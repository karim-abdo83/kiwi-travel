import { mainImage } from "@/lib/utils";
import {
  confirmNotification,
  reviewNotification,
  tripBooking,
} from "@/server/db/schema";
import { tripBookingFormSchema } from "@/validators/trip-booking-schema";
import { TRPCError } from "@trpc/server";
import { format } from "date-fns";
import { count, desc, eq, inArray } from "drizzle-orm";
import { getTranslations } from "next-intl/server";
import { z } from "zod";
import nodemailer from "nodemailer";
import path from "path";
import {
  adminProcedure,
  authProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "../trpc";
import { env } from "@/env";
import { render } from "@react-email/components";
import { BookingEmail } from "../email/booking-email";
import { currentUser } from "@clerk/nextjs/server";

const emailTransporter = nodemailer.createTransport({
  host: env.EMAIL_SENDING_HOST,
  port: Number(env.EMAIL_SENDING_PORT),
  secure: true,
  auth: {
    user: env.EMAIL_SENDING_ADDRESS,
    pass: env.EMAIL_SENDING_PASSWORD,
  },
});

export const tripBookingRouter = createTRPCRouter({
  list: authProtectedProcedure.query(
    async ({ ctx }) =>
      await ctx.db.query.tripBooking
        .findMany({
          where: ({ userId }, { eq }) => eq(userId, ctx.userId),
          with: {
            review: {
              columns: {
                ratingValue: true,
              },
            },
            trip: {
              columns: {
                id: true,
                titleEn: true,
                titleRu: true,
                assetsUrls: true,
                adultTripPriceInCents: true,
              },
              with: {
                destination: {
                  columns: {
                    id: true,
                    nameEn: true,
                    nameRu: true,
                  },
                  with: {
                    country: true,
                  },
                },
              },
            },
          },
        })
        .then((res) =>
          res.map((item) => ({
            id: item.id,
            status: item.status,
            bookingDate: item.bookingDate,
            travelersCount:
              item.adultsCount + item.childrenCount + item.infantsCount,
            review: item.review,
            titleEn: item.trip.titleEn,
            titleRu: item.trip.titleRu,
            image: mainImage(item.trip.assetsUrls),
            locationEn: `${item.trip.destination.country.nameEn}, ${item.trip.destination.nameEn}`,
            locationRu: `${item.trip.destination.country.nameRu}, ${item.trip.destination.nameRu}`,
            price: Math.floor(item.trip.adultTripPriceInCents / 100),
          })),
        ),
  ),
  view: authProtectedProcedure.input(z.number()).query(
    async ({ ctx, input }) =>
      await ctx.db.query.tripBooking.findFirst({
        where: ({ id, userId }, { eq, and }) =>
          and(eq(userId, ctx.userId), eq(id, input)),
        with: {
          review: {
            columns: {
              id: true,
              message: true,
              ratingValue: true,
              createdAt: true,
            },
          },
          trip: {
            columns: {
              id: true,
              slug: true,
              titleEn: true,
              titleRu: true,
              assetsUrls: true,
              adultTripPriceInCents: true,
              childTripPriceInCents: true,
              isConfirmationRequired: true,
            },
            with: {
              destination: {
                columns: {
                  id: true,
                  nameEn: true,
                  nameRu: true,
                },
                with: {
                  country: true,
                },
              },
            },
          },
        },
      }),
  ),
  create: authProtectedProcedure
    .input(
      tripBookingFormSchema.extend({
        tripId: z.number({ required_error: "Trip is required" }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const t = await getTranslations("TripDetailsPage.bookingForm");

      const trip = await ctx.db.query.trip.findFirst({
        columns: {
          id: true,
          slug: true,
          titleRu: true,
          titleEn: true,
          adultTripPriceInCents: true,
          childTripPriceInCents: true,
          isConfirmationRequired: true,
        },
        where: ({ id }, { eq }) => eq(id, input.tripId),
      });

      if (!trip) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Trip doesn't exist with provided `tripId`",
        });
      }

      const existingBooking = await ctx.db.query.tripBooking.findFirst({
        columns: {
          id: true,
        },
        where: ({ userId, tripId, status, bookingDate }, { eq, and }) =>
          and(
            eq(userId, ctx.userId),
            eq(tripId, input.tripId),
            eq(bookingDate, format(input.date, "yyyy-MM-dd")),
            inArray(status, ["pending", "accepted"]),
          ),
      });

      if (existingBooking) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: t("existingBookingError"),
        });
      }

      const user = (await currentUser())!;

      await ctx.db.insert(tripBooking).values({
        userId: ctx.userId,
        userPhone: input.phone,
        userEmail: user.emailAddresses[0]!.emailAddress,
        adultPriceInCents: trip.adultTripPriceInCents,
        childPriceInCents: trip.childTripPriceInCents,
        adultsCount: input.adultsCount,
        childrenCount: input.childrenCount,
        infantsCount: input.infantsCount,
        tripId: input.tripId,
        bookingDate: format(input.date, "yyyy-MM-dd"),
        status: trip.isConfirmationRequired ? "pending" : "accepted",
      });

      const bookingLink = `${env.NEXT_PUBLIC_APP_URL}/dashboard/bookings`;
      const tripLink = `${env.NEXT_PUBLIC_APP_URL}/trips/${trip.slug}`;

      await sendTelegramNotification(
        `🧾 <b>Новая бронь</b>\nПользователь: ${input.email}\nТелефон: ${input.phone}\nТур: ${input.tripId}\nДата: ${format(input.date, "yyyy-MM-dd")}\n<a href="${bookingLink}">Открыть в админке</a>\n\n<a href="${tripLink}">${trip.titleRu}</a>`
      );
      const tEmail = await getTranslations("General.bookingEmail.new");

      // Calculate totals for email
      const totalPeople = input.adultsCount + input.childrenCount + input.infantsCount;
      const adultTotal = (trip.adultTripPriceInCents / 100) * input.adultsCount;
      const childTotal = trip.childTripPriceInCents ? (trip.childTripPriceInCents / 100) * input.childrenCount : 0;
      const emailTotal = adultTotal + childTotal;

      const emailHtml = await render(
        <BookingEmail
          bookingId={0} // или реальный ID, если захочешь получить его из insert
          bookingLink={bookingLink}
          translations={tEmail}
          bookingData={{
            fullName: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.firstName || "Guest User",
            email: user.emailAddresses[0]!.emailAddress,
            phoneNumber: input.phone,
            bookingDate: format(input.date, "yyyy-MM-dd"),
            numberOfPeople: totalPeople,
            totalAmount: emailTotal,
            tripTitle: trip.titleEn,
            additionalNotes: "",
          }}
        />
      );

      await sendEmail({
        email: emailHtml,
        to: user.emailAddresses[0]!.emailAddress,
        subject: tEmail("title"), // например, "📩 Новая бронь"
      });

      return {
        message: trip.isConfirmationRequired
          ? t("successMessageWithConfirm")
          : t("successMessage"),
      };
    }),
  createAnonymously: publicProcedure
    .input(
      tripBookingFormSchema.extend({
        tripId: z.number({ required_error: "Trip is required" }),
        email: z.string().email({ message: "Email is required" }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const t = await getTranslations("TripDetailsPage.bookingForm");

      const trip = await ctx.db.query.trip.findFirst({
        columns: {
          id: true,
          slug: true,
          titleRu: true,
          titleEn: true,
          adultTripPriceInCents: true,
          childTripPriceInCents: true,
          isConfirmationRequired: true,
        },
        where: ({ id }, { eq }) => eq(id, input.tripId),
      });

      if (!trip) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Trip doesn't exist with provided `tripId`",
        });
      }

      const existingBooking = await ctx.db.query.tripBooking.findFirst({
        columns: {
          id: true,
        },
        where: ({ userId, tripId, status, bookingDate }, { eq, and }) =>
          and(
            eq(userId, input.email),
            eq(tripId, input.tripId),
            eq(bookingDate, format(input.date, "yyyy-MM-dd")),
            inArray(status, ["pending", "accepted"]),
          ),
      });

      if (existingBooking) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: t("existingBookingError"),
        });
      }

      await ctx.db.insert(tripBooking).values({
        userId: input.email,
        userPhone: input.phone,
        userEmail: input.email,
        adultPriceInCents: trip.adultTripPriceInCents,
        childPriceInCents: trip.childTripPriceInCents,
        adultsCount: input.adultsCount,
        childrenCount: input.childrenCount,
        infantsCount: input.infantsCount,
        tripId: input.tripId,
        bookingDate: format(input.date, "yyyy-MM-dd"),
        status: trip.isConfirmationRequired ? "pending" : "accepted",
      });

      const bookingLink = `${env.NEXT_PUBLIC_APP_URL}/dashboard/bookings`;
      const tripLink = `${env.NEXT_PUBLIC_APP_URL}/trips/${trip.slug}`;

      await sendTelegramNotification(
        `🧾 <b>Новая бронь</b>\nПользователь: ${input.email}\nТелефон: ${input.phone}\nТур: ${input.tripId}\nДата: ${format(input.date, "yyyy-MM-dd")}\n<a href="${bookingLink}">Открыть в админке</a>\n\n<a href="${tripLink}">${trip.titleRu}</a>`
      );

      const tEmail = await getTranslations("General.bookingEmail.new");

      // Calculate totals for email
      const totalPeople = input.adultsCount + input.childrenCount + input.infantsCount;
      const adultTotal = (trip.adultTripPriceInCents / 100) * input.adultsCount;
      const childTotal = trip.childTripPriceInCents ? (trip.childTripPriceInCents / 100) * input.childrenCount : 0;
      const emailTotal = adultTotal + childTotal;

      const emailHtml = await render(
        <BookingEmail
          bookingId={0} // или реальный ID, если захочешь получить его из insert
          bookingLink={bookingLink}
          translations={tEmail}
          bookingData={{
            fullName: "Guest User", // Anonymous users don't provide name
            email: input.email,
            phoneNumber: input.phone,
            bookingDate: format(input.date, "yyyy-MM-dd"),
            numberOfPeople: totalPeople,
            totalAmount: emailTotal,
            tripTitle: trip.titleRu,
            additionalNotes: "",
          }}
        />
      );

      await sendEmail({
        email: emailHtml,
        to: input.email,
        subject: tEmail("title"), // например, "📩 Нова бронь"
      });

      return {
        message: trip.isConfirmationRequired
          ? t("successMessageWithConfirm")
          : t("successMessage"),
      };
    }),
  cancel: authProtectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      const booking = await ctx.db.query.tripBooking.findFirst({
        where: ({ id, userId }, { eq, and }) =>
          and(eq(userId, ctx.userId), eq(id, input)),
        columns: {
          status: true,
        },
        with: {
          trip: {
            columns: {
              isConfirmationRequired: true,
            },
          },
        },
      });

      if (!booking)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "no booking with provided id by current user",
        });

      if (booking.status !== "accepted" && booking.status !== "pending")
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "you can only cancel requests that is in 'pending' or 'accepted' statuses",
        });

      if (booking.status === "accepted" && booking.trip.isConfirmationRequired)
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "you can't cancel accepted booking that need admin confirmation, contact the admin firstly",
        });

      await ctx.db
        .update(tripBooking)
        .set({
          status: "cancelled",
        })
        .where(eq(tripBooking.id, input));

      const t = await getTranslations("ToastMessages");

      return {
        message: t("CancelBooking"),
      };
    }),
  adminListByDate: adminProcedure
    .input(
      z.object({
        tripId: z.number(),
        date: z.date(),
      }),
    )
    .query(
      async ({ ctx, input }) =>
        await ctx.db.query.tripBooking.findMany({
          where: ({ tripId, bookingDate }, { and, eq }) =>
            and(
              eq(tripId, input.tripId),
              eq(bookingDate, format(input.date, "yyyy-MM-dd")),
            ),
        }),
    ),
  adminConfirmBooking: adminProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      const userEmailAddress = await ctx.db.transaction(async (tx) => {
        await ctx.db
          .update(tripBooking)
          .set({
            status: "accepted",
          })
          .where(eq(tripBooking.id, input));

        const booking = await tx.query.tripBooking.findFirst({
          where: ({ id }, { eq }) => eq(id, input),
          columns: {
            id: true,
            tripId: true,
            userId: true,
            userEmail: true,
          },
        });

        if (!booking) return;

        const trip = await tx.query.trip.findFirst({
          where: ({ id }, { eq }) => eq(id, booking.tripId),
          columns: {
            titleEn: true,
            titleRu: true,
          },
        });

        if (!trip) return;

        await tx.insert(confirmNotification).values({
          userId: booking.userId,
          tripBookingId: booking.id,
          tripTitleEn: trip.titleEn,
          tripTitleRu: trip.titleRu,
          isCancelled: false,
        });

        return booking.userEmail;
      });

      const t = await getTranslations("General.bookingEmail.accepted");

      const email = await render(
        <BookingEmail
          bookingId={input}
          bookingLink={`${env.NEXT_PUBLIC_APP_URL}/bookings/${input}`}
          translations={t}
          bookingData={{
            fullName: "",
            email: "",
            phoneNumber: "",
            bookingDate: "",
            numberOfPeople: 0,
            totalAmount: 0,
            tripTitle: "",
            additionalNotes: "",
          }}
        />,
      );

      sendEmail({
        email,
        to: userEmailAddress ?? "",
        subject: t("title"),
      });

      return {
        message: "booking has been confirmed successfully",
      };
    }),
  adminCancelBooking: adminProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      const userEmailAddress = await ctx.db.transaction(async (tx) => {
        const booking = await tx.query.tripBooking.findFirst({
          where: ({ id }, { eq }) => eq(id, input),
          columns: {
            id: true,
            tripId: true,
            userId: true,
            userEmail: true,
          },
        });

        if (!booking) return;

        const trip = await tx.query.trip.findFirst({
          where: ({ id }, { eq }) => eq(id, booking.tripId),
          columns: {
            titleEn: true,
            titleRu: true,
            isConfirmationRequired: true,
          },
        });

        if (!trip) return;

        if (!trip.isConfirmationRequired)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "you can only cancel bookings for confirm required trips",
          });

        await ctx.db
          .update(tripBooking)
          .set({
            status: "cancelled",
          })
          .where(eq(tripBooking.id, input));

        await tx.insert(confirmNotification).values({
          userId: booking.userId,
          tripBookingId: booking.id,
          tripTitleEn: trip.titleEn,
          tripTitleRu: trip.titleRu,
          isCancelled: true,
        });

        return booking.userEmail;
      });

      const t = await getTranslations("General.bookingEmail.rejected");

      const email = await render(
        <BookingEmail
          bookingId={input}
          bookingLink={`${env.NEXT_PUBLIC_APP_URL}/bookings/${input}`}
          translations={t}
          bookingData={{
            fullName: "",
            email: "",
            phoneNumber: "",
            bookingDate: "",
            numberOfPeople: 0,
            totalAmount: 0,
            tripTitle: "",
            additionalNotes: ""
          }}
        />,
      );

      sendEmail({
        email,
        to: userEmailAddress ?? "",
        subject: t("title"),
      });

      return {
        message: "booking has been cancelled successfully",
      };
    }),
  adminMarkAsDoneBooking: adminProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      const userEmailAddress = await ctx.db.transaction(async (tx) => {
        await ctx.db
          .update(tripBooking)
          .set({
            status: "done",
          })
          .where(eq(tripBooking.id, input));

        const booking = await tx.query.tripBooking.findFirst({
          where: ({ id }, { eq }) => eq(id, input),
          columns: {
            id: true,
            tripId: true,
            userId: true,
            userEmail: true,
          },
        });

        if (!booking) return;

        const trip = await tx.query.trip.findFirst({
          where: ({ id }, { eq }) => eq(id, booking.tripId),
          columns: {
            titleEn: true,
            titleRu: true,
          },
        });

        if (!trip) return;

        await tx.insert(reviewNotification).values({
          userId: booking.userId,
          tripBookingId: booking.id,
          tripTitleEn: trip.titleEn,
          tripTitleRu: trip.titleRu,
        });

        return booking.userEmail;
      });

      const t = await getTranslations("General.bookingEmail.completed");

      const email = await render(
        <BookingEmail
          bookingId={input}
          bookingLink={`${env.NEXT_PUBLIC_APP_URL}/bookings/${input}`}
          translations={t}
          bookingData={{
            fullName: "",
            email: "",
            phoneNumber: "",
            bookingDate: "",
            numberOfPeople: 0,
            totalAmount: 0,
            tripTitle: "",
            additionalNotes: "",
          }}
        />,
      );

      sendEmail({
        email,
        to: userEmailAddress ?? "",
        subject: t("title"),
      })
      const bookingLink = `${env.NEXT_PUBLIC_APP_URL}/bookings/${input}`;

      await sendTelegramNotification(
        `📩 New booking confirmed\n<a href="${bookingLink}">View booking</a>`
      );

      return {
        message: "booking has been marked as done successfully",
      };
    }),
  adminUnseenBookingsCount: adminProcedure.query(
    async ({ ctx }) =>
      await ctx.db
        .select({
          count: count(),
        })
        .from(tripBooking)
        .where(eq(tripBooking.isSeenByAdmin, false)),
  ),
  adminList: adminProcedure.query(
    async ({ ctx }) =>
      await ctx.db.transaction(async (tx) => {
        const result = await tx.query.tripBooking.findMany({
          with: {
            trip: {
              columns: {
                titleEn: true,
              },
            },
          },
          orderBy: desc(tripBooking.isSeenByAdmin),
        });

        await tx.update(tripBooking).set({
          isSeenByAdmin: true,
        });

        return result;
      }),
  ),
  adminDelete: adminProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(tripBooking).where(eq(tripBooking.id, input));

      return {
        message: "Deleted Successfully",
      };
    }),
});

async function sendEmail({
  email,
  to,
  subject,
  copyToAdmin = true,
}: {
  email: string;
  to: string;
  subject: string;
  copyToAdmin?: boolean;
}): Promise<void> {
  const publicDir = path.join(process.cwd(), "public");
  const emailLogoPath = path.join(publicDir, "email-logo.png");
  const attachments = [
    { filename: "email-logo.png", path: emailLogoPath, cid: "logo", contentType: "image/png" },
  ];

  try {
    await emailTransporter.sendMail({
      from: env.EMAIL_SENDING_ADDRESS,
      to,
      subject,
      html: email,
      attachments,
    });
    console.log(`✅ Email sent to ${to}`);
  } catch (err) {
    console.error("❌ Error sending email to user", err);
  }

  if (copyToAdmin && env.EMAIL_ADMIN_ADDRESS) {
    try {
      await emailTransporter.sendMail({
        from: env.EMAIL_SENDING_ADDRESS,
        to: env.EMAIL_ADMIN_ADDRESS,
        subject: `[ADMIN COPY] ${subject}`,
        html: email,
        attachments,
      });
      console.log(`📬 Admin copy sent to ${env.EMAIL_ADMIN_ADDRESS}`);
    } catch (err) {
      console.error("⚠️ Error sending admin copy", err);
    }
  }
}

async function sendTelegramNotification(message: string) {
  const token = env.TELEGRAM_BOT_TOKEN;
  const chatId = env.TELEGRAM_ADMIN_CHAT_ID;

  if (!token || !chatId) {
    console.warn("⚠️ Telegram config missing");
    return;
  }

  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
      }),
    });

    if (!res.ok) {
      console.error("❌ Telegram API error", await res.text());
    } else {
      console.log("📨 Sent Telegram message");
    }
  } catch (err) {
    console.error("❌ Telegram fetch error", err);
  }
}


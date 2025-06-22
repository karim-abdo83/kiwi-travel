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
import {
  adminProcedure,
  authProtectedProcedure,
  createTRPCRouter,
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
        />,
      );

      sendEmail({
        email,
        to: userEmailAddress ?? "",
        subject: t("title"),
      });

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
}: {
  email: string;
  to: string;
  subject: string;
}): Promise<any> {
  return emailTransporter
    .sendMail({
      from: env.EMAIL_SENDING_ADDRESS,
      to,
      subject,
      html: email,
    })
    .catch((err) => console.error("Error Sending Email\n", err));
}

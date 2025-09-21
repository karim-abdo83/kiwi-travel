import { addReviewAdminFormSchema, addReviewFormSchema } from "@/validators/review-schema";
import {
  adminProcedure,
  authProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "../trpc";
import { TRPCError } from "@trpc/server";
import { clerkClient } from "@clerk/nextjs/server";
import { review, review as reviewTableSchema } from "@/server/db/schema";
import { and, eq, desc } from "drizzle-orm";
import { z } from "zod";
import { getTranslations } from "next-intl/server";
import { db } from "@/server/db";

export const reviewRouter = createTRPCRouter({
  // create: authProtectedProcedure
  //   .input(addReviewFormSchema.extend({ 
  //     images: z.array(z.any()).optional() // Using z.any() to handle File objects from the client
  //   }))
  //   .mutation(async ({ ctx, input }) => {
  //     // Verify booking if bookingId is provided
  //     if (input.bookingId) {
  //       const booking = await ctx.db.query.tripBooking.findFirst({
  //         where: (fields, { eq, and }) => {
  //           const conditions = [eq(fields.userId, ctx.userId)];
            
  //           if (input.bookingId !== undefined) {
  //             conditions.push(eq(fields.id, input.bookingId));
  //           }
            
  //           return and(...conditions);
  //         },
  //         columns: {
  //           id: true,
  //           status: true,
  //           tripId: true
  //         },
  //         with: {
  //           review: true,
  //         },
  //       });

  //       if (!booking) {
  //         throw new TRPCError({
  //           code: "NOT_FOUND",
  //           message: "No booking found with the provided ID for the current user.",
  //         });
  //       }

  //       if (booking.review) {
  //         throw new TRPCError({
  //           code: "BAD_REQUEST",
  //           message: "There is already a review for this booking. Please edit the existing review instead.",
  //         });
  //       }

  //       if (booking.status !== "done") {
  //         throw new TRPCError({
  //           code: "BAD_REQUEST",
  //           message: "You can only submit a review for completed bookings.",
  //         });
  //       }
  //     }

  //     // Get user info from Clerk
  //     const client = await clerkClient();
  //     const user = await client.users.getUser(ctx.userId);
  //     const userEmail = user.emailAddresses[0]?.emailAddress || "";
  //     const userName = input.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || "Anonymous";

  //     // Upload images if any
  //     let imageUrls: string[] = [];
  //     if (input.images && input.images.length > 0) {
  //       try {
  //         // Convert File objects to a format that can be sent to the server
  //         const files = input.images.map(file => ({
  //           name: file.name,
  //           type: file.type,
  //           arrayBuffer: () => file.arrayBuffer()
  //         }));
          
  //         // imageUrls = await uploadMultipleFiles(files);
  //       } catch (error) {
  //         console.error("Error uploading images:", error);
  //         throw new TRPCError({
  //           code: "INTERNAL_SERVER_ERROR",
  //           message: "Failed to upload review images. Please try again.",
  //         });
  //       }
  //     }

  //     try {
  //       // Start a transaction
  //       const result = await db.transaction(async (tx) => {
  //         // Get tripId if bookingId is provided
  //         let tripId: number | undefined;
  //         if (input.bookingId) {
  //           const booking = await tx.query.tripBooking.findFirst({
  //             where: (fields, { eq }) => eq(fields.id, input.bookingId!),
  //             columns: { tripId: true }
  //           });
  //           tripId = booking?.tripId;
  //         }

  //         // Create the review
  //         const [newReview] = await tx.insert(reviewTableSchema).values({
  //           ratingValue: input.ratingValue,
  //           message: input.message,
  //           tripBookingId: input.bookingId,
  //           tripId,
  //           userId: ctx.userId,
  //           userEmail: input.email || userEmail,
  //           userImageUrl: user.imageUrl,
  //           userFullName: userName,
  //         }).returning();

  //         // If there are images, create review image records
  //         // if (imageUrls.length > 0) {
  //         //   await tx.insert(reviewImage).values(
  //         //     imageUrls.map(url => ({
  //         //       reviewId: newReview.id,
  //         //       url,
  //         //     }))
  //         //   );
  //         // }

  //         return newReview;
  //       });

  //       const t = await getTranslations("ToastMessages");
  //       return {
  //         ...result,
  //         message: t("AddReview"),
  //       };
  //     } catch (error) {
  //       console.error("Error creating review:", error);
  //       throw new TRPCError({
  //         code: "INTERNAL_SERVER_ERROR",
  //         message: "Failed to create review. Please try again.",
  //       });
  //     }

  //     const t = await getTranslations("ToastMessages");

  //     return {
  //       message: t("AddReview"),
  //     };
  //   }),
  createPublicly: publicProcedure
  .input(addReviewFormSchema)
  .mutation(async ({ ctx, input }) => {

    if (!input.ratingValue || !input.message || !input.name || !input.email) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "All fields are required except image.",
      });
    }

    await ctx.db.insert(reviewTableSchema).values({
      ratingValue: input.ratingValue,
      message: input.message,
      userEmail: input.email || '',
      userId: input.userId || null,
      userFullName: input.name,
      image: input.image || null,
    });

    const t = await getTranslations("ToastMessages");

    return {
      message: t("AddReview"),
    };
  }),
  create: authProtectedProcedure
  .input(addReviewFormSchema)
  .mutation(async ({ ctx, input }) => {
    if (!input.bookingId) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "no booking with provided id by current user",
      });
    }
    
    const booking = await ctx.db.query.tripBooking.findFirst({
      where: ({ id, userId }, { eq, and }) =>
        and(eq(userId, ctx.userId), eq(id, input.bookingId || 0)),
      columns: {
        tripId: true,
        status: true,
      },
      with: {
        review: true,
      },
    });

    if (!booking)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "no booking with provided id by current user",
      });

    if (booking.review)
      throw new TRPCError({
        code: "BAD_REQUEST",
        message:
          "there is already a review for this booking, instead, try to edit the existing one",
      });

    if (booking.status !== "done")
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "you can't add a review for non-done bookings",
      });

    const client = await clerkClient();

    const user = await client.users.getUser(ctx.userId);

    await ctx.db.insert(reviewTableSchema).values({
      ratingValue: input.ratingValue,
      message: input.message,
      tripBookingId: input.bookingId,
      tripId: booking.tripId,
      userEmail: user.emailAddresses[0]!.emailAddress,
      userId: ctx.userId,
      userImageUrl: user.hasImage ? user.imageUrl : null,
      userFullName: user.fullName,
    });

    const t = await getTranslations("ToastMessages");

    return {
      message: t("AddReview"),
    };
  }),
  createByAdmin: adminProcedure
    .input(addReviewAdminFormSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(reviewTableSchema).values({
        ratingValue: input.ratingValue,
        message: input.message,
        // tripBookingId: 123,
        // tripId: 123,
        userEmail: input.email,
        // userId: 'admin',
        userImageUrl: null,
        userFullName: input.fullName,
      });

      const t = await getTranslations("ToastMessages");

      return {
        message: t("AddReview"),
      };
    }),
  updateByAdmin: adminProcedure
    .input(addReviewAdminFormSchema.extend({ id: z.number().int() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.update(reviewTableSchema).set({
        ratingValue: input.ratingValue,
        message: input.message,
        // tripBookingId: 123,
        // tripId: 123,
        userEmail: input.email,
        // userId: 'admin',
        userImageUrl: null,
        userFullName: input.fullName,
      }).where(eq(reviewTableSchema.id, input.id));

      const t = await getTranslations("ToastMessages");

      return {
        message: t("UpdateReview"),
      };
    }),
  deleteByAdmin: adminProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(reviewTableSchema)
        .where(
          and(
            eq(reviewTableSchema.id, input),
          ),
        );

      const t = await getTranslations("ToastMessages");

      return {
        message: t("DeleteReview"),
      };
    }),
  delete: authProtectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(reviewTableSchema)
        .where(
          and(
            eq(reviewTableSchema.userId, ctx.userId),
            eq(reviewTableSchema.id, input),
          ),
        );

      const t = await getTranslations("ToastMessages");

      return {
        message: t("DeleteReview"),
      };
    }),

  //admin
  adminHide: adminProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(review)
        .set({
          isHiddenByAdmin: true,
        })
        .where(eq(review.id, input));

      return {
        message: "review has been hidden successfully",
      };
    }),
  adminUnhide: adminProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(review)
        .set({
          isHiddenByAdmin: false,
        })
        .where(eq(review.id, input));

      return {
        message: "review has been unhidden successfully",
      };
    }),
  adminReply: adminProcedure
    .input(z.object({ reviewId: z.number(), adminReply: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(reviewTableSchema)
        .set({
          adminReply: input.adminReply,
        })
        .where(eq(reviewTableSchema.id, input.reviewId));

      return {
        message: "review has been replied successfully",
      };
    }),
  listTop: publicProcedure.query(
    async ({ ctx }) => {
      const reviews = await ctx.db.query.review.findMany({
        where: (fields, { eq, and }) =>
          and(
            eq(fields.ratingValue, 5),
            eq(fields.isHiddenByAdmin, false)
          ),
        columns: {
          id: true,
          image: true,
          userImageUrl: true,
          userEmail: true,
          userFullName: true,
          message: true,
          adminReply: true,
          createdAt: true,
          ratingValue: true,
        },
        with: {
          trip: {
            columns: {
              id: true,
              titleEn: true,
              titleRu: true,
            },
          },
          // replies: {},
        },
        limit: 100,
        orderBy: (fields, { desc }) => [desc(fields.createdAt)],
      });
      return reviews;
    }
  ),
  listForAdmin: adminProcedure.query(
    async ({ ctx }) =>
      await ctx.db.query.review.findMany({
        // columns: {
        //   id: true,
        //   email: true,
        //   userImageUrl: true,
        //   userEmail: true,
        //   userFullName: true,
        //   message: true,
        // },
        // limit: 10,
      }),
  ),
});

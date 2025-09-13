import { z } from "zod";

export const ratingValues = [1, 2, 3, 4, 5] as const;

export const addReviewFormSchema = z.object({
  bookingId: z.number(),
  message: z.string().min(1, "message is required"),
  ratingValue: z
    .number({
      required_error: "rating is required",
    })
    .int()
    .refine(
      (rating) => ratingValues.includes(rating as any),
      "rating must be between 1 and 5",
    ),
});


export const addReviewAdminFormSchema = z.object({
  email: z.string().min(1, "Email is required").max(100, 'Enter 1-100 characters'),
  fullName: z.string().min(1, "Full name is Required").max(100, 'Enter 1-100 characters'),
  message: z.string().min(1, "message is required"),
  ratingValue: z
    .number({
      required_error: "rating is required",
    })
    .int()
    .refine(
      (rating) => ratingValues.includes(rating as any),
      "rating must be between 1 and 5",
    ),
});

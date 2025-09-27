import { z } from "zod";

export const ratingValues = [1, 2, 3, 4, 5] as const;

export const addReviewFormSchema = z.object({
  bookingId: z.number().optional(),
  message: z.string().min(1, "Message is required"),
  ratingValue: z
    .number({
      required_error: "Rating is required",
    })
    .int()
    .refine(
      (rating) => ratingValues.includes(rating as any),
      "Rating must be between 1 and 5"
    ),
  image: z
    .union([z.string().url("Must be a valid URL"), z.literal(""), z.null()])
    .optional()
    .transform(val => val || undefined), // Convert empty string to undefined
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email").optional(),
  // 
  userId: z.string().optional(),
  tripId: z.number().optional(),
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

import { z } from "zod";


export const tripBookingFormSchema = z.object({
  date: z.date({
    required_error: "Please select a date",
  }),
  adultsCount: z
    .number({
      required_error: "Please select number of adults",
    })
    .min(1, "At least 1 adult is required"),
  childrenCount: z.number(),
  infantsCount: z.number(),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(
      /^(?:\+?(\d{1,3}))?[-. (]*([\d]{1,14})(?:[-. ]*([\d]{1,14}))?(?:[-. ]*([\d]{1,14}))?(?: *x(\d+))?$/,
      "Please enter a valid phone number",
    ),
});

export type TripBookingFormValues = z.infer<typeof tripBookingFormSchema>
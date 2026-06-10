import { z } from "zod";


export const tripBookingFormSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters"),
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
  ticketItems: z
    .array(
      z.object({
        ticketTypeId: z.number().int().positive(),
        quantity: z.number().int().min(0),
      }),
    )
    .optional(),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(
      /^(?:\+?(\d{1,3}))?[-. (]*([\d]{1,14})(?:[-. ]*([\d]{1,14}))?(?:[-. ]*([\d]{1,14}))?(?: *x(\d+))?$/,
      "Please enter a valid phone number",
    ),
  email: z.string().optional(),
  hotelNameAddress: z.string().optional(),
roomNumberOrSpecialRequests: z.string().optional(),
});

export type TripBookingFormValues = z.infer<typeof tripBookingFormSchema>

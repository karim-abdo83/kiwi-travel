import { z } from "zod";


const tripBookingFields = {
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters"),
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
  email: z.string().optional(),
  hotelNameAddress: z.string().optional(),
  roomNumberOrSpecialRequests: z.string().optional(),
  attribution: z.string().max(10000).optional(),
};

const bookingDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must use YYYY-MM-DD format")
  .refine((value) => {
    const [year, month, day] = value.split("-").map(Number);
    const isLeapYear = year! % 4 === 0 && (year! % 100 !== 0 || year! % 400 === 0);
    const daysInMonth = [31, isLeapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    return month! >= 1 && month! <= 12 && day! >= 1 && day! <= daysInMonth[month! - 1]!;
  }, "Please select a valid date");

export const tripBookingFormSchema = z.object({
  ...tripBookingFields,
  date: bookingDateSchema,
});

export const tripBookingUiFormSchema = z.object({
  ...tripBookingFields,
  date: z.custom<Date>((value) => value instanceof Date && !Number.isNaN(value.getTime()), {
    message: "Please select a date",
  }),
});

export type TripBookingFormValues = z.infer<typeof tripBookingUiFormSchema>;

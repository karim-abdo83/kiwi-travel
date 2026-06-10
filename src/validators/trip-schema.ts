import { z } from "zod";

export const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export const tripTicketTypeFormSchema = z.object({
  nameEn: z.string().min(1, "English ticket name is required"),
  nameRu: z.string().min(1, "Russian ticket name is required"),
  price: z.number({ message: "Ticket price is required" }).min(0, "Ticket price cannot be negative"),
  sortOrder: z.number({ message: "Sort order is required" }).int().min(0, "Sort order cannot be negative"),
  isActive: z.boolean().default(true),
});

const validateLegacyPrices = (
  value: {
    adultPrice?: number;
    childPrice?: number;
    ticketTypes?: { isActive: boolean }[];
  },
  ctx: z.RefinementCtx,
) => {
  const hasActiveTicketTypes = value.ticketTypes?.some((ticketType) => ticketType.isActive) ?? false;

  if (hasActiveTicketTypes) return;

  if (value.adultPrice === undefined) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Adult price is required when active ticket types are not used",
      path: ["adultPrice"],
    });
  }

  if (value.childPrice === undefined) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Child price is required when active ticket types are not used",
      path: ["childPrice"],
    });
  }
};

export const tripFormBaseSchema = z.object({
  slug: z.string().min  (1, "Slug is required"),
  titleEn: z.string().min(1, "English title is required"),
  titleRu: z.string().min(1, "Russian title is required"),
  titleTr: z.string().min(1, "Turkish title is required"),
  descriptionEn: z.string().min(1, "English description is required"),
  descriptionRu: z.string().min(1, "Russian description is required"),
  descriptionTr: z.string().min(1, "Turkish description is required"),
  longDescriptionEn: z.string().min(1, "English long description is required"),
  longDescriptionRu: z.string().min(1, "Russian long description is required"),
  longDescriptionTr: z.string().min(1, "Turkish long description is required"),
  features: z
    .array(z.number().int())
    .min(1, "At least one feature is required"),
  assets: z
    .array(z.string().url("Must be a valid URL"))
    .min(1, "At least one asset URL is required"),
  travelTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Must be in format HH:MM"),
  availableDays: z
    .array(z.enum(days))
    .min(1, "At least one day must be an available day"),
  tripTypes: z
    .array(z.number({ message: "trip type is required" }))
    .min(1, "At least one type must be provided"),
  duration: z.string().min(1, "Duration is required"),
  sizeOfTrip: z.string().min(1, "Size of trip is required"),
  isAvailable: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isConfirmationRequired: z.boolean().default(false),
  destinationId: z
    .number({ message: "Destination is required" })
    .int()
    .positive("Destination ID must be a positive integer"),
  displayFromPrice: z
    .number({ message: "Display from price must be a number" })
    .min(0, "Display from price cannot be negative")
    .optional(),
  adultPrice: z
    .number({ message: "Adult price must be a number" })
    .positive("Adult price must be a positive number")
    .optional(),
  childPrice: z
    .number({ message: "Child price must be a number" })
    .min(0, "Child price cannot be negative")
    .optional(),
  childAge: z.string(),
  infantAge: z.string(),
  ticketTypes: z.array(tripTicketTypeFormSchema).optional(),
  // 
  pickupPointEn: z.string().optional(),
  pickupPointRu: z.string().optional(),
  pickupPointTr: z.string().optional(),
  placeOfReturnEn: z.string().optional(),
  placeOfReturnRu: z.string().optional(),
  placeOfReturnTr: z.string().optional(),
}); 

export const tripFormSchema = tripFormBaseSchema.superRefine(validateLegacyPrices);

export const tripFormUpdateSchema = tripFormBaseSchema
  .extend({ id: z.number().int() })
  .superRefine(validateLegacyPrices);

export const tripSearchFormSchema = z.object({
  search: z.string().optional(),
  date: z.date().min(new Date()).optional(),
  price: z
    .object({
      lower: z.number().optional(),
      greater: z.number().optional(),
    })
    .optional(),
  destinations: z.array(z.number()).optional(),
  countries: z.array(z.number()).optional(),
  types: z.array(z.number()).optional(),
  page: z.number().optional(),
});

export type TripFormValues = z.infer<typeof tripFormSchema>;

export type TripSearchFormValues = z.infer<typeof tripSearchFormSchema>;

export type Day = (typeof days)[number];

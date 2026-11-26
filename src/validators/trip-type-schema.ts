import { z } from "zod";

export const tripTypeFormSchema = z.object({
  nameEn: z.string().min(1, "English name is required"),
  nameRu: z.string().min(1, "Russian name is required"),
  nameDe: z.string().optional(),
});

export type TripTypeFormValues = z.infer<typeof tripTypeFormSchema>;

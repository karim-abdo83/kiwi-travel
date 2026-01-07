import { z } from "zod";

export const countryFormSchema = z.object({
  nameEn: z.string().min(1, "English name is required"),
  nameRu: z.string().min(1, "Russian name is required"),
  nameTr: z.string().min(1, "Turkish name is required").default(""),
})

export type CountryFormValues = z.infer<typeof countryFormSchema>;
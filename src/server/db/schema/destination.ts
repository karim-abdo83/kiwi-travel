import { relations } from "drizzle-orm"
import { pgTable } from "drizzle-orm/pg-core";
import { trip } from "./trip";

export const country = pgTable("contries", (c) => ({
  id: c.integer("id").primaryKey().generatedByDefaultAsIdentity(),
  nameEn: c.text("name_en").notNull(),
  nameRu: c.text("name_ru").notNull(),
}));

export const destination = pgTable("destinations", (c) => ({
  id: c.integer("id").primaryKey().generatedByDefaultAsIdentity(),
  slug: c.text("slug").notNull(),
  nameEn: c.text("name_en").notNull(),
  nameRu: c.text("name_ru").notNull(),
  imageUrl: c.text("image_url").notNull(),
  isPopular: c.boolean("is_popular").notNull(),
  countryId: c.integer("country_id")
    .notNull()
    .references(() => country.id, { onDelete: "restrict" }),
}));


// ======================== relations ========================
export const countryRelations = relations(country, ({ many }) => ({
  destinations: many(country),
}));

export const destinationRelations = relations(destination, ({ one, many }) => ({
  trips: many(trip),
  country: one(country, {
    fields: [destination.countryId],
    references: [country.id],
  }),
}))
import { sql, relations } from "drizzle-orm";
import { pgTable, primaryKey } from "drizzle-orm/pg-core";
import { destination } from "./destination";
import { days } from "@/validators/trip-schema";
import { tripBooking } from "./trip-booking";
import { review } from "./review";

export const trip = pgTable("trips", (c) => ({
  id: c.integer("id").primaryKey().generatedByDefaultAsIdentity(),
  titleEn: c.text("title_en").notNull(),
  titleRu: c.text("title_ru").notNull(),
  descriptionEn: c.text("description_en").notNull(),
  descriptionRu: c.text("description_ru").notNull(),
  longDescriptionEn: c.text("long_description_en").notNull(),
  longDescriptionRu: c.text("long_description_ru").notNull(),
  /**
   * each asset consists of this format:
   * `{url}?type=video` if video
   * `{url}?type=image` if image
   */
  assetsUrls: c.text("assets_urls").array().notNull(),
  travelTime: c.time("travel_time").notNull(),
  destinationId: c
    .integer("destination_id")
    .notNull()
    .references(() => destination.id, { onDelete: "restrict" }),
  adultTripPriceInCents: c.integer("adult_trip_price_in_cents").notNull(),
  childTripPriceInCents: c.integer("child_trip_price_in_cents").notNull().default(0),
  childAge: c.text("child_age").notNull().default(""),
  infantAge: c.text("infant_age").notNull().default(""),
  isAvailable: c.boolean("is_available").notNull(),
  isFeatured: c.boolean("is_featured").notNull(),
  isConfirmationRequired: c
    .boolean("is_confirmation_required")
    .notNull()
    .default(false),
  duration: c.text("duration").notNull(),
  availableDays: c
    .text("available_days", {
      enum: days,
    })
    .array()
    .notNull(),
  createdAt: c
    .timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: c
    .timestamp("updated_at", { withTimezone: true })
    .$onUpdate(() => new Date()),
}));

export const tripFeature = pgTable("trip_features", (c) => ({
  id: c.integer("id").primaryKey().generatedByDefaultAsIdentity(),
  contentEn: c.text("content_en").notNull(),
  contentRu: c.text("content_ru").notNull(),
}));

export const tripToFeature = pgTable(
  "trip_to_feature",
  (c) => ({
    tripId: c
      .integer("trip_id")
      .notNull()
      .references(() => trip.id, { onDelete: "cascade" }),
    featureId: c
      .integer("feature_id")
      .notNull()
      .references(() => tripFeature.id, { onDelete: "cascade" }),
  }),
  (t) => [primaryKey({ columns: [t.tripId, t.featureId] })],
);

export const tripType = pgTable("trip_type", (c) => ({
  id: c.integer("id").primaryKey().generatedByDefaultAsIdentity(),
  nameEn: c.text("name_en").notNull(),
  nameRu: c.text("name_ru").notNull(),
}));

export const tripToTripType = pgTable(
  "trip_to_trip_type",
  (c) => ({
    tripId: c
      .integer("trip_id")
      .notNull()
      .references(() => trip.id, { onDelete: "cascade" }),
    tripTypeId: c
      .integer("trip_type_id")
      .notNull()
      .references(() => tripType.id, { onDelete: "cascade" }),
  }),
  (t) => [primaryKey({ columns: [t.tripId, t.tripTypeId] })],
);

// ======================== relations ========================
export const tripRelations = relations(trip, ({ many, one }) => ({
  bookings: many(tripBooking),
  features: many(tripToFeature),
  tripTypes: many(tripToTripType),
  reviews: many(review),
  destination: one(destination, {
    fields: [trip.destinationId],
    references: [destination.id],
  }),
}));

export const tripToFeatureRelations = relations(tripToFeature, ({ one }) => ({
  feature: one(tripFeature, {
    fields: [tripToFeature.featureId],
    references: [tripFeature.id],
  }),
  trip: one(trip, {
    fields: [tripToFeature.tripId],
    references: [trip.id],
  }),
}));

export const tripToTripTypeRelations = relations(tripToTripType, ({ one }) => ({
  tripType: one(tripType, {
    fields: [tripToTripType.tripTypeId],
    references: [tripType.id],
  }),
  trip: one(trip, {
    fields: [tripToTripType.tripId],
    references: [trip.id],
  }),
}))
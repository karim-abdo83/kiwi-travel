import { relations, sql } from "drizzle-orm";
import { index, jsonb, pgTable } from "drizzle-orm/pg-core";
import { trip } from "./trip";
import { review } from "./review";
import type {
  AttributionSource,
  AttributionTouchpoint,
} from "@/lib/attribution";

export const tripBooking = pgTable(
  "trip_bookings",
  (c) => ({
    id: c.integer("id").primaryKey().generatedByDefaultAsIdentity(),
    userId: c.text("user_id").notNull(),
    userName: c.text("user_name"),
    userPhone: c.text("user_phone").notNull(),
    userEmail: c.text("user_email").notNull(),
    adultPriceInCents: c.integer("adult_price_in_cents").notNull(),
    childPriceInCents: c.integer("child_price_in_cents").notNull().default(0),
    tripId: c
      .integer("trip_id")
      .notNull()
      .references(() => trip.id, { onDelete: "cascade" }),
    bookingDate: c.date("booking_date").notNull(),
    adultsCount: c.integer("adults_count").notNull(),
    childrenCount: c.integer("children_count").notNull().default(0),
    infantsCount: c.integer("infants_count").notNull().default(0),
    isSeenByAdmin: c.boolean("is_seen_by_admin").notNull().default(false),
    status: c
      .text("status", {
        enum: ["pending", "accepted", "cancelled", "done", "missed"],
      })
      .notNull(),
    gclid: c.text("gclid"),
    gbraid: c.text("gbraid"),
    wbraid: c.text("wbraid"),
    yclid: c.text("yclid"),
    utmSource: c.text("utm_source"),
    utmMedium: c.text("utm_medium"),
    utmCampaign: c.text("utm_campaign"),
    utmContent: c.text("utm_content"),
    utmTerm: c.text("utm_term"),
    utmAdgroup: c.text("utm_adgroup"),
    utmAd: c.text("utm_ad"),
    visitorId: c.text("visitor_id"),
    journeyId: c.text("journey_id"),
    firstTouch: jsonb("first_touch").$type<AttributionTouchpoint>(),
    lastTouch: jsonb("last_touch").$type<AttributionTouchpoint>(),
    originalLandingPage: c.text("original_landing_page"),
    currentLandingPage: c.text("current_landing_page"),
    attributionReferrer: c.text("attribution_referrer"),
    firstLandingPage: c.text("first_landing_page"),
    lastLandingPage: c.text("last_landing_page"),
    referrer: c.text("referrer"),
    firstTouchSource: c.text("first_touch_source").$type<AttributionSource>(),
    lastTouchSource: c.text("last_touch_source").$type<AttributionSource>(),
    createdAt: c
      .timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: c
      .timestamp("updated_at", { withTimezone: true })
      .$onUpdate(() => new Date()),
  }),
  (t) => [
    index("user_id_idx").on(t.userId),
    index("booking_date_idx").on(t.bookingDate),
    index("trip_booking_visitor_id_idx").on(t.visitorId),
    index("trip_booking_journey_id_idx").on(t.journeyId),
  ],
);

// ======================== relations ========================

export const tripBookRelations = relations(tripBooking, ({ one }) => ({
  review: one(review),
  trip: one(trip, {
    fields: [tripBooking.tripId],
    references: [trip.id],
  }),
}));

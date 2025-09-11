import { pgTable } from "drizzle-orm/pg-core";
import { tripBooking } from "./trip-booking";
import { relations, sql } from "drizzle-orm";
import { trip } from "./trip";

export const review = pgTable("reviews", (c) => ({
  id: c.integer("id").primaryKey().generatedByDefaultAsIdentity(),
  // to make accessing the reviews faster
  // via trip relation
  tripId: c
    .integer("trip_id")
    // .notNull()
    .references(() => trip.id, { onDelete: "cascade" }),
  tripBookingId: c
    .integer("trip_booking_id")
    // .notNull()
    .references(() => tripBooking.id, { onDelete: "cascade" }),
  userId: c.text("user_id")/*.notNull()*/,
  userEmail: c.text("user_email").notNull(),
  userImageUrl: c.text("user_image_url"),
  userFullName: c.text("user_full_name"),
  message: c.text("message").notNull(),
  ratingValue: c.integer("rating_value").notNull(),
  isHiddenByAdmin: c.boolean("is_hidden_by_admin").notNull().default(false),
  createdAt: c
    .timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
}));

// ======================== relations ========================
export const reviewRelations = relations(review, ({ one }) => ({
  trip: one(trip, {
    fields: [review.tripId],
    references: [trip.id],
  }),
  tripBooking: one(tripBooking, {
    fields: [review.tripBookingId],
    references: [tripBooking.id],
  }),
}));

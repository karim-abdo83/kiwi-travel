import { pgTable } from "drizzle-orm/pg-core";
import { tripBooking } from "./trip-booking";
import { relations, sql } from "drizzle-orm";
import { trip } from "./trip";

export const review = pgTable("reviews", (c) => ({
  id: c.integer("id").primaryKey().generatedByDefaultAsIdentity(),
  // to make accessing the reviews faster
  // via trip relation
  image: c.text("image"),
  tripId: c
    .integer("trip_id")
    .references(() => trip.id, { onDelete: "cascade" }),
  tripBookingId: c
    .integer("trip_booking_id")
    .references(() => tripBooking.id, { onDelete: "cascade" }),
  userId: c.text("user_id"),
  userEmail: c.text("user_email").notNull(),
  userImageUrl: c.text("user_image_url"),
  userFullName: c.text("user_full_name"),
  message: c.text("message").notNull(),
  adminReply: c.text("admin_reply"),
  ratingValue: c.integer("rating_value").notNull(),
  isHiddenByAdmin: c.boolean("is_hidden_by_admin").notNull().default(false),
  createdAt: c
    .timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),

  // keep as plain column, no .references here
  parentId: c.integer("parent_id"),
}));

// ======================== relations ========================
export const reviewRelations = relations(review, ({ one, many }) => ({
  trip: one(trip, {
    fields: [review.tripId],
    references: [trip.id],
  }),
  tripBooking: one(tripBooking, {
    fields: [review.tripBookingId],
    references: [tripBooking.id],
  }),
  // self reference (parent review)
  parent: one(review, {
    fields: [review.parentId],
    references: [review.id],
  }),

  // add replies as reverse relation
  replies: many(review),
}));

export type Review = typeof review.$inferSelect;

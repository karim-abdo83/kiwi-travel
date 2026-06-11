import { relations, sql } from "drizzle-orm";
import { index, pgTable } from "drizzle-orm/pg-core";
import { trip } from "./trip";
import { review } from "./review";
import { tripTicketType } from "./trip";

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
    tripId: c.integer("trip_id")
      .notNull()
      .references(() => trip.id, { onDelete: "cascade" }),
    bookingDate: c.date("booking_date").notNull(),
    adultsCount: c.integer("adults_count").notNull(),
    childrenCount: c.integer("children_count").notNull().default(0),
    infantsCount: c.integer("infants_count").notNull().default(0),
    isSeenByAdmin: c.boolean("is_seen_by_admin").notNull().default(false),
    status: c.text("status", {
      enum: ["pending", "accepted", "cancelled", "done", "missed"],
    }).notNull(),
    createdAt: c.timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: c.timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  }),
  (t) => [
    index("user_id_idx").on(t.userId),
    index("booking_date_idx").on(t.bookingDate),
  ],
);

export const tripBookingTicketType = pgTable(
  "trip_booking_ticket_types",
  (c) => ({
    id: c.integer("id").primaryKey().generatedByDefaultAsIdentity(),
    bookingId: c.integer("booking_id")
      .notNull()
      .references(() => tripBooking.id, { onDelete: "cascade" }),
    ticketTypeId: c.integer("ticket_type_id").references(() => tripTicketType.id, {
      onDelete: "set null",
    }),
    ticketNameEn: c.text("ticket_name_en").notNull(),
    ticketNameRu: c.text("ticket_name_ru").notNull(),
    unitPriceInCents: c.integer("unit_price_in_cents").notNull(),
    quantity: c.integer("quantity").notNull(),
    totalPriceInCents: c.integer("total_price_in_cents").notNull(),
    sortOrder: c.integer("sort_order").notNull().default(0),
    createdAt: c.timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  }),
  (t) => [
    index("trip_booking_ticket_types_booking_id_idx").on(t.bookingId),
  ],
);

// ======================== relations ======================== 

export const tripBookRelations = relations(tripBooking, ({ many, one }) => ({
  review: one(review),
  trip: one(trip, {
    fields: [tripBooking.tripId],
    references: [trip.id],
  }),
  ticketTypes: many(tripBookingTicketType),
}));

export const tripBookingTicketTypeRelations = relations(tripBookingTicketType, ({ one }) => ({
  booking: one(tripBooking, {
    fields: [tripBookingTicketType.bookingId],
    references: [tripBooking.id],
  }),
  ticketType: one(tripTicketType, {
    fields: [tripBookingTicketType.ticketTypeId],
    references: [tripTicketType.id],
  }),
}));

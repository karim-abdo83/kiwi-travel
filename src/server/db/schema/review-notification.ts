import { index, pgTable } from "drizzle-orm/pg-core";
import { tripBooking } from "./trip-booking";

export const reviewNotification = pgTable("review_notifications", c => ({
  id: c.integer("id").primaryKey().generatedByDefaultAsIdentity(),
  userId: c.text("user_id").notNull(),
  tripTitleEn: c.text("trip_title_en").notNull(),
  tripTitleRu: c.text("trip_title_ru").notNull(),
  tripBookingId: c.integer("trip_booking_id").notNull().references(() => tripBooking.id, { onDelete: "cascade" }),
  isShown: c.boolean("is_shown").notNull().default(false),
}), t => [
  index("review_notifications_user_id_idx").on(t.userId),
]);
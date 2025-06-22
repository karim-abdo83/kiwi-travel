import { index, pgTable } from "drizzle-orm/pg-core";
import { tripBooking } from "./trip-booking";

export const confirmNotification = pgTable("confirm_notifications", c => ({
  id: c.integer("id").primaryKey().generatedByDefaultAsIdentity(),
  userId: c.text("user_id").notNull(),
  tripTitleEn: c.text("trip_title_en").notNull(),
  tripTitleRu: c.text("trip_title_ru").notNull(),
  tripBookingId: c.integer("trip_booking_id").notNull().references(() => tripBooking.id, { onDelete: "cascade" }),
  isCancelled: c.boolean("is_cancelled").notNull(),
  isShown: c.boolean("is_shown").notNull().default(false),
}), t => [
  index("confirm_notifications_user_id_idx").on(t.userId),
]);
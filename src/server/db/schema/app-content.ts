import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const appContent = pgTable("app_content", (c) => ({
  id: c.integer("id").primaryKey().generatedByDefaultAsIdentity(),
  popularDestinationEn: c.text("popular_destination_en").notNull(),
  popularDestinationRu: c.text("popular_destination_ru").notNull(),
  createdAt: c
    .timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: c
    .timestamp("updated_at", { withTimezone: true })
    .$onUpdate(() => new Date()),
}));

export type AppContent = typeof appContent.$inferSelect;

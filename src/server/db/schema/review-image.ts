import { pgTable } from "drizzle-orm/pg-core";
import { review } from "./review";
import { relations } from "drizzle-orm";

export const reviewImage = pgTable("review_images", (c) => ({
  id: c.integer("id").primaryKey().generatedByDefaultAsIdentity(),
  reviewId: c
    .integer("review_id")
    .notNull()
    .references(() => review.id, { onDelete: "cascade" }),
  url: c.text("url").notNull(),
  createdAt: c
    .timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
}));

// ======================== relations ========================
export const reviewImageRelations = relations(reviewImage, ({ one }) => ({
  review: one(review, {
    fields: [reviewImage.reviewId],
    references: [review.id],
  }),
}));

export type ReviewImage = typeof reviewImage.$inferSelect;
export type NewReviewImage = typeof reviewImage.$inferInsert;

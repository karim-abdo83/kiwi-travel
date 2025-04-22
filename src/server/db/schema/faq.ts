import { pgTable } from "drizzle-orm/pg-core";

export const faq = pgTable("faqs", (c) => ({
  id: c.integer("id").primaryKey().generatedByDefaultAsIdentity(),
  questionEn: c.text("question_en").notNull(),
  questionRu: c.text("question_ru").notNull(),
  answerEn: c.text("answer_en").notNull(),
  answerRu: c.text("answer_ru").notNull(),
}))
ALTER TABLE "settings" RENAME COLUMN "popular_destination" TO "popular_destination_en";--> statement-breakpoint
ALTER TABLE "settings" ADD COLUMN "popular_destination_ru" text NOT NULL;
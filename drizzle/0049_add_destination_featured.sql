ALTER TABLE "destinations" ADD COLUMN "is_featured" boolean DEFAULT false NOT NULL;--> statement-breakpoint
UPDATE "destinations" SET "is_featured" = "is_popular";

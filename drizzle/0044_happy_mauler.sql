ALTER TABLE "app_content" ALTER COLUMN "popular_destination_tr" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "destinations" ADD COLUMN "name_tr" text DEFAULT '' NOT NULL;
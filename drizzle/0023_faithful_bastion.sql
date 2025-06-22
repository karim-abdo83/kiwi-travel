ALTER TABLE "trips" RENAME COLUMN "trip_price_in_cents" TO "adult_trip_price_in_cents";--> statement-breakpoint
ALTER TABLE "trips" ADD COLUMN "child_trip_price_in_cents" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "trips" ADD COLUMN "infant_trip_price_in_cents" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "trips" ADD COLUMN "child_age" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "trips" ADD COLUMN "infant_age" integer DEFAULT 0 NOT NULL;
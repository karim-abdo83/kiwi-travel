ALTER TABLE "trip_bookings" RENAME COLUMN "price_in_cents" TO "adult_price_in_cents";--> statement-breakpoint
ALTER TABLE "trip_bookings" RENAME COLUMN "travelers_count" TO "adults_count";--> statement-breakpoint
ALTER TABLE "trip_bookings" ADD COLUMN "child_price_in_cents" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "trip_bookings" ADD COLUMN "infant_price_in_cents" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "trip_bookings" ADD COLUMN "children_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "trip_bookings" ADD COLUMN "infants_count" integer DEFAULT 0 NOT NULL;
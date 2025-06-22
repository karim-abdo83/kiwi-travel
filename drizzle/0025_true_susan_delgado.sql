ALTER TABLE "trips" ALTER COLUMN "child_age" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "trips" ALTER COLUMN "child_age" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "trips" ALTER COLUMN "infant_age" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "trips" ALTER COLUMN "infant_age" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "trips" DROP COLUMN "infant_trip_price_in_cents";--> statement-breakpoint
ALTER TABLE "trip_bookings" DROP COLUMN "infant_price_in_cents";
-- Add Turkish tour information fields to trips
ALTER TABLE "trips" ADD COLUMN IF NOT EXISTS "pickup_point_tr" text;--> statement-breakpoint
ALTER TABLE "trips" ADD COLUMN IF NOT EXISTS "place_of_return_tr" text;

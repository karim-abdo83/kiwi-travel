ALTER TABLE "trips" ADD COLUMN "display_from_price_in_cents" integer;--> statement-breakpoint
UPDATE "trips"
SET "display_from_price_in_cents" = "adult_trip_price_in_cents"
WHERE "display_from_price_in_cents" IS NULL;

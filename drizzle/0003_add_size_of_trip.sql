-- Add size_of_trip column to trips table
ALTER TABLE "trips" ADD COLUMN IF NOT EXISTS "size_of_trip" text NOT NULL DEFAULT '';
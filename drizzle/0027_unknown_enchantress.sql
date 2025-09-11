ALTER TABLE "reviews" ALTER COLUMN "trip_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "reviews" ALTER COLUMN "trip_booking_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "reviews" ALTER COLUMN "user_id" DROP NOT NULL;
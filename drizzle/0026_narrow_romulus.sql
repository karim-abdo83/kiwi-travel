ALTER TABLE "confirm_notifications" DROP CONSTRAINT "confirm_notifications_trip_booking_id_trip_bookings_id_fk";
--> statement-breakpoint
ALTER TABLE "review_notifications" DROP CONSTRAINT "review_notifications_trip_booking_id_trip_bookings_id_fk";
--> statement-breakpoint
ALTER TABLE "confirm_notifications" ADD CONSTRAINT "confirm_notifications_trip_booking_id_trip_bookings_id_fk" FOREIGN KEY ("trip_booking_id") REFERENCES "public"."trip_bookings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_notifications" ADD CONSTRAINT "review_notifications_trip_booking_id_trip_bookings_id_fk" FOREIGN KEY ("trip_booking_id") REFERENCES "public"."trip_bookings"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "trips" ALTER COLUMN "title_tr" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "trips" ALTER COLUMN "description_tr" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "trips" ALTER COLUMN "long_description_tr" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "trips" ADD COLUMN "pickup_point_tr" text;--> statement-breakpoint
ALTER TABLE "trips" ADD COLUMN "place_of_return_tr" text;
CREATE TABLE "settings" (
  "id" text PRIMARY KEY NOT NULL,
  "value" jsonb NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- Add index for faster lookups
CREATE INDEX "settings_id_idx" ON "settings" ("id");

-- Insert default settings
INSERT INTO "settings" ("id", "value") 
VALUES ('home_page', '{"popularDestinationsTitle": "Popular Destinations"}')
ON CONFLICT ("id") DO NOTHING;

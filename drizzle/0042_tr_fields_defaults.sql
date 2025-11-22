-- Make Turkish text fields safe on existing DBs by backfilling NULLs, then enforcing DEFAULT '' NOT NULL

-- Backfill any NULLs to avoid NOT NULL violation
UPDATE "trips" SET "title_tr" = '' WHERE "title_tr" IS NULL;
UPDATE "trips" SET "description_tr" = '' WHERE "description_tr" IS NULL;
UPDATE "trips" SET "long_description_tr" = '' WHERE "long_description_tr" IS NULL;

-- Set defaults
ALTER TABLE "trips" ALTER COLUMN "title_tr" SET DEFAULT '';
ALTER TABLE "trips" ALTER COLUMN "description_tr" SET DEFAULT '';
ALTER TABLE "trips" ALTER COLUMN "long_description_tr" SET DEFAULT '';

-- Enforce NOT NULL
ALTER TABLE "trips" ALTER COLUMN "title_tr" SET NOT NULL;
ALTER TABLE "trips" ALTER COLUMN "description_tr" SET NOT NULL;
ALTER TABLE "trips" ALTER COLUMN "long_description_tr" SET NOT NULL;

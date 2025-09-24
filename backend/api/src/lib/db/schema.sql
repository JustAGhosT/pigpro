-- Drop tables if they exist to start fresh
DROP TABLE IF EXISTS "financial_transactions";
DROP TABLE IF EXISTS "production_records";
DROP TABLE IF EXISTS "animals";
DROP TABLE IF EXISTS "groups";
DROP TABLE IF EXISTS "species";
DROP TABLE IF EXISTS "categories";
DROP TABLE IF EXISTS "fx_rates";
DROP TABLE IF EXISTS "report_jobs";

-- Species Table
CREATE TABLE "species" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" VARCHAR(255) NOT NULL,
  "is_dairy" BOOLEAN NOT NULL DEFAULT false,
  "is_ruminant" BOOLEAN NOT NULL DEFAULT false,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Groups Table
CREATE TABLE "groups" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" VARCHAR(255) NOT NULL,
  "species_id" UUID NOT NULL REFERENCES "species"("id"),
  "location_id" VARCHAR(255),
  "tags" TEXT[],
  "active" BOOLEAN NOT NULL DEFAULT true
);

-- Animals Table
CREATE TABLE "animals" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "external_id" VARCHAR(255) UNIQUE,
  "species_id" UUID NOT NULL REFERENCES "species"("id"),
  "group_id" UUID REFERENCES "groups"("id"),
  "sex" VARCHAR(50) NOT NULL,
  "dob" TIMESTAMPTZ,
  "status" VARCHAR(50) NOT NULL,
  "tags" TEXT[]
);

-- Production Records Table
CREATE TABLE "production_records" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "species_id" UUID NOT NULL REFERENCES "species"("id"),
  "animal_id" UUID REFERENCES "animals"("id"),
  "group_id" UUID REFERENCES "groups"("id"),
  "event_type" VARCHAR(255) NOT NULL,
  "event_subtype" VARCHAR(255),
  "date" TIMESTAMPTZ NOT NULL,
  "quantity" NUMERIC,
  "unit" VARCHAR(50),
  "weight_value" NUMERIC,
  "weight_unit" VARCHAR(50),
  "egg_count" INTEGER,
  "milk_volume" NUMERIC,
  "milk_unit" VARCHAR(50),
  "notes" TEXT,
  "source_imported" BOOLEAN DEFAULT false,
  "source_origin" VARCHAR(255),
  "created_by" VARCHAR(255),
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Categories Table (for financials)
CREATE TABLE "categories" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" VARCHAR(255) NOT NULL,
  "type" VARCHAR(50) NOT NULL, -- 'income' or 'expense'
  "parent_id" UUID REFERENCES "categories"("id"),
  "is_active" BOOLEAN NOT NULL DEFAULT true
);

-- Financial Transactions Table
CREATE TABLE "financial_transactions" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "species_id" UUID REFERENCES "species"("id"),
  "group_id" UUID REFERENCES "groups"("id"),
  "category_id" UUID NOT NULL REFERENCES "categories"("id"),
  "type" VARCHAR(50) NOT NULL,
  "amount" NUMERIC NOT NULL,
  "currency" VARCHAR(10) NOT NULL,
  "fx_rate_to_base" NUMERIC NOT NULL,
  "base_amount_cached" NUMERIC NOT NULL,
  "date" TIMESTAMPTZ NOT NULL,
  "vendor_or_buyer" VARCHAR(255),
  "memo" TEXT,
  "created_by" VARCHAR(255),
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- FX Rates Table
CREATE TABLE "fx_rates" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "date" DATE NOT NULL,
    "currency" VARCHAR(10) NOT NULL,
    "rate_to_base" NUMERIC NOT NULL,
    UNIQUE("date", "currency")
);

-- Report Jobs Table (for async tasks)
CREATE TABLE "report_jobs" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "type" VARCHAR(255) NOT NULL,
    "params_json" JSONB,
    "status" VARCHAR(50) NOT NULL,
    "uri" VARCHAR(255),
    "requested_by" VARCHAR(255),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX ON "groups" ("species_id");
CREATE INDEX ON "animals" ("species_id");
CREATE INDEX ON "animals" ("group_id");
CREATE INDEX ON "production_records" ("event_type");
CREATE INDEX ON "production_records" ("date");
CREATE INDEX ON "financial_transactions" ("date");
CREATE INDEX ON "financial_transactions" ("category_id");

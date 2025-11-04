-- Add method_and_soul column
ALTER TABLE hotdogs ADD COLUMN IF NOT EXISTS method_and_soul TEXT;

-- Convert ingredients from text[] to JSONB to support structured format
-- First, create a temporary column
ALTER TABLE hotdogs ADD COLUMN IF NOT EXISTS ingredients_new JSONB;

-- Migrate existing data: convert text[] to JSONB array format for backwards compatibility
UPDATE hotdogs 
SET ingredients_new = to_jsonb(ingredients)
WHERE ingredients IS NOT NULL;

-- Drop old column and rename new one
ALTER TABLE hotdogs DROP COLUMN IF EXISTS ingredients;
ALTER TABLE hotdogs RENAME COLUMN ingredients_new TO ingredients;
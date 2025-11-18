-- Add detailed nutrition fields to hotdogs table
ALTER TABLE hotdogs 
ADD COLUMN IF NOT EXISTS fat_total_g DECIMAL(5,1),
ADD COLUMN IF NOT EXISTS fat_saturated_g DECIMAL(5,1),
ADD COLUMN IF NOT EXISTS fat_trans_g DECIMAL(5,1),
ADD COLUMN IF NOT EXISTS carbs_total_g DECIMAL(5,1),
ADD COLUMN IF NOT EXISTS carbs_fiber_g DECIMAL(5,1),
ADD COLUMN IF NOT EXISTS carbs_sugars_g DECIMAL(5,1),
ADD COLUMN IF NOT EXISTS protein_g DECIMAL(5,1),
ADD COLUMN IF NOT EXISTS sodium_mg DECIMAL(6,1),
ADD COLUMN IF NOT EXISTS cholesterol_mg DECIMAL(5,1),
ADD COLUMN IF NOT EXISTS ingredients_hash TEXT;

-- Add comment explaining the ingredients_hash field
COMMENT ON COLUMN hotdogs.ingredients_hash IS 'Hash of ingredients JSON to detect changes and trigger nutrition recalculation';
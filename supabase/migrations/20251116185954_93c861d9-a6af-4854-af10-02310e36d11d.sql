-- Add recipe metadata columns for enhanced Google structured data
ALTER TABLE hotdogs 
ADD COLUMN IF NOT EXISTS prep_time TEXT,
ADD COLUMN IF NOT EXISTS cook_time TEXT,
ADD COLUMN IF NOT EXISTS total_time TEXT,
ADD COLUMN IF NOT EXISTS recipe_yield TEXT,
ADD COLUMN IF NOT EXISTS date_published TIMESTAMP WITH TIME ZONE DEFAULT now(),
ADD COLUMN IF NOT EXISTS calories INTEGER,
ADD COLUMN IF NOT EXISTS video_url TEXT;

-- Populate default values for existing hotdogs
UPDATE hotdogs 
SET 
  prep_time = 'PT10M',
  cook_time = 'PT5M',
  total_time = 'PT15M',
  recipe_yield = 'Serves 1',
  date_published = COALESCE(date_published, now())
WHERE prep_time IS NULL;
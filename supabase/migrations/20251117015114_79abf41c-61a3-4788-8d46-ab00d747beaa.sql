-- Add category tags and region columns to hotdogs table
ALTER TABLE public.hotdogs 
ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS region text;

-- Populate regions based on countries
UPDATE public.hotdogs SET region = CASE
  -- North America
  WHEN country IN ('United States', 'USA', 'Canada') THEN 'North America'
  -- South America
  WHEN country IN ('Brazil', 'Chile', 'Peru', 'Argentina') THEN 'South America'
  -- Europe
  WHEN country IN ('Germany', 'Denmark', 'Finland', 'Norway', 'Sweden', 'Iceland', 'Czech Republic', 'Poland', 'United Kingdom', 'UK', 'France', 'Russia') THEN 'Europe'
  -- Asia
  WHEN country IN ('Japan', 'South Korea', 'Korea', 'Thailand', 'India', 'China') THEN 'Asia'
  -- Africa
  WHEN country IN ('South Africa', 'Tanzania', 'Tunisia', 'Kenya') THEN 'Africa'
  -- Oceania
  WHEN country IN ('Australia', 'New Zealand') THEN 'Oceania'
  ELSE 'Other'
END;

-- Tag classic/traditional hot dogs
UPDATE public.hotdogs SET tags = array_append(tags, 'classic')
WHERE slug IN (
  'chicago-hotdog',
  'newyork-hotdog', 
  'coney-island-hotdog',
  'detroit-coney-dog',
  'rhode-island-hotdog',
  'kansas-city-hotdog',
  'atlanta-hotdog',
  'seattle-hotdog'
) AND NOT ('classic' = ANY(tags));

-- Tag spicy hot dogs (conservative - only obviously spicy ones)
UPDATE public.hotdogs SET tags = array_append(tags, 'spicy')
WHERE (
  slug IN ('sonoran-hotdog', 'shuco-hotdog', 'currywurst-hotdog', 'mishkaki-hotdog')
  OR name ILIKE '%spicy%'
  OR name ILIKE '%hot sauce%'
  OR description ILIKE '%jalapeño%'
  OR description ILIKE '%habanero%'
  OR description ILIKE '%sriracha%'
  OR description ILIKE '%hot sauce%'
  OR description ILIKE '%chili pepper%'
) AND NOT ('spicy' = ANY(tags));

-- Tag chili-topped hot dogs
UPDATE public.hotdogs SET tags = array_append(tags, 'chili')
WHERE (
  slug IN ('coney-island-hotdog', 'detroit-coney-dog', 'rhode-island-hotdog')
  OR name ILIKE '%chili%'
  OR description ILIKE '%chili%'
  OR description ILIKE '%chile%'
) AND NOT ('chili' = ANY(tags));

-- Tag fusion/unconventional hot dogs
UPDATE public.hotdogs SET tags = array_append(tags, 'fusion')
WHERE slug IN (
  'seoul-corndog',
  'saopaulo-hotdog',
  'bangkok-hotdog',
  'tokyo-hotdog',
  'bombay-hotdog',
  'toronto-hotdog'
) AND NOT ('fusion' = ANY(tags));

-- Tag grilled/charred hot dogs
UPDATE public.hotdogs SET tags = array_append(tags, 'grilled')
WHERE (
  slug IN ('sonoran-hotdog', 'boerewors-hotdog', 'mishkaki-hotdog', 'grilli-makkara-hotdog')
  OR name ILIKE '%grilled%'
  OR name ILIKE '%charred%'
  OR name ILIKE '%smoked%'
  OR description ILIKE '%grilled%'
  OR description ILIKE '%charred%'
  OR description ILIKE '%smoked%'
  OR description ILIKE '%flame%'
) AND NOT ('grilled' = ANY(tags));

-- Tag hot dogs with uncommon ingredients
UPDATE public.hotdogs SET tags = array_append(tags, 'uncommon')
WHERE (
  slug IN ('seoul-corndog', 'saopaulo-hotdog', 'toronto-hotdog', 'seattle-hotdog', 'completo-hotdog')
  OR description ILIKE '%mozzarella%'
  OR description ILIKE '%cream cheese%'
  OR description ILIKE '%pineapple%'
  OR description ILIKE '%potato chips%'
  OR description ILIKE '%egg%'
  OR description ILIKE '%avocado%'
  OR description ILIKE '%kimchi%'
  OR description ILIKE '%coleslaw%'
) AND NOT ('uncommon' = ANY(tags));

-- Create index for faster tag queries
CREATE INDEX IF NOT EXISTS idx_hotdogs_tags ON public.hotdogs USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_hotdogs_region ON public.hotdogs(region);
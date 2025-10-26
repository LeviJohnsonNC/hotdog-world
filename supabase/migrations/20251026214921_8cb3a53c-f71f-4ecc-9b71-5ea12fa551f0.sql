-- Add new columns to hotdogs table for detailed information
ALTER TABLE public.hotdogs
ADD COLUMN IF NOT EXISTS ingredients TEXT[],
ADD COLUMN IF NOT EXISTS instructions TEXT[],
ADD COLUMN IF NOT EXISTS fun_facts TEXT[],
ADD COLUMN IF NOT EXISTS origin_story TEXT,
ADD COLUMN IF NOT EXISTS explore_links JSONB DEFAULT '[]'::jsonb;

-- Add a comment to document the structure
COMMENT ON COLUMN public.hotdogs.explore_links IS 'Array of objects with title and url properties: [{"title": "Link Title", "url": "https://..."}]';
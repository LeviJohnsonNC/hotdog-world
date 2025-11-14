-- Create table to store sprite sheet data directly in database
CREATE TABLE IF NOT EXISTS public.sprite_sheets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  image_data TEXT NOT NULL, -- base64 encoded image
  version BIGINT NOT NULL,
  grid_size INTEGER NOT NULL,
  sprite_size INTEGER NOT NULL,
  sheet_size INTEGER NOT NULL,
  hotdogs_count INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.sprite_sheets ENABLE ROW LEVEL SECURITY;

-- Allow public read access to sprite sheets
CREATE POLICY "Public can view sprite sheets"
ON public.sprite_sheets FOR SELECT
USING (true);

-- Allow authenticated users to insert/update sprite sheets
CREATE POLICY "Authenticated can manage sprite sheets"
ON public.sprite_sheets FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
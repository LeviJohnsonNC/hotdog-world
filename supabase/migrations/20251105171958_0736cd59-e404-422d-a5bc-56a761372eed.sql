-- Add sprite sheet metadata columns to hotdogs table
ALTER TABLE hotdogs 
ADD COLUMN IF NOT EXISTS sprite_x INTEGER,
ADD COLUMN IF NOT EXISTS sprite_y INTEGER,
ADD COLUMN IF NOT EXISTS sprite_width INTEGER DEFAULT 256,
ADD COLUMN IF NOT EXISTS sprite_height INTEGER DEFAULT 256,
ADD COLUMN IF NOT EXISTS sprite_sheet_version INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS needs_sprite_update BOOLEAN DEFAULT false;

-- Create storage bucket for sprite sheets (public by default)
INSERT INTO storage.buckets (id, name)
VALUES ('hotdog-sprites', 'hotdog-sprites')
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for sprite sheet bucket (public read access)
CREATE POLICY "Public can view sprite sheets"
ON storage.objects FOR SELECT
USING (bucket_id = 'hotdog-sprites');

CREATE POLICY "Service role can manage sprite sheets"
ON storage.objects FOR ALL
USING (bucket_id = 'hotdog-sprites');
-- Add RLS policies for sprites folder in hotdog-photos bucket
-- This allows authenticated users to upload/update sprites and everyone to view them

-- Allow authenticated users to upload sprites
CREATE POLICY "Authenticated can upload sprites"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'hotdog-photos' 
  AND (storage.foldername(name))[1] = 'sprites'
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to update sprites
CREATE POLICY "Authenticated can update sprites"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'hotdog-photos' 
  AND (storage.foldername(name))[1] = 'sprites'
  AND auth.role() = 'authenticated'
);

-- Allow public read access to sprites
CREATE POLICY "Public can view sprites"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'hotdog-photos' 
  AND (storage.foldername(name))[1] = 'sprites'
);

-- Clean up old hotdog-sprites policies (these are orphaned and no longer used)
DROP POLICY IF EXISTS "Public Access for Sprite Sheets" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload for Sprite Sheets" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Update for Sprite Sheets" ON storage.objects;
DROP POLICY IF EXISTS "Public access to sprite sheets" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload sprite sheets" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update sprite sheets" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete sprite sheets" ON storage.objects;
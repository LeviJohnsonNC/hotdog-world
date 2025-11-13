-- Create hotdog-sprites storage bucket
INSERT INTO storage.buckets (id, name)
VALUES ('hotdog-sprites', 'hotdog-sprites')
ON CONFLICT (id) DO NOTHING;

-- Allow public access to view sprite sheets
CREATE POLICY "Public Access for Sprite Sheets"
ON storage.objects FOR SELECT
USING (bucket_id = 'hotdog-sprites');

-- Allow authenticated users to upload sprite sheets
CREATE POLICY "Authenticated Upload for Sprite Sheets"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'hotdog-sprites' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to update sprite sheets
CREATE POLICY "Authenticated Update for Sprite Sheets"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'hotdog-sprites' 
  AND auth.role() = 'authenticated'
);
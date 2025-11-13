-- Drop existing incomplete policies
DROP POLICY IF EXISTS "Public can view sprite sheets" ON storage.objects;
DROP POLICY IF EXISTS "Service role can manage sprite sheets" ON storage.objects;

-- Create proper policies for sprite sheet storage

-- Allow authenticated users to upload sprite sheets
CREATE POLICY "Authenticated users can upload sprite sheets"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'hotdog-sprites');

-- Allow authenticated users to update sprite sheets  
CREATE POLICY "Authenticated users can update sprite sheets"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'hotdog-sprites')
WITH CHECK (bucket_id = 'hotdog-sprites');

-- Allow public access to view sprite sheets
CREATE POLICY "Public access to sprite sheets"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'hotdog-sprites');

-- Allow authenticated users to delete sprite sheets
CREATE POLICY "Authenticated users can delete sprite sheets"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'hotdog-sprites');
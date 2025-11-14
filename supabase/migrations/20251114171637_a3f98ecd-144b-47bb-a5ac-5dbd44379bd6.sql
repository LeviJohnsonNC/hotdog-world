-- Ensure hotdog-photos bucket exists (without public column)
INSERT INTO storage.buckets (id, name)
VALUES ('hotdog-photos', 'hotdog-photos')
ON CONFLICT (id) DO NOTHING;

-- Clean up old sprite policies
DROP POLICY IF EXISTS "Authenticated can upload sprites" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can update sprites" ON storage.objects;
DROP POLICY IF EXISTS "Public can view sprites" ON storage.objects;

-- Create permissive policy for all operations on hotdog-photos bucket
-- This allows both service role (edge function) and frontend to access
CREATE POLICY "Allow all operations on hotdog-photos"
ON storage.objects FOR ALL
USING (bucket_id = 'hotdog-photos')
WITH CHECK (bucket_id = 'hotdog-photos');
-- Remove incorrectly created bucket (if exists)
DELETE FROM storage.buckets WHERE id = 'hotdog-sprites';

-- Keep RLS policies for when bucket is created via Storage API
-- (These policies are correct and work on storage.objects table)
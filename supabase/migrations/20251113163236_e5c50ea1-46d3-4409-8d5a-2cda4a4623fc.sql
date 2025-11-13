-- Remove the bucket created with SQL (not properly registered with storage service)
DELETE FROM storage.buckets WHERE id = 'hotdog-sprites';
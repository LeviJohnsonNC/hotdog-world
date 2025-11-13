-- Delete and recreate bucket with explicit configuration
DELETE FROM storage.buckets WHERE id = 'hotdog-sprites';

-- Create bucket with explicit settings
INSERT INTO storage.buckets (id, name, owner, created_at, updated_at)
VALUES (
  'hotdog-sprites',
  'hotdog-sprites',
  NULL,
  now(),
  now()
);
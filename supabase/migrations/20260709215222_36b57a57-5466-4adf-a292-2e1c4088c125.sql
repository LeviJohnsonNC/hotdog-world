
-- user_profiles: restrict SELECT to own row only
DROP POLICY IF EXISTS "Authenticated can view public profile fields" ON public.user_profiles;
CREATE POLICY "Users can view their own profile"
  ON public.user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- hotdog_stamps: remove leaderboard-wide SELECT (leaderboard uses SECURITY DEFINER RPC)
DROP POLICY IF EXISTS "Authenticated can view all stamps for leaderboard" ON public.hotdog_stamps;

-- storage.objects: strengthen hotdog-photos policies by also verifying server-set owner
DROP POLICY IF EXISTS "Users can view their own photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own photos" ON storage.objects;

CREATE POLICY "Users can view their own photos"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'hotdog-photos'
    AND owner = auth.uid()
    AND (auth.uid())::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can upload their own photos"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'hotdog-photos'
    AND owner = auth.uid()
    AND (auth.uid())::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own photos"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'hotdog-photos'
    AND owner = auth.uid()
    AND (auth.uid())::text = (storage.foldername(name))[1]
  )
  WITH CHECK (
    bucket_id = 'hotdog-photos'
    AND owner = auth.uid()
    AND (auth.uid())::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own photos"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'hotdog-photos'
    AND owner = auth.uid()
    AND (auth.uid())::text = (storage.foldername(name))[1]
  );

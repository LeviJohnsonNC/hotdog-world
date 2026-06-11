
-- 1. Drop email column from user_profiles (not used; email is in auth.users)
ALTER TABLE public.user_profiles DROP COLUMN IF EXISTS email;

-- 2. Restrict user_profiles SELECT to owner only
DROP POLICY IF EXISTS "Anyone can view display names" ON public.user_profiles;
-- "Users can view their own profile" already exists for owner SELECT

-- 3. Restrict hotdog_stamps SELECT to owner only (leaderboard uses SECURITY DEFINER RPC)
DROP POLICY IF EXISTS "Anyone can view stamps for leaderboard" ON public.hotdog_stamps;

-- 4. Drop overly-permissive storage policy
DROP POLICY IF EXISTS "Allow all operations on hotdog-photos" ON storage.objects;

-- 5. Lock down SECURITY DEFINER functions
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.generate_unique_display_name() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_leaderboard_data() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_leaderboard_data() TO authenticated;

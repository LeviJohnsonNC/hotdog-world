
-- Remove the previous SECURITY DEFINER view.
DROP VIEW IF EXISTS public.public_profiles;

-- Restrict which columns of user_profiles authenticated users can SELECT.
-- Only user_id + display_name are needed publicly (for the leaderboard);
-- email stays hidden from other users.
REVOKE SELECT ON public.user_profiles FROM authenticated;
GRANT SELECT (user_id, display_name) ON public.user_profiles TO authenticated;

-- Broaden the row-level SELECT policy so leaderboard aggregation sees all rows,
-- but only the columns granted above are actually readable.
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
CREATE POLICY "Authenticated can view public profile fields"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (true);

-- Rewrite the leaderboard function to read user_profiles directly under invoker rights.
CREATE OR REPLACE FUNCTION public.get_leaderboard_data()
RETURNS TABLE(user_id uuid, display_name text, stamp_count bigint, first_stamp_time bigint)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path TO 'public'
AS $function$
  SELECT
    hs.user_id,
    up.display_name,
    COUNT(DISTINCT hs.hotdog_id)::bigint AS stamp_count,
    MIN(hs.timestamp)::bigint AS first_stamp_time
  FROM public.hotdog_stamps hs
  LEFT JOIN public.user_profiles up ON hs.user_id = up.user_id
  GROUP BY hs.user_id, up.display_name
  ORDER BY stamp_count DESC, first_stamp_time ASC;
$function$;

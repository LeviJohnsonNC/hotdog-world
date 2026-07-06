
-- Public view exposing only non-sensitive profile fields (owned by postgres → bypasses RLS on user_profiles safely, exposes only user_id + display_name).
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT user_id, display_name FROM public.user_profiles;

GRANT SELECT ON public.public_profiles TO anon, authenticated;

-- Allow authenticated users to read all stamp rows so leaderboard aggregation works under invoker rights.
CREATE POLICY "Authenticated can view all stamps for leaderboard"
ON public.hotdog_stamps
FOR SELECT
TO authenticated
USING (true);

-- Switch leaderboard function from SECURITY DEFINER to SECURITY INVOKER; read display_name via the safe view.
CREATE OR REPLACE FUNCTION public.get_leaderboard_data()
RETURNS TABLE(user_id uuid, display_name text, stamp_count bigint, first_stamp_time bigint)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path TO 'public'
AS $function$
  SELECT
    hs.user_id,
    pp.display_name,
    COUNT(DISTINCT hs.hotdog_id)::bigint AS stamp_count,
    MIN(hs.timestamp)::bigint AS first_stamp_time
  FROM public.hotdog_stamps hs
  LEFT JOIN public.public_profiles pp ON hs.user_id = pp.user_id
  GROUP BY hs.user_id, pp.display_name
  ORDER BY stamp_count DESC, first_stamp_time ASC;
$function$;

-- Add public SELECT policy for hotdog_stamps (for leaderboard visibility)
CREATE POLICY "Anyone can view stamps for leaderboard"
ON public.hotdog_stamps
FOR SELECT
TO public
USING (true);

-- Add public SELECT policy for user_profiles (for display names on leaderboard)
CREATE POLICY "Anyone can view display names"
ON public.user_profiles
FOR SELECT
TO public
USING (true);

-- Add indexes for leaderboard query performance
CREATE INDEX IF NOT EXISTS idx_hotdog_stamps_user_id ON public.hotdog_stamps(user_id);
CREATE INDEX IF NOT EXISTS idx_hotdog_stamps_timestamp ON public.hotdog_stamps(timestamp);

-- Create a database function for efficient leaderboard aggregation
CREATE OR REPLACE FUNCTION public.get_leaderboard_data()
RETURNS TABLE (
  user_id uuid,
  display_name text,
  stamp_count bigint,
  first_stamp_time bigint
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    hs.user_id,
    up.display_name,
    COUNT(DISTINCT hs.hotdog_id)::bigint as stamp_count,
    MIN(hs.timestamp)::bigint as first_stamp_time
  FROM hotdog_stamps hs
  LEFT JOIN user_profiles up ON hs.user_id = up.user_id
  GROUP BY hs.user_id, up.display_name
  ORDER BY stamp_count DESC, first_stamp_time ASC;
$$;
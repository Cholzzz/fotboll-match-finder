
CREATE OR REPLACE FUNCTION public.get_player_rankings(limit_count int DEFAULT 50)
RETURNS TABLE(
  player_user_id uuid,
  view_count bigint,
  full_name text,
  avatar_url text,
  player_position text,
  region text,
  age int
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    pv.player_user_id,
    count(*)::bigint AS view_count,
    p.full_name,
    p.avatar_url,
    pp.position AS player_position,
    pp.region,
    pp.age
  FROM public.profile_views pv
  JOIN public.profiles p ON p.user_id = pv.player_user_id
  LEFT JOIN public.player_profiles pp ON pp.user_id = pv.player_user_id
  GROUP BY pv.player_user_id, p.full_name, p.avatar_url, pp.position, pp.region, pp.age
  ORDER BY view_count DESC
  LIMIT limit_count;
END;
$$;

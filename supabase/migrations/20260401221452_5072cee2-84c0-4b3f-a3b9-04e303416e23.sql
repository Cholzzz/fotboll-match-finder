
-- saved_players table
CREATE TABLE public.saved_players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  club_user_id uuid NOT NULL,
  player_user_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(club_user_id, player_user_id)
);
ALTER TABLE public.saved_players ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clubs can save players" ON public.saved_players
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = club_user_id);

CREATE POLICY "Clubs can view saved players" ON public.saved_players
  FOR SELECT TO authenticated USING (auth.uid() = club_user_id);

CREATE POLICY "Clubs can unsave players" ON public.saved_players
  FOR DELETE TO authenticated USING (auth.uid() = club_user_id);

-- player_statistics table
CREATE TABLE public.player_statistics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  season text NOT NULL DEFAULT '2024/2025',
  matches integer NOT NULL DEFAULT 0,
  goals integer NOT NULL DEFAULT 0,
  assists integer NOT NULL DEFAULT 0,
  yellow_cards integer NOT NULL DEFAULT 0,
  red_cards integer NOT NULL DEFAULT 0,
  minutes_played integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, season)
);
ALTER TABLE public.player_statistics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view statistics" ON public.player_statistics
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Players can insert own stats" ON public.player_statistics
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Players can update own stats" ON public.player_statistics
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

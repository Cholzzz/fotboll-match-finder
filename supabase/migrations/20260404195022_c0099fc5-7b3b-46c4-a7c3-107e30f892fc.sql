
CREATE TABLE public.player_performance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  test_type text NOT NULL,
  test_name text NOT NULL,
  value numeric NOT NULL,
  unit text NOT NULL,
  verified_by text NOT NULL DEFAULT 'self',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.player_performance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view performance data"
  ON public.player_performance FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Players can insert own performance data"
  ON public.player_performance FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Players can update own performance data"
  ON public.player_performance FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Players can delete own performance data"
  ON public.player_performance FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

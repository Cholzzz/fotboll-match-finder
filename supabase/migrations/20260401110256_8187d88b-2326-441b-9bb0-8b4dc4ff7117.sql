
-- Trials table
CREATE TABLE public.trials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  club_user_id uuid NOT NULL,
  title text,
  trial_date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  location text NOT NULL,
  positions jsonb NOT NULL DEFAULT '[]'::jsonb,
  max_spots integer NOT NULL DEFAULT 20,
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.trials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view trials" ON public.trials
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Clubs can create trials" ON public.trials
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = club_user_id);

CREATE POLICY "Clubs can update own trials" ON public.trials
  FOR UPDATE TO authenticated
  USING (auth.uid() = club_user_id);

CREATE POLICY "Clubs can delete own trials" ON public.trials
  FOR DELETE TO authenticated
  USING (auth.uid() = club_user_id);

-- Trial applications table
CREATE TABLE public.trial_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trial_id uuid NOT NULL REFERENCES public.trials(id) ON DELETE CASCADE,
  player_user_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  message text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(trial_id, player_user_id)
);

ALTER TABLE public.trial_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Players can apply to trials" ON public.trial_applications
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = player_user_id);

CREATE POLICY "Players can view own applications" ON public.trial_applications
  FOR SELECT TO authenticated
  USING (
    auth.uid() = player_user_id
    OR EXISTS (
      SELECT 1 FROM public.trials t WHERE t.id = trial_id AND t.club_user_id = auth.uid()
    )
  );

CREATE POLICY "Club owners can update applications" ON public.trial_applications
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.trials t WHERE t.id = trial_id AND t.club_user_id = auth.uid()
    )
  );

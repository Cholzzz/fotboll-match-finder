
INSERT INTO storage.buckets (id, name, public) VALUES ('highlights', 'highlights', true);

CREATE TABLE public.highlights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text,
  description text,
  video_url text NOT NULL,
  position text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.highlights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view highlights" ON public.highlights
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can insert own highlights" ON public.highlights
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own highlights" ON public.highlights
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view highlight videos" ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'highlights');

CREATE POLICY "Authenticated users can upload highlight videos" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'highlights');

CREATE POLICY "Users can delete own highlight videos" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'highlights' AND (storage.foldername(name))[1] = auth.uid()::text);

ALTER PUBLICATION supabase_realtime ADD TABLE public.highlights;

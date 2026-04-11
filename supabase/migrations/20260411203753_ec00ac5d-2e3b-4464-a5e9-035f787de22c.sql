
-- Create posts table for news feed
CREATE TABLE public.posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can view posts
CREATE POLICY "Authenticated users can view posts"
ON public.posts FOR SELECT TO authenticated
USING (true);

-- Users can create their own posts
CREATE POLICY "Users can create own posts"
ON public.posts FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can update their own posts
CREATE POLICY "Users can update own posts"
ON public.posts FOR UPDATE TO authenticated
USING (auth.uid() = user_id);

-- Users can delete their own posts
CREATE POLICY "Users can delete own posts"
ON public.posts FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- Create post_likes table
CREATE TABLE public.post_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(post_id, user_id)
);

ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view likes"
ON public.post_likes FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Users can like posts"
ON public.post_likes FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike posts"
ON public.post_likes FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- Create post_comments table
CREATE TABLE public.post_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view comments"
ON public.post_comments FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Users can create comments"
ON public.post_comments FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
ON public.post_comments FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- Enable realtime for posts
ALTER PUBLICATION supabase_realtime ADD TABLE public.posts;

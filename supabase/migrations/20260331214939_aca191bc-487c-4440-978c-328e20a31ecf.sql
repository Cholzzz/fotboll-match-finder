
-- Connections table for network/follow system
CREATE TABLE public.connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(requester_id, receiver_id)
);

-- Enable RLS
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;

-- Users can view connections they are part of
CREATE POLICY "Users can view their connections"
ON public.connections FOR SELECT TO authenticated
USING (auth.uid() = requester_id OR auth.uid() = receiver_id);

-- Users can send connection requests
CREATE POLICY "Users can send connection requests"
ON public.connections FOR INSERT TO authenticated
WITH CHECK (auth.uid() = requester_id AND requester_id != receiver_id);

-- Users can update connections they received (accept/reject) or cancel their own
CREATE POLICY "Users can update their connections"
ON public.connections FOR UPDATE TO authenticated
USING (auth.uid() = receiver_id OR auth.uid() = requester_id);

-- Users can delete their own connections
CREATE POLICY "Users can delete their connections"
ON public.connections FOR DELETE TO authenticated
USING (auth.uid() = requester_id OR auth.uid() = receiver_id);


-- Drop overly permissive policies
DROP POLICY "Users can create conversations" ON public.conversations;
DROP POLICY "Users can add participants" ON public.conversation_participants;

-- Conversations: any authenticated user can create (needed for starting chats)
CREATE POLICY "Authenticated users can create conversations"
ON public.conversations FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.conversation_participants
    WHERE conversation_id = id AND user_id = auth.uid()
  )
  OR NOT EXISTS (
    SELECT 1 FROM public.conversation_participants
    WHERE conversation_id = id
  )
);

-- Participants: users can add themselves or others only if they're already in the conversation
CREATE POLICY "Users can add participants to conversations"
ON public.conversation_participants FOR INSERT TO authenticated
WITH CHECK (
  user_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.conversation_participants cp
    WHERE cp.conversation_id = conversation_participants.conversation_id AND cp.user_id = auth.uid()
  )
);

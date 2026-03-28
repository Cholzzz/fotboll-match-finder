
-- Fix 1: Remove overly permissive SELECT policy on user_roles
DROP POLICY IF EXISTS "Users can view all roles" ON public.user_roles;

-- Replace with: users can only view their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Fix 2: Remove overly permissive INSERT policy on user_roles
DROP POLICY IF EXISTS "Users can insert their own role" ON public.user_roles;

-- Replace with: users can only insert their own role IF they don't already have one
CREATE POLICY "Users can insert their first role"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND NOT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = auth.uid()
  )
);

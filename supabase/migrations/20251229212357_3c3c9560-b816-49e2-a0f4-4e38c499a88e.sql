-- Drop the existing overly permissive INSERT policy
DROP POLICY IF EXISTS "Service role can insert rate limit events" ON public.rate_limit_events;

-- Create a new policy that only allows service role to insert
CREATE POLICY "Service role can insert rate limit events" 
ON public.rate_limit_events 
FOR INSERT 
WITH CHECK (auth.role() = 'service_role');
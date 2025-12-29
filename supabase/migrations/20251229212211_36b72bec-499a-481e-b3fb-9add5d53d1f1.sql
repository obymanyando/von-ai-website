-- Drop the existing overly permissive INSERT policy
DROP POLICY IF EXISTS "Allow insert from service role" ON public.contact_submissions;

-- Create a new policy that only allows service role to insert
CREATE POLICY "Service role can insert submissions" 
ON public.contact_submissions 
FOR INSERT 
WITH CHECK (auth.role() = 'service_role');
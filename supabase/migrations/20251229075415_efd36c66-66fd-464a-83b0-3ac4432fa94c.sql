-- Allow authenticated users to read contact submissions
CREATE POLICY "Authenticated users can view submissions"
ON public.contact_submissions
FOR SELECT
TO authenticated
USING (true);

-- Allow authenticated users to delete submissions
CREATE POLICY "Authenticated users can delete submissions"
ON public.contact_submissions
FOR DELETE
TO authenticated
USING (true);
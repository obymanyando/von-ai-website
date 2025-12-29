-- Create table to track rate limit events for monitoring
CREATE TABLE public.rate_limit_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_ip TEXT NOT NULL,
  event_type TEXT NOT NULL, -- 'message_limit', 'conversation_limit'
  endpoint TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.rate_limit_events ENABLE ROW LEVEL SECURITY;

-- Only admins can view rate limit events
CREATE POLICY "Admins can view rate limit events"
ON public.rate_limit_events
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete rate limit events (for cleanup)
CREATE POLICY "Admins can delete rate limit events"
ON public.rate_limit_events
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Service role can insert (from edge functions)
CREATE POLICY "Service role can insert rate limit events"
ON public.rate_limit_events
FOR INSERT
WITH CHECK (true);

-- Create index for querying by IP and time
CREATE INDEX idx_rate_limit_events_ip_time ON public.rate_limit_events(client_ip, created_at DESC);
CREATE INDEX idx_rate_limit_events_created_at ON public.rate_limit_events(created_at DESC);
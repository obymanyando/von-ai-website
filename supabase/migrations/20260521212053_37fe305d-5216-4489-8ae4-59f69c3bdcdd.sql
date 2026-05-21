
-- Fix missing quiz_events table (referenced in code, never created)
CREATE TABLE IF NOT EXISTS public.quiz_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  event TEXT NOT NULL,
  result TEXT,
  answers JSONB,
  abandoned_at_question INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_quiz_events_session ON public.quiz_events(session_id);
CREATE INDEX IF NOT EXISTS idx_quiz_events_created ON public.quiz_events(created_at DESC);
ALTER TABLE public.quiz_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert quiz events"
  ON public.quiz_events FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Admins can view quiz events"
  ON public.quiz_events FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete quiz events"
  ON public.quiz_events FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- ============================================
-- Resource Library
-- ============================================

CREATE TABLE public.resource_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  resource_slug TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'en',
  consent_given BOOLEAN NOT NULL DEFAULT false,
  consent_at TIMESTAMPTZ,
  marketing_opt_in BOOLEAN NOT NULL DEFAULT true,
  ip_hash TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_resource_leads_email ON public.resource_leads(email);
CREATE INDEX idx_resource_leads_slug ON public.resource_leads(resource_slug);
CREATE INDEX idx_resource_leads_created ON public.resource_leads(created_at DESC);
ALTER TABLE public.resource_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role inserts resource leads"
  ON public.resource_leads FOR INSERT TO public
  WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Admins view resource leads"
  ON public.resource_leads FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins delete resource leads"
  ON public.resource_leads FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TABLE public.resource_downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_slug TEXT NOT NULL,
  gated BOOLEAN NOT NULL DEFAULT false,
  lead_id UUID REFERENCES public.resource_leads(id) ON DELETE SET NULL,
  language TEXT,
  ip_hash TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_resource_downloads_slug ON public.resource_downloads(resource_slug);
CREATE INDEX idx_resource_downloads_created ON public.resource_downloads(created_at DESC);
ALTER TABLE public.resource_downloads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert downloads"
  ON public.resource_downloads FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Admins view downloads"
  ON public.resource_downloads FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TABLE public.marketing_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  language TEXT NOT NULL DEFAULT 'en',
  source TEXT,
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  unsubscribed_at TIMESTAMPTZ
);
CREATE INDEX idx_marketing_subscribers_active ON public.marketing_subscribers(email) WHERE unsubscribed_at IS NULL;
ALTER TABLE public.marketing_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role manages marketing subscribers"
  ON public.marketing_subscribers FOR ALL TO public
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Admins view marketing subscribers"
  ON public.marketing_subscribers FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins delete marketing subscribers"
  ON public.marketing_subscribers FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

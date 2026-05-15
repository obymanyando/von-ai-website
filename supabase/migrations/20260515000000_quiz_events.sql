CREATE TABLE public.quiz_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL,
  event TEXT NOT NULL,
  result TEXT,
  answers JSONB,
  abandoned_at_question INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.quiz_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert quiz events"
  ON public.quiz_events FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can read quiz events"
  ON public.quiz_events FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

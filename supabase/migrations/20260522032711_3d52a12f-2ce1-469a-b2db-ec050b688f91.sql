
CREATE TABLE public.insights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.insights ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view insights" ON public.insights FOR SELECT USING (true);
CREATE POLICY "Anyone can insert insights" ON public.insights FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete insights" ON public.insights FOR DELETE USING (true);

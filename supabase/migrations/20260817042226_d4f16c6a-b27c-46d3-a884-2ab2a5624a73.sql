CREATE TABLE IF NOT EXISTS public.site_content (
  id text PRIMARY KEY,
  title text NOT NULL,
  body text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.site_content TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_content TO authenticated;
GRANT ALL ON public.site_content TO service_role;

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "site_content public read" ON public.site_content FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "site_content admin write" ON public.site_content FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.site_content (id, title, body, sort_order) VALUES
  ('sobre', 'Sobre', 'A Wiskow Concept nasceu do gesto: silhuetas anotadas, tecidos tocados de leve e uma obsessão discreta pelo caimento.', 1),
  ('manifesto', 'Manifesto', 'Roupa não é tendência. É linguagem. Trabalhamos com pequenas produções e matérias-primas naturais.', 2),
  ('trocas', 'Política de Trocas', 'Trocas em até 7 dias corridos após o recebimento, com a peça sem uso e com etiqueta. Fale com a gente pelo WhatsApp.', 3),
  ('tamanhos', 'Guia de tamanhos', 'P: 36/38 · M: 40/42 · G: 44/46. Em caso de dúvida, escreva para nós — ajudamos a escolher.', 4)
ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS instagram_feed text[] NOT NULL DEFAULT '{}';

CREATE POLICY "media admin insert" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "media admin update" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "media admin delete" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "media admin read" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));
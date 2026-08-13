CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user','assistant')),
  content TEXT NOT NULL,
  sources JSONB NOT NULL DEFAULT '[]'::jsonb,
  feedback SMALLINT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
CREATE INDEX messages_user_created_idx ON public.messages (user_id, created_at);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.messages TO authenticated;
GRANT ALL ON public.messages TO service_role;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own messages" ON public.messages FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.kb_chunks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  doc TEXT NOT NULL,
  heading TEXT NOT NULL,
  content TEXT NOT NULL,
  embedding vector(1536),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX kb_chunks_doc_heading_idx ON public.kb_chunks (doc, heading);
GRANT SELECT ON public.kb_chunks TO authenticated;
GRANT ALL ON public.kb_chunks TO service_role;
ALTER TABLE public.kb_chunks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Signed-in users can read knowledge base" ON public.kb_chunks FOR SELECT TO authenticated USING (true);

CREATE OR REPLACE FUNCTION public.match_kb_chunks(query_embedding vector(1536), match_count int DEFAULT 5)
RETURNS TABLE (id uuid, doc text, heading text, content text, similarity float)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT c.id, c.doc, c.heading, c.content, 1 - (c.embedding <=> query_embedding) AS similarity
  FROM public.kb_chunks c
  WHERE c.embedding IS NOT NULL
  ORDER BY c.embedding <=> query_embedding
  LIMIT match_count;
$$;
GRANT EXECUTE ON FUNCTION public.match_kb_chunks(vector, int) TO authenticated, service_role;
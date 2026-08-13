REVOKE ALL ON FUNCTION public.match_kb_chunks(vector, int) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.match_kb_chunks(vector, int) TO service_role;
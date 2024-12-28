CREATE OR REPLACE FUNCTION public.generate_uuid()
RETURNS json
LANGUAGE sql
AS $$
  SELECT json_build_object('id', gen_random_uuid()::text);
$$;

-- Pantry table
CREATE TABLE public.user_pantry (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  ingredient_ids text[] NOT NULL DEFAULT '{}',
  equipment_ids  text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_pantry TO authenticated;
GRANT ALL ON public.user_pantry TO service_role;

ALTER TABLE public.user_pantry ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own pantry"
  ON public.user_pantry FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own pantry"
  ON public.user_pantry FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own pantry"
  ON public.user_pantry FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users delete own pantry"
  ON public.user_pantry FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER user_pantry_set_updated_at
BEFORE UPDATE ON public.user_pantry
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Canonical id columns on hotdogs for fast pantry matching
ALTER TABLE public.hotdogs
  ADD COLUMN IF NOT EXISTS canonical_ingredient_ids text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS canonical_equipment_ids  text[] NOT NULL DEFAULT '{}';

CREATE INDEX IF NOT EXISTS hotdogs_canon_ing_gin
  ON public.hotdogs USING gin (canonical_ingredient_ids);
CREATE INDEX IF NOT EXISTS hotdogs_canon_eq_gin
  ON public.hotdogs USING gin (canonical_equipment_ids);

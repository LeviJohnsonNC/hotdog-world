
ALTER TABLE public.hotdogs
  ADD COLUMN IF NOT EXISTS recipe_meta jsonb,
  ADD COLUMN IF NOT EXISTS recipe_ingredients jsonb,
  ADD COLUMN IF NOT EXISTS recipe_steps jsonb;

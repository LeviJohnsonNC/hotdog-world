
ALTER TABLE public.hotdogs
  ADD COLUMN IF NOT EXISTS flavor_profile jsonb,
  ADD COLUMN IF NOT EXISTS anatomy jsonb,
  ADD COLUMN IF NOT EXISTS why_it_works text,
  ADD COLUMN IF NOT EXISTS origin_timeline jsonb,
  ADD COLUMN IF NOT EXISTS pull_quote text,
  ADD COLUMN IF NOT EXISTS hero_subtitle text,
  ADD COLUMN IF NOT EXISTS accent_palette jsonb,
  ADD COLUMN IF NOT EXISTS related_slugs text[];

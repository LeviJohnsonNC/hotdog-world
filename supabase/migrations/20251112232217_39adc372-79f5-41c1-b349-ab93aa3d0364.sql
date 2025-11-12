-- Add slug column to hotdogs table
ALTER TABLE public.hotdogs 
ADD COLUMN slug TEXT;

-- Generate slugs from existing hotdog names
UPDATE public.hotdogs
SET slug = LOWER(
  REGEXP_REPLACE(
    REGEXP_REPLACE(
      REGEXP_REPLACE(name, '[^\w\s-]', '', 'g'),
      '\s+', '-', 'g'
    ),
    '-+', '-', 'g'
  )
);

-- Make slug unique and not null
ALTER TABLE public.hotdogs
ADD CONSTRAINT hotdogs_slug_unique UNIQUE (slug);

ALTER TABLE public.hotdogs
ALTER COLUMN slug SET NOT NULL;

-- Create index for faster slug lookups
CREATE INDEX idx_hotdogs_slug ON public.hotdogs(slug);
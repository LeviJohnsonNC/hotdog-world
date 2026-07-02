
UPDATE public.hotdogs
SET
  origin_story  = replace(replace(origin_story,  ' — ', ', '), '—', ','),
  hero_subtitle = replace(replace(hero_subtitle, ' — ', ', '), '—', ','),
  pull_quote    = replace(replace(pull_quote,    ' — ', ', '), '—', ','),
  description   = replace(replace(description,   ' — ', ', '), '—', ','),
  why_it_works  = replace(replace(why_it_works,  ' — ', ', '), '—', ',')
WHERE
  origin_story  LIKE '%—%'
  OR hero_subtitle LIKE '%—%'
  OR pull_quote    LIKE '%—%'
  OR description   LIKE '%—%'
  OR why_it_works  LIKE '%—%';


UPDATE public.hotdogs
SET origin_story = replace(replace(origin_story, ' — ', ', '), '—', ',')
WHERE slug = 'seattle-dog';

UPDATE public.hotdogs
SET origin_timeline = '[
  {"era":"Late 1980s","title":"An accidental swap","body":"A bagel cart near Pioneer Square kept a tub of cream cheese next to the sauerkraut. One busy night, the vendor grabbed the wrong tub and smeared it on a hot dog bun. The drunk kids in line loved it."},
  {"era":"Early 1990s","title":"Grunge, rain, and late nights","body":"Street carts outside Capitol Hill and Pike-Pine clubs figured out the formula: sell warmth. The Seattle dog spread bar to bar as the after-show fuel of a city that stayed out too late."},
  {"era":"2000s","title":"A city in edible form","body":"Cream cheese melted into a toasted bun, onions caramelized slow and sweet, mustard cut the richness. Messy, comforting, a little absurd, weird and independent, just like the city."},
  {"era":"Today","title":"Still on the corner","body":"You can still find them at 2 a.m., steam rising in the drizzle. No restaurant, no brand, just a cart, a griddle, and a wild idea that turned out to be right."}
]'::jsonb
WHERE slug = 'seattle-dog';

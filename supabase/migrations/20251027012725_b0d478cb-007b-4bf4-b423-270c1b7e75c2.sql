-- Update New York-Style Hot Dog
UPDATE hotdogs
SET 
  description = 'The quintessential street food of the Big Apple — a steamed, natural-casing all-beef hot dog served in a soft bun with spicy brown mustard and warm sauerkraut. Simple, iconic, and unapologetically New York.',
  ingredients = ARRAY[
    'Natural-casing all-beef dog (Sabrett is iconic)',
    'Plain white steamed bun',
    'Yellow or spicy brown mustard',
    'Warm sauerkraut',
    'Optional: NY-style red onion sauce (sweet & tangy)'
  ],
  instructions = ARRAY[
    'Heat water to just below a boil — dogs simmer in steamy water, not aggressively boil (5–7 min).',
    'Warm buns over the steam — soft, never toasted.',
    'Warm kraut and onion sauce separately.',
    'Assemble in NYC order: mustard first → kraut/onion sauce.',
    'Wrap in parchment/foil to recreate that street-cart vibe.',
    'Pro tip: Add a touch of vinegar or broth to simmering water = cart-style "dirty water."'
  ],
  fun_facts = ARRAY[
    'Vendor permits near Central Park can cost over $250,000/year.',
    'New Yorkers see ketchup on a dog as a red-card offense.',
    'Blue & yellow umbrellas? Sabrett brand dominance.',
    'Vendors often pass stands down through families for generations.',
    'Street dogs fueled late-night workers long before fast food existed.'
  ],
  origin_story = 'German immigrants introduced frankfurters to Manhattan in the 19th century. Nathan Handwerker made them a national icon in 1916 at Coney Island by selling them cheap. As the city industrialized, the hot dog cart became a symbol of mobility and hustle — a meal made to be eaten one-handed while chasing a job, a train, or a dream.'
WHERE name = 'New York-Style Hot Dog';

-- Update Seattle Dog
UPDATE hotdogs
SET 
  description = 'Born from Seattle''s grunge-era nightlife, this Pacific Northwest creation combines a grilled Polish sausage with cream cheese, caramelized onions, and a kick of jalapeños. It''s weird, it''s wonderful, and it only makes sense after midnight.',
  ingredients = ARRAY[
    'Beef or Polish sausage, split and grilled',
    'Slightly crusty bakery bun (often French-style)',
    'Cream cheese spread',
    'Grilled sweet onions',
    'Jalapeños or Sriracha drizzle'
  ],
  instructions = ARRAY[
    'Split sausages lengthwise and grill to a crisp edge.',
    'Toast buns lightly on cut side.',
    'Microwave cream cheese 10 sec and spread inside bun.',
    'Add sausage + heap of onions + heat (jalapeños or Sriracha).',
    'Wrap bottom half in foil to keep it together — true street physics.',
    'Pro tip: Everything bagel buns = Seattle soul.'
  ],
  fun_facts = ARRAY[
    'Was created to feed post-club grunge crowds in the ''90s.',
    'Cream cheese originally dispensed with caulking guns.',
    'Best eaten after midnight; shops don''t push it for lunch.',
    'Hard to find outside the Pacific Northwest — regional secret.',
    'Bagel shops helped normalize cream cheese on hot dogs.'
  ],
  origin_story = 'As Seattle''s indie music scene exploded, vendors around Capitol Hill invented a dog bold enough to match the city''s weird energy. It''s punk street food — rich, hot, messy — born from nightlife, not nostalgia. The Seattle Dog is a testament to improvisation becoming tradition.'
WHERE name = 'Seattle Dog';

-- Update Rhode Island "New York System" Wiener
UPDATE hotdogs
SET 
  description = 'A Providence institution with Greek roots, this petite hot dog is draped in a cumin-spiced meat sauce, mustard, onions, and celery salt. Assembled with lightning speed and forearm finesse, it''s Rhode Island''s caffeinated answer to late-night hunger.',
  ingredients = ARRAY[
    'Small veal-pork-beef natural-casing wiener (Olneyville style)',
    'Soft steamed bun',
    'Yellow mustard',
    'Greek-spiced beef sauce: cumin-forward, thin',
    'Finely chopped onions',
    'Celery salt to finish'
  ],
  instructions = ARRAY[
    'Steam wieners and buns (or colander over pot).',
    'Cook beef sauce very fine and loose, never chili-thick.',
    'Order matters: mustard → meat sauce → onions → celery salt.',
    'Serve at least two per person. Rhode Island law* (*culturally).',
    'Pro tip: Keep the plate warm — these cool fast.'
  ],
  fun_facts = ARRAY[
    'Buns are often dressed lined up on a forearm.',
    'Coffee milk is the traditional pairing.',
    '"New York System" = early marketing swagger, not NYC origin.',
    'Mustard placement is judged like an exam.',
    'Many shops are still Greek family-owned.'
  ],
  origin_story = 'Greek immigrants in the 1920s crafted a meat sauce blending Balkan spices with American diner culture. Built for factory workers and night owls, the "System" means speed, precision, and showmanship. It''s Providence pride wrapped in a small bun.'
WHERE name LIKE '%Rhode Island%' OR name LIKE '%New York System%';

-- Update Atlanta Slaw Dog
UPDATE hotdogs
SET 
  description = 'A Southern classic that brings BBQ sensibility to the hot dog stand. Topped with creamy, slightly sweet coleslaw, this Atlanta favorite offers a refreshing crunch and a taste of Georgia hospitality in every bite.',
  ingredients = ARRAY[
    'Pork or all-beef hot dog',
    'Soft steamed bun',
    'Yellow mustard',
    'Sweet creamy coleslaw',
    'Optional chili'
  ],
  instructions = ARRAY[
    'Gently grill or simmer the dog.',
    'Warm bun till soft.',
    'Make slaw: mayo, a touch of sugar, salt — minimal vinegar.',
    'Build: mustard base → overloaded slaw top.',
    'Eat immediately for hot-cold contrast.',
    'Pro tip: Coleslaw should be chilled right before serving.'
  ],
  fun_facts = ARRAY[
    'In the South, slaw is a condiment, not a side.',
    'Sweet profiles match Coca-Cola culture.',
    'Local pride in slaw styles goes county-by-county.',
    'Southern diners have been doing this since the 40s-50s.',
    'BBQ influence: slaw tames heat and smoke.'
  ],
  origin_story = 'When highway diners and mill-town lunch counters dominated Georgia, cooks started topping dogs with the same slaw used in barbecue plates — crunchy, cooling, comforting. The Atlanta Slaw Dog became everyday home cooking in a bun, a soft-spoken classic that defines Southern hospitality.'
WHERE name LIKE '%Atlanta%' AND name LIKE '%Slaw%';

-- Insert or Update Coney Island-Style Chili Dog (Detroit Coney Dog)
INSERT INTO hotdogs (id, name, city, country, latitude, longitude, description, ingredients, instructions, fun_facts, origin_story)
VALUES (
  'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  'Detroit Coney Dog',
  'Detroit',
  'USA',
  42.3314,
  -83.0458,
  'Detroit''s take on the Coney Island classic features a natural-casing beef hot dog smothered in beanless chili, yellow mustard, and raw onions. It''s a Midwest icon with Balkan soul, sparking legendary rivalries between Lafayette and American Coney Island.',
  ARRAY[
    'All-beef dog',
    'Steamed bun',
    'Thin chili (beanless, onion-based)',
    'Yellow mustard',
    'Raw onions'
  ],
  ARRAY[
    'Simmer dog or griddle until it gets a slight crisp snap.',
    'Steam buns soft, never toasted.',
    'Warm chili until pourable, not thick.',
    'Assemble: chili → mustard → onions.',
    'Serve fast — napkin required.',
    'Pro tip: True coney chili uses very finely ground beef.'
  ],
  ARRAY[
    'Detroit perfected it — yes, confusingly.',
    '"Coney" became a catch-all term in the Midwest.',
    'Rivalries exist within families over chili texture.',
    'Carnivals + hot dogs = marketing gold.',
    'Bean chili is considered heresy in many coney houses.'
  ],
  'Inspired by success at NYC''s Coney Island, Greek and Macedonian immigrants carried the idea west, adapting it with their own spice traditions. It swept through factory towns where people needed cheap, savory fuel — evolving into a Middle-America staple with endless local identity battles.'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  city = EXCLUDED.city,
  country = EXCLUDED.country,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  description = EXCLUDED.description,
  ingredients = EXCLUDED.ingredients,
  instructions = EXCLUDED.instructions,
  fun_facts = EXCLUDED.fun_facts,
  origin_story = EXCLUDED.origin_story;
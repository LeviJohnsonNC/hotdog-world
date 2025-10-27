-- Update New York-Style Hot Dog (Dirty Water Dog)
UPDATE hotdogs
SET 
  name = 'New York-Style Hot Dog',
  description = 'The iconic New York street dog features an all-beef natural-casing hot dog in a steamed white bun, topped with spicy brown mustard and warm sauerkraut. Optional NYC red onion sauce adds authentic flavor. Born from German immigrant frankfurters in the 1860s, it became the ultimate democratic street food.',
  ingredients = ARRAY[
    'All-beef natural-casing hot dog (Sabrett or Hebrew National)',
    'Plain white steamed bun',
    'Spicy brown or yellow mustard',
    'Warm sauerkraut',
    'NYC red onion sauce (onions with tomato paste, vinegar, spices) - optional'
  ],
  instructions = ARRAY[
    'Heat water to just below a boil — simmer dogs 5–7 minutes (never bubble)',
    'Warm buns over steam pot — do not toast',
    'Heat sauerkraut and/or onion sauce separately',
    'Assemble: mustard first, then kraut/onion sauce',
    'Wrap in parchment or foil for authentic street-cart feel',
    'Pro tip: Add splash of vinegar to kraut to mimic "dirty water" flavor'
  ],
  fun_facts = ARRAY[
    'Hot dog cart permits near Central Park can exceed $250k/year',
    'Asking for ketchup will get you instant vendor judgment',
    'Classic umbrella is blue/yellow Sabrett branding',
    'Called "dirty water dogs" because simmering water becomes savory broth',
    'Street dogs powered working-class NYC through industrial boom eras'
  ],
  origin_story = 'German immigrants brought frankfurters to Manhattan in the 1860s, pairing them with cheap bread to feed laborers. Nathan''s celebrity rise at Coney Island in 1916 established hot dogs as a democratic street food for the masses. As New York exploded upward and outward, the hot dog cart became a symbol of hustle, independence, and the survival grind that defines the city.'
WHERE id = '76779b9e-dbb5-49f0-9e4a-0f4e98378300';

-- Update Rhode Island "New York System" Wiener
UPDATE hotdogs
SET 
  name = 'Rhode Island "New York System" Wiener',
  city = 'Providence',
  description = 'A Rhode Island classic featuring a veal-pork-beef natural-casing wiener in a steamed bun, topped with Greek-spiced beef sauce, mustard, onions, and celery salt. Created by Greek immigrants in the early 1900s, the "system" refers to the speed and choreography of assembly.',
  ingredients = ARRAY[
    'Veal-pork-beef natural-casing wiener (Olneyville brand)',
    'Steamed white bun',
    'Yellow mustard',
    'Rhode Island Greek-spiced beef sauce (thin, not chili)',
    'Finely chopped onions',
    'Celery salt finish'
  ],
  instructions = ARRAY[
    'Warm wieners and buns in steamer or covered colander',
    'Cook beef sauce: super-fine ground beef, cumin, paprika, cayenne, tiny cinnamon, onion powder; simmer thin',
    'Assemble in order: mustard → meat sauce → onions → celery salt',
    'Serve 2–4 per person — locals never order just one',
    'Pro tip: Preheat plates so bun stays steamy to last bite'
  ],
  fun_facts = ARRAY[
    'Cooks line 10+ buns on their arm for assembly',
    'Served with coffee milk, Rhode Island''s state drink',
    '"New York" in the name is pure marketing shade',
    'Exact topping order is a cultural commandment',
    'Greek-American families have guarded recipes for generations'
  ],
  origin_story = 'In the early 1900s, Greek immigrants running diners invented the meat sauce to differentiate from German sausages. It became the blue-collar fuel of factory workers and the late-night crowd. The "system" refers to the speed, choreography, and bravado with which these dogs are built — Rhode Island pride made edible.'
WHERE id = '2633827c-45aa-4b29-a578-73314a266ec4';

-- Update Seattle Dog
UPDATE hotdogs
SET 
  name = 'Seattle Dog',
  description = 'Born outside nightclubs in the 1990s grunge era, the Seattle Dog features a split grilled Polish sausage in a toasted bun with cream cheese, grilled sweet onions, and jalapeños or Sriracha. A quirky mash-up that defines Seattle''s alternative identity.',
  ingredients = ARRAY[
    'Split grilled beef or Polish sausage',
    'Toasted bakery-style hot dog bun',
    'Cream cheese spread',
    'Grilled sweet onions',
    'Jalapeños or Sriracha drizzle'
  ],
  instructions = ARRAY[
    'Split sausages lengthwise and grill to crisp caramelized edges',
    'Lightly toast bun on grill or griddle',
    'Microwave cream cheese 10–15 seconds and spread thick inside bun',
    'Add grilled onions and heat (jalapeños or Sriracha)',
    'Wrap bottom half in foil — Seattle street style',
    'Pro tip: Use everything bagel buns for PNW energy'
  ],
  fun_facts = ARRAY[
    'Born outside nightclubs in the 1990s grunge era',
    'Cream cheese was first served from construction caulk guns',
    'Widely tied to Pike/Pine and outdoor music venues',
    'Seattle claims the bagel sandwich → hot dog mash-up crown',
    'Remains a mostly after-dark phenomenon'
  ],
  origin_story = 'As Seattle''s music culture exploded, vendors needed a dog that matched its quirky personality and cold nights. Bagel-shop excess cream cheese + Polish sausages + club crowds = instant cult classic. It''s not old — it''s a time capsule of Seattle''s alternative identity.'
WHERE id = '8440ecd2-ce81-4cfe-8e25-cafd6c0f444d';

-- Update Atlanta Southern Slaw Dog
UPDATE hotdogs
SET 
  name = 'Atlanta Slaw Dog',
  description = 'A Southern comfort classic featuring a hot dog topped with sweet, creamy Southern slaw. Rooted in the South''s tradition of pairing smoked meats with slaw, this Atlanta creation is edible hospitality — warm, cool, crunchy, and creamy all at once.',
  ingredients = ARRAY[
    'Beef or pork hot dog',
    'Soft steamed bun',
    'Yellow mustard',
    'Sweet, creamy Southern slaw (with sugar)',
    'Optional: chili for a chili slaw dog'
  ],
  instructions = ARRAY[
    'Boil or lightly grill the hot dog',
    'Warm buns until soft (microwave in damp towel)',
    'Mix slaw: cabbage + mayo + sugar (no vinegar overload), chill briefly',
    'Spread mustard on bun, add dog, mound slaw overflowing',
    'Eat immediately — contrast comes from warm/cold',
    'Pro tip: Let slaw rest 10–15 minutes for perfect texture'
  ],
  fun_facts = ARRAY[
    'In the South, slaw is a topping, not a side',
    'The sweetness is not optional — local palate law',
    'Huge at baseball parks and roadside stands',
    'Slaw keeps the heat in check during Southern summers',
    'Often served with Coca-Cola, Atlanta''s hometown drink'
  ],
  origin_story = 'Rooted in the South''s longstanding pairing of smoked meats with slaw, diners began topping hot dogs this way in the 1940s–50s. It''s a comfort-on-comfort creation — crunchy and creamy, warm and cool — reflecting the lighter, sweeter BBQ influences of Georgia. The slaw dog is Atlanta''s edible hospitality: friendly, familiar, and a little messy.'
WHERE id = '88ae4dc7-89c7-4c6b-9381-4010f973e350';

-- Insert Detroit Coney Dog (new entry)
INSERT INTO hotdogs (
  id,
  name,
  city,
  country,
  description,
  latitude,
  longitude,
  ingredients,
  instructions,
  fun_facts,
  origin_story
) VALUES (
  gen_random_uuid(),
  'Detroit Coney Dog',
  'Detroit',
  'USA',
  'A Detroit institution featuring a natural-casing beef dog topped with Detroit Coney Sauce (Balkan-influenced beef sauce), yellow mustard, and raw chopped onions. Created by Greek and Macedonian immigrants, it became the edible emblem of the Motor City.',
  42.3314,
  -83.0458,
  ARRAY[
    'Natural-casing beef dog (Dearborn or Koegel preferred)',
    'Steamed bun',
    'Detroit Coney Sauce (Balkan-influenced beef sauce)',
    'Yellow mustard',
    'Raw chopped onions'
  ],
  ARRAY[
    'Pan-grill dog until it gets a snappy brown crust',
    'Steam bun for 10–20 seconds for softness',
    'Make sauce: finely grind cooked beef with onion; season with paprika, garlic, mustard powder; thin with broth — loose, not chunky',
    'Build: mustard first → sauce → onions',
    'Serve in pairs — default order is two',
    'Pro tip: Process cooked meat briefly for smooth spoonable texture'
  ],
  ARRAY[
    'The Lafayette vs. American rivalry is legendary and lifelong',
    'Order wrong toppings and you''ll out yourself as a tourist',
    'A true Detroiter has a favorite sauce and will defend it loudly',
    'Served faster than fast food — diner ballet',
    'A staple since the Model T era'
  ],
  'Greek and Macedonian immigrants adapted American hot dogs using familiar spice profiles from home. Detroit''s booming auto industry fueled demand for fast, hearty street meals. The Coney Dog became the edible emblem of the Motor City — immigrant ambition meeting industrial America.'
);
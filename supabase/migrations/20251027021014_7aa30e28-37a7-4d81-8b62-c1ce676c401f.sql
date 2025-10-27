-- Fix all remaining hot dogs (#6-28) with correct array syntax

-- #6 Sonoran Hot Dog (Tucson)
UPDATE public.hotdogs 
SET 
  name = 'Sonoran Hot Dog',
  city = 'Tucson',
  country = 'United States',
  description = $$A bacon-wrapped hot dog topped with pinto beans, onions, tomatoes, jalapeños, mustard, and mayo, served in a soft bolillo roll. This Arizona-Mexico border specialty brings bold flavors and textures together.$$,
  ingredients = ARRAY['Hot dog', 'Bacon strips', 'Bolillo roll', 'Pinto beans', 'Chopped onions', 'Diced tomatoes', 'Jalapeño peppers', 'Mustard', 'Mayonnaise']::TEXT[],
  instructions = ARRAY['Wrap hot dog tightly with bacon', 'Grill until bacon is crispy', 'Place in toasted bolillo roll', 'Add warm pinto beans', 'Top with onions, tomatoes, and jalapeños', 'Drizzle with mustard and mayo']::TEXT[],
  fun_facts = ARRAY['Born from Sonoran street vendors in the 1980s', 'Bacon-wrapped dogs are now iconic in Tucson', 'Often sold from carts late at night', 'Bolillo bread is essential for authenticity']::TEXT[],
  origin_story = $$The Sonoran hot dog originated with street vendors in Hermosillo, Mexico, and crossed the border to Tucson in the 1980s. Mexican immigrants brought their bacon-wrapped tradition, and it quickly became a beloved late-night street food staple in southern Arizona.$$
WHERE city = 'Tucson';

-- #7 Texas Hot Dog (Austin)
UPDATE public.hotdogs 
SET 
  name = 'Texas Hot Dog',
  city = 'Austin',
  country = 'United States',
  description = $$A jumbo all-beef hot dog topped with chili con carne, shredded cheddar cheese, diced onions, and jalapeños. Big, bold, and spicy—everything''s bigger in Texas!$$,
  ingredients = ARRAY['All-beef hot dog', 'Hoagie bun', 'Chili con carne', 'Shredded cheddar cheese', 'Diced onions', 'Pickled jalapeños', 'Yellow mustard']::TEXT[],
  instructions = ARRAY['Grill jumbo all-beef hot dog', 'Toast hoagie bun', 'Place hot dog in bun', 'Smother with chili con carne', 'Add generous amount of shredded cheddar', 'Top with onions and jalapeños', 'Finish with yellow mustard']::TEXT[],
  fun_facts = ARRAY['Austin''s food truck culture embraced loaded hot dogs', 'Often served at BBQ joints and dive bars', 'The bigger the better—Texas style!', 'Chili con carne is a Texas staple']::TEXT[],
  origin_story = $$Texas hot dogs evolved from the state''s love of hearty, no-holds-barred comfort food. Austin''s vibrant food truck scene in the 2000s popularized oversized, chili-smothered dogs that matched the state''s "go big or go home" mentality.$$
WHERE city = 'Austin';

-- #8 Carolina Slaw Dog (Charlotte)
UPDATE public.hotdogs 
SET 
  name = 'Carolina Slaw Dog',
  city = 'Charlotte',
  country = 'United States',
  description = $$A grilled hot dog topped with tangy coleslaw, chili, mustard, and onions. The creamy slaw balances the savory chili for a perfect Southern bite.$$,
  ingredients = ARRAY['Hot dog', 'Steamed bun', 'Creamy coleslaw', 'Beef chili', 'Yellow mustard', 'Chopped onions']::TEXT[],
  instructions = ARRAY['Grill hot dog until charred', 'Steam bun until soft', 'Place hot dog in bun', 'Add layer of beef chili', 'Top with generous coleslaw', 'Drizzle with yellow mustard', 'Finish with chopped onions']::TEXT[],
  fun_facts = ARRAY['Coleslaw on hot dogs is a Carolinas tradition', 'Dates back to early 20th century', 'Every diner has their own slaw recipe', 'The debate: creamy vs vinegar-based slaw']::TEXT[],
  origin_story = $$The Carolina Slaw Dog emerged from working-class lunch counters across North and South Carolina in the early 1900s. German immigrants brought hot dogs, while Southern cooks added their beloved coleslaw, creating a regional classic that''s been debated and perfected for over a century.$$
WHERE city = 'Charlotte';

-- #9 Mexican Sonoran Dog (Hermosillo)
UPDATE public.hotdogs 
SET 
  name = 'Mexican Sonoran Dog',
  city = 'Hermosillo',
  country = 'Mexico',
  description = $$The original bacon-wrapped hot dog from Sonora, Mexico. Topped with beans, grilled onions, tomatoes, cream sauce, and salsa verde in a soft bolillo roll.$$,
  ingredients = ARRAY['Hot dog', 'Bacon', 'Bolillo roll', 'Pinto beans', 'Grilled onions', 'Chopped tomatoes', 'Mexican crema', 'Salsa verde', 'Lime wedge']::TEXT[],
  instructions = ARRAY['Wrap hot dog with bacon', 'Grill until bacon is golden and crispy', 'Toast bolillo roll', 'Spread warm pinto beans inside', 'Place hot dog in roll', 'Top with grilled onions and tomatoes', 'Drizzle with crema and salsa verde', 'Serve with lime wedge']::TEXT[],
  fun_facts = ARRAY['Invented in Hermosillo in the 1980s', 'Street vendors created the bacon-wrapped style', 'Inspired the Tucson Sonoran dog', 'A late-night favorite after concerts and clubs']::TEXT[],
  origin_story = $$In the 1980s, inventive street vendors in Hermosillo began wrapping hot dogs in bacon to make them more appealing and flavorful. The combination with bolillo bread, beans, and fresh toppings became an instant hit, spreading across Sonora and eventually crossing into Arizona.$$
WHERE city = 'Hermosillo';

-- #10 Completo (Santiago)
UPDATE public.hotdogs 
SET 
  name = 'Completo',
  city = 'Santiago',
  country = 'Chile',
  description = $$Chile''s iconic hot dog loaded with mashed avocado, tomatoes, sauerkraut, mayonnaise, and sometimes even french fries. A complete meal in a bun!$$,
  ingredients = ARRAY['Hot dog (vienesa)', 'Pan de completo (special bun)', 'Mashed avocado', 'Diced tomatoes', 'Sauerkraut', 'Chilean mayonnaise', 'French fries (optional)']::TEXT[],
  instructions = ARRAY['Grill or boil the hot dog', 'Warm the completo bun', 'Spread generous layer of mashed avocado', 'Place hot dog on top', 'Add diced tomatoes', 'Top with sauerkraut', 'Smother with Chilean mayo', 'Optional: add french fries on top']::TEXT[],
  fun_facts = ARRAY['Completo means "complete" in Spanish', 'Chileans consume over 200 million hot dogs annually', 'Italian completo adds green beans and hot sauce', 'Often eaten as a full meal, not just a snack']::TEXT[],
  origin_story = $$The Completo emerged in Santiago in the mid-20th century, influenced by European immigrants who brought sausages and sauerkraut traditions. Chilean vendors added local touches like mashed avocado, creating a uniquely Chilean fusion that became a national obsession.$$
WHERE city = 'Santiago';

-- #11 Lima Street Dog (Lima)
UPDATE public.hotdogs 
SET 
  name = 'Lima Street Dog',
  city = 'Lima',
  country = 'Peru',
  description = $$A Peruvian street hot dog topped with mayo, ketchup, mustard, and a unique touch: crispy potato sticks. Simple, satisfying, and distinctly Lima.$$,
  ingredients = ARRAY['Hot dog', 'Pan (bread roll)', 'Mayonnaise', 'Ketchup', 'Yellow mustard', 'Crispy potato sticks', 'Diced onions']::TEXT[],
  instructions = ARRAY['Grill hot dog until slightly charred', 'Slice bread roll lengthwise', 'Place hot dog in roll', 'Drizzle with mayo, ketchup, and mustard', 'Top with diced onions', 'Add generous handful of crispy potato sticks']::TEXT[],
  fun_facts = ARRAY['Potato sticks (papas al hilo) are essential', 'Popular at soccer games and festivals', 'Street vendors call them "salchipapas"', 'Often sold from carts in Miraflores district']::TEXT[],
  origin_story = $$Lima''s street hot dogs gained popularity in the 1970s as fast food culture arrived in Peru. Vendors added crispy potato sticks—a local favorite—transforming a simple hot dog into something uniquely Peruvian. Today, they''re a beloved street food staple.$$
WHERE city = 'Lima';

-- #12 Rød Pølser (Copenhagen)
UPDATE public.hotdogs 
SET 
  name = 'Rød Pølser',
  city = 'Copenhagen',
  country = 'Denmark',
  description = $$Denmark''s famous bright red hot dog served in a bun with remoulade, crispy fried onions, pickles, ketchup, and mustard. A colorful and flavorful Scandinavian classic.$$,
  ingredients = ARRAY['Rød pølse (red sausage)', 'White bread bun', 'Remoulade sauce', 'Crispy fried onions', 'Pickled cucumber slices', 'Ketchup', 'Sweet mustard']::TEXT[],
  instructions = ARRAY['Boil or grill the rød pølse', 'Slice bun lengthwise (leave hinge intact)', 'Place hot dog in bun', 'Add generous remoulade', 'Top with crispy fried onions', 'Add pickle slices', 'Drizzle with ketchup and sweet mustard']::TEXT[],
  fun_facts = ARRAY['Rød means "red" in Danish', 'Color comes from red dye added to the sausage', 'Sold from iconic pølsevogne (hot dog carts) since 1920s', 'Remoulade is the signature Danish condiment']::TEXT[],
  origin_story = $$The rød pølser tradition began in Copenhagen in the early 1900s, inspired by German frankfurters. Danish vendors added their own twist: bright red coloring and remoulade sauce. The iconic pølsevogne carts became a fixture of Copenhagen street life.$$
WHERE city = 'Copenhagen';

-- #13 Currywurst (Berlin)
UPDATE public.hotdogs 
SET 
  name = 'Currywurst',
  city = 'Berlin',
  country = 'Germany',
  description = $$Germany''s most beloved street food: a sliced bratwurst smothered in curry-spiced ketchup and dusted with curry powder. Often served with fries or bread.$$,
  ingredients = ARRAY['Bratwurst', 'Curry ketchup', 'Curry powder', 'Bread roll or fries', 'Optional: paprika']::TEXT[],
  instructions = ARRAY['Grill or pan-fry bratwurst until golden', 'Slice into bite-sized pieces', 'Arrange on plate or in container', 'Smother with warm curry ketchup', 'Dust generously with curry powder', 'Serve with bread roll or fries on side']::TEXT[],
  fun_facts = ARRAY['Invented in Berlin in 1949 by Herta Heuwer', 'Over 800 million currywursts consumed annually in Germany', 'Berlin has a Currywurst Museum', 'Every region has its own curry ketchup recipe']::TEXT[],
  origin_story = $$In 1949, Herta Heuwer mixed ketchup with curry powder and other spices at her Berlin street stand, creating currywurst. It became an instant sensation among reconstruction workers and quickly spread across Germany, becoming the nation''s most iconic street food.$$
WHERE city = 'Berlin';

-- #14 Pylsa (Reykjavík)
UPDATE public.hotdogs 
SET 
  name = 'Pylsa',
  city = 'Reykjavík',
  country = 'Iceland',
  description = $$Iceland''s famous hot dog made with lamb, topped with raw and crispy fried onions, ketchup, sweet mustard, and remoulade. A must-try when visiting Reykjavík!$$,
  ingredients = ARRAY['Lamb hot dog', 'Steamed bun', 'Raw onions', 'Crispy fried onions', 'Ketchup', 'Sweet brown mustard (pylsusinnep)', 'Remoulade']::TEXT[],
  instructions = ARRAY['Boil lamb hot dog', 'Steam bun until soft', 'Place hot dog in bun', 'Add raw chopped onions', 'Top with crispy fried onions', 'Apply ketchup in zigzag pattern', 'Add sweet mustard', 'Finish with remoulade']::TEXT[],
  fun_facts = ARRAY['Made from Icelandic lamb (sometimes mixed with pork and beef)', 'Bæjarins Beztu stand has served since 1937', 'Even Bill Clinton ordered "eina með öllu" (one with everything)', 'Icelanders eat more hot dogs per capita than Americans']::TEXT[],
  origin_story = $$The Icelandic pylsa has been a Reykjavík staple since the 1930s. Using locally sourced lamb made these hot dogs uniquely Icelandic. The famous Bæjarins Beztu Pylsur stand, operating since 1937, turned the humble hot dog into a national icon and tourist attraction.$$
WHERE city = 'Reykjavík';

-- #15 Tunnbrödsrulle (Stockholm)
UPDATE public.hotdogs 
SET 
  name = 'Tunnbrödsrulle',
  city = 'Stockholm',
  country = 'Sweden',
  description = $$A Swedish hot dog wrapped in soft flatbread (tunnbröd) with mashed potatoes, crispy fried onions, shrimp salad, pickles, ketchup, and mustard. Uniquely Scandinavian!$$,
  ingredients = ARRAY['Hot dog', 'Tunnbröd (soft flatbread)', 'Instant mashed potatoes', 'Räksallad (shrimp salad)', 'Crispy fried onions', 'Pickled cucumber', 'Ketchup', 'Sweet mustard']::TEXT[],
  instructions = ARRAY['Warm tunnbröd flatbread', 'Spread thin layer of mashed potatoes', 'Place hot dog on one side', 'Add shrimp salad', 'Top with crispy fried onions', 'Add pickled cucumber slices', 'Drizzle with ketchup and mustard', 'Roll up tightly and wrap in paper']::TEXT[],
  fun_facts = ARRAY['Tunnbröd is traditional Swedish flatbread', 'Mashed potatoes in a hot dog is uniquely Swedish', 'Popular at Stockholm street vendors since 1990s', 'Often eaten after a night out']::TEXT[],
  origin_story = $$The tunnbrödsrulle emerged in northern Sweden and became a Stockholm street food sensation in the 1990s. The unusual combination of mashed potatoes and shrimp salad reflects Swedish culinary creativity and their love of convenient, filling street food.$$
WHERE city = 'Stockholm';

-- #16 Pølse med Lompe (Oslo)
UPDATE public.hotdogs 
SET 
  name = 'Pølse med Lompe',
  city = 'Oslo',
  country = 'Norway',
  description = $$A Norwegian hot dog wrapped in lompe (potato flatbread) instead of a regular bun, topped with ketchup, mustard, and crispy fried onions. Comforting and distinctly Norwegian.$$,
  ingredients = ARRAY['Grilled hot dog', 'Lompe (potato flatbread)', 'Ketchup', 'Sweet mustard', 'Crispy fried onions', 'Optional: pickled cucumber']::TEXT[],
  instructions = ARRAY['Grill hot dog until slightly charred', 'Warm lompe flatbread', 'Place hot dog in center of lompe', 'Add ketchup and sweet mustard', 'Top with crispy fried onions', 'Optional: add pickle slices', 'Fold lompe around hot dog and serve']::TEXT[],
  fun_facts = ARRAY['Lompe is made from potato, making it gluten-free', 'Sold at every 7-Eleven and Narvesen kiosk', 'Norwegians often eat this while hiking', 'National debate: lompe vs regular bun']::TEXT[],
  origin_story = $$Pølse med lompe has been a Norwegian staple since the mid-20th century. Lompe, a traditional potato flatbread, was already common in Norwegian homes, so wrapping hot dogs in it was a natural evolution. Today it''s sold everywhere from gas stations to mountain cabins.$$
WHERE city = 'Oslo';

-- #17 Grilli Makkara (Helsinki)
UPDATE public.hotdogs 
SET 
  name = 'Grilli Makkara',
  city = 'Helsinki',
  country = 'Finland',
  description = $$A Finnish grilled sausage served with ketchup, mustard, and sometimes pickled cucumber. Simple, satisfying, and a late-night favorite from Helsinki''s grilli kiosks.$$,
  ingredients = ARRAY['Grillimakkara (thick sausage)', 'White bread bun', 'Ketchup', 'Finnish mustard (sinappi)', 'Pickled cucumber slices', 'Optional: crispy fried onions']::TEXT[],
  instructions = ARRAY['Grill makkara until well-charred', 'Slice bun lengthwise', 'Place sausage in bun', 'Add generous ketchup', 'Add Finnish mustard', 'Top with pickled cucumber', 'Optional: add fried onions']::TEXT[],
  fun_facts = ARRAY['Grilli kiosks are everywhere in Helsinki', 'A popular post-sauna snack', 'Often eaten after a night out', 'Finnish mustard is milder than American']::TEXT[],
  origin_story = $$Grilli culture exploded in Finland after World War II as street kiosks selling grilled sausages became social hubs. Helsinki''s iconic grilli stands serve late into the night, providing comfort food to generations of Finns braving the Nordic cold.$$
WHERE city = 'Helsinki';

-- #18 London Gourmet Dog (London)
UPDATE public.hotdogs 
SET 
  name = 'London Gourmet Dog',
  city = 'London',
  country = 'United Kingdom',
  description = $$An upscale British hot dog featuring quality Cumberland sausage, caramelized onions, English mustard, and sometimes a drizzle of ale reduction in an artisan bun.$$,
  ingredients = ARRAY['Cumberland sausage', 'Artisan brioche bun', 'Caramelized onions', 'English mustard', 'Ale reduction', 'Rocket (arugula)', 'Aged cheddar']::TEXT[],
  instructions = ARRAY['Grill Cumberland sausage until golden', 'Toast brioche bun', 'Spread thin layer of English mustard', 'Place sausage in bun', 'Top with caramelized onions', 'Drizzle with ale reduction', 'Add rocket and shaved aged cheddar']::TEXT[],
  fun_facts = ARRAY['Part of London''s gourmet street food movement', 'Often found at Borough Market and food markets', 'Cumberland sausage dates back centuries', 'British ale reduction adds pub-style flavor']::TEXT[],
  origin_story = $$As London''s street food scene evolved in the 2010s, vendors began elevating the humble hot dog with quality British ingredients. Using traditional Cumberland sausages and local craft ales, they created a gourmet version that honors British culinary heritage.$$
WHERE city = 'London';

-- #19 Kielbasa Roll (Warsaw)
UPDATE public.hotdogs 
SET 
  name = 'Kielbasa Roll',
  city = 'Warsaw',
  country = 'Poland',
  description = $$A Polish grilled kielbasa sausage served in a crusty roll with mustard, horseradish, and pickled vegetables. Hearty, flavorful, and authentically Polish.$$,
  ingredients = ARRAY['Kielbasa sausage', 'Crusty bread roll', 'Polish mustard', 'Horseradish sauce', 'Pickled cucumbers', 'Sauerkraut', 'Grilled onions']::TEXT[],
  instructions = ARRAY['Grill kielbasa until skin is crispy', 'Slice roll lengthwise', 'Spread mustard and horseradish inside', 'Place hot kielbasa in roll', 'Top with sauerkraut', 'Add grilled onions', 'Serve with pickled cucumbers on side']::TEXT[],
  fun_facts = ARRAY['Kielbasa means "sausage" in Polish', 'Street vendors sell them near Old Town Square', 'Often paired with Polish beer', 'Horseradish is a traditional Polish condiment']::TEXT[],
  origin_story = $$Kielbasa has been central to Polish cuisine for centuries. As Warsaw modernized, street vendors began serving grilled kielbasa in rolls, creating a quick, affordable meal that retained traditional flavors. Today, it''s a staple of Warsaw''s street food scene.$$
WHERE city = 'Warsaw';

-- #20 Párek v Rohlíku (Prague)
UPDATE public.hotdogs 
SET 
  name = 'Párek v Rohlíku',
  city = 'Prague',
  country = 'Czech Republic',
  description = $$A Czech hot dog (párek) served in a crusty roll (rohlík) with mustard and sometimes ketchup. Simple, classic, and found at every Prague street corner.$$,
  ingredients = ARRAY['Párek (Czech sausage)', 'Rohlík (Czech roll)', 'Czech mustard', 'Ketchup', 'Optional: pickled peppers']::TEXT[],
  instructions = ARRAY['Boil or grill párek', 'Slice rohlík lengthwise', 'Place párek in roll', 'Add generous Czech mustard', 'Optional: add ketchup', 'Optional: add pickled peppers', 'Serve immediately']::TEXT[],
  fun_facts = ARRAY['Found at every tram stop and corner', 'Párek is the Czech word for hot dog', 'Often eaten for breakfast', 'Czech mustard is quite spicy']::TEXT[],
  origin_story = $$Párek v rohlíku has been a Czech staple since the early 20th century, introduced during the Austro-Hungarian Empire. The combination of German sausage-making tradition and Czech rohlík bread created an enduring street food that remains unchanged to this day.$$
WHERE city = 'Prague';

-- #21 Sosiska v Teste (Moscow)
UPDATE public.hotdogs 
SET 
  name = 'Sosiska v Teste',
  city = 'Moscow',
  country = 'Russia',
  description = $$A Russian hot dog wrapped in pastry dough and baked until golden. Often served with ketchup or mustard. A warm, portable snack beloved across Russia.$$,
  ingredients = ARRAY['Sosiska (Russian sausage)', 'Puff pastry dough', 'Ketchup', 'Mustard', 'Optional: cheese filling']::TEXT[],
  instructions = ARRAY['Wrap sosiska in strip of puff pastry', 'Seal edges', 'Optional: add cheese inside', 'Brush with egg wash', 'Bake at 375°F until golden brown', 'Serve warm with ketchup and mustard']::TEXT[],
  fun_facts = ARRAY['Sold at every Russian kiosk and bakery', 'A popular school lunch item', 'Often eaten on trains and buses', 'Cheese version is called "v teste s syrom"']::TEXT[],
  origin_story = $$Sosiska v teste emerged in Soviet Russia as a convenient, filling snack that could be mass-produced and sold from kiosks. The pastry-wrapped sausage became a nostalgic comfort food for generations of Russians and remains popular today.$$
WHERE city = 'Moscow';

-- #22 Tokyo Bakery Dog (Tokyo)
UPDATE public.hotdogs 
SET 
  name = 'Tokyo Bakery Dog',
  city = 'Tokyo',
  country = 'Japan',
  description = $$A Japanese-style hot dog baked into soft, fluffy bread with a sweet glaze. Often found in convenience stores and bakeries throughout Tokyo.$$,
  ingredients = ARRAY['Sausage', 'Soft milk bread dough', 'Kewpie mayonnaise', 'Tonkatsu sauce', 'Aonori (seaweed flakes)', 'Bonito flakes']::TEXT[],
  instructions = ARRAY['Wrap sausage in milk bread dough', 'Let rise until puffy', 'Brush with egg wash', 'Bake until golden', 'Drizzle with Kewpie mayo and tonkatsu sauce', 'Sprinkle with aonori and bonito flakes']::TEXT[],
  fun_facts = ARRAY['Found in every Japanese convenience store', 'Bread is incredibly soft and pillowy', 'Often eaten for breakfast', 'Japanese mayo is sweeter than American']::TEXT[],
  origin_story = $$Tokyo''s bakery hot dogs emerged in the 1960s as Japanese bakeries adapted Western foods with local ingredients. The soft, sweet bread and umami-rich toppings created a uniquely Japanese comfort food that became a convenience store staple.$$
WHERE city = 'Tokyo';

-- #23 Korean Corn Dog (Seoul)
UPDATE public.hotdogs 
SET 
  name = 'Korean Corn Dog',
  city = 'Seoul',
  country = 'South Korea',
  description = $$A hot dog or mozzarella cheese coated in sweet batter, covered in panko breadcrumbs or even ramen noodles, deep-fried, and drizzled with ketchup and mustard. Crispy, stretchy, and Instagram-worthy!$$,
  ingredients = ARRAY['Hot dog or mozzarella stick', 'Sweet batter', 'Panko breadcrumbs or crushed ramen', 'Vegetable oil for frying', 'Sugar', 'Ketchup', 'Yellow mustard']::TEXT[],
  instructions = ARRAY['Skewer hot dog or cheese', 'Dip in sweet batter', 'Roll in panko or crushed ramen noodles', 'Deep fry until golden and crispy', 'Immediately roll in sugar', 'Drizzle with ketchup and mustard in zigzag pattern', 'Serve hot']::TEXT[],
  fun_facts = ARRAY['Went viral on social media in 2010s', 'Myeongdong street is famous for corn dog stalls', 'Half hot dog, half cheese versions are popular', 'Some versions use potato cubes instead of breadcrumbs']::TEXT[],
  origin_story = $$Korean corn dogs evolved from American corn dogs in the 2000s, with Korean street vendors adding creative twists like mozzarella cheese, sweet coatings, and unconventional breading. They became a global social media sensation, drawing food tourists to Seoul''s Myeongdong district.$$
WHERE city = 'Seoul';

-- #24 Bangkok Spicy Street Dog (Bangkok)
UPDATE public.hotdogs 
SET 
  name = 'Bangkok Spicy Street Dog',
  city = 'Bangkok',
  country = 'Thailand',
  description = $$A Thai-style hot dog grilled and topped with spicy sriracha mayo, pickled vegetables, cilantro, and crispy fried garlic. Sweet, sour, spicy, and aromatic!$$,
  ingredients = ARRAY['Hot dog', 'Mini baguette', 'Sriracha mayo', 'Sweet chili sauce', 'Pickled carrot and daikon', 'Fresh cilantro', 'Crispy fried garlic', 'Lime wedge']::TEXT[],
  instructions = ARRAY['Grill hot dog until charred', 'Slice mini baguette lengthwise', 'Spread sriracha mayo inside', 'Place hot dog in baguette', 'Drizzle with sweet chili sauce', 'Top with pickled vegetables', 'Add fresh cilantro', 'Sprinkle crispy fried garlic', 'Serve with lime wedge']::TEXT[],
  fun_facts = ARRAY['Influenced by Thai-French colonial history', 'Khao San Road vendors serve them late-night', 'Balance of Thai flavor profiles: sweet, sour, salty, spicy', 'Often customized with extra chilies']::TEXT[],
  origin_story = $$Bangkok''s street food vendors began adapting hot dogs in the 1990s, infusing them with Thai flavors like sriracha, sweet chili, and pickled vegetables. The French colonial influence shows in the mini baguette, creating a unique Thai-Western fusion.$$
WHERE city = 'Bangkok';

-- #25 Bombay Hot Dog (Mumbai)
UPDATE public.hotdogs 
SET 
  name = 'Bombay Hot Dog',
  city = 'Mumbai',
  country = 'India',
  description = $$An Indian street hot dog served in pav bread, topped with spicy chutney, crispy sev, chopped onions, and cilantro. Bold, spicy, and bursting with flavor!$$,
  ingredients = ARRAY['Vegetarian or chicken sausage', 'Pav (soft bread roll)', 'Green chutney (cilantro-mint)', 'Tamarind chutney', 'Sev (crispy chickpea noodles)', 'Chopped onions', 'Fresh cilantro', 'Chaat masala']::TEXT[],
  instructions = ARRAY['Grill or pan-fry sausage', 'Toast pav with butter', 'Spread green chutney inside pav', 'Place sausage in pav', 'Drizzle tamarind chutney', 'Top with chopped onions', 'Add generous handful of sev', 'Garnish with cilantro', 'Dust with chaat masala']::TEXT[],
  fun_facts = ARRAY['Inspired by Mumbai''s famous vada pav', 'Often vegetarian due to local preferences', 'Sev adds essential crunch', 'Popular at Juhu Beach and street stalls']::TEXT[],
  origin_story = $$Mumbai''s hot dog culture emerged as street vendors adapted Western fast food with Indian flavors in the 1990s. Using local pav bread and classic chaat toppings, they created a spicy, tangy version that appeals to Mumbaikars'' love of bold street food.$$
WHERE city = 'Mumbai';

-- #26 Aussie Dog (Sydney)
UPDATE public.hotdogs 
SET 
  name = 'Aussie Dog',
  city = 'Sydney',
  country = 'Australia',
  description = $$An Australian sausage sizzle-inspired hot dog with grilled onions, tomato sauce (ketchup), mustard, and sometimes beetroot. Simple, classic, and quintessentially Aussie!$$,
  ingredients = ARRAY['Beef or pork sausage', 'White bread or bun', 'Grilled onions', 'Tomato sauce (ketchup)', 'American mustard', 'Canned beetroot slices (optional)', 'BBQ sauce']::TEXT[],
  instructions = ARRAY['Grill sausage on BBQ', 'Grill onions until caramelized', 'Toast bread or bun', 'Place sausage diagonally on bread', 'Top with grilled onions', 'Add tomato sauce and mustard', 'Optional: add beetroot slices', 'Optional: drizzle BBQ sauce']::TEXT[],
  fun_facts = ARRAY['Sausage sizzles are Australian fundraising tradition', 'Often served at Bunnings hardware stores on weekends', 'Beetroot on hot dogs is uniquely Australian', 'Onions on top vs bottom is a heated debate']::TEXT[],
  origin_story = $$The sausage sizzle has been an Australian institution since the 1970s, commonly used for community fundraisers. What started as a simple grilled sausage in bread became a national symbol, with Bunnings hardware stores making weekend sausage sizzles a beloved Aussie tradition.$$
WHERE city = 'Sydney';

-- #27 Puka Dog (Honolulu)
UPDATE public.hotdogs 
SET 
  name = 'Puka Dog',
  city = 'Honolulu',
  country = 'United States',
  description = $$A Hawaiian specialty where a Polish sausage is inserted into toasted sweet bread, filled with tropical fruit relish, garlic lemon secret sauce, and spicy mustard. Sweet, tangy, and tropical!$$,
  ingredients = ARRAY['Polish sausage', 'Sweet Hawaiian bread', 'Tropical fruit relish (mango or pineapple)', 'Garlic lemon secret sauce', 'Spicy mustard', 'Optional: coconut flakes']::TEXT[],
  instructions = ARRAY['Toast sweet bread until golden', 'Create pocket in bread (puka means hole)', 'Fill pocket with tropical fruit relish', 'Add garlic lemon sauce', 'Insert grilled Polish sausage', 'Drizzle spicy mustard', 'Optional: top with toasted coconut']::TEXT[],
  fun_facts = ARRAY['Invented on Kauai, now famous in Honolulu', 'Puka means "hole" in Hawaiian', 'Secret sauce recipe is closely guarded', 'A must-try for tourists visiting Hawaii']::TEXT[],
  origin_story = $$The Puka Dog was created on Kauai in the 1990s by a vendor who wanted to showcase Hawaiian tropical flavors in a hot dog. By stuffing the relish inside the bread and using sweet Hawaiian bread, they created a unique island fusion that became a tourist favorite.$$
WHERE city = 'Honolulu';

-- #28 Toronto Street Dog (Toronto)
UPDATE public.hotdogs 
SET 
  name = 'Toronto Street Dog',
  city = 'Toronto',
  country = 'Canada',
  description = $$A Toronto street cart hot dog topped with mustard, ketchup, relish, onions, and sauerkraut. Simple, classic, and sold from iconic street vendors across the city.$$,
  ingredients = ARRAY['All-beef hot dog', 'Steamed bun', 'Yellow mustard', 'Ketchup', 'Sweet relish', 'Diced onions', 'Sauerkraut']::TEXT[],
  instructions = ARRAY['Steam hot dog', 'Steam bun until soft', 'Place hot dog in bun', 'Add yellow mustard', 'Add ketchup', 'Top with sweet relish', 'Add diced onions', 'Finish with sauerkraut']::TEXT[],
  fun_facts = ARRAY['Toronto has over 350 licensed hot dog carts', 'Iconic red-and-white street carts', 'Part of Toronto''s multicultural street food scene', 'Often topped with Toronto-style relish']::TEXT[],
  origin_story = $$Toronto''s street hot dog culture dates back to the early 1900s with immigrant vendors. The iconic red-and-white carts became fixtures across the city, serving simple, satisfying hot dogs to busy Torontonians. Today, they represent the city''s unpretentious street food heritage.$$
WHERE city = 'Toronto';
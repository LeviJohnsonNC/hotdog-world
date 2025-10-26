-- Create hotdogs table
CREATE TABLE public.hotdogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  description TEXT NOT NULL,
  latitude NUMERIC NOT NULL,
  longitude NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.hotdogs ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Hotdogs are publicly readable"
ON public.hotdogs
FOR SELECT
USING (true);

-- Insert seed data
INSERT INTO public.hotdogs (name, city, country, description, latitude, longitude) VALUES
('Chicago-Style Hot Dog', 'Chicago', 'USA', 'All-beef frank in a poppy-seed bun; mustard, neon relish, onion, tomato, pickle spear, sport peppers, celery salt — never ketchup.', 41.8781, -87.6298),
('Dirty Water Dog', 'New York', 'USA', 'Steamed or grilled kosher beef dog; mustard, sauerkraut, and optional onion-tomato sauce. Simple, classic street fare.', 40.7128, -74.0060),
('Seattle Dog', 'Seattle', 'USA', 'Toasted bun with cream cheese spread and grilled onions; sometimes jalapeños or Sriracha. A late-night favorite.', 47.6062, -122.3321),
('New York System Wiener', 'Rhode Island', 'USA', 'New York System wiener: small dog with mustard, celery salt, chopped onions, and beef sauce, served assembly-line style.', 41.8240, -71.4128),
('Coney Island Hot Dog', 'Coney Island', 'USA', 'Beef dog with chili, mustard, and chopped onions — an early ancestor of many chili dogs.', 40.5755, -73.9707),
('Kansas City Hot Dog', 'Kansas City', 'USA', 'Pork and beef frank wrapped in bacon, topped with sauerkraut and Swiss cheese, served in a sesame-seed bun.', 39.0997, -94.5786),
('Southern Slaw Dog', 'Atlanta', 'USA', 'Southern Slaw Dog: dog with yellow mustard and sweet coleslaw, occasionally with chili.', 33.7490, -84.3880),
('Sonoran Hot Dog', 'Arizona', 'USA', 'Bacon-wrapped dog in a bolillo-style roll, topped with beans, mayo, mustard, onions, tomatoes, and jalapeño salsa.', 31.9686, -99.9018),
('Shuco', 'Guatemala City', 'Guatemala', 'Shuco dog with guacamole, cabbage, mustard, mayo, ketchup, and spicy salsa in a toasted roll.', 14.6349, -90.5069),
('Completo', 'Santiago', 'Chile', 'Completo: dog with tomato, mashed avocado, and heaps of mayonnaise; sometimes sauerkraut or relish.', -33.4489, -70.6693),
('Pancho', 'Buenos Aires', 'Argentina', 'Pancho: long, thin dog often topped with chimichurri, cheese sauce, or potato sticks.', -34.6037, -58.3816),
('Cachorro-Quente Paulista', 'São Paulo', 'Brazil', 'Cachorro-quente: loaded with tomato sauce, mashed potatoes, peas, corn, grated cheese, and crispy potato sticks.', -23.5505, -46.6333),
('Peruvian Hot Dog', 'Lima', 'Peru', 'Dog topped with mayo, mustard, ketchup, fries, and spicy ají sauce — a street-corner staple.', -12.0464, -77.0428),
('Rød Pølser', 'Copenhagen', 'Denmark', 'Rød Pølser: bright red sausage with ketchup, mustard, remoulade, raw and fried onions, and sliced pickles.', 55.6761, 12.5683),
('Currywurst', 'Berlin', 'Germany', 'Currywurst: sliced sausage drowned in curry-ketchup sauce; eaten with a fork, not a bun, but hot-dog-adjacent.', 52.5200, 13.4050),
('Pylsa', 'Reykjavík', 'Iceland', 'Pylsa: lamb-based dog with sweet mustard, remoulade, raw and crispy onions. Beloved at Bæjarins Beztu Pylsur stand.', 64.1466, -21.9426),
('Tunnbrödsrulle', 'Stockholm', 'Sweden', 'Tunnbrödsrulle: hot dog rolled in flatbread with mashed potatoes, shrimp salad, lettuce, and onions.', 59.3293, 18.0686),
('Pølse med Lompe', 'Oslo', 'Norway', 'Pølse med lompe: dog wrapped in thin potato flatbread with ketchup and mustard — simple and portable.', 59.9139, 10.7522),
('Grilli Makkara', 'Helsinki', 'Finland', 'Grilli makkara: thick sausage in bun with mustard, relish, and occasionally cucumber salad.', 60.1695, 24.9354),
('British Gourmet Dog', 'London', 'UK', 'Modern British versions favor gourmet dogs with caramelized onions, English mustard, and aged cheddar.', 51.5074, -0.1278),
('Kielbasa Roll', 'Warsaw', 'Poland', 'Kielbasa roll: smoky sausage in crusty bun with sauerkraut and spicy mustard.', 52.2297, 21.0122),
('Párek v Rohlíku', 'Prague', 'Czech Republic', 'Párek v rohlíku: sausage inserted into hollowed-out roll, topped with mustard or ketchup; tidy and efficient.', 50.0755, 14.4378),
('Sosiska v Teste', 'Moscow', 'Russia', 'Sosiska v teste: sausage baked inside pastry dough — essentially a hot-dog croissant.', 55.7558, 37.6173),
('Japanese Bakery Dog', 'Tokyo', 'Japan', 'Bakery hot dogs often topped with ketchup, mayo, nori flakes, and pickled vegetables; fusion at its finest.', 35.6762, 139.6503),
('Korean Corn Dog', 'Seoul', 'South Korea', 'Korean corn dog: sausage (or mozzarella-filled) battered, deep-fried, rolled in sugar, sometimes coated in fries.', 37.5665, 126.9780),
('Thai Street Dog', 'Bangkok', 'Thailand', 'Spicy street dogs glazed in sweet chili sauce, often served on skewers with papaya salad.', 13.7563, 100.5018),
('Bombay Hot Dog', 'Mumbai', 'India', 'Bombay hot dog: chicken or lamb sausage with onions, chutney, and spicy masala ketchup.', 19.0760, 72.8777),
('Aussie Dog', 'Sydney', 'Australia', 'Aussie dog: grilled dog with beetroot, fried onions, cheese, and barbecue sauce.', -33.8688, 151.2093),
('Puka Dog', 'Honolulu', 'Hawaii', 'Puka Dog: Polish sausage in a hollowed-out bun, filled with tropical relishes (mango, pineapple) and spicy garlic sauce.', 21.3099, -157.8581),
('Toronto Street Dog', 'Toronto', 'Canada', 'Street dog: all-beef dog loaded with mustard, onions, relish, sauerkraut, hot peppers — grill-cart royalty.', 43.6532, -79.3832);
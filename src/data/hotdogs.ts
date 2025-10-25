import { Hotdog } from "@/types/hotdog";
import chicagoImage from "@/assets/chicago-hotdog.jpg";
import tokyoImage from "@/assets/tokyo-hotdog.jpg";
import saoPauloImage from "@/assets/saopaulo-hotdog.jpg";
import berlinImage from "@/assets/berlin-hotdog.jpg";
import newYorkImage from "@/assets/newyork-hotdog.jpg";
import copenhagenImage from "@/assets/copenhagen-hotdog.jpg";

// Helper to convert lat/lng to 3D sphere coordinates
const latLngToVector3 = (lat: number, lng: number, radius: number = 2): [number, number, number] => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  
  return [x, y, z];
};

export const hotdogs: Hotdog[] = [
  {
    id: "chicago-dog",
    name: "Chicago-Style Hot Dog",
    city: "Chicago",
    country: "USA",
    position: latLngToVector3(41.8781, -87.6298),
    story: "Born in the Great Depression, this all-beef frank became Chicago's pride. The neon-green relish is iconic, and locals say ketchup is strictly forbidden. It's a garden on a bun, sold from stands across the Windy City.",
    ingredients: [
      "All-beef hot dog",
      "Poppy seed bun",
      "Yellow mustard",
      "Bright green relish",
      "Fresh chopped onions",
      "Tomato wedges",
      "Kosher pickle spear",
      "Sport peppers",
      "Celery salt"
    ],
    recipe: [
      "Steam the poppy seed bun until soft and warm",
      "Grill or steam the all-beef hot dog until heated through",
      "Place the hot dog in the bun",
      "Add yellow mustard in a zigzag pattern",
      "Top with neon green relish",
      "Add chopped white onions",
      "Place tomato wedges on both sides",
      "Add a pickle spear alongside",
      "Add sport peppers for heat",
      "Finish with a generous sprinkle of celery salt"
    ],
    image: chicagoImage,
    funFact: "Never ask for ketchup in Chicago—it's considered a hot dog sin!"
  },
  {
    id: "tokyo-dog",
    name: "Okonomiyaki Dog",
    city: "Tokyo",
    country: "Japan",
    position: latLngToVector3(35.6762, 139.6503),
    story: "A fusion creation from Tokyo's street food scene, this hot dog wraps savory pancake batter around a frank and tops it with dancing bonito flakes. It's okonomiyaki meets street cart innovation.",
    ingredients: [
      "Pork or chicken frank",
      "Savory pancake batter",
      "Okonomiyaki sauce",
      "Japanese mayo",
      "Bonito flakes (katsuobushi)",
      "Nori seaweed strips",
      "Pickled ginger (optional)"
    ],
    recipe: [
      "Wrap the frank in savory pancake batter",
      "Grill until the batter is golden and crispy",
      "Drizzle with okonomiyaki sauce",
      "Add thin lines of Japanese mayo",
      "Top with bonito flakes that dance from the heat",
      "Sprinkle with nori seaweed strips",
      "Serve with pickled ginger on the side"
    ],
    image: tokyoImage,
    funFact: "The bonito flakes 'dance' because they're so thin they move with the steam!"
  },
  {
    id: "sao-paulo-dog",
    name: "Cachorro-Quente Paulista",
    city: "São Paulo",
    country: "Brazil",
    position: latLngToVector3(-23.5505, -46.6333),
    story: "In Brazil, a hot dog is never just a hot dog. São Paulo's version is a full meal—loaded with corn, peas, potato sticks, quail eggs, and enough sauces to make it wonderfully messy. It's street food maximalism at its finest.",
    ingredients: [
      "Hot dog sausage",
      "Soft bun",
      "Sweet corn",
      "Green peas",
      "Potato sticks (batata palha)",
      "Quail eggs",
      "Mozzarella cheese",
      "Ketchup",
      "Mayo",
      "Mustard",
      "Tomato sauce"
    ],
    recipe: [
      "Heat the hot dog and bun",
      "Add the hot dog to the bun",
      "Layer on sweet corn and green peas",
      "Add ketchup, mayo, and mustard",
      "Top with melted mozzarella",
      "Add sliced or whole quail eggs",
      "Finish with a generous pile of crispy potato sticks",
      "Drizzle with warm tomato sauce"
    ],
    image: saoPauloImage,
    funFact: "Brazilians eat more hot dogs per capita than Americans!"
  },
  {
    id: "berlin-dog",
    name: "Currywurst",
    city: "Berlin",
    country: "Germany",
    position: latLngToVector3(52.5200, 13.4050),
    story: "Invented in post-war Berlin, currywurst is the city's most famous street food. The curry ketchup was created by a resourceful vendor mixing British curry powder with ketchup. Now it's a cultural icon served at stands across Germany.",
    ingredients: [
      "Bratwurst or pork sausage",
      "Curry ketchup",
      "Curry powder",
      "Crusty bread or fries"
    ],
    recipe: [
      "Grill or pan-fry the bratwurst until browned and cooked through",
      "Slice the sausage into bite-sized pieces",
      "Smother with warm curry ketchup",
      "Dust generously with curry powder",
      "Serve with crusty bread or crispy fries on the side"
    ],
    image: berlinImage,
    funFact: "Berliners consume around 70 million currywursts every year!"
  },
  {
    id: "new-york-dog",
    name: "New York Dirty Water Dog",
    city: "New York City",
    country: "USA",
    position: latLngToVector3(40.7128, -74.0060),
    story: "The quintessential NYC street food. These all-beef franks simmer in hot water carts on nearly every Manhattan corner. Simple, fast, and iconic—just mustard and sauerkraut, served with attitude.",
    ingredients: [
      "All-beef hot dog",
      "Steamed bun",
      "Yellow mustard",
      "Sauerkraut or onions in tomato sauce"
    ],
    recipe: [
      "Simmer the hot dog in water until heated through",
      "Steam the bun until soft",
      "Place the hot dog in the bun",
      "Add a stripe of yellow mustard",
      "Top with sauerkraut or onions in tomato sauce"
    ],
    image: newYorkImage,
    funFact: "The term 'dirty water' comes from the cloudy water the dogs simmer in all day!"
  },
  {
    id: "copenhagen-dog",
    name: "Rød Pølse",
    city: "Copenhagen",
    country: "Denmark",
    position: latLngToVector3(55.6761, 12.5683),
    story: "Denmark's iconic red hot dog, or rød pølse, has been a street food staple since the 1920s. The bright red color comes from food dye, and it's traditionally served from pølsevogn (sausage wagons) with crispy fried onions and tangy remoulade.",
    ingredients: [
      "Red hot dog (rød pølse)",
      "Hot dog bun or flatbread (lompe)",
      "Remoulade sauce",
      "Ketchup",
      "Mustard",
      "Crispy fried onions (ristede løg)",
      "Pickles"
    ],
    recipe: [
      "Boil or grill the red hot dog until heated through",
      "Warm the bun or wrap in lompe (traditional potato flatbread)",
      "Place the hot dog in the bun",
      "Add remoulade sauce generously",
      "Top with ketchup and mustard",
      "Add crispy fried onions",
      "Garnish with pickles"
    ],
    image: copenhagenImage,
    funFact: "Danes eat more than 110 million hot dogs per year—that's about 19 per person!"
  }
];

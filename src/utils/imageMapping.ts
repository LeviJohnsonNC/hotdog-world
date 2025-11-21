// Map city names to their actual image filenames
export const cityToImageMap: Record<string, string> = {
  "Atlanta": "atlanta-hotdog.png",
  "Sydney": "aussie-hotdog.png",
  "Bangkok": "thailand-hotdog.png",
  "Cape Town": "boerewors-hotdog.png",
  "Mumbai": "bombay-hotdog.png",
  "Chicago, Illinois": "chicago-hotdog-hero.png",
  "Chicago": "chicago-hotdog-hero.png",
  "Santiago": "completo-hotdog.png",
  "Coney Island": "coney-island-hotdog.png",
  "Berlin": "currywurst-hotdog.png",
  "Dar es Salaam": "mishkaki-hotdog.png",
  "Detroit": "detroit-coney-dog.png",
  "Helsinki": "grilli-makkara-hotdog.png",
  "Kansas City": "kansas-city-hotdog.png",
  "Krakow": "kielbasa-roll-hotdog.png",
  "Warsaw": "kielbasa-roll-hotdog.png",
  "Lima": "lima-hotdog.png",
  "London": "london-hotdog.png",
  "Tunis": "merguez-hotdog.png",
  "Nairobi": "mishkaki-hotdog.png",
  "New York": "newyork-hotdog.png",
  "Buenos Aires": "pancho-hotdog.png",
  "Prague": "parek-rohliku-hotdog.png",
  "Oslo": "polse-lompe-hotdog.png",
  "Honolulu": "puka-hotdog.png",
  "Reykjavík": "pylsa-hotdog.png",
  "Providence": "rhode-island-hotdog.png",
  "Copenhagen": "rod-polser-hotdog.png",
  "São Paulo": "saopaulo-hotdog.png",
  "Seattle": "seattle-hotdog.png",
  "Seoul": "seoul-corndog.png",
  "Guatemala City": "shuco-hotdog.png",
  "Anchorage": "alaska-reindeer-dog.png",
  "Arizona": "sonoran-hotdog.png",
  "Moscow": "sosiska-teste-hotdog.png",
  "Tokyo": "tokyo-hotdog.png",
  "Toronto": "toronto-hotdog.png",
  "Stockholm": "tunnbrodsrulle-hotdog.png",
  "Montreal": "montreal-hotdog.png",
  "LA": "la-hotdog.png",
  "Philippines": "philippines-hotdog.png",
  "Michigan": "michigan-hotdog.png",
  "Pennsylvania": "pennsylvania-hotdog.png",
  "Bogotá": "colombia-hotdog.png",
  "Caracas": "venezuela-hotdog.png",
  "San José": "costarica-hotdog.png",
  "Kyiv": "ukraine-hotdog.png",
  "Japan": "japan-tako-san-hotdog.png",
};

export function getHotdogImage(city: string): string {
  const imageName = cityToImageMap[city];
  if (imageName) {
    return `/images/${imageName}`;
  }
  
  // Fallback: try city slug
  const citySlug = city.toLowerCase().replace(/\s+/g, "-");
  return `/images/${citySlug}-hotdog.png`;
}

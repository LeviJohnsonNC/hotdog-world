import { StampedHotdog } from "@/types/passport";

export interface SpiderGraphData {
  axis: string;
  value: number;
  fullMark: 5;
}

/**
 * Calculate spider graph data based on tried hotdogs
 */
export const calculateSpiderGraphData = (stampedHotdogs: StampedHotdog[]): SpiderGraphData[] => {
  const triedHotdogs = stampedHotdogs.filter(h => h.isStamped);
  
  if (triedHotdogs.length === 0) {
    return [
      { axis: "Regions", value: 0, fullMark: 5 },
      { axis: "Spice", value: 0, fullMark: 5 },
      { axis: "Style", value: 0, fullMark: 5 },
      { axis: "Complexity", value: 0, fullMark: 5 },
      { axis: "Indulgence", value: 0, fullMark: 5 },
      { axis: "Variety", value: 0, fullMark: 5 },
    ];
  }

  // 1. Regions Explored (% of 6 regions tried)
  const allRegions = ["North America", "South America", "Europe", "Asia", "Africa", "Oceania"];
  const triedRegions = new Set(triedHotdogs.map(h => h.region).filter(Boolean));
  const regionsValue = (triedRegions.size / allRegions.length) * 5;

  // 2. Spice Chaser (% of tried dogs with spice tags)
  const spicyDogs = triedHotdogs.filter(h => 
    h.tags?.some(tag => tag === "spicy" || tag === "chili-topped")
  );
  const spiceValue = (spicyDogs.length / triedHotdogs.length) * 5;

  // 3. Style Explorer (% fusion/unconventional vs classic/traditional)
  const adventurousDogs = triedHotdogs.filter(h =>
    h.tags?.some(tag => tag === "fusion" || tag === "unconventional")
  );
  const styleValue = (adventurousDogs.length / triedHotdogs.length) * 5;

  // 4. Complexity (avg ingredient count, normalized to 0-5)
  const ingredientCounts = triedHotdogs.map(h => {
    const ingredients = h.ingredients;
    if (Array.isArray(ingredients)) {
      return ingredients.length;
    } else if (ingredients && typeof ingredients === 'object') {
      const hotdogBun = (ingredients.hotdog_and_bun || []).length;
      const toppings = (ingredients.toppings || []).length;
      return hotdogBun + toppings;
    }
    return 0;
  });
  const avgIngredients = ingredientCounts.reduce((sum, count) => sum + count, 0) / ingredientCounts.length;
  // Normalize: 0-3 ingredients = 0, 20+ ingredients = 5
  const complexityValue = Math.min(5, Math.max(0, (avgIngredients - 3) / 3.4));

  // 5. Indulgence (avg calories, normalized to 0-5)
  const caloriesData = triedHotdogs
    .map(h => h.calories)
    .filter((c): c is number => c !== null && c !== undefined);
  const avgCalories = caloriesData.length > 0
    ? caloriesData.reduce((sum, cal) => sum + cal, 0) / caloriesData.length
    : 0;
  // Normalize: 200 calories = 0, 800+ calories = 5
  const indulgenceValue = Math.min(5, Math.max(0, (avgCalories - 200) / 120));

  // 6. Ingredient Variety (unique ingredients count, normalized to 0-5)
  const allIngredients = new Set<string>();
  triedHotdogs.forEach(h => {
    const ingredients = h.ingredients;
    if (Array.isArray(ingredients)) {
      ingredients.forEach(ing => allIngredients.add(ing.toLowerCase()));
    } else if (ingredients && typeof ingredients === 'object') {
      (ingredients.hotdog_and_bun || []).forEach((ing: string) => allIngredients.add(ing.toLowerCase()));
      (ingredients.toppings || []).forEach((ing: string) => allIngredients.add(ing.toLowerCase()));
    }
  });
  // Normalize: 0-10 unique = 0, 30+ unique = 5
  const varietyValue = Math.min(5, Math.max(0, (allIngredients.size - 10) / 4));

  return [
    { axis: "Regions", value: Math.round(regionsValue * 10) / 10, fullMark: 5 },
    { axis: "Spice", value: Math.round(spiceValue * 10) / 10, fullMark: 5 },
    { axis: "Style", value: Math.round(styleValue * 10) / 10, fullMark: 5 },
    { axis: "Complexity", value: Math.round(complexityValue * 10) / 10, fullMark: 5 },
    { axis: "Indulgence", value: Math.round(indulgenceValue * 10) / 10, fullMark: 5 },
    { axis: "Variety", value: Math.round(varietyValue * 10) / 10, fullMark: 5 },
  ];
};

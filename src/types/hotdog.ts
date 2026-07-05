export interface Hotdog {
  id: string;
  slug: string;
  name: string;
  city: string;
  country: string;
  description: string;
  latitude: number;
  longitude: number;
  image: string;
  globeImage?: string;
  position: [number, number, number]; // 3D coordinates on globe
  ingredients?: {
    hotdog_and_bun?: string[];
    toppings?: string[];
  } | string[]; // Supports both new structured format and legacy array format
  instructions?: string[];
  fun_facts?: string[];
  origin_story?: string;
  method_and_soul?: string;
  explore_links?: Array<{ title: string; url: string }>;
  // Recipe metadata for Google structured data
  prep_time?: string;
  cook_time?: string;
  total_time?: string;
  recipe_yield?: string;
  date_published?: string;
  calories?: number;
  video_url?: string;
  // Badge-related categorization
  tags?: string[];
  region?: string;
  // Normalized IDs for pantry matching
  canonical_ingredient_ids?: string[];
  canonical_equipment_ids?: string[];
  // Detailed nutrition information
  fat_total_g?: number;
  fat_saturated_g?: number;
  fat_trans_g?: number;
  carbs_total_g?: number;
  carbs_fiber_g?: number;
  carbs_sugars_g?: number;
  protein_g?: number;
  sodium_mg?: number;
  cholesterol_mg?: number;
  // Editorial detail-page fields (optional, per-dog)
  hero_subtitle?: string | null;
  flavor_profile?: {
    mess?: number;
    heat?: number;
    crunch?: number;
    sauce?: number;
    boldness?: number;
    distinctiveness?: number;
    // legacy keys (kept optional for backward compatibility)
    sweet?: number;
    salty?: number;
    creamy?: number;
  } | null;
  anatomy?: Array<{ layer: string; note?: string }> | null;
  why_it_works?: string | null;
  origin_timeline?: Array<{
    era: string;
    title: string;
    body: string;
    icon?: string;
  }> | null;
  pull_quote?: string | null;
  accent_palette?: { primary?: string; secondary?: string } | null;
  related_slugs?: string[] | null;
  // Structured, cookable recipe (optional — falls back to prose fields)
  recipe_meta?: {
    servings?: number;
    servings_unit?: string;
    prep_min?: number;
    cook_min?: number;
    rest_min?: number;
    difficulty?: string;
    equipment?: string[];
  } | null;
  recipe_ingredients?: Array<{
    id: string;
    group?: string;
    name: string;
    qty?: number | null;
    unit?: string | null;
    note?: string | null;
    optional?: boolean;
  }> | null;
  recipe_steps?: Array<{
    n?: number;
    title: string;
    body: string;
    duration_min?: number | null;
    temp?: string | null;
    uses?: string[];
    tip?: string | null;
    pitfall?: string | null;
  }> | null;
}

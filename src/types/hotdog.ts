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
    sweet?: number;
    salty?: number;
    crunch?: number;
    creamy?: number;
    heat?: number;
    mess?: number;
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
}

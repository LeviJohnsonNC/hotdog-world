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
  // Sprite sheet coordinates
  sprite_x?: number | null;
  sprite_y?: number | null;
  sprite_width?: number | null;
  sprite_height?: number | null;
  sprite_sheet_version?: number | null;
  spriteSheetUrl?: string | null;
  hasSpriteCoordinates?: boolean;
  // Recipe metadata for Google structured data
  prep_time?: string;
  cook_time?: string;
  total_time?: string;
  recipe_yield?: string;
  date_published?: string;
  calories?: number;
  video_url?: string;
}

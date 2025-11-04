export interface Hotdog {
  id: string;
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
}

export interface HotdogStamp {
  hotdogId: string;
  tried: boolean;
  rating?: number; // 1-5
  review?: string;
  photoDataUrl?: string; // compressed base64 thumbnail
  timestamp: number;
  lastModified: number;
}

export interface PassportStats {
  total: number;
  stamped: number;
  percentage: number;
  avgRating: number;
  countriesVisited: number;
}

export interface StampedHotdog {
  id: string;
  name: string;
  city: string;
  country: string;
  description: string;
  latitude: number;
  longitude: number;
  image: string;
  position: [number, number, number];
  ingredients?: any;
  instructions?: string[];
  fun_facts?: string[];
  origin_story?: string;
  method_and_soul?: string;
  explore_links?: Array<{ title: string; url: string }>;
  sprite_x?: number | null;
  sprite_y?: number | null;
  sprite_width?: number | null;
  sprite_height?: number | null;
  sprite_sheet_version?: number | null;
  spriteSheetUrl?: string | null;
  hasSpriteCoordinates?: boolean;
  tags?: string[];
  region?: string;
  calories?: number;
  stamp: HotdogStamp | null;
  isStamped: boolean;
}

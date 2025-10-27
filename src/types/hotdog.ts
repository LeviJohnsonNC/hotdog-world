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
  ingredients?: string[];
  instructions?: string[];
  fun_facts?: string[];
  origin_story?: string;
  explore_links?: Array<{ title: string; url: string }>;
}

export interface HotdogCluster {
  id: string;
  position: [number, number, number];
  hotdogs: Hotdog[];
}

export interface Hotdog {
  id: string;
  name: string;
  city: string;
  country: string;
  description: string;
  latitude: number;
  longitude: number;
  position: [number, number, number]; // 3D coordinates on globe
}

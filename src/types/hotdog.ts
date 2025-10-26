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
}

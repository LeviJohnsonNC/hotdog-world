export interface Hotdog {
  id: string;
  name: string;
  city: string;
  country: string;
  position: [number, number, number]; // 3D coordinates on globe
  story: string;
  ingredients: string[];
  recipe: string[];
  image: string;
  funFact: string;
}

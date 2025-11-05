export interface HotdogStamp {
  hotdogId: string;
  tried: boolean;
  rating?: number; // 1-5
  review?: string;
  photoDataUrl?: string; // compressed base64 thumbnail
  timestamp: number;
  lastModified: number;
}

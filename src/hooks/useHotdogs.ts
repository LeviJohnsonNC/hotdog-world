import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Hotdog } from "@/types/hotdog";

// Standard spherical to Cartesian coordinate conversion
// Works with Three.js SphereGeometry default UV mapping
const latLngToVector3 = (lat: number, lng: number, radius: number = 2.15): [number, number, number] => {
  // Convert lat/lng to spherical coordinates (phi, theta)
  const phi = (90 - lat) * (Math.PI / 180);      // 0 at north pole, π at south pole
  const theta = (lng + 180) * (Math.PI / 180);   // 0 to 2π around equator
  
  // Standard spherical to Cartesian conversion
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  
  return [x, y, z];
};

export function useHotdogs() {
  return useQuery({
    queryKey: ["hotdogs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hotdogs")
        .select("*")
        .order("name");

      if (error) throw error;

      // Use single hotdog pin image for all cities
      const hotdogPinImage = '/hotdogs/hotdog-pin.png';
      
      const cityImageMap: Record<string, string> = {
        'Chicago': hotdogPinImage,
        'Chicago, Illinois': '/images/chicago-hotdog-hero.png',
        'New York': '/images/newyork-hotdog.png',
        'Kansas City': '/images/kansas-city-hotdog.png',
        'Providence': '/images/rhode-island-hotdog.png',
        'Tokyo': hotdogPinImage,
        'Berlin': hotdogPinImage,
        'Copenhagen': hotdogPinImage,
        'São Paulo': hotdogPinImage,
      };

      // Add 3D position and image to each hotdog
      return (data || []).map((hotdog) => ({
        ...hotdog,
        position: latLngToVector3(Number(hotdog.latitude), Number(hotdog.longitude)),
        image: cityImageMap[hotdog.city] || hotdogPinImage,
        explore_links: Array.isArray(hotdog.explore_links) 
          ? hotdog.explore_links as Array<{ title: string; url: string }>
          : []
      })) as Hotdog[];
    },
  });
}

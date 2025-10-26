import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Hotdog } from "@/types/hotdog";

// Helper to convert lat/lng to 3D sphere coordinates
const latLngToVector3 = (lat: number, lng: number, radius: number = 2.05): [number, number, number] => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  
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

      // Map city names to image files
      const cityImageMap: Record<string, string> = {
        'Chicago': '/src/assets/chicago-hotdog.jpg',
        'New York': '/src/assets/newyork-hotdog.jpg',
        'Tokyo': '/src/assets/tokyo-hotdog.jpg',
        'Berlin': '/src/assets/berlin-hotdog.jpg',
        'Copenhagen': '/src/assets/copenhagen-hotdog.jpg',
        'São Paulo': '/src/assets/saopaulo-hotdog.jpg',
      };

      // Add 3D position and image to each hotdog
      return (data || []).map((hotdog) => ({
        ...hotdog,
        position: latLngToVector3(Number(hotdog.latitude), Number(hotdog.longitude)),
        image: cityImageMap[hotdog.city] || '/src/assets/chicago-hotdog.jpg'
      })) as Hotdog[];
    },
  });
}

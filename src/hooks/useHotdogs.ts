import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Hotdog, HotdogCluster } from "@/types/hotdog";

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

// Calculate distance between two 3D points
const distance3D = (pos1: [number, number, number], pos2: [number, number, number]): number => {
  const [x1, y1, z1] = pos1;
  const [x2, y2, z2] = pos2;
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2));
};

// Detect overlapping hotdogs and create clusters
const createClusters = (hotdogs: Hotdog[], threshold: number = 0.15): { clusters: HotdogCluster[], singles: Hotdog[] } => {
  const clustered = new Set<string>();
  const clusters: HotdogCluster[] = [];
  const singles: Hotdog[] = [];

  hotdogs.forEach((hotdog, index) => {
    if (clustered.has(hotdog.id)) return;

    const nearby = hotdogs.filter((other, otherIndex) => {
      if (index === otherIndex || clustered.has(other.id)) return false;
      return distance3D(hotdog.position, other.position) < threshold;
    });

    if (nearby.length > 0) {
      // Create cluster
      const clusterHotdogs = [hotdog, ...nearby];
      clusterHotdogs.forEach(h => clustered.add(h.id));
      
      clusters.push({
        id: `cluster-${hotdog.id}`,
        position: hotdog.position,
        hotdogs: clusterHotdogs,
      });
    } else {
      singles.push(hotdog);
    }
  });

  return { clusters, singles };
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
        'Tokyo': hotdogPinImage,
        'Berlin': hotdogPinImage,
        'Copenhagen': hotdogPinImage,
        'São Paulo': hotdogPinImage,
      };

      // Add 3D position and image to each hotdog
      const hotdogsWithPositions = (data || []).map((hotdog) => ({
        ...hotdog,
        position: latLngToVector3(Number(hotdog.latitude), Number(hotdog.longitude)),
        image: cityImageMap[hotdog.city] || hotdogPinImage,
        explore_links: Array.isArray(hotdog.explore_links) 
          ? hotdog.explore_links as Array<{ title: string; url: string }>
          : []
      })) as Hotdog[];

      return createClusters(hotdogsWithPositions);
    },
  });
}

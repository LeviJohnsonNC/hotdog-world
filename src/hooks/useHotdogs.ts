import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Hotdog } from "@/types/hotdog";

// Standard spherical to Cartesian coordinate conversion
// Works with Three.js SphereGeometry default UV mapping
const latLngToVector3 = (lat: number, lng: number, radius: number = 2.02): [number, number, number] => {
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
  const dx = pos1[0] - pos2[0];
  const dy = pos1[1] - pos2[1];
  const dz = pos1[2] - pos2[2];
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
};

// Apply radial offsets to overlapping pins
const applyOverlapOffsets = (
  hotdogs: Array<{ position: [number, number, number]; [key: string]: any }>,
  threshold: number = 0.3,
  offsetRadius: number = 0.15,
  sphereRadius: number = 2.02
): void => {
  // Track which hotdogs have been processed
  const processed = new Set<number>();
  
  for (let i = 0; i < hotdogs.length; i++) {
    if (processed.has(i)) continue;
    
    // Find all hotdogs that overlap with this one
    const group: number[] = [i];
    for (let j = i + 1; j < hotdogs.length; j++) {
      if (processed.has(j)) continue;
      
      const dist = distance3D(hotdogs[i].position, hotdogs[j].position);
      if (dist < threshold) {
        group.push(j);
        processed.add(j);
      }
    }
    
    // If there's overlap, apply circular offsets
    if (group.length > 1) {
      processed.add(i);
      
      for (let k = 1; k < group.length; k++) {
        const idx = group[k];
        const angle = (2 * Math.PI * k) / group.length;
        
        // Calculate offset in a perpendicular plane to the position vector
        const pos = hotdogs[idx].position;
        const magnitude = Math.sqrt(pos[0] * pos[0] + pos[1] * pos[1] + pos[2] * pos[2]);
        
        // Create a perpendicular vector for offsetting
        const perpX = -pos[2];
        const perpZ = pos[0];
        const perpMag = Math.sqrt(perpX * perpX + perpZ * perpZ);
        
        if (perpMag > 0) {
          // Normalize perpendicular vector
          const normPerpX = perpX / perpMag;
          const normPerpZ = perpZ / perpMag;
          
          // Apply circular offset
          const offsetX = Math.cos(angle) * offsetRadius * normPerpX;
          const offsetZ = Math.cos(angle) * offsetRadius * normPerpZ;
          const offsetY = Math.sin(angle) * offsetRadius;
          
          // Add offset and renormalize to sphere surface
          const newX = pos[0] + offsetX;
          const newY = pos[1] + offsetY;
          const newZ = pos[2] + offsetZ;
          const newMag = Math.sqrt(newX * newX + newY * newY + newZ * newZ);
          
          hotdogs[idx].position = [
            (newX / newMag) * sphereRadius,
            (newY / newMag) * sphereRadius,
            (newZ / newMag) * sphereRadius
          ];
        }
      }
    }
  }
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
        'Detroit': '/images/detroit-coney-dog.png',
        'Coney Island': '/images/coney-island-hotdog.png',
        'Kansas City': '/images/kansas-city-hotdog.png',
        'Providence': '/images/rhode-island-hotdog.png',
        'Seattle': '/images/seattle-hotdog.png',
        'Atlanta': '/images/atlanta-hotdog.png',
        'Arizona': '/images/sonoran-hotdog.png',
        'Tokyo': hotdogPinImage,
        'Berlin': hotdogPinImage,
        'Copenhagen': hotdogPinImage,
        'São Paulo': hotdogPinImage,
        'Seoul': '/images/seoul-corndog.png',
        'Toronto': '/images/toronto-hotdog.png',
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
      
      // Apply offsets to prevent overlapping pins
      applyOverlapOffsets(hotdogsWithPositions);
      
      return hotdogsWithPositions;
    },
  });
}

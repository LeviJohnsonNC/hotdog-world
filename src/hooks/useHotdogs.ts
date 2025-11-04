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

// Apply radial offsets to overlapping pins with enhanced distribution
const applyOverlapOffsets = (
  hotdogs: Array<{ position: [number, number, number]; [key: string]: any }>,
  threshold: number = 0.5,
  offsetRadius: number = 0.3,
  sphereRadius: number = 2.02
): void => {
  const processed = new Set<number>();
  
  for (let i = 0; i < hotdogs.length; i++) {
    if (processed.has(i)) continue;
    
    // Find all overlapping hotdogs
    const group: number[] = [i];
    for (let j = i + 1; j < hotdogs.length; j++) {
      if (processed.has(j)) continue;
      
      const dist = distance3D(hotdogs[i].position, hotdogs[j].position);
      if (dist < threshold) {
        group.push(j);
        processed.add(j);
      }
    }
    
    // If overlap detected, distribute all pins in the group
    if (group.length > 1) {
      processed.add(i);
      
      // Calculate centroid of the group
      const centroid: [number, number, number] = [0, 0, 0];
      group.forEach(idx => {
        centroid[0] += hotdogs[idx].position[0];
        centroid[1] += hotdogs[idx].position[1];
        centroid[2] += hotdogs[idx].position[2];
      });
      centroid[0] /= group.length;
      centroid[1] /= group.length;
      centroid[2] /= group.length;
      
      // Normalize centroid to sphere surface
      const centroidMag = Math.sqrt(
        centroid[0] * centroid[0] + 
        centroid[1] * centroid[1] + 
        centroid[2] * centroid[2]
      );
      centroid[0] = (centroid[0] / centroidMag) * sphereRadius;
      centroid[1] = (centroid[1] / centroidMag) * sphereRadius;
      centroid[2] = (centroid[2] / centroidMag) * sphereRadius;
      
      // Create two perpendicular vectors on the tangent plane
      const up: [number, number, number] = [0, 1, 0];
      const normal = centroid;
      
      // First tangent vector (cross product of normal and up)
      let tangent1: [number, number, number] = [
        normal[1] * up[2] - normal[2] * up[1],
        normal[2] * up[0] - normal[0] * up[2],
        normal[0] * up[1] - normal[1] * up[0]
      ];
      
      // Handle case where normal is parallel to up
      if (Math.abs(normal[1]) > 0.99) {
        const right: [number, number, number] = [1, 0, 0];
        tangent1 = [
          normal[1] * right[2] - normal[2] * right[1],
          normal[2] * right[0] - normal[0] * right[2],
          normal[0] * right[1] - normal[1] * right[0]
        ];
      }
      
      // Normalize tangent1
      const t1Mag = Math.sqrt(tangent1[0]**2 + tangent1[1]**2 + tangent1[2]**2);
      tangent1[0] /= t1Mag;
      tangent1[1] /= t1Mag;
      tangent1[2] /= t1Mag;
      
      // Second tangent vector (cross product of normal and tangent1)
      const tangent2: [number, number, number] = [
        normal[1] * tangent1[2] - normal[2] * tangent1[1],
        normal[2] * tangent1[0] - normal[0] * tangent1[2],
        normal[0] * tangent1[1] - normal[1] * tangent1[0]
      ];
      
      const t2Mag = Math.sqrt(tangent2[0]**2 + tangent2[1]**2 + tangent2[2]**2);
      tangent2[0] /= t2Mag;
      tangent2[1] /= t2Mag;
      tangent2[2] /= t2Mag;
      
      // Distribute ALL pins evenly in a circle
      group.forEach((idx, k) => {
        const angle = (2 * Math.PI * k) / group.length;
        
        // Calculate offset using tangent vectors
        const offsetX = offsetRadius * (Math.cos(angle) * tangent1[0] + Math.sin(angle) * tangent2[0]);
        const offsetY = offsetRadius * (Math.cos(angle) * tangent1[1] + Math.sin(angle) * tangent2[1]);
        const offsetZ = offsetRadius * (Math.cos(angle) * tangent1[2] + Math.sin(angle) * tangent2[2]);
        
        // Apply offset to centroid
        const newX = centroid[0] + offsetX;
        const newY = centroid[1] + offsetY;
        const newZ = centroid[2] + offsetZ;
        
        // Renormalize to sphere surface
        const newMag = Math.sqrt(newX**2 + newY**2 + newZ**2);
        
        hotdogs[idx].position = [
          (newX / newMag) * sphereRadius,
          (newY / newMag) * sphereRadius,
          (newZ / newMag) * sphereRadius
        ];
      });
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
        'Guatemala City': '/images/shuco-hotdog.png',
        'Lima': '/images/lima-hotdog.png',
        'Santiago': '/images/completo-hotdog.png',
        'Tokyo': '/images/tokyo-hotdog.png',
        'Berlin': '/images/currywurst-hotdog.png',
        'Copenhagen': '/images/rod-polser-hotdog.png',
        'São Paulo': '/images/saopaulo-hotdog.png',
        'Seoul': '/images/seoul-corndog.png',
        'Toronto': '/images/toronto-hotdog.png',
        'Buenos Aires': '/images/pancho-hotdog.png',
        'Honolulu': '/images/puka-hotdog.png',
        'Reykjavík': '/images/pylsa-hotdog.png',
        'London': '/images/london-hotdog.png',
        'Stockholm': '/images/tunnbrodsrulle-hotdog.png',
        'Oslo': '/images/polse-lompe-hotdog.png',
        'Helsinki': '/images/grilli-makkara-hotdog.png',
        'Warsaw': '/images/kielbasa-roll-hotdog.png',
        'Prague': '/images/parek-rohliku-hotdog.png',
        'Moscow': '/images/sosiska-teste-hotdog.png',
        'Mumbai': '/images/bombay-hotdog.png',
        'Bangkok': '/images/bangkok-hotdog.png',
        'Sydney': '/images/aussie-hotdog.png',
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

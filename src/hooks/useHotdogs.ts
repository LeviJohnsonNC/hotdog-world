import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Hotdog } from "@/types/hotdog";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

// Standard spherical to Cartesian coordinate conversion
// Works with Three.js SphereGeometry default UV mapping
const latLngToVector3 = (lat: number, lng: number, radius: number = 2.08): [number, number, number] => {
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

// Apply minimal offsets to overlapping pins while preserving real locations
const applyOverlapOffsets = (
  hotdogs: Array<{ position: [number, number, number]; [key: string]: any }>,
  threshold: number = 0.3,
  offsetStrength: number = 0.08,
  sphereRadius: number = 2.08
): void => {
  // Apply iterative nudging to separate overlapping pins
  const maxIterations = 3;
  
  for (let iteration = 0; iteration < maxIterations; iteration++) {
    let hasOverlap = false;
    
    for (let i = 0; i < hotdogs.length; i++) {
      for (let j = i + 1; j < hotdogs.length; j++) {
        const pos1 = hotdogs[i].position;
        const pos2 = hotdogs[j].position;
        const dist = distance3D(pos1, pos2);
        
        if (dist < threshold && dist > 0) {
          hasOverlap = true;
          
          // Calculate push-away direction
          const dx = pos2[0] - pos1[0];
          const dy = pos2[1] - pos1[1];
          const dz = pos2[2] - pos1[2];
          
          // Normalize direction
          const mag = Math.sqrt(dx * dx + dy * dy + dz * dz);
          const dirX = dx / mag;
          const dirY = dy / mag;
          const dirZ = dz / mag;
          
          // Apply small offset in opposite directions
          const offset = offsetStrength * (threshold - dist) / threshold;
          
          // Move pin i slightly away
          const new1X = pos1[0] - dirX * offset;
          const new1Y = pos1[1] - dirY * offset;
          const new1Z = pos1[2] - dirZ * offset;
          const mag1 = Math.sqrt(new1X * new1X + new1Y * new1Y + new1Z * new1Z);
          hotdogs[i].position = [
            (new1X / mag1) * sphereRadius,
            (new1Y / mag1) * sphereRadius,
            (new1Z / mag1) * sphereRadius
          ];
          
          // Move pin j slightly away
          const new2X = pos2[0] + dirX * offset;
          const new2Y = pos2[1] + dirY * offset;
          const new2Z = pos2[2] + dirZ * offset;
          const mag2 = Math.sqrt(new2X * new2X + new2Y * new2Y + new2Z * new2Z);
          hotdogs[j].position = [
            (new2X / mag2) * sphereRadius,
            (new2Y / mag2) * sphereRadius,
            (new2Z / mag2) * sphereRadius
          ];
        }
      }
    }
    
    // Stop early if no overlaps found
    if (!hasOverlap) break;
  }
};

export function useHotdogs() {
  return useQuery({
    queryKey: ["hotdogs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hotdogs")
        .select("id, slug, name, city, country, description, latitude, longitude, ingredients, instructions, fun_facts, origin_story, method_and_soul, explore_links, prep_time, cook_time, total_time, recipe_yield, date_published, calories, video_url")
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
        'Cape Town': '/images/boerewors-hotdog.png',
        'Tunis': '/images/merguez-hotdog.png',
        'Dar es Salaam': '/images/mishkaki-hotdog.png',
      };

      // Add 3D position and fallback image to each hotdog
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

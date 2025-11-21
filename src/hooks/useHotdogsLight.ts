import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Hotdog } from "@/types/hotdog";
import { getHotdogImage } from "@/utils/imageMapping";

// Utility function to convert lat/lng to 3D vector position on a sphere
function latLngToVector3(
  lat: number,
  lng: number,
  radius: number = 2.10
): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);

  return [x, y, z];
}

// Calculate 3D distance between two points
function distance3D(
  pos1: [number, number, number],
  pos2: [number, number, number]
): number {
  const dx = pos1[0] - pos2[0];
  const dy = pos1[1] - pos2[1];
  const dz = pos1[2] - pos2[2];
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

// Multi-pass iterative relaxation with geographic anchoring
function applyOverlapOffsets(
  hotdogs: Array<{ position: [number, number, number]; latitude: number; longitude: number; [key: string]: any }>,
  threshold: number = 0.10,
  initialOffsetStrength: number = 0.08,
  sphereRadius: number = 2.01,
  iterations: number = 10,
  decayRate: number = 0.008,
  maxDisplacement: number = 0.05,
  springStrength: number = 0.03
): void {
  // Store original positions for geographic anchoring
  const originalPositions = hotdogs.map((h) => 
    latLngToVector3(h.latitude, h.longitude, sphereRadius)
  );
  
  const positions = hotdogs.map((h) => [...h.position] as [number, number, number]);

  // Multi-pass relaxation
  for (let iteration = 0; iteration < iterations; iteration++) {
    const currentOffsetStrength = initialOffsetStrength - (decayRate * iteration);
    
    // Calculate offsets for this iteration
    for (let i = 0; i < positions.length; i++) {
      let offsetX = 0;
      let offsetY = 0;
      let offsetZ = 0;

      // Calculate repulsion forces from nearby hotdogs
      for (let j = 0; j < positions.length; j++) {
        if (i === j) continue;

        const dist = distance3D(positions[i], positions[j]);

        if (dist < threshold) {
          const dx = positions[i][0] - positions[j][0];
          const dy = positions[i][1] - positions[j][1];
          const dz = positions[i][2] - positions[j][2];

          const magnitude = Math.sqrt(dx * dx + dy * dy + dz * dz) || 0.001;
          offsetX += (dx / magnitude) * currentOffsetStrength;
          offsetY += (dy / magnitude) * currentOffsetStrength;
          offsetZ += (dz / magnitude) * currentOffsetStrength;
        }
      }

      // Cap displacement to prevent flyaways
      const displacementMag = Math.sqrt(offsetX * offsetX + offsetY * offsetY + offsetZ * offsetZ);
      if (displacementMag > maxDisplacement) {
        const scale = maxDisplacement / displacementMag;
        offsetX *= scale;
        offsetY *= scale;
        offsetZ *= scale;
      }

      // Apply offset
      positions[i][0] += offsetX;
      positions[i][1] += offsetY;
      positions[i][2] += offsetZ;

      // Normalize back to sphere surface
      const length = Math.sqrt(
        positions[i][0] ** 2 + positions[i][1] ** 2 + positions[i][2] ** 2
      );
      positions[i][0] = (positions[i][0] / length) * sphereRadius;
      positions[i][1] = (positions[i][1] / length) * sphereRadius;
      positions[i][2] = (positions[i][2] / length) * sphereRadius;

      // Apply geographic spring force (pull back toward original position)
      const dx = originalPositions[i][0] - positions[i][0];
      const dy = originalPositions[i][1] - positions[i][1];
      const dz = originalPositions[i][2] - positions[i][2];

      positions[i][0] += dx * springStrength;
      positions[i][1] += dy * springStrength;
      positions[i][2] += dz * springStrength;

      // Normalize again after spring force
      const finalLength = Math.sqrt(
        positions[i][0] ** 2 + positions[i][1] ** 2 + positions[i][2] ** 2
      );
      positions[i][0] = (positions[i][0] / finalLength) * sphereRadius;
      positions[i][1] = (positions[i][1] / finalLength) * sphereRadius;
      positions[i][2] = (positions[i][2] / finalLength) * sphereRadius;
    }
  }

  // Update hotdog positions
  for (let i = 0; i < hotdogs.length; i++) {
    hotdogs[i].position = positions[i];
  }
}

export function useHotdogsLight() {
  return useQuery({
    queryKey: ["hotdogs-light"],
    queryFn: async () => {
      const { data: hotdogs, error } = await supabase
        .from("hotdogs")
        .select("id, slug, name, city, country, description, latitude, longitude, tags, region");

      if (error) throw error;
      if (!hotdogs) return [];

      const processedHotdogs: Hotdog[] = hotdogs.map((hotdog) => {
        const position = latLngToVector3(hotdog.latitude, hotdog.longitude);
        const imageUrl = getHotdogImage(hotdog.city);

        return {
          id: hotdog.id,
          slug: hotdog.slug,
          name: hotdog.name,
          city: hotdog.city,
          country: hotdog.country,
          description: hotdog.description,
          latitude: hotdog.latitude,
          longitude: hotdog.longitude,
          image: imageUrl,
          position,
          tags: hotdog.tags || [],
          region: hotdog.region || undefined,
        };
      });

      applyOverlapOffsets(processedHotdogs);

      return processedHotdogs;
    },
  });
}

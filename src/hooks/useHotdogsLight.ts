import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Hotdog } from "@/types/hotdog";
import { getGlobeImage, getHotdogImage } from "@/utils/imageMapping";
import { latLngToVector3, applyOverlapOffsets } from "@/utils/globePositioning";

export function useHotdogsLight() {
  return useQuery({
    queryKey: ["hotdogs-light"],
    queryFn: async () => {
      const { data: hotdogs, error } = await supabase
        .from("hotdogs")
        .select("id, slug, name, city, country, description, latitude, longitude, tags, region, ingredients, calories, canonical_ingredient_ids, canonical_equipment_ids");

      if (error) throw error;
      if (!hotdogs) return [];

      const processedHotdogs: Hotdog[] = hotdogs.map((hotdog) => {
        const position = latLngToVector3(hotdog.latitude, hotdog.longitude);

        return {
          id: hotdog.id,
          slug: hotdog.slug,
          name: hotdog.name,
          city: hotdog.city,
          country: hotdog.country,
          description: hotdog.description,
          latitude: hotdog.latitude,
          longitude: hotdog.longitude,
          image: getHotdogImage(hotdog.city, hotdog.slug),
          globeImage: getGlobeImage(hotdog.city, hotdog.slug),
          position,
          tags: hotdog.tags || [],
          region: hotdog.region || undefined,
          ingredients: hotdog.ingredients as any,
          calories: hotdog.calories || undefined,
          canonical_ingredient_ids: (hotdog as any).canonical_ingredient_ids || [],
          canonical_equipment_ids: (hotdog as any).canonical_equipment_ids || [],
        };
      });

      applyOverlapOffsets(processedHotdogs);

      return processedHotdogs;
    },
  });
}

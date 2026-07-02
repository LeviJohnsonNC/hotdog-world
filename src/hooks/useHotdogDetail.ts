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

export function useHotdogDetail(slug: string) {
  return useQuery({
    queryKey: ["hotdog", slug],
    queryFn: async () => {
      const { data: hotdog, error } = await supabase
        .from("hotdogs")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) throw error;
      if (!hotdog) return null;

      const position = latLngToVector3(hotdog.latitude, hotdog.longitude);
      const imageUrl = getHotdogImage(hotdog.city, hotdog.slug);

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
        ingredients: hotdog.ingredients,
        instructions: hotdog.instructions,
        fun_facts: hotdog.fun_facts,
        origin_story: hotdog.origin_story,
        method_and_soul: hotdog.method_and_soul,
        explore_links: hotdog.explore_links,
        prep_time: hotdog.prep_time,
        cook_time: hotdog.cook_time,
        total_time: hotdog.total_time,
        recipe_yield: hotdog.recipe_yield,
        date_published: hotdog.date_published,
        calories: hotdog.calories,
        video_url: hotdog.video_url,
        tags: hotdog.tags,
        region: hotdog.region,
        fat_total_g: hotdog.fat_total_g,
        fat_saturated_g: hotdog.fat_saturated_g,
        fat_trans_g: hotdog.fat_trans_g,
        carbs_total_g: hotdog.carbs_total_g,
        carbs_fiber_g: hotdog.carbs_fiber_g,
        carbs_sugars_g: hotdog.carbs_sugars_g,
        protein_g: hotdog.protein_g,
        sodium_mg: hotdog.sodium_mg,
        cholesterol_mg: hotdog.cholesterol_mg,
        hero_subtitle: (hotdog as any).hero_subtitle ?? null,
        flavor_profile: (hotdog as any).flavor_profile ?? null,
        anatomy: (hotdog as any).anatomy ?? null,
        why_it_works: (hotdog as any).why_it_works ?? null,
        origin_timeline: (hotdog as any).origin_timeline ?? null,
        pull_quote: (hotdog as any).pull_quote ?? null,
        accent_palette: (hotdog as any).accent_palette ?? null,
        related_slugs: (hotdog as any).related_slugs ?? null,
        recipe_meta: (hotdog as any).recipe_meta ?? null,
        recipe_ingredients: (hotdog as any).recipe_ingredients ?? null,
        recipe_steps: (hotdog as any).recipe_steps ?? null,
      } as Hotdog;
    },
    enabled: !!slug,
  });
}

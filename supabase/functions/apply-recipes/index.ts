// One-shot admin function to apply structured recipe data to hotdogs.
// Reads outputs.json bundled with the function and runs UPDATEs via service role.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import recipes from "../_tmp/recipes.json" with { type: "json" };

Deno.serve(async (_req) => {
  const url = Deno.env.get("SUPABASE_URL")!;
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const sb = createClient(url, key, { auth: { persistSession: false } });

  const entries = Object.entries(recipes as Record<string, any>);
  const results: Array<{ slug: string; ok: boolean; error?: string }> = [];

  for (const [slug, r] of entries) {
    const { error } = await sb
      .from("hotdogs")
      .update({
        recipe_meta: r.recipe_meta,
        recipe_ingredients: r.recipe_ingredients,
        recipe_steps: r.recipe_steps,
      })
      .eq("slug", slug);
    results.push({ slug, ok: !error, error: error?.message });
  }

  const ok = results.filter((r) => r.ok).length;
  return new Response(
    JSON.stringify({ total: results.length, ok, failed: results.filter((r) => !r.ok) }),
    { headers: { "Content-Type": "application/json" } },
  );
});

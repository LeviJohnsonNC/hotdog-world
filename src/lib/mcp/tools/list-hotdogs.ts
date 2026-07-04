import { createClient } from "@supabase/supabase-js";
import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "list_hotdogs",
  title: "List hotdogs",
  description:
    "List hotdogs in the Hotdog World catalog. Returns name, slug, city, country, and short description. Use `limit` (default 50) to page results.",
  inputSchema: {
    limit: z.number().int().positive().max(200).optional().describe("Max hotdogs to return (default 50, max 200)."),
    country: z.string().optional().describe("Optional country filter (case-insensitive substring)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit, country }) => {
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    let q = supabase
      .from("hotdogs")
      .select("name, slug, city, country, description, region, tags")
      .order("name", { ascending: true })
      .limit(limit ?? 50);
    if (country) q = q.ilike("country", `%${country}%`);
    const { data, error } = await q;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      structuredContent: { hotdogs: data ?? [] },
    };
  },
});

import { createClient } from "@supabase/supabase-js";
import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "search_hotdogs",
  title: "Search hotdogs",
  description:
    "Search hotdogs by keyword across name, city, country, and description. Returns matching hotdogs with slug and short description.",
  inputSchema: {
    query: z.string().min(1).describe("Search term, e.g. 'mustard', 'Tokyo', 'spicy'."),
    limit: z.number().int().positive().max(100).optional().describe("Max results (default 20)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ query, limit }) => {
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const like = `%${query}%`;
    const { data, error } = await supabase
      .from("hotdogs")
      .select("name, slug, city, country, description")
      .or(`name.ilike.${like},city.ilike.${like},country.ilike.${like},description.ilike.${like}`)
      .limit(limit ?? 20);
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      structuredContent: { hotdogs: data ?? [], query },
    };
  },
});

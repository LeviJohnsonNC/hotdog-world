import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listHotdogs from "./tools/list-hotdogs";
import getHotdog from "./tools/get-hotdog";
import searchHotdogs from "./tools/search-hotdogs";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "hotdog-world-mcp",
  title: "Hotdog World",
  version: "0.1.0",
  instructions:
    "Tools for exploring the Hotdog World catalog — a curated atlas of hotdogs from around the globe. Use `search_hotdogs` to find hotdogs by keyword, `list_hotdogs` to browse (optionally by country), and `get_hotdog` to fetch full recipe, origin, nutrition, and trivia for a specific slug.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listHotdogs, getHotdog, searchHotdogs],
});

# CLAUDE.md

Last reviewed: 2026-07-05

Operating guide for Claude (or any AI coding agent) working in this repo.

## What this app is

**Hotdogs Around the World** (aka "Hotdog World") is a single-page React web app that presents a curated atlas of iconic hot dogs from around the globe. Users spin an interactive 3D globe, click location pins, read editorial-style detail pages (recipe, origin, nutrition, trivia), collect passport stamps, and now filter recipes by what they have in a personal pantry.

Audience: food-curious general web visitors on desktop and mobile. Not a professional recipe app.

Public URLs:
- Preview: `https://id-preview--d604fab4-62c6-4d19-a452-add7f952abe4.lovable.app`
- Production: `https://hotdog-world.lovable.app` and `https://hotdog-world.com`

## Tech stack

- **Build**: Vite 5 + `@vitejs/plugin-react-swc`
- **Language**: TypeScript 5, React 18
- **Styling**: Tailwind CSS 3 + `tailwindcss-animate` + shadcn/ui (Radix primitives in `src/components/ui/`)
- **Routing**: `react-router-dom` v6 (`BrowserRouter` in `src/App.tsx`)
- **Data**: `@tanstack/react-query` v5 for all server state
- **Backend**: Lovable Cloud (Supabase under the hood) — Postgres, Auth, Storage, Edge Functions
- **3D globe**: `three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`
- **Forms**: `react-hook-form` + `zod` + `@hookform/resolvers`
- **Charts**: `recharts` (passport radar chart)
- **SEO**: `react-helmet-async`, static `public/sitemap.xml`, JSON-LD in detail pages
- **MCP**: `@lovable.dev/mcp-js` — server bundled by Vite plugin into `supabase/functions/mcp/`

## Run / build / lint

Requires Node.js (Node 20+ recommended) and npm.

```sh
npm i          # install
npm run dev    # Vite dev server on http://localhost:8080
npm run build  # production build
npm run build:dev
npm run preview
npm run lint   # ESLint (flat config in eslint.config.js)
```

There are **no tests** in this repo — no `test` script, no Vitest/Jest config, no `__tests__` folders. Do not claim coverage that does not exist.

## Important folders

- `src/pages/` — one file per route (see `src/App.tsx` for the route table)
- `src/components/` — feature components at the root; `ui/` = shadcn primitives; `detail/`, `passport/`, `leaderboard/`, `recipe/` = feature-scoped
- `src/contexts/` — `AuthContext`, `UserProgressContext` (stamps, revealed facts, visited hotdogs, trivia clicks, anon→user migration)
- `src/hooks/` — React Query hooks (`useHotdogs`, `useHotdogsLight`, `useHotdogDetail`, `usePantry`, `useStamps`, `useVisitedHotdogs`, `useRevealedFacts`, `useTriviaBadges`, `useFTUX`, `useOnboardingNudges`, `useOnlineStatus`, `useReducedMotion`, `useRetryableOperation`, `useSound`)
- `src/utils/` — pure logic: `badgeCalculator`, `badgeConfig`, `levelBadgeConfig`, `rankLadder`, `spiderGraphCalculator`, `passportHelpers`, `stampStorage`, `dataMigration`, `imageMapping`, `imageCompression`, `callsign`, `relatedCaptions`, `seoOverrides`
- `src/data/pantryTaxonomy.ts` — canonical ingredient/equipment lists + starter kit
- `src/types/` — `hotdog.ts`, `passport.ts`
- `src/lib/mcp/` — MCP tool definitions (`list-hotdogs`, `get-hotdog`, `search-hotdogs`)
- `src/integrations/supabase/` — **auto-generated** `client.ts` and `types.ts` — do not edit
- `supabase/migrations/` — dated SQL migrations (create tables + RLS + GRANTs)
- `supabase/functions/` — Edge Functions: `mcp` (auto-bundled by `mcpPlugin()`), `generate-hotdog-sprite`, `populate-recipe-metadata`, `sitemap`
- `public/anatomy/` — hand-drawn per-hotdog "exploded view" PNGs keyed by slug
- `public/textures/` — 3D globe textures (preloaded in `index.html`)

## Coding conventions used in the repo

- Path alias: `@/…` → `src/…` (configured in `vite.config.ts` and `tsconfig`).
- Named exports for components except pages (default export).
- All server state goes through React Query hooks — never call `supabase` directly from a component when a hook exists. Follow the light/detail split (`useHotdogsLight` for list views, `useHotdogDetail` for single dog).
- Anonymous users get localStorage-backed progress; on sign-in `UserProgressContext` migrates it into Supabase. Preserve this pattern for any new user-scoped feature (see `usePantry.ts` for the same idea).
- Tailwind styling uses **semantic HSL design tokens** defined in `src/index.css` (`--primary`, `--mustard-yellow`, `--ink`, `--paper`, `--stamp-red`, `--cilantro`, etc.). Never hardcode hex or `text-white`/`bg-black` — use `text-[hsl(var(--ink))]` or a shadcn variant.
- Toasts: `sonner` (`import { toast } from "sonner"`) or shadcn `useToast()` — both are mounted in `App.tsx`.
- Fonts: `font-sans` (Inter), `font-heading` (Poppins), `font-display` (Bebas Neue), plus `Caveat` and `Special Elite` loaded in `index.html` for editorial accents.
- Vite env only — use `import.meta.env.DEV`, never `process.env`. Timeout typing: `ReturnType<typeof setTimeout>`.

## UI / design principles to preserve

- **Editorial field-guide aesthetic**: paper backgrounds, ink navy, stamp red, cilantro green, mustard yellow. Poppins headings, Special Elite / Caveat for postcard and stamp accents.
- Detail pages use "paper card" surfaces with subtle shadows — see `src/components/detail/*`.
- Passport pages use a stamp/postcard metaphor (`PassportStamp`, `StampCard`, `TriviaPostcards`, `FactFlipCard`).
- Motion is subtle: `fade-in`, `bounce-gentle`, `spin-slow` keyframes in `tailwind.config.ts`. Respect `useReducedMotion()`.
- Meta description must stay under 160 chars. Every page needs a single H1 including 404/loading states.
- Hotdog images: use full uploaded photos site-wide; transparent versions are for globe pins only.
- Do not modify a hotdog's `method_and_soul` prose unless explicitly asked.

## Common mistakes to avoid

- Editing `src/integrations/supabase/client.ts` or `types.ts` (auto-generated).
- Editing `supabase/functions/mcp/index.ts` — it is regenerated from `src/lib/mcp/**` by the Vite `mcpPlugin()`. Change the source, not the bundle.
- Creating a Supabase table without a matching `GRANT` block in the same migration (PostgREST will 401 otherwise).
- Storing roles on `user_profiles`. There is currently no roles table — add one via the `user_roles` + `has_role` SECURITY DEFINER pattern if roles become needed.
- Adding backend/server code outside `supabase/functions/` — this is a client-only Vite project.
- Hardcoding colors instead of using design tokens; using default AI-slop palettes (purple gradients, generic Inter-on-white).
- Referencing "Supabase" in user-facing copy — say Lovable Cloud / backend.
- Adding sprite sheets for globe pins — the project explicitly uses individual image URLs.
- Re-adding Browse-all links to the header (they belong in the footer to prevent overlap).

## Central files to read first

1. `src/App.tsx` — providers stack, route table, React Query defaults.
2. `src/index.css` — full design-token palette (both semantic and food-derived).
3. `tailwind.config.ts` — token → utility mapping, keyframes, fonts.
4. `src/types/hotdog.ts` — the canonical `Hotdog` shape (recipe, anatomy, flavor profile, canonical pantry IDs).
5. `src/pages/Index.tsx` and `src/components/Globe.tsx` — landing experience.
6. `src/pages/HotdogDetail.tsx` + `src/components/detail/EditorialDetailView.tsx` — the editorial detail page composition.
7. `src/contexts/UserProgressContext.tsx` — all user-scoped state and anon→user migration.
8. `src/hooks/useHotdogsLight.ts` and `src/hooks/useHotdogDetail.ts` — the two-tier fetch pattern.
9. `src/hooks/usePantry.ts` + `src/pages/Pantry.tsx` + `src/data/pantryTaxonomy.ts` — the pantry / "what can I make" feature.
10. `src/lib/mcp/index.ts` — MCP server definition; manifest lives at `.lovable/mcp/manifest.json`.

## Before making changes

1. Read the file you're editing — do not modify without seeing current contents.
2. Confirm whether server state already has a React Query hook; extend it instead of duplicating a fetch.
3. If touching the DB: write a migration under `supabase/migrations/` with `CREATE TABLE → GRANT → ENABLE RLS → CREATE POLICY` in that order.
4. If touching MCP: edit `src/lib/mcp/**`, then re-verify the manifest — never hand-edit the bundled function.
5. If touching styling: use existing tokens; add new ones to `src/index.css` and Tailwind config together.
6. Check `mem://index.md` — project memory captures behavioural rules (badge logic, FTUX, globe rendering, SEO overrides) that are easy to violate accidentally.
7. Do not add tests where none exist unless the user asks — but never claim tests pass without running them.
8. Verify the change: for UI bugs drive Playwright against `http://localhost:8080`; for build health run `npm run build` if a change could break compilation.

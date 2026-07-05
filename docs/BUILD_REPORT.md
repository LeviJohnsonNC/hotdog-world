# Build Report — Hotdogs Around the World

Last reviewed: 2026-07-05

A technical handover document for a senior engineer or AI coding agent taking over this repository.

## 1. Product summary

Hotdogs Around the World is a client-side React SPA that presents a curated catalog of ~40+ regional hot dogs as an interactive experience. The core loop:

1. Land on the 3D globe (`/`).
2. Click a pin → editorial detail page for that hot dog (`/hotdog/:slug`).
3. Read recipe, origin timeline, anatomy, nutrition, trivia; optionally stamp the passport.
4. Track progress in `/passport` (stamps, badges, level, spider graph) and `/leaderboard`.
5. Fill in `/pantry` to filter `/hotdogs` down to recipes the user can actually make.

User goals: exploration, light education, personal collection ("passport"), and now practical filtering by ingredients on hand.

## 2. Feature map

- **3D interactive globe** with per-hotdog pins (`src/components/Globe.tsx`, `HotdogPin.tsx`, `HotdogModel.tsx`, `Stars.tsx`, `LoadingGlobe.tsx`). "Spin the Globe" gesture, backface culling, iterative overlap relaxation with geographic anchor spring force.
- **Editorial detail page** (`src/components/detail/*`) with hero, build rail, anatomy exploded view (per-slug PNGs in `public/anatomy/`), steps, flavor radar, method-and-soul essay, origin timeline, nutrition damage panel, trivia postcards, related CTA, sticky passport bar.
- **Recipe schema** JSON-LD injected for Google rich results, including full nutrition.
- **Browse all** page (`/hotdogs`) with search, region/tag filters, and the new "Only what I can make" pantry toggle showing "Ready to cook" / "N away" badges.
- **Pantry** (`/pantry`) — categorized ingredient + equipment checklist with progress bars, starter kit quick-add, reactive "Ready to cook" and "Almost there" side rail.
- **Passport** (`/passport`) — stamp collection grid, level card, radar chart (`LevelProgressionCard`), badge cards, empty-state teaser.
- **Leaderboard** (`/leaderboard`) — podium, rank ladder, standings rows over an atlas backdrop.
- **Account settings** (`/settings`) and **Auth** (`/auth`).
- **Admin utility** (`/admin/populate-metadata`) for backfilling recipe metadata.
- **FTUX**: choreographed 4900 ms onboarding with pin pulsing, runs once, persisted via localStorage.
- **Onboarding nudges** (`OnboardingNudge`, `useOnboardingNudges`).
- **Trivia badges** with fact-flip postcards; badges/progress cleared on logout.
- **SEO**: `react-helmet-async`, per-page metadata overrides in `src/utils/seoOverrides.ts`, static `public/sitemap.xml`, `public/robots.txt`, JSON-LD.
- **Offline indicator** (`OfflineIndicator`, `useOnlineStatus`).
- **Error boundary** with retry toasts and exponential backoff (`ErrorBoundary`, `queryErrorHandler`, `useRetryableOperation`).
- **MCP server** exposing `list_hotdogs`, `get_hotdog`, `search_hotdogs` for agent integrations.

## 3. Main user flows

- **Anonymous browse**: land → spin globe → open detail → stamp (localStorage) → continue browsing. Progress persists locally.
- **Sign up / sign in**: `/auth` → email + password + display name → session established → `UserProgressContext` migrates local stamps, revealed facts, visits, trivia clicks, and pantry into Supabase.
- **Cook-what-I-have**: `/pantry` → check ingredients + equipment (or "Starter Kit") → toggle "Only what I can make" on `/hotdogs` → cards show match state → click through to detail page.
- **Passport progression**: visit + stamp hot dogs → badges unlock → level advances → radar chart fills → leaderboard rank updates.

## 4. Architecture overview

Client-only Vite SPA. All backend concerns live in Lovable Cloud (Supabase):

```text
                 ┌──────────────────────────────┐
                 │        React SPA (Vite)      │
                 │  Providers (App.tsx):        │
                 │   ErrorBoundary              │
                 │   QueryClientProvider        │
                 │   HelmetProvider             │
                 │   AuthProvider               │
                 │   UserProgressProvider       │
                 │   TooltipProvider            │
                 │   BrowserRouter              │
                 └──────────┬───────────────────┘
                            │ React Query hooks
                            ▼
                 ┌──────────────────────────────┐
                 │   supabase-js client         │
                 │   (auto-gen client.ts)       │
                 └──────────┬───────────────────┘
                            │
        ┌───────────────────┼────────────────────────┐
        ▼                   ▼                        ▼
   Postgres (RLS)     Auth (email+pw)         Edge Functions
   hotdogs                                    - mcp (auto-bundled)
   user_profiles                              - populate-recipe-metadata
   hotdog_stamps                              - generate-hotdog-sprite
   revealed_facts                             - sitemap
   sprite_sheets
   user_pantry
```

- Providers are ordered so React Query wraps everything user-scoped; `UserProgressContext` depends on `AuthContext`.
- `QueryClient` defaults: `staleTime: 5 min`, `refetchOnWindowFocus: false`, custom retry via `getRetryConfig()` and `handleQueryError` in `src/lib/queryErrorHandler.ts`.

## 5. Routes / pages

Defined in `src/App.tsx`:

| Path | Component | Purpose |
|---|---|---|
| `/` | `pages/Index.tsx` | 3D globe landing |
| `/hotdog/:slug` | `pages/HotdogDetail.tsx` | Editorial detail page |
| `/hotdogs` | `pages/BrowseHotdogs.tsx` | Grid + search + pantry filter |
| `/pantry` | `pages/Pantry.tsx` | Ingredient/equipment checklist |
| `/passport` | `pages/Passport.tsx` | Stamps, level, radar, badges (tabs via `?tab=`) |
| `/leaderboard` | `pages/Leaderboard.tsx` | Podium + standings |
| `/settings` | `pages/AccountSettings.tsx` | Account management |
| `/auth` | `pages/Auth.tsx` | Sign in / sign up |
| `/admin/populate-metadata` | `pages/PopulateMetadata.tsx` | One-off backfill utility |
| `*` | `pages/NotFound.tsx` | 404 with H1 "Page Not Found" |

## 6. Key components

- **Globe stack**: `Globe.tsx` (504 lines) orchestrates the R3F scene; `HotdogPin.tsx` renders individual pins with `depthTest/Write=false` and `renderOrder=20`; `HotdogModel.tsx` is the 3D dog; `Stars.tsx` background; `LoadingGlobe.tsx` skeleton.
- **Detail composition** (`src/components/detail/`): `EditorialDetailView` composes `HeroSection`, `BuildSection` + `BuildRail`, `StepsSection`, `InstructionsSection`, `AnatomySection`, `FlavorProfileCard`, `MethodAndSoulSection`, `OriginTimelineSection`, `NutritionDamage`, `TriviaPostcards`, `ExploreMoreCTA`, `StickyPassportBar`.
- **Passport**: `PassportStamp`, `StampCard`, `StampDetailModal`, `BadgeCard`, `LevelProgressionCard` (recharts radar), `ProgressRing`, `PassportStats`.
- **Leaderboard**: `LeaderboardHeader`, `PodiumCard`, `RankLadderCard`, `StandingsRow`, `PassportStandingCard`, `AtlasBackdrop`.
- **Recipe**: `NutritionLabel` (compact + expanded views).
- **Cards**: `FactFlipCard` (postcard flip), `TechnicalNote`.
- **UI primitives**: `src/components/ui/*` — shadcn/ui set (button, dialog, tabs, tooltip, etc.).

## 7. Data model / state management

Postgres tables (public schema, all with RLS + explicit GRANTs — see migrations in `supabase/migrations/`):

- `hotdogs` — main catalog. Domain fields include slug, name, city, country, region, tags, description, coordinates, image URLs, `recipe_ingredients` / `recipe_steps` / `recipe_meta` (jsonb), full nutrition breakdown, `flavor_profile`, `anatomy`, `origin_timeline`, `pull_quote`, `accent_palette`, `related_slugs`, plus derived `canonical_ingredient_ids` / `canonical_equipment_ids` (text[] with GIN indexes) for pantry matching.
- `user_profiles` — user-facing profile row (email, display_name). Populated by `handle_new_user()` SECURITY DEFINER trigger function.
- `hotdog_stamps` — per-user passport stamps.
- `revealed_facts` — per-user trivia reveal state.
- `sprite_sheets` — reserved / historical (Needs verification for current usage).
- `user_pantry` — per-user `ingredient_ids text[]`, `equipment_ids text[]`.

Notable DB functions (SECURITY DEFINER, `search_path=public`):
- `handle_new_user()` — creates `user_profiles` row.
- `get_leaderboard_data()` — aggregated leaderboard query.
- `generate_unique_display_name()` — "TravelerNNNN" fallback.
- `set_updated_at()` — generic updated_at trigger helper.

Client state:
- **Server state** → React Query hooks (`useHotdogs`, `useHotdogsLight`, `useHotdogDetail`, `usePantry`, `useStamps`, `useVisitedHotdogs`, `useRevealedFacts`, `useTriviaBadges`).
- **Global user state** → `UserProgressContext` (562 lines) centralizes stamps, revealed facts, visits, trivia clicks, migration status.
- **Auth** → `AuthContext` wraps `supabase.auth` (sign in / sign up / sign out, session listener).
- **Local-only**: FTUX flag, anon stamps/pantry in localStorage (see `src/utils/stampStorage.ts`, `src/hooks/usePantry.ts`).

TypeScript types: `src/types/hotdog.ts`, `src/types/passport.ts`, generated `src/integrations/supabase/types.ts`.

## 8. API / backend / integration points

- **Supabase client** singleton: `src/integrations/supabase/client.ts` (auto-generated — do not edit).
- **Edge Functions** in `supabase/functions/`:
  - `mcp/` — MCP JSON-RPC endpoint. **Auto-generated** by `mcpPlugin()` from `src/lib/mcp/**` on every build. Manifest at `.lovable/mcp/manifest.json`. Tools: `list_hotdogs`, `get_hotdog`, `search_hotdogs`. Path: `/functions/v1/mcp`, auth: none.
  - `populate-recipe-metadata/` — async backfill for hotdog recipe metadata (invoked from `/admin/populate-metadata`).
  - `generate-hotdog-sprite/` — sprite generation (historical / Needs verification for current use).
  - `sitemap/` — dynamic sitemap endpoint (companion to the static `public/sitemap.xml`).
- **External**: Google Fonts (Inter, Poppins, Bebas Neue, Caveat, Special Elite) loaded in `index.html`; Google Search Console verification meta present.

## 9. Authentication / permissions

- Email + password auth via `supabase.auth`. Sign-up captures `display_name` in user metadata.
- Sign-out attempts `scope: 'global'`, falls back to `'local'`.
- `handle_new_user` trigger creates the `user_profiles` row.
- **No roles table exists.** All routes are publicly reachable client-side, including `/admin/populate-metadata` — access is soft-gated by obscurity, not by policy. If real admin gating is added, use the `user_roles` + `has_role` SECURITY DEFINER pattern; never store roles on `user_profiles`.
- RLS is enabled on every user-owned table; policies scope to `auth.uid()`. Anonymous progress is kept in localStorage and migrated on sign-in by `UserProgressContext`.

## 10. Styling / design system

- Tokens defined in `src/index.css` under `:root` (HSL). Both **semantic** tokens (`--background`, `--primary`, `--muted`, `--border`, sidebar tokens) and **brand food tokens** (`--ketchup-red`, `--mustard-yellow`, `--bun-beige`, `--sky-blue`, `--leafy-green`, `--midnight-navy`, `--papaya-pink`, `--parchment`, plus editorial: `--paper`, `--paper-edge`, `--ink`, `--stamp-red`, `--sauce-pink`, `--cilantro`).
- `tailwind.config.ts` extends colors from HSL vars, adds `container` centering (2rem padding, 1400px 2xl), `fontFamily` (sans=Inter, heading=Poppins, display=Bebas Neue), and keyframes `bounce-gentle`, `fade-in`, `spin-slow` plus accordion.
- shadcn components in `src/components/ui/` — do not restyle by editing them; theme via CSS variables.
- Dark mode: `darkMode: ["class"]` — infrastructure present; not actively themed. Needs verification if enabled.
- Accent typography: `Caveat` and `Special Elite` (loaded in `index.html`) power the postcard/stamp look — use sparingly.

## 11. Environment variables

Set in `.env` (client-safe values only — Vite exposes anything starting with `VITE_`):

- `VITE_SUPABASE_URL` — Lovable Cloud project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` — publishable/anon key (safe to ship)
- `VITE_SUPABASE_PROJECT_ID` — project identifier

Server-side secrets (managed in Lovable Cloud, **never commit**):

- `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_PUBLISHABLE_KEYS`
- `SUPABASE_SECRET_KEYS`, `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_JWKS`, `SUPABASE_DB_URL`
- `LOVABLE_API_KEY` (Lovable AI Gateway)
- `GOOGLE_SEARCH_CONSOLE_API_KEY` (managed via Connector)

Do not fabricate values or paste secret contents into docs or code.

## 12. Known limitations, bugs, fragile areas

- **Zero automated tests.** Every change is validated by hand.
- **Auto-generated files** (`src/integrations/supabase/client.ts`, `types.ts`, `supabase/functions/mcp/index.ts`) are silently regenerated. Editing them causes churn or is overwritten.
- **No admin gating** on `/admin/populate-metadata` — anyone who guesses the URL can invoke the backfill trigger; the edge function itself is the real trust boundary. Needs verification of function-side checks.
- **Globe rendering** is delicate: `depthTest/Write=false` + `renderOrder=20` + backface culling (dot product of normal and camera) + iterative relaxation with geographic anchor spring force. See `mem://architecture/3d-globe-hotdog-rendering-strategy`. Regressions here are easy.
- **UserProgressContext** is 562 lines and mixes stamps, facts, visits, trivia, and migration. Splitting risks breaking the anon→signed-in migration.
- **FTUX** runs exactly once (localStorage flag). Clearing localStorage or private browsing re-triggers it — expected behaviour, not a bug.
- **Static sitemap** at `public/sitemap.xml` must be maintained manually alongside the `sitemap` edge function.
- **Meta description** hard rule: ≤ 160 chars. `src/utils/seoOverrides.ts` overrides titles/descriptions per slug for CTR.
- **Pantry match** is a strict "own all required" check (optional ingredients excluded from the requirement); pantry filter can show zero matches early — expected.
- Header markup in `index.html` renders a static H1 in `#root` before hydration — do not remove; it provides pre-hydration SEO and initial paint.
- **Node globals** are unavailable in Vite runtime — use `import.meta.env.DEV` and `ReturnType<typeof setTimeout>`.

## 13. Deployment / build notes

- Deployed via Lovable (Publish flow). Custom domains: `hotdog-world.lovable.app` and `hotdog-world.com`.
- `vite build` outputs to `dist/` (default). `public/_headers` and `public/_redirects` are copied through — used by the hosting layer.
- `mcpPlugin()` in `vite.config.ts` regenerates the MCP function on build. Do not remove it or the manifest will drift.
- `componentTagger` from `lovable-tagger` runs only in `mode === "development"` — needed for Lovable's visual editor.
- Dev server: `host: "::"`, `port: 8080` (matches sandbox Playwright expectations).
- Database changes go through `supabase/migrations/*.sql`. Never edit `supabase/config.toml` project-level settings.

## 14. Testing status and gaps

- **Unit tests**: none. No test runner installed.
- **Integration / E2E**: none checked in. Playwright is available in the dev sandbox for ad-hoc verification, not as a suite.
- **Type safety**: TypeScript strict mode is **off** — `tsconfig.app.json` sets `strict: false`, `noImplicitAny: false`, `noUnusedLocals: false`, `noUnusedParameters: false`. Type errors are loose; do not rely on the compiler to catch mistakes.
- **Lint**: `npm run lint` runs ESLint flat config with `typescript-eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`.
- **Manual QA needed** for: globe pin overlap after data changes, FTUX first-run, sign-up → migration path, pantry filter edge cases (0 matches, all matches), passport radar with zero data, offline indicator, error boundary retry.

## 15. Suggested next improvements

1. Add a **test harness** (Vitest + React Testing Library + Playwright) starting with `usePantry` matching logic, `badgeCalculator`, and the anon→user migration in `UserProgressContext`.
2. Introduce a **`user_roles` table + `has_role()`** SECURITY DEFINER function and gate `/admin/*` routes and the `populate-recipe-metadata` edge function on it.
3. **Split `UserProgressContext`** into per-concern providers (stamps, facts, visits, trivia) sharing a migration primitive to reduce the 562-line surface area.
4. Replace the **static `public/sitemap.xml`** with the `sitemap` edge function as the source of truth, and drop the duplicate.
5. **Server-side pantry match** — push canonical-array containment into a Postgres RPC so `/hotdogs` can filter over the network instead of client-side, improving cold-load UX at scale.
6. **Skeletons + Suspense** for the globe and detail hero to smooth the perceived load; consolidate loading states currently spread across hooks.
7. Add a **dark theme pass** — infrastructure exists (`darkMode: "class"`) but no dark token set is authored.
8. **Image pipeline**: standardize on Lovable Assets for hotdog imagery (currently mixed between `/public/anatomy/*.png` and CDN URLs) to shrink repo size.
9. **Analytics**: no analytics library detected — add privacy-respecting telemetry (e.g. Plausible) if product wants funnel metrics.
10. **Docs**: expand this report with a per-hotdog data dictionary once the schema stabilizes.

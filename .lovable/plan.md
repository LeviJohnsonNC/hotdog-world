
# Hot Dog Detail Page Redesign — Bogotá First

Ship the full redesign against the Bogotá Perro Caliente entry only. Other dogs keep the current page until you approve the direction and we expand. New DB columns are nullable, so every other dog stays unaffected.

## Phase 1 — Database

Single migration adding nullable columns to `public.hotdogs`:

- `flavor_profile jsonb` — `{ sweet, salty, crunch, creamy, heat, mess }` each 0–3
- `anatomy jsonb` — `[{ layer, note? }]` ordered bottom→top
- `why_it_works text`
- `origin_timeline jsonb` — `[{ era, title, body, icon? }]`
- `pull_quote text`
- `hero_subtitle text`
- `accent_palette jsonb` — `{ primary, secondary }` as HSL strings (e.g. `"352 100% 74%"`) so they slot into the existing token system
- `related_slugs text[]` — optional manual override; auto-derive by shared `region` + `tags` when null

No RLS changes needed (table is publicly readable, writes denied). Bogotá row backfilled via a follow-up data insert once the migration is approved and types regenerate.

## Phase 2 — Data backfill for Bogotá

Author Bogotá's content using existing fields + light research (Colombian street-food sources, not invented "old tricks"):

- `hero_subtitle` — the punchier subtitle from the brief
- `flavor_profile` — Sweet 2, Salty 2, Crunch 3, Creamy 2, Heat 0, Mess 3
- `anatomy` — 7 layers from the brief (bun → dog → pink sauce → pineapple sauce → cheese → papitas → optional crown)
- `why_it_works` — the pineapple/papitas/mayo sentence from the brief
- `origin_timeline` — 4 eras from the brief, grounded language
- `pull_quote` — "A proper perro is built tall, almost unstable, like a dare."
- `accent_palette` — sauce pink + pineapple yellow, expressed as HSL tokens
- `related_slugs` — Venezuelan Perro Caliente, Sonoran, Completo, Cachorro Quente (only those that exist in DB; verified before write)
- De-dupe and regroup `ingredients` into Base / Sauces / Crunch / Fresh toppings / Optional chaos
- Lightly tighten `method_and_soul` (the memory rule about not modifying it is overridden here because you've explicitly asked for this redesign)

## Phase 3 — Design tokens & shared utilities

Add to `index.css` (HSL only, semantic tokens):

- `--paper`, `--paper-edge`, `--ink`, `--stamp-red`, `--sauce-pink`, `--cilantro`, `--pineapple`, `--brass`
- `--shadow-paper`, `--shadow-stamp`
- Per-page accent overrides applied via inline `style={{ '--accent-1': ..., '--accent-2': ... }}` from `accent_palette`
- Utilities: `.bg-paper` (subtle SVG grain data-URI), `.paper-card`, `.stamp-label`, `.ink-circle` (checkbox skin)

Extend `tailwind.config.ts` with the new color tokens and a `stamp-press` keyframe (scale + slight rotate, gated by `prefers-reduced-motion`).

## Phase 4 — Component split

`HotdogDetail.tsx` becomes a thin shell (route + Helmet/JSON-LD + layout). New components under `src/components/detail/`:

- `HeroSection` — full-bleed image, stronger bottom gradient, visa-sticker location pill, balanced display type, metadata chip row (from `tags` + `region` + city; no fabricated values)
- `StickyPassportBar` (desktop) — appears after hero scrolls off; Back to Map · name+city · trivia progress · Stamp button
- `MobileActionBar` — sticky bottom Back + Stamp
- `FlavorProfileCard` — meter bars colored from accent tokens (renders only if `flavor_profile` present)
- `AnatomySection` — vertical layered stack with numbered callouts + `why_it_works` margin note (renders only if `anatomy` present)
- `BuildSection` — keeps SEO-visible `<h2>Recipe</h2>`, displays "The Bogotá Build" as the styled stamp label; ink-circle checkboxes (still real Radix `Checkbox` for a11y); grouped ingredients; nutrition rendered as a small "Approx. per dog" receipt sticker in a sidebar slot
- `InstructionsSection` — numbered step cards, two columns on desktop, technique tips as margin notes
- `MethodAndSoulSection` — editorial card, vertical cilantro/mustard accent stripe, large pull quote from `pull_quote` (fallback: first sentence of `method_and_soul`)
- `TriviaSection` — restyles `FactFlipCard` as collectible postcards with "Discovered" stamp on reveal; stamp-trail progress replaces `<Progress>`; completion fires existing `useTriviaBadges` pipeline (no new per-city badge)
- `OriginTimelineSection` — vertical timeline using existing `.timeline-dot` styles, one entry per era from `origin_timeline` (falls back to the current prose block if null)
- `ExploreMoreCTA` — bottom card with Stamp passport (re-trigger), Spin the globe (links `/`), and 3 related dog cards from `related_slugs` (or auto-derived by region+tags)

Desktop layout: editorial two-column at `lg+` inside `max-w-[1140px]`. Tablet/mobile: single column with strong section separation. Existing floating round Back button and floating PassportStamp are removed in favor of the new bars.

## Phase 5 — Interaction polish

- Stamp button: brass styling, press animation, existing toast preserved
- Card flip: keep current 3D flip, add "Discovered" stamp overlay on reveal
- Hover lift only on interactive cards
- All animations gated by `prefers-reduced-motion`

## Phase 6 — QA

- Recipe + BreadcrumbList JSON-LD unchanged; verify against Rich Results Test
- Confirm non-Bogotá dogs render unchanged (sections gracefully hide when new fields are null)
- Check mobile (sticky bar doesn't overlap final card), tablet single column, desktop two column

## Technical notes

- Order of operations: (a) approve migration → (b) types regenerate → (c) data insert for Bogotá + verify related slugs → (d) build components against typed fields. Components reading new fields handle `null` so the page works before the data insert lands.
- No hardcoded hex in components. Per-dog accents flow through `accent_palette` HSL strings written into a CSS variable scope on the page root.
- Bogotá-only scoping: every new section component checks the relevant field for null and hides itself otherwise — no slug gating, so when you backfill the next dog it automatically lights up.

## Open question for after you approve

Once you've reviewed Bogotá, I'll need a quick rubric from you for expanding: how grounded vs. playful you want the timeline copy, and whether you'd like me to draft batches of (flavor_profile + anatomy + timeline + pull_quote) for the next ~5 dogs for your review, or do them one-by-one.

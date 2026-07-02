## My take on the critique

**Strongly agree**
- Voice/labels: renaming ratings ("Napkin Risk", "Local Oddness"), "The Damage" nutrition, more evocative hero subtitles, and provenance labels (vendor lore / home version / canonical / disputed) — these are the highest-leverage changes and cost almost nothing.
- Sticky navy nav feels like admin chrome. A quieter "passport strip" fits the tone better.
- Nutrition should collapse — it's tonally the biggest offender right now.
- "Method & Soul" deserves more authority via labeled micro-blocks (Field Note / The Move / Local Warning).
- Anatomy reading 6→1 is confusing. A layered stack diagram is the right long-term move.
- Trivia cards look flat. Postcard/stamp treatment is a real delight opportunity.
- Related dogs need curation reasons ("spiced sausage energy" etc.).
- Fix data bugs (missing "ml water" amount) — these silently kill the craft feeling.

**Partially agree**
- Handwritten margin notes, grease spots, paper scuffs: yes, but *very* restrained. Easy to slide into kitsch. I'd budget ~2–3 motifs per page, not a scrapbook.
- Canonical vs home-cook recipe modes: great idea but a big content lift across 50 dogs. Worth it, but phase it after the visual/voice pass so we're not blocked on writing.
- Reducing hero overlay: agree in principle, but some dogs have busy photos; needs a per-image contrast check, not a blanket change.

**Disagree / push back**
- Dropping to 4 flavor axes. We just finished populating 6 across 50 dogs and the 6 read cleanly. I'd **rename** rather than **remove** — keep the data, change the labels.
- Imperfect card rotations: risky at scale, hurts scanability on mobile. Skip.
- Sound on trivia flip: adds friction, autoplay policies bite. Skip.

**What "great" looks like as a first step (Phase 1, Seattle pilot only)**

Focus: voice + chrome + nutrition + trivia. No schema changes, no per-dog content writing beyond Seattle.

1. **Rename the 6 flavor axes** in `FlavorProfileCard` labels only (data unchanged):
   Mess Factor → Napkin Risk, Regional Distinctiveness → Local Oddness, Boldness → Swagger, Heat/Crunch/Sauce Load unchanged. Add small "low / medium / dangerous" tick labels.
2. **"The Damage" nutrition module**: collapse the full nutrition card into a one-line summary (cal · fat · protein) with a "Show full label" expander. Keep JSON-LD nutrition markup intact for SEO.
3. **Passport strip header**: replace the navy sticky bar with a lighter paper-toned strip: `← Atlas` · dog name · city · `n/6 field notes` · Stamp. Same behavior, quieter visual weight.
4. **Method & Soul micro-labels**: split the section into up to 3 labeled cards driven by existing copy (Field Note / The Move / Why It Works). If a dog only has one block, we render one — no empty states.
5. **Trivia as postcards**: restyle `TriviaPostcards` cards as postcard-backs (perforated edge, stamp corner, "tap to flip" affordance, subtle flip animation). Content unchanged.
6. **Curated related-dog captions**: add a one-line "why this one" caption under each related card. For the pilot, hand-write Seattle's 3; for other dogs, fall back to city/region text until Phase 3.
7. **Content bug sweep on Seattle**: fix the missing water amount and any other blank quantities/steps on the pilot page.
8. **Hero subtitle rewrite for Seattle only**: use `hero_subtitle` field we already have; no new field needed.

Explicitly **not** in Phase 1: anatomy diagram redesign, provenance-tagged origin story, canonical-vs-home recipe modes, map/neighbourhood module, applying anything to the other 49 dogs.

## Phased roadmap after approval

- **Phase 2 — Anatomy + Origin provenance**: turn Anatomy into a layered stack diagram; add provenance tags (vendor lore / canonical / disputed) to `origin_timeline` entries. Pilot on Seattle, then batch-migrate.
- **Phase 3 — Recipe dual-mode**: add `recipe_variant` (canonical vs home) to `recipe_steps`; UI toggle in `BuildRail`. Author Seattle first, then generate for the rest.
- **Phase 4 — Field-guide polish pass**: paper textures per section, controlled "artifact" details (ticket-stub Stamp CTA, map coord line in hero), curated related-dog captions for all 50.

## Technical notes (safe to skip)

- Files touched in Phase 1: `FlavorProfileCard.tsx`, new `NutritionDamage.tsx` replacing current nutrition placement in `EditorialDetailView.tsx`, `StickyPassportBar.tsx`, `MethodAndSoulSection.tsx`, `TriviaPostcards.tsx`, `ExploreMoreCTA.tsx`, plus Seattle-only DB update for hero subtitle + ingredient fix.
- No migrations, no edge functions, no image work.
- Keep existing Recipe/Nutrition JSON-LD so SEO is unaffected.

Approve Phase 1 and I'll ship it against Seattle so you can react before we roll to the other 49.

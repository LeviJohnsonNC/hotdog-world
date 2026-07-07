## Goal

The Pantry lists items like "Grilled onions & peppers", "Mashed potatoes", "Egg wash", "Beef chili", "Pulled pork" — these aren't raw ingredients you'd stock, they're prep steps. Remove them from the pantry UI and satisfy them automatically when the user owns the raw components (plus the required cooking equipment).

Shelf-stable "prep" items (crispy fried onions, roasted red peppers, coleslaw, pickled cabbage/cucumber, sauerkraut, remoulade, etc.) stay as-is — those are commonly bought jarred/canned.

## Items to convert to derived (prep → raws)

| Prep ID | Derived from |
|---|---|
| `grilled_onions_and_peppers` | `yellow_onion` + `bell_pepper` + equipment `grill` or `skillet` |
| `mashed_potatoes` | `potato` + equipment `saucepan` or `large_pot` |
| `eggwash` | `egg` |
| `beef_chili` | `beef` + `canned_tomatoes` + `chili_powder` + equipment `saucepan` or `skillet` |
| `pulled_pork` | (no raw pork in taxonomy) — treat as always-derived from equipment `oven` or `large_pot` + at least one protein owned → **safer**: leave as pantry item for now, flag in report |

For `pulled_pork` there's no raw pork ingredient in the taxonomy, so it can't cleanly derive. I'll leave it in the pantry (it's a one-off) and note it — happy to add a `pork_shoulder` raw ingredient if you'd rather.

## Implementation

### 1. `src/data/pantryTaxonomy.ts`
- Remove the 4 derivable entries (`grilled_onions_and_peppers`, `mashed_potatoes`, `eggwash`, `beef_chili`) from the exported `INGREDIENTS` array so they disappear from Pantry UI.
- Add a new export:
  ```ts
  export const DERIVED_INGREDIENTS: Record<string, { ingredients: string[]; equipmentAny?: string[] }> = {
    grilled_onions_and_peppers: { ingredients: ["yellow_onion","bell_pepper"], equipmentAny: ["grill","skillet","grill_pan"] },
    mashed_potatoes:            { ingredients: ["potato"],                       equipmentAny: ["saucepan","large_pot"] },
    eggwash:                    { ingredients: ["egg"] },
    beef_chili:                 { ingredients: ["beef","canned_tomatoes","chili_powder"], equipmentAny: ["saucepan","skillet","large_pot"] },
  };
  ```

### 2. `src/hooks/usePantry.ts`
Update `canMakeHotdog` and `missingCount` so that when a hotdog requires a derived ID, it counts as owned if all its raw ingredients are owned AND at least one item from `equipmentAny` is owned. Missing raw pieces bubble up into `missingIngredients` under the derived label (so the UI still tells the user *why* they can't make it).

No schema/DB changes — hotdogs keep their existing `canonical_ingredient_ids`; we just reinterpret a small allow-list of them client-side.

### 3. Cleanup pass
- If a user already saved one of the 4 removed IDs in their pantry (localStorage or `user_pantry.ingredient_ids`), it's harmless — the ID just no longer appears in the UI. No migration needed.

## Not doing

- Not touching hotdog recipe data (`canonical_ingredient_ids` on hotdogs stays untouched).
- Not touching the recipe display in `BuildSection` — the recipe still shows "grilled onions & peppers" as written; only the pantry checklist is simplified.
- Not touching shelf-stable prep (crispy fried onions, roasted red peppers, coleslaw, pickles, sauerkraut, remoulade, etc.) per your "pragmatic" choice.

## Verification

- Run `npm run build` after the change.
- Manually open `/pantry` and confirm the 4 items are gone.
- Open a hotdog that uses e.g. `grilled_onions_and_peppers` (Sonora / Danger Dog) and confirm that owning `yellow_onion` + `bell_pepper` + a grill/skillet marks it as makeable.

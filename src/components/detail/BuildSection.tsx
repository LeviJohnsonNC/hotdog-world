import { useState } from "react";
import { Hotdog } from "@/types/hotdog";
import { Checkbox } from "@/components/ui/checkbox";
import { NutritionLabel } from "@/components/recipe/NutritionLabel";

interface Props {
  hotdog: Hotdog;
  cityBuildLabel?: string;
}

// Map structured ingredient group keys → editorial group names
const GROUP_LABELS: Record<string, string> = {
  hotdog_and_bun: "Base",
  base: "Base",
  sauces: "Sauces",
  toppings: "Toppings",
  crunch: "Crunch",
  fresh: "Fresh toppings",
  optional: "Optional chaos",
};

const SAUCE_HINTS = ["sauce", "mayo", "ketchup", "mustard", "guacamole", "salsa", "aji"];
const CRUNCH_HINTS = ["papitas", "potato", "chip", "shoestring", "bacon", "crisp"];
const FRESH_HINTS = ["lettuce", "tomato", "onion", "cabbage", "cilantro", "egg"];
const OPTIONAL_HINTS = ["optional", "quail", "avocado"];

function regroupFlat(items: string[]) {
  const groups: Record<string, string[]> = {
    Base: [],
    Sauces: [],
    Crunch: [],
    "Fresh toppings": [],
    "Optional chaos": [],
  };
  const seen = new Set<string>();
  items.forEach((raw) => {
    const item = raw.trim();
    const key = item.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    if (OPTIONAL_HINTS.some((h) => key.includes(h))) groups["Optional chaos"].push(item);
    else if (SAUCE_HINTS.some((h) => key.includes(h))) groups.Sauces.push(item);
    else if (CRUNCH_HINTS.some((h) => key.includes(h))) groups.Crunch.push(item);
    else if (FRESH_HINTS.some((h) => key.includes(h))) groups["Fresh toppings"].push(item);
    else groups.Base.push(item);
  });
  return groups;
}

export function BuildSection({ hotdog, cityBuildLabel }: Props) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  // Build groups from whatever structure exists
  let groups: Record<string, string[]>;
  if (
    hotdog.ingredients &&
    typeof hotdog.ingredients === "object" &&
    !Array.isArray(hotdog.ingredients)
  ) {
    const data = hotdog.ingredients as Record<string, string[]>;
    // Flatten all and regroup editorially for cohesion
    const flat = Object.values(data).flat();
    groups = regroupFlat(flat);
  } else {
    groups = regroupFlat((hotdog.ingredients as string[]) || []);
  }

  const groupNames = Object.keys(groups).filter((g) => groups[g].length > 0);

  return (
    <section className="paper-card p-6 md:p-10">
      {/* SEO-visible H2 (visually hidden) preserved for Recipe rich-results */}
      <h2 className="sr-only">Recipe</h2>

      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="stamp-label">{cityBuildLabel || `The ${hotdog.city} Build`}</div>
        <span className="text-[11px] uppercase tracking-[0.18em] text-[hsl(var(--ink))]/60">
          Vendor recipe
        </span>
      </div>

      <div className="grid md:grid-cols-[1fr_220px] gap-8">
        <div className="space-y-6">
          {groupNames.map((name) => (
            <div key={name}>
              <div className="text-[11px] uppercase tracking-[0.18em] font-bold text-[hsl(var(--accent-2))] mb-3">
                {name}
              </div>
              <ul className="space-y-2.5">
                {groups[name].map((item, i) => {
                  const k = `${name}-${i}`;
                  const isChecked = !!checked[k];
                  return (
                    <li key={k} className="flex items-start gap-3 group">
                      <Checkbox
                        id={`build-${k}`}
                        checked={isChecked}
                        onCheckedChange={(v) =>
                          setChecked((p) => ({ ...p, [k]: v as boolean }))
                        }
                        className="mt-1 h-5 w-5 rounded-full border-2 border-[hsl(var(--ink))]/70 data-[state=checked]:bg-[hsl(var(--stamp-red))] data-[state=checked]:border-[hsl(var(--stamp-red))]"
                      />
                      <label
                        htmlFor={`build-${k}`}
                        className={`text-base leading-relaxed cursor-pointer transition-all ${
                          isChecked
                            ? "line-through opacity-50 text-[hsl(var(--ink))]/60"
                            : "text-[hsl(var(--ink))]/90"
                        }`}
                      >
                        {item}
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Receipt-style nutrition sidebar */}
        {hotdog.calories != null && (
          <aside
            className="rounded-md p-4 border border-dashed self-start"
            style={{
              borderColor: "hsl(var(--ink) / 0.3)",
              background: "hsl(var(--paper))",
            }}
          >
            <div className="text-[10px] uppercase tracking-[0.22em] text-[hsl(var(--ink))]/60 mb-2 text-center">
              Approx. per dog
            </div>
            <NutritionLabel
              calories={hotdog.calories}
              fat_total_g={hotdog.fat_total_g}
              fat_saturated_g={hotdog.fat_saturated_g}
              fat_trans_g={hotdog.fat_trans_g}
              carbs_total_g={hotdog.carbs_total_g}
              carbs_fiber_g={hotdog.carbs_fiber_g}
              carbs_sugars_g={hotdog.carbs_sugars_g}
              protein_g={hotdog.protein_g}
              sodium_mg={hotdog.sodium_mg}
              cholesterol_mg={hotdog.cholesterol_mg}
            />
          </aside>
        )}
      </div>
    </section>
  );
}

import { useMemo, useState } from "react";
import { Hotdog } from "@/types/hotdog";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Copy, Printer, Check } from "lucide-react";
import { toast } from "sonner";

interface Props {
  hotdog: Hotdog;
}

const SCALES = [1, 2, 4] as const;
type Scale = (typeof SCALES)[number];

// Nicely formats scaled quantities: whole numbers when possible, ½ ¼ ¾ for common fractions
function formatQty(qty: number): string {
  if (!isFinite(qty)) return "";
  const rounded = Math.round(qty * 100) / 100;
  if (Number.isInteger(rounded)) return String(rounded);
  const whole = Math.floor(rounded);
  const frac = rounded - whole;
  const fracMap: Array<[number, string]> = [
    [0.125, "⅛"],
    [0.25, "¼"],
    [0.333, "⅓"],
    [0.5, "½"],
    [0.666, "⅔"],
    [0.75, "¾"],
    [0.875, "⅞"],
  ];
  const nearest = fracMap.reduce((best, cur) =>
    Math.abs(cur[0] - frac) < Math.abs(best[0] - frac) ? cur : best
  );
  if (Math.abs(nearest[0] - frac) < 0.06) {
    return whole > 0 ? `${whole} ${nearest[1]}` : nearest[1];
  }
  return rounded.toFixed(1).replace(/\.0$/, "");
}

function scaledLine(
  ing: NonNullable<Hotdog["recipe_ingredients"]>[number],
  scale: Scale
): string {
  const parts: string[] = [];
  if (ing.qty != null) {
    parts.push(formatQty(ing.qty * scale));
  }
  if (ing.unit) parts.push(ing.unit);
  parts.push(ing.name);
  return parts.filter(Boolean).join(" ");
}

export function BuildRail({ hotdog }: Props) {
  const [scale, setScale] = useState<Scale>(1);
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const meta = hotdog.recipe_meta;
  const ingredients = hotdog.recipe_ingredients || [];

  const grouped = useMemo(() => {
    const groups: Record<string, typeof ingredients> = {};
    ingredients.forEach((ing) => {
      const g = ing.group || "Ingredients";
      if (!groups[g]) groups[g] = [];
      groups[g].push(ing);
    });
    return groups;
  }, [ingredients]);

  const totalMin =
    (meta?.prep_min ?? 0) + (meta?.cook_min ?? 0) + (meta?.rest_min ?? 0);

  const servings = (meta?.servings ?? 1) * scale;

  const copyShoppingList = async () => {
    const lines = ingredients
      .map((ing) => `• ${scaledLine(ing, scale)}${ing.note ? ` (${ing.note})` : ""}`)
      .join("\n");
    const text = `${hotdog.name} shopping list (serves ${servings})\n\n${lines}`;
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Shopping list copied");
    } catch {
      toast.error("Couldn't copy, try again");
    }
  };

  return (
    <aside className="paper-card p-5 md:p-6 lg:sticky lg:top-24 lg:self-start">
      <h2 className="sr-only">Recipe</h2>

      {/* Header */}
      <div className="flex items-baseline justify-between gap-3 mb-1">
        <div className="stamp-label">The {hotdog.city} Build</div>
        <span className="text-[10px] uppercase tracking-[0.18em] text-[hsl(var(--ink))]/60">
          Vendor recipe
        </span>
      </div>
      <h2 className="font-heading text-2xl md:text-[26px] leading-tight text-[hsl(var(--ink))]">
        Shop &amp; prep
      </h2>

      {/* Meta strip */}
      {meta && (
        <dl className="mt-4 grid grid-cols-4 gap-2 text-center border-y border-dashed border-[hsl(var(--paper-edge))]/70 py-3">
          <div>
            <dt className="text-[9px] uppercase tracking-widest text-[hsl(var(--ink))]/55">
              Serves
            </dt>
            <dd className="font-heading text-lg text-[hsl(var(--ink))]">
              {servings}
            </dd>
          </div>
          <div>
            <dt className="text-[9px] uppercase tracking-widest text-[hsl(var(--ink))]/55">
              Prep
            </dt>
            <dd className="font-heading text-lg text-[hsl(var(--ink))]">
              {meta.prep_min ?? "—"}
              <span className="text-[10px] font-body ml-0.5">min</span>
            </dd>
          </div>
          <div>
            <dt className="text-[9px] uppercase tracking-widest text-[hsl(var(--ink))]/55">
              Cook
            </dt>
            <dd className="font-heading text-lg text-[hsl(var(--ink))]">
              {meta.cook_min ?? "—"}
              <span className="text-[10px] font-body ml-0.5">min</span>
            </dd>
          </div>
          <div>
            <dt className="text-[9px] uppercase tracking-widest text-[hsl(var(--ink))]/55">
              Total
            </dt>
            <dd className="font-heading text-lg text-[hsl(var(--ink))]">
              {totalMin || "—"}
              <span className="text-[10px] font-body ml-0.5">min</span>
            </dd>
          </div>
        </dl>
      )}

      {meta?.difficulty && (
        <div className="mt-3 text-[11px] uppercase tracking-[0.18em] text-[hsl(var(--ink))]/60">
          Difficulty ·{" "}
          <span className="text-[hsl(var(--accent-2))] font-bold">
            {meta.difficulty}
          </span>
        </div>
      )}

      {/* Servings scaler */}
      <div className="mt-4">
        <div className="text-[10px] uppercase tracking-[0.18em] text-[hsl(var(--ink))]/55 mb-1.5">
          Scale batch
        </div>
        <div
          role="tablist"
          aria-label="Scale servings"
          className="inline-flex rounded-full border border-[hsl(var(--ink))]/25 overflow-hidden"
        >
          {SCALES.map((s) => (
            <button
              key={s}
              role="tab"
              aria-selected={scale === s}
              onClick={() => setScale(s)}
              className={`px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                scale === s
                  ? "bg-[hsl(var(--stamp-red))] text-white"
                  : "text-[hsl(var(--ink))]/70 hover:bg-[hsl(var(--ink))]/5"
              }`}
            >
              {s}×
            </button>
          ))}
        </div>
      </div>

      {/* Ingredients */}
      <div className="mt-6 space-y-5">
        {Object.entries(grouped).map(([groupName, items]) => (
          <div key={groupName}>
            <div className="text-[11px] uppercase tracking-[0.18em] font-bold text-[hsl(var(--accent-2))] mb-2">
              {groupName}
            </div>
            <ul className="space-y-2">
              {items.map((ing) => {
                const k = ing.id;
                const isChecked = !!checked[k];
                return (
                  <li key={k} className="flex items-start gap-2.5">
                    <Checkbox
                      id={`ing-${k}`}
                      checked={isChecked}
                      onCheckedChange={(v) =>
                        setChecked((p) => ({ ...p, [k]: v as boolean }))
                      }
                      className="mt-1 h-4 w-4 rounded-sm border-2 border-[hsl(var(--ink))]/60 data-[state=checked]:bg-[hsl(var(--stamp-red))] data-[state=checked]:border-[hsl(var(--stamp-red))]"
                    />
                    <label
                      htmlFor={`ing-${k}`}
                      className={`text-sm leading-snug cursor-pointer ${
                        isChecked
                          ? "line-through opacity-50"
                          : "text-[hsl(var(--ink))]/90"
                      }`}
                    >
                      <span className="font-semibold">
                        {scaledLine(ing, scale)}
                      </span>
                      {ing.optional && (
                        <span className="ml-1.5 text-[10px] uppercase tracking-wider text-[hsl(var(--ink))]/50">
                          optional
                        </span>
                      )}
                      {ing.note && (
                        <span className="block text-[11px] text-[hsl(var(--ink))]/55 italic mt-0.5">
                          {ing.note}
                        </span>
                      )}
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Equipment */}
      {meta?.equipment && meta.equipment.length > 0 && (
        <div className="mt-6 pt-5 border-t border-dashed border-[hsl(var(--paper-edge))]/70">
          <div className="text-[11px] uppercase tracking-[0.18em] font-bold text-[hsl(var(--accent-2))] mb-2">
            Equipment
          </div>
          <ul className="grid grid-cols-1 gap-1.5">
            {meta.equipment.map((e) => (
              <li
                key={e}
                className="flex items-start gap-2 text-xs text-[hsl(var(--ink))]/75"
              >
                <Check className="h-3 w-3 mt-0.5 shrink-0 text-[hsl(var(--ink))]/40" />
                <span>{e}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="mt-6 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-xs"
          onClick={copyShoppingList}
        >
          <Copy className="h-3.5 w-3.5 mr-1.5" />
          Copy list
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-xs"
          onClick={() => window.print()}
        >
          <Printer className="h-3.5 w-3.5 mr-1.5" />
          Print
        </Button>
      </div>
    </aside>
  );
}

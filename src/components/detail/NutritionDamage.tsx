import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FullNutritionFacts } from "@/components/recipe/NutritionLabel";
import { Hotdog } from "@/types/hotdog";

interface Props {
  hotdog: Hotdog;
}

export function NutritionDamage({ hotdog }: Props) {
  const [open, setOpen] = useState(false);
  if (hotdog.calories == null) return null;

  const bits: string[] = [];
  bits.push(`${hotdog.calories} cal`);
  if (hotdog.fat_total_g != null) bits.push(`${hotdog.fat_total_g}g fat`);
  if (hotdog.protein_g != null) bits.push(`${hotdog.protein_g}g protein`);
  if (hotdog.carbs_total_g != null) bits.push(`${hotdog.carbs_total_g}g carbs`);

  return (
    <section className="paper-card px-5 py-4 md:px-6 md:py-4 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-baseline gap-4 flex-wrap">
        <span className="stamp-label">The Damage</span>
        <span className="font-mono text-sm md:text-base text-[hsl(var(--ink))]/80">
          {bits.join(" · ")}
        </span>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button className="text-[11px] uppercase tracking-[0.18em] underline underline-offset-4 text-[hsl(var(--ink))]/70 hover:text-[hsl(var(--ink))]">
            Show full label
          </button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nutrition Facts</DialogTitle>
          </DialogHeader>
          <FullNutritionFacts
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
        </DialogContent>
      </Dialog>
    </section>
  );
}

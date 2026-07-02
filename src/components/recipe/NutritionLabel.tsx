import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface NutritionLabelProps {
  calories?: number;
  fat_total_g?: number;
  fat_saturated_g?: number;
  fat_trans_g?: number;
  carbs_total_g?: number;
  carbs_fiber_g?: number;
  carbs_sugars_g?: number;
  protein_g?: number;
  sodium_mg?: number;
  cholesterol_mg?: number;
}

export function NutritionLabel(props: NutritionLabelProps) {
  // Only render if we have nutrition data
  if (!props.calories && !props.fat_total_g && !props.carbs_total_g && !props.protein_g) {
    return null;
  }

  // Calculate daily value percentages (based on 2000 calorie diet)
  const dailyValues = {
    fat: props.fat_total_g ? Math.round((props.fat_total_g / 78) * 100) : 0,
    saturatedFat: props.fat_saturated_g ? Math.round((props.fat_saturated_g / 20) * 100) : 0,
    cholesterol: props.cholesterol_mg ? Math.round((props.cholesterol_mg / 300) * 100) : 0,
    sodium: props.sodium_mg ? Math.round((props.sodium_mg / 2300) * 100) : 0,
    carbs: props.carbs_total_g ? Math.round((props.carbs_total_g / 275) * 100) : 0,
    fiber: props.carbs_fiber_g ? Math.round((props.carbs_fiber_g / 28) * 100) : 0,
    protein: props.protein_g ? Math.round((props.protein_g / 50) * 100) : 0,
  };

  return (
    <Card className="border border-border/50">
      <CardContent className="p-4">
        {/* Compact horizontal view */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-px flex-1 bg-border/50" />
            <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase whitespace-nowrap">
              Nutrition Facts (Per Hot Dog)
            </h3>
            <div className="h-px flex-1 bg-border/50" />
          </div>

          <div className="flex items-center justify-center gap-3 text-sm">
            <span className="font-semibold">
              {props.calories || 0} <span className="text-xs uppercase tracking-wider text-muted-foreground">Calories</span>
            </span>
            <span className="text-border">|</span>
            <span className="font-semibold">
              {props.fat_total_g || 0}g <span className="text-xs uppercase tracking-wider text-muted-foreground">Fat</span>
            </span>
            <span className="text-border">|</span>
            <span className="font-semibold">
              {props.carbs_total_g || 0}g <span className="text-xs uppercase tracking-wider text-muted-foreground">Carbs</span>
            </span>
            <span className="text-border">|</span>
            <span className="font-semibold">
              {props.protein_g || 0}g <span className="text-xs uppercase tracking-wider text-muted-foreground">Protein</span>
            </span>
          </div>
        </div>

        {/* Dialog with full nutrition details */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full mt-4" size="sm">
              Show Full Nutrition Label
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Nutrition Facts</DialogTitle>
            </DialogHeader>
            <FullNutritionFacts {...props} />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

export function FullNutritionFacts(props: NutritionLabelProps) {
  const dailyValues = {
    fat: props.fat_total_g ? Math.round((props.fat_total_g / 78) * 100) : 0,
    saturatedFat: props.fat_saturated_g ? Math.round((props.fat_saturated_g / 20) * 100) : 0,
    cholesterol: props.cholesterol_mg ? Math.round((props.cholesterol_mg / 300) * 100) : 0,
    sodium: props.sodium_mg ? Math.round((props.sodium_mg / 2300) * 100) : 0,
    carbs: props.carbs_total_g ? Math.round((props.carbs_total_g / 275) * 100) : 0,
    fiber: props.carbs_fiber_g ? Math.round((props.carbs_fiber_g / 28) * 100) : 0,
    protein: props.protein_g ? Math.round((props.protein_g / 50) * 100) : 0,
  };

  return (
    <div className="space-y-2 max-h-[70vh] overflow-y-auto">
      <div className="border-b-8 border-foreground pb-1">
        <h3 className="text-3xl font-bold">Nutrition Facts</h3>
        <p className="text-sm">Per hot dog</p>
      </div>

      <div className="border-b-4 border-foreground py-2">
        <div className="flex justify-between items-end">
          <span className="text-sm font-semibold">Calories</span>
          <span className="text-4xl font-bold">{props.calories || 0}</span>
        </div>
      </div>

      <div className="border-b border-foreground pt-1">
        <div className="text-xs text-right font-bold">% Daily Value*</div>
      </div>

      <div className="flex justify-between border-b border-muted py-1">
        <span className="font-semibold">
          <span className="font-bold">Total Fat</span> {props.fat_total_g || 0}g
        </span>
        <span className="font-bold">{dailyValues.fat}%</span>
      </div>

      {props.fat_saturated_g != null && (
        <div className="flex justify-between border-b border-muted py-1 pl-4">
          <span>Saturated Fat {props.fat_saturated_g}g</span>
          <span className="font-bold">{dailyValues.saturatedFat}%</span>
        </div>
      )}

      {props.fat_trans_g != null && (
        <div className="border-b border-muted py-1 pl-4">
          <span className="italic">Trans Fat {props.fat_trans_g}g</span>
        </div>
      )}

      {props.cholesterol_mg != null && (
        <div className="flex justify-between border-b border-muted py-1">
          <span><span className="font-bold">Cholesterol</span> {props.cholesterol_mg}mg</span>
          <span className="font-bold">{dailyValues.cholesterol}%</span>
        </div>
      )}

      {props.sodium_mg != null && (
        <div className="flex justify-between border-b border-muted py-1">
          <span><span className="font-bold">Sodium</span> {props.sodium_mg}mg</span>
          <span className="font-bold">{dailyValues.sodium}%</span>
        </div>
      )}

      <div className="flex justify-between border-b border-muted py-1">
        <span><span className="font-bold">Total Carbohydrate</span> {props.carbs_total_g || 0}g</span>
        <span className="font-bold">{dailyValues.carbs}%</span>
      </div>

      {props.carbs_fiber_g != null && (
        <div className="flex justify-between border-b border-muted py-1 pl-4">
          <span>Dietary Fiber {props.carbs_fiber_g}g</span>
          <span className="font-bold">{dailyValues.fiber}%</span>
        </div>
      )}

      {props.carbs_sugars_g != null && (
        <div className="border-b border-muted py-1 pl-4">
          <span>Total Sugars {props.carbs_sugars_g}g</span>
        </div>
      )}

      <div className="flex justify-between border-b-8 border-foreground py-1">
        <span><span className="font-bold">Protein</span> {props.protein_g || 0}g</span>
        <span className="font-bold">{dailyValues.protein}%</span>
      </div>

      <div className="pt-2 text-xs">
        <p>* The % Daily Value tells you how much a nutrient in a serving of food contributes to a daily diet. 2,000 calories a day is used for general nutrition advice.</p>
      </div>
    </div>
  );
}

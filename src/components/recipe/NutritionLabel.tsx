import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

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

export function NutritionLabel({
  calories,
  fat_total_g,
  fat_saturated_g,
  fat_trans_g,
  carbs_total_g,
  carbs_fiber_g,
  carbs_sugars_g,
  protein_g,
  sodium_mg,
  cholesterol_mg,
}: NutritionLabelProps) {
  const [isOpen, setIsOpen] = useState(false);

  // If no nutrition data available, don't render
  if (!calories && !fat_total_g && !carbs_total_g && !protein_g) {
    return null;
  }

  return (
    <Card className="p-4 bg-background border-2">
      <div className="space-y-2">
        <div className="border-b-8 border-foreground pb-1">
          <h3 className="text-2xl font-bold">Nutrition Facts</h3>
          <p className="text-sm">Per hot dog</p>
        </div>

        <Separator className="bg-foreground h-[2px]" />

        {calories !== undefined && (
          <>
            <div className="flex justify-between items-end py-1">
              <span className="font-bold text-3xl">Calories</span>
              <span className="font-bold text-4xl">{Math.round(calories)}</span>
            </div>
            <Separator className="bg-foreground h-[6px]" />
          </>
        )}

        <div className="text-xs text-right font-semibold pb-1">% Daily Value*</div>

        <div className="space-y-1 text-sm">
          {fat_total_g !== undefined && (
            <>
              <div className="flex justify-between border-t border-foreground/20 pt-1">
                <span className="font-bold">Total Fat</span>
                <span className="font-bold">{fat_total_g}g</span>
              </div>
              {fat_saturated_g !== undefined && (
                <div className="flex justify-between pl-4 text-foreground/90">
                  <span>Saturated Fat</span>
                  <span>{fat_saturated_g}g</span>
                </div>
              )}
              {fat_trans_g !== undefined && (
                <div className="flex justify-between pl-4 text-foreground/90 italic">
                  <span>Trans Fat</span>
                  <span>{fat_trans_g}g</span>
                </div>
              )}
            </>
          )}

          {cholesterol_mg !== undefined && (
            <div className="flex justify-between border-t border-foreground/20 pt-1 font-bold">
              <span>Cholesterol</span>
              <span>{cholesterol_mg}mg</span>
            </div>
          )}

          {sodium_mg !== undefined && (
            <div className="flex justify-between border-t border-foreground/20 pt-1 font-bold">
              <span>Sodium</span>
              <span>{sodium_mg}mg</span>
            </div>
          )}

          {carbs_total_g !== undefined && (
            <>
              <div className="flex justify-between border-t border-foreground/20 pt-1 font-bold">
                <span>Total Carbohydrate</span>
                <span>{carbs_total_g}g</span>
              </div>
              {carbs_fiber_g !== undefined && (
                <div className="flex justify-between pl-4 text-foreground/90">
                  <span>Dietary Fiber</span>
                  <span>{carbs_fiber_g}g</span>
                </div>
              )}
              {carbs_sugars_g !== undefined && (
                <div className="flex justify-between pl-4 text-foreground/90">
                  <span>Total Sugars</span>
                  <span>{carbs_sugars_g}g</span>
                </div>
              )}
            </>
          )}

          {protein_g !== undefined && (
            <div className="flex justify-between border-t-8 border-foreground pt-1 font-bold">
              <span>Protein</span>
              <span>{protein_g}g</span>
            </div>
          )}
        </div>

        <Separator className="bg-foreground h-[6px] mt-2" />

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="link" className="w-full text-xs p-0 h-auto font-semibold">
              Show Full Nutrition Label →
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Complete Nutrition Information</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Card className="p-4 bg-background border-2">
                <div className="space-y-2 text-sm">
                  <div className="border-b-8 border-foreground pb-2">
                    <h3 className="text-2xl font-bold">Nutrition Facts</h3>
                    <p className="text-sm">Per hot dog</p>
                  </div>

                  {calories !== undefined && (
                    <>
                      <div className="flex justify-between items-end py-2 border-t-2 border-foreground">
                        <span className="font-bold text-2xl">Calories</span>
                        <span className="font-bold text-3xl">{Math.round(calories)}</span>
                      </div>
                      <Separator className="bg-foreground h-[4px]" />
                    </>
                  )}

                  <div className="text-xs text-right font-semibold">% Daily Value*</div>

                  <div className="space-y-1">
                    {fat_total_g !== undefined && (
                      <>
                        <div className="flex justify-between border-t border-foreground/20 pt-1 font-bold">
                          <span>Total Fat {fat_total_g}g</span>
                          <span>{Math.round((fat_total_g / 78) * 100)}%</span>
                        </div>
                        {fat_saturated_g !== undefined && (
                          <div className="flex justify-between pl-4">
                            <span>Saturated Fat {fat_saturated_g}g</span>
                            <span>{Math.round((fat_saturated_g / 20) * 100)}%</span>
                          </div>
                        )}
                        {fat_trans_g !== undefined && (
                          <div className="flex justify-between pl-4 italic">
                            <span>Trans Fat {fat_trans_g}g</span>
                          </div>
                        )}
                      </>
                    )}

                    {cholesterol_mg !== undefined && (
                      <div className="flex justify-between border-t border-foreground/20 pt-1 font-bold">
                        <span>Cholesterol {cholesterol_mg}mg</span>
                        <span>{Math.round((cholesterol_mg / 300) * 100)}%</span>
                      </div>
                    )}

                    {sodium_mg !== undefined && (
                      <div className="flex justify-between border-t border-foreground/20 pt-1 font-bold">
                        <span>Sodium {sodium_mg}mg</span>
                        <span>{Math.round((sodium_mg / 2300) * 100)}%</span>
                      </div>
                    )}

                    {carbs_total_g !== undefined && (
                      <>
                        <div className="flex justify-between border-t border-foreground/20 pt-1 font-bold">
                          <span>Total Carbohydrate {carbs_total_g}g</span>
                          <span>{Math.round((carbs_total_g / 275) * 100)}%</span>
                        </div>
                        {carbs_fiber_g !== undefined && (
                          <div className="flex justify-between pl-4">
                            <span>Dietary Fiber {carbs_fiber_g}g</span>
                            <span>{Math.round((carbs_fiber_g / 28) * 100)}%</span>
                          </div>
                        )}
                        {carbs_sugars_g !== undefined && (
                          <div className="flex justify-between pl-4">
                            <span>Total Sugars {carbs_sugars_g}g</span>
                          </div>
                        )}
                      </>
                    )}

                    {protein_g !== undefined && (
                      <div className="flex justify-between border-t-8 border-foreground pt-2 font-bold">
                        <span>Protein {protein_g}g</span>
                        <span>{Math.round((protein_g / 50) * 100)}%</span>
                      </div>
                    )}
                  </div>

                  <Separator className="bg-foreground h-[6px]" />

                  <div className="text-xs pt-2 space-y-1">
                    <p>* Percent Daily Values are based on a 2,000 calorie diet. Your daily values may be higher or lower depending on your calorie needs.</p>
                  </div>
                </div>
              </Card>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Card>
  );
}

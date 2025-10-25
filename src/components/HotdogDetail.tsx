import { Hotdog } from "@/types/hotdog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, MapPin, Sparkles } from "lucide-react";

interface HotdogDetailProps {
  hotdog: Hotdog;
  onClose: () => void;
}

export function HotdogDetail({ hotdog, onClose }: HotdogDetailProps) {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <Card className="max-w-3xl w-full max-h-[90vh] overflow-y-auto border-2 shadow-[var(--shadow-elevated)]">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
          
          <div className="flex items-start gap-3 mb-4">
            <Badge variant="secondary" className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {hotdog.city}, {hotdog.country}
            </Badge>
          </div>
          
          <CardTitle className="text-3xl font-heading pr-12">{hotdog.name}</CardTitle>
          <CardDescription className="text-base">{hotdog.story}</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="relative rounded-lg overflow-hidden border-4 border-primary/20">
            <img
              src={hotdog.image}
              alt={hotdog.name}
              className="w-full h-64 object-cover"
            />
          </div>
          
          <div className="bg-accent/20 border-2 border-accent/30 rounded-lg p-4 flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-accent-foreground flex-shrink-0 mt-1" />
            <div>
              <p className="font-heading font-semibold text-sm mb-1">Fun Fact</p>
              <p className="text-sm text-muted-foreground">{hotdog.funFact}</p>
            </div>
          </div>
          
          <div>
            <h3 className="font-heading font-semibold text-xl mb-3">Ingredients</h3>
            <div className="flex flex-wrap gap-2">
              {hotdog.ingredients.map((ingredient, index) => (
                <Badge key={index} variant="outline" className="text-sm">
                  {ingredient}
                </Badge>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-heading font-semibold text-xl mb-3">Recipe</h3>
            <ol className="space-y-3">
              {hotdog.recipe.map((step, index) => (
                <li key={index} className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                    {index + 1}
                  </span>
                  <span className="text-sm text-foreground pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

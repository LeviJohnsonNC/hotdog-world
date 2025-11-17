import { Badge } from "@/utils/badgeConfig";
import { BadgeProgress } from "@/utils/badgeCalculator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface BadgeCardProps {
  badge: Badge;
  progress: BadgeProgress;
}

export const BadgeCard = ({ badge, progress }: BadgeCardProps) => {
  const isEarned = progress.earned;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "relative group cursor-pointer transition-all duration-300 hover:scale-105",
              "rounded-xl p-3 border-2",
              isEarned
                ? "border-primary shadow-lg shadow-primary/20"
                : "border-border/50 opacity-60"
            )}
          >
            <div className="relative aspect-square">
              <img
                src={badge.image}
                alt={badge.name}
                className={cn(
                  "w-full h-full object-contain transition-all duration-300",
                  !isEarned && "grayscale opacity-50"
                )}
              />
              {isEarned && (
                <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent rounded-lg animate-pulse" />
              )}
            </div>
            
            {/* Progress indicator for unearned badges */}
            {!isEarned && (
              <div className="absolute bottom-1 right-1 bg-background/90 backdrop-blur-sm rounded-full px-2 py-0.5 text-xs font-medium text-muted-foreground border border-border">
                {progress.current}/{progress.required}
              </div>
            )}

            {/* Earned indicator */}
            {isEarned && (
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg">
                <span className="text-primary-foreground text-lg">✓</span>
              </div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs pointer-events-auto">
          <div className="space-y-1">
            <p className="font-semibold text-foreground">{badge.name}</p>
            <p className="text-sm text-muted-foreground">{badge.description}</p>
            <p className="text-xs text-muted-foreground pt-1">
              Progress: {progress.current} / {progress.required}
              {isEarned && " ✓ Earned!"}
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

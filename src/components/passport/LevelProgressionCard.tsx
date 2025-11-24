import { LEVEL_BADGES, LevelBadge } from "@/utils/levelBadgeConfig";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";

interface LevelProgressionCardProps {
  stampCount: number;
}

// Helper: Get current level badge based on stamp count
const getCurrentLevel = (stampCount: number): LevelBadge => {
  // Find the highest badge where dogsTried <= stampCount
  for (let i = LEVEL_BADGES.length - 1; i >= 0; i--) {
    if (stampCount >= LEVEL_BADGES[i].dogsTried) {
      return LEVEL_BADGES[i];
    }
  }
  return LEVEL_BADGES[0]; // Default to first badge
};

// Helper: Get next level badge
const getNextLevel = (stampCount: number): LevelBadge | null => {
  const currentLevel = getCurrentLevel(stampCount);
  const currentIndex = LEVEL_BADGES.findIndex(b => b.id === currentLevel.id);
  
  if (currentIndex === LEVEL_BADGES.length - 1) {
    return null; // Already at max level
  }
  
  return LEVEL_BADGES[currentIndex + 1];
};

// Helper: Calculate progress to next level
const getProgressToNextLevel = (stampCount: number): { current: number; target: number; percentage: number; remaining: number } => {
  const nextLevel = getNextLevel(stampCount);
  const currentLevel = getCurrentLevel(stampCount);
  
  if (!nextLevel) {
    return { current: stampCount, target: currentLevel.dogsTried, percentage: 100, remaining: 0 };
  }
  
  const progressInLevel = stampCount - currentLevel.dogsTried;
  const levelRange = nextLevel.dogsTried - currentLevel.dogsTried;
  const percentage = (progressInLevel / levelRange) * 100;
  const remaining = nextLevel.dogsTried - stampCount;
  
  return {
    current: stampCount,
    target: nextLevel.dogsTried,
    percentage: Math.min(percentage, 100),
    remaining,
  };
};

export const LevelProgressionCard = ({ stampCount }: LevelProgressionCardProps) => {
  const currentLevel = getCurrentLevel(stampCount);
  const nextLevel = getNextLevel(stampCount);
  const progress = getProgressToNextLevel(stampCount);

  return (
    <Card className="relative overflow-hidden bg-card/80 backdrop-blur-md border-2 border-primary/20 shadow-xl mb-8">
      <div className="p-6 space-y-6">
        {/* Main Progression Display */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          {/* Current Level - Left */}
          <div className="flex flex-col items-center text-center space-y-3 lg:col-span-1">
            <div className="relative">
              <img
                src={currentLevel.image}
                alt={currentLevel.name}
                className="w-32 h-32 object-contain drop-shadow-2xl"
              />
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                CURRENT
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">{currentLevel.name}</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-xs">{currentLevel.description}</p>
            </div>
          </div>

          {/* Progress Section - Middle */}
          <div className="flex flex-col justify-center space-y-3 lg:col-span-1">
            {nextLevel ? (
              <>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress to next level</span>
                    <span className="font-bold text-foreground">{progress.current}/{progress.target}</span>
                  </div>
                  <Progress value={progress.percentage} className="h-3" />
                </div>
                <p className="text-sm text-center text-muted-foreground">
                  <span className="font-semibold text-primary">{progress.remaining} more</span> {progress.remaining === 1 ? 'dog' : 'dogs'} to reach <span className="font-semibold">{nextLevel.name}</span>
                </p>
              </>
            ) : (
              <div className="text-center space-y-2">
                <div className="text-4xl">🏆</div>
                <p className="text-lg font-bold text-primary">Maximum Level Achieved!</p>
                <p className="text-sm text-muted-foreground">You've conquered all {stampCount} hot dogs!</p>
              </div>
            )}
          </div>

          {/* Next Level - Right */}
          {nextLevel && (
            <div className="flex flex-col items-center text-center space-y-3 lg:col-span-1">
              <div className="relative">
                <img
                  src={nextLevel.image}
                  alt={nextLevel.name}
                  className="w-28 h-28 object-contain grayscale opacity-40 drop-shadow-lg"
                />
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-muted text-muted-foreground px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  NEXT
                </div>
              </div>
              <div>
                <h4 className="text-base font-bold text-muted-foreground">{nextLevel.name}</h4>
              </div>
            </div>
          )}
        </div>

        {/* Spider Graph Placeholder - Future Enhancement */}
        <div className="border-t border-border/50 pt-6">
          <div className="flex items-center justify-center h-32 bg-muted/20 rounded-lg border border-dashed border-border/50">
            <p className="text-sm text-muted-foreground/60">
              {/* Spider graph visualization coming soon */}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

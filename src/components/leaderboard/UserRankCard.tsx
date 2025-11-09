import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Crown } from "lucide-react";

interface UserRankCardProps {
  rank: number;
  displayName: string | null;
  stampCount: number;
  totalHotdogs: number;
  userId: string;
}

const getMedalComponent = (rank: number) => {
  if (rank === 1) {
    return <Trophy className="w-8 h-8 text-yellow-500" />;
  } else if (rank === 2) {
    return <Medal className="w-8 h-8 text-gray-400" />;
  } else if (rank === 3) {
    return <Medal className="w-8 h-8 text-orange-600" />;
  }
  return null;
};

export const UserRankCard = ({ 
  rank, 
  displayName, 
  stampCount, 
  totalHotdogs,
  userId 
}: UserRankCardProps) => {
  const percentage = (stampCount / totalHotdogs) * 100;
  const medal = getMedalComponent(rank);
  const fallbackName = displayName || `Explorer #${userId.slice(-4)}`;
  const initials = fallbackName.slice(0, 2).toUpperCase();

  return (
    <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-2 border-primary/20 shadow-lg backdrop-blur-sm">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <Badge variant="default" className="gap-1 text-sm font-semibold">
            <Crown className="w-4 h-4" />
            Your Rank
          </Badge>
          <span className="text-sm text-muted-foreground">
            {stampCount > 0 ? `Ranked #${rank} of all explorers` : 'Start exploring!'}
          </span>
        </div>

        <div className="flex items-center gap-4 mb-4">
          {/* Rank / Medal */}
          <div className="flex-shrink-0 w-12 text-center">
            {medal ? (
              medal
            ) : (
              <span className="text-2xl font-bold text-foreground">
                #{rank}
              </span>
            )}
          </div>

          {/* Avatar */}
          <Avatar className="h-14 w-14 border-2 border-primary">
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-lg">
              {initials}
            </AvatarFallback>
          </Avatar>

          {/* Name and Count */}
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold truncate text-foreground">
              {fallbackName}
            </h3>
            <p className="text-base text-muted-foreground">
              🌭 × {stampCount} hot dog{stampCount !== 1 ? 's' : ''} collected
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={percentage} className="h-3" />
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {percentage.toFixed(0)}% complete
            </p>
            <p className="text-sm font-medium text-foreground">
              {stampCount} / {totalHotdogs}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

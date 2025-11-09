import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, Medal } from "lucide-react";

interface LeaderboardCardProps {
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

const getRankStyle = (rank: number) => {
  if (rank === 1) {
    return "bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 text-white";
  } else if (rank === 2) {
    return "bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 text-white";
  } else if (rank === 3) {
    return "bg-gradient-to-br from-orange-400 via-amber-600 to-orange-700 text-white";
  }
  return "bg-card";
};

export const LeaderboardCard = ({ 
  rank, 
  displayName, 
  stampCount, 
  totalHotdogs,
  userId 
}: LeaderboardCardProps) => {
  const percentage = (stampCount / totalHotdogs) * 100;
  const medal = getMedalComponent(rank);
  const rankStyle = getRankStyle(rank);
  const fallbackName = displayName || `Explorer #${userId.slice(-4)}`;
  const initials = fallbackName.slice(0, 2).toUpperCase();

  return (
    <Card 
      className={`${rankStyle} transition-all duration-200 hover:scale-[1.02] hover:shadow-lg animate-fade-in backdrop-blur-sm`}
      style={{ animationDelay: `${rank * 50}ms` }}
    >
      <div className="p-6">
        <div className="flex items-center gap-4 mb-4">
          {/* Rank / Medal */}
          <div className="flex-shrink-0 w-12 text-center">
            {medal ? (
              medal
            ) : (
              <span className="text-2xl font-bold text-muted-foreground">
                #{rank}
              </span>
            )}
          </div>

          {/* Avatar */}
          <Avatar className="h-12 w-12 border-2 border-border">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>

          {/* Name and Count */}
          <div className="flex-1 min-w-0">
            <h3 className={`text-lg font-semibold truncate ${rank <= 3 ? 'text-white' : 'text-foreground'}`}>
              {fallbackName}
            </h3>
            <p className={`text-sm ${rank <= 3 ? 'text-white/90' : 'text-muted-foreground'}`}>
              🌭 × {stampCount} hot dog{stampCount !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <Progress 
            value={percentage} 
            className={`h-2 ${rank <= 3 ? 'bg-white/20' : ''}`}
          />
          <p className={`text-xs text-right ${rank <= 3 ? 'text-white/80' : 'text-muted-foreground'}`}>
            {percentage.toFixed(0)}% complete
          </p>
        </div>
      </div>
    </Card>
  );
};

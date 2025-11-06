import { PassportStats as PassportStatsType } from '@/types/passport';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgressRing } from './ProgressRing';
import { Star, MapPin, Award } from 'lucide-react';

interface PassportStatsProps {
  stats: PassportStatsType;
}

export const PassportStats = ({ stats }: PassportStatsProps) => {
  return (
    <div className="space-y-6">
      {/* Progress Ring */}
      <div className="flex justify-center py-8">
        <ProgressRing value={stats.percentage} size={220} strokeWidth={16} />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Total Stamps */}
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Award className="w-4 h-4" />
              Stamps Collected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {stats.stamped} <span className="text-lg text-muted-foreground">/ {stats.total}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.total - stats.stamped} more to go!
            </p>
          </CardContent>
        </Card>

        {/* Average Rating */}
        <Card className="border-secondary/20 bg-gradient-to-br from-secondary/5 to-transparent">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Star className="w-4 h-4" />
              Average Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {stats.avgRating > 0 ? stats.avgRating.toFixed(1) : '—'}
              <span className="text-lg text-muted-foreground ml-1">
                {stats.avgRating > 0 && '⭐'}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.avgRating > 0 ? 'Across all rated dogs' : 'Rate some dogs!'}
            </p>
          </CardContent>
        </Card>

        {/* Countries Visited */}
        <Card className="border-accent/20 bg-gradient-to-br from-accent/5 to-transparent sm:col-span-2 lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Countries Visited
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {stats.countriesVisited}
              <span className="text-lg text-muted-foreground ml-1">🌍</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.countriesVisited > 0 ? 'Keep exploring!' : 'Start your journey!'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Milestone Message */}
      {stats.stamped === 0 && (
        <Card className="bg-muted/50 border-dashed">
          <CardContent className="pt-6 text-center">
            <p className="text-lg font-medium text-foreground mb-2">
              🎉 Ready to start your journey?
            </p>
            <p className="text-sm text-muted-foreground">
              Visit the map and try your first hot dog to get your first stamp!
            </p>
          </CardContent>
        </Card>
      )}

      {stats.stamped > 0 && stats.stamped < 5 && (
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <CardContent className="pt-6 text-center">
            <p className="text-lg font-medium text-foreground mb-2">
              🌟 Great start!
            </p>
            <p className="text-sm text-muted-foreground">
              Try {5 - stats.stamped} more to unlock the "Taster" milestone!
            </p>
          </CardContent>
        </Card>
      )}

      {stats.stamped >= 5 && stats.stamped < 10 && (
        <Card className="bg-gradient-to-r from-accent/10 to-primary/10 border-accent/20">
          <CardContent className="pt-6 text-center">
            <p className="text-lg font-medium text-foreground mb-2">
              🗺️ You're on a roll!
            </p>
            <p className="text-sm text-muted-foreground">
              Try {10 - stats.stamped} more to become a "Globetrotter"!
            </p>
          </CardContent>
        </Card>
      )}

      {stats.stamped >= 10 && stats.stamped < stats.total && (
        <Card className="bg-gradient-to-r from-secondary/10 to-accent/10 border-secondary/20">
          <CardContent className="pt-6 text-center">
            <p className="text-lg font-medium text-foreground mb-2">
              🔥 Incredible progress!
            </p>
            <p className="text-sm text-muted-foreground">
              Only {stats.total - stats.stamped} more to complete your passport!
            </p>
          </CardContent>
        </Card>
      )}

      {stats.stamped === stats.total && (
        <Card className="bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 border-primary">
          <CardContent className="pt-6 text-center">
            <p className="text-2xl font-bold text-foreground mb-2">
              👑 World Champion of Dogs! 👑
            </p>
            <p className="text-sm text-muted-foreground">
              You've tried every single hot dog! Amazing achievement!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

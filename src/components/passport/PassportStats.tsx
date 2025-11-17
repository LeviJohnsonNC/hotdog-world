import { PassportStats as PassportStatsType } from '@/types/passport';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgressRing } from './ProgressRing';
import { Star, MapPin, Award } from 'lucide-react';
import { BadgeCard } from './BadgeCard';
import { BADGES } from '@/utils/badgeConfig';
import { BadgeProgress } from '@/utils/badgeCalculator';

interface PassportStatsProps {
  stats: PassportStatsType;
  badges: BadgeProgress[];
}

export const PassportStats = ({ stats, badges }: PassportStatsProps) => {
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

      {/* Achievement Badges */}
      <div className="space-y-4 mt-8">
        <div className="text-center">
          <h3 className="text-2xl font-heading font-bold text-foreground mb-2">
            Achievement Badges
          </h3>
          <p className="text-sm text-muted-foreground">
            Earn badges by completing special challenges on your hot dog journey
          </p>
        </div>
        
        {/* Badge Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 md:gap-4 mt-6">
          {BADGES.map((badge, index) => (
            <BadgeCard 
              key={badge.id} 
              badge={badge} 
              progress={badges[index]}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

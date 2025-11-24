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

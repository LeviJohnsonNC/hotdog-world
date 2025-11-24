import { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { useHotdogsLight } from "@/hooks/useHotdogsLight";
import { useStamps } from "@/hooks/useStamps";
import { calculatePassportStats, sortHotdogs } from "@/utils/passportHelpers";
import { calculateBadgeProgress } from "@/utils/badgeCalculator";
import { BADGES } from "@/utils/badgeConfig";
import { StampCard } from "@/components/passport/StampCard";
import { StampDetailModal } from "@/components/passport/StampDetailModal";
import { PassportStats } from "@/components/passport/PassportStats";
import { LevelProgressionCard } from "@/components/passport/LevelProgressionCard";
import { StampedHotdog } from "@/types/passport";
import { toast } from "@/hooks/use-toast";
import { useOnboardingNudges } from "@/hooks/useOnboardingNudges";
import { LEVEL_BADGES } from "@/utils/levelBadgeConfig";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from "recharts";

const Passport = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') || 'stamps';
  const { data: hotdogs = [], isLoading: hotdogsLoading } = useHotdogsLight();
  const { stamps, loading: stampsLoading } = useStamps();
  const [selectedHotdog, setSelectedHotdog] = useState<StampedHotdog | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { hasBadgeToastBeenShown, markBadgeToastShown } = useOnboardingNudges();

  // Combine hotdog data with stamps
  const stampedHotdogs = useMemo(() => {
    return hotdogs.map(hotdog => {
      const stamp = stamps.find(s => s.hotdogId === hotdog.id) || null;
      return {
        ...hotdog,
        stamp,
        isStamped: stamp !== null
      };
    });
  }, [hotdogs, stamps]);

  // Calculate stats
  const stats = useMemo(() => {
    return calculatePassportStats(stampedHotdogs);
  }, [stampedHotdogs]);

  // Calculate badges
  const badges = useMemo(() => {
    return calculateBadgeProgress(stampedHotdogs);
  }, [stampedHotdogs]);

  // Track and notify for newly earned badges (only show toast once per badge)
  useEffect(() => {
    badges.forEach(badge => {
      if (badge.earned && !hasBadgeToastBeenShown(badge.badgeId)) {
        const badgeInfo = BADGES.find(b => b.id === badge.badgeId);
        if (badgeInfo) {
          // Skip toasts for special badges that have their own celebration logic
          const specialBadges = ['passport-opened', 'first-bite-taken', 'curious-clicker'];
          if (!specialBadges.includes(badge.badgeId)) {
            toast({
              title: "🎉 Badge Earned!",
              description: `You've unlocked: ${badgeInfo.name}`,
              duration: 5000,
            });
          }
          markBadgeToastShown(badge.badgeId);
        }
      }
    });
  }, [badges, hasBadgeToastBeenShown, markBadgeToastShown]);

  // Sort: stamped first, then unstamped
  const sortedHotdogs = useMemo(() => {
    return sortHotdogs(stampedHotdogs);
  }, [stampedHotdogs]);

  const handleStampClick = (hotdog: StampedHotdog) => {
    setSelectedHotdog(hotdog);
    setModalOpen(true);
  };

  const isLoading = hotdogsLoading || stampsLoading;

  const siteUrl = window.location.origin;

  if (isLoading) {
    return (
      <div className="relative w-full min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-heading text-primary mb-4">My Hot Dog Passport</h1>
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your passport...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <Helmet>
        <title>My Hot Dog Passport | Hotdogs Around the World</title>
        <meta 
          name="description" 
          content="Track your hot dog journey around the world. View your collected stamps, stats, and explore new destinations."
        />
        <link rel="canonical" href={`${siteUrl}/passport`} />
        
        {/* Open Graph tags */}
        <meta property="og:title" content="My Hot Dog Passport | Hotdogs Around the World" />
        <meta property="og:description" content="Track your hot dog journey around the world. View your collected stamps, stats, and explore new destinations." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${siteUrl}/passport`} />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="My Hot Dog Passport | Hotdogs Around the World" />
        <meta name="twitter:description" content="Track your hot dog journey around the world. View your collected stamps, stats, and explore new destinations." />
      </Helmet>

      {/* Header */}
      <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-md border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            onClick={() => navigate("/")}
            variant="ghost"
            size="sm"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Map
          </Button>
          
          <div className="text-center flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              My Hot Dog Passport
            </h1>
            <p className="text-sm text-muted-foreground">
              {stats.stamped} of {stats.total} destinations visited
            </p>
          </div>
          
          <div className="w-24" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={tabParam} onValueChange={(value) => navigate(`/passport?tab=${value}`)} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="stamps">Hot Dogs Tried</TabsTrigger>
            <TabsTrigger value="stats">My Badges</TabsTrigger>
          </TabsList>

          {/* Stamps Tab */}
          <TabsContent value="stamps" className="space-y-6">
            {stats.stamped === 0 ? (
              <div className="text-center py-12 space-y-8 max-w-2xl mx-auto">
                {/* Hero Badge Display - The Empty Bun */}
                <div className="space-y-4">
                  <img 
                    src={LEVEL_BADGES[0].image} 
                    alt={LEVEL_BADGES[0].name}
                    className="w-32 h-32 mx-auto drop-shadow-lg"
                  />
                  <h2 className="text-2xl font-bold text-foreground">
                    {LEVEL_BADGES[0].name}
                  </h2>
                  <p className="text-sm text-muted-foreground italic max-w-md mx-auto">
                    "{LEVEL_BADGES[0].description}"
                  </p>
                </div>

                {/* Faded Radar Chart Placeholder */}
                <div className="space-y-3">
                  <div className="relative w-full h-64 opacity-15">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={[
                        { axis: 'Regions', value: 1 },
                        { axis: 'Spice', value: 1 },
                        { axis: 'Style', value: 1 },
                        { axis: 'Complexity', value: 1 },
                        { axis: 'Indulgence', value: 1 },
                        { axis: 'Variety', value: 1 },
                      ]}>
                        <PolarGrid stroke="hsl(var(--muted-foreground))" />
                        <PolarAngleAxis 
                          dataKey="axis" 
                          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                        />
                        <Radar
                          dataKey="value"
                          stroke="hsl(var(--primary))"
                          fill="hsl(var(--primary))"
                          fillOpacity={0.3}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Your Food Adventure Profile unlocks after your first hot dog tried.
                  </p>
                </div>

                {/* Call to Action */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-foreground">
                    Start Your Journey!
                  </h3>
                  <p className="text-muted-foreground max-w-lg mx-auto">
                    Trying your first hot dog will unlock your Food Adventure Profile and your first level badge. 
                    Explore the map to record your first dog!
                  </p>
                  <Button onClick={() => navigate("/")} size="lg" className="mt-4">
                    Explore the Map
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Level Progression Card */}
                <LevelProgressionCard stampCount={stats.stamped} stampedHotdogs={stampedHotdogs} />
                
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-foreground">
                    Your Collection
                  </h2>
                  <div className="text-sm text-muted-foreground">
                    {sortedHotdogs.filter(h => h.isStamped).length} stamped
                  </div>
                </div>
              </div>
            )}

            {/* Stamps Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {sortedHotdogs.map((hotdog) => (
                <StampCard
                  key={hotdog.id}
                  hotdog={hotdog}
                  onClick={() => handleStampClick(hotdog)}
                />
              ))}
            </div>
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats">
            <PassportStats stats={stats} badges={badges} />
          </TabsContent>
        </Tabs>
      </main>

      {/* Stamp Detail Modal */}
      <StampDetailModal
        hotdog={selectedHotdog}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
};

export default Passport;

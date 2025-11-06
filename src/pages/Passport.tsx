import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { useHotdogs } from "@/hooks/useHotdogs";
import { useStamps } from "@/hooks/useStamps";
import { calculatePassportStats, sortHotdogs } from "@/utils/passportHelpers";
import { StampCard } from "@/components/passport/StampCard";
import { StampDetailModal } from "@/components/passport/StampDetailModal";
import { PassportStats } from "@/components/passport/PassportStats";
import { StampedHotdog } from "@/types/passport";

const Passport = () => {
  const navigate = useNavigate();
  const { data: hotdogs = [], isLoading: hotdogsLoading } = useHotdogs();
  const { stamps, loading: stampsLoading } = useStamps();
  const [selectedHotdog, setSelectedHotdog] = useState<StampedHotdog | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

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

  // Sort: stamped first, then unstamped
  const sortedHotdogs = useMemo(() => {
    return sortHotdogs(stampedHotdogs);
  }, [stampedHotdogs]);

  const handleStampClick = (hotdog: StampedHotdog) => {
    setSelectedHotdog(hotdog);
    setModalOpen(true);
  };

  const isLoading = hotdogsLoading || stampsLoading;

  if (isLoading) {
    return (
      <div className="relative w-full min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your passport...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
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
        <Tabs defaultValue="stamps" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="stamps">Your Stamps</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
          </TabsList>

          {/* Stamps Tab */}
          <TabsContent value="stamps" className="space-y-6">
            {stats.stamped === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="text-6xl mb-4">🌭</div>
                <h2 className="text-2xl font-bold text-foreground">
                  Start Your Journey!
                </h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Visit the map to explore and try your first hot dog. 
                  Each one you try will appear here as a colorful stamp!
                </p>
                <Button onClick={() => navigate("/")} size="lg" className="mt-4">
                  Explore the Map
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
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
            <PassportStats stats={stats} />
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

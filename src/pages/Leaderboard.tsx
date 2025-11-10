import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { LeaderboardCard } from "@/components/leaderboard/LeaderboardCard";
import { UserRankCard } from "@/components/leaderboard/UserRankCard";

interface LeaderboardEntry {
  user_id: string;
  display_name: string | null;
  stamp_count: number;
  first_stamp_time: number;
}

const Leaderboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Fetch total hotdog count
  const { data: totalHotdogs = 0 } = useQuery({
    queryKey: ["total-hotdogs"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("hotdogs")
        .select("*", { count: "exact", head: true });
      
      if (error) throw error;
      return count || 0;
    },
  });

  // Fetch top 10 leaderboard
  const { data: leaderboard = [], isLoading: isLoadingLeaderboard } = useQuery({
    queryKey: ["leaderboard-top10"],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc("get_leaderboard_data");
      
      if (error) throw error;
      
      return (data || []).slice(0, 10);
    },
  });

  // Fetch current user's rank (if logged in)
  const { data: userRank } = useQuery({
    queryKey: ["user-rank", user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .rpc("get_leaderboard_data");
      
      if (error) throw error;

      // Find user's rank
      const userIndex = data?.findIndex(entry => entry.user_id === user.id) ?? -1;
      if (userIndex === -1) return null;

      return {
        ...data[userIndex],
        rank: userIndex + 1,
      };
    },
    enabled: !!user,
  });

  const siteUrl = window.location.origin;

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <Helmet>
        <title>Hot Dog Leaderboard - Top Explorers | Hotdogs Around the World</title>
        <meta 
          name="description" 
          content="See who's leading the hot dog exploration race! Compare your progress with top explorers from around the world."
        />
        <link rel="canonical" href={`${siteUrl}/leaderboard`} />
        
        {/* Open Graph tags */}
        <meta property="og:title" content="Hot Dog Leaderboard - Top Explorers | Hotdogs Around the World" />
        <meta property="og:description" content="See who's leading the hot dog exploration race! Compare your progress with top explorers from around the world." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${siteUrl}/leaderboard`} />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Hot Dog Leaderboard - Top Explorers" />
        <meta name="twitter:description" content="See who's leading the hot dog exploration race! Compare your progress with top explorers from around the world." />
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
              Hot Dog Leaderboard
            </h1>
            <p className="text-sm text-muted-foreground">
              Top explorers from around the world
            </p>
          </div>
          
          <div className="w-24" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* User's Rank Card */}
        {user && userRank && (
          <div className="mb-8 animate-fade-in">
            <UserRankCard
              rank={userRank.rank}
              displayName={userRank.display_name}
              stampCount={userRank.stamp_count}
              totalHotdogs={totalHotdogs}
              userId={userRank.user_id}
            />
          </div>
        )}

        {/* Top 10 Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground mb-4">
            🏆 Top 10 Explorers
          </h2>

          {/* Loading State */}
          {isLoadingLeaderboard && (
            <div className="space-y-4">
              {[...Array(10)].map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoadingLeaderboard && leaderboard.length === 0 && (
            <div className="text-center py-16 space-y-4">
              <div className="text-6xl mb-4">🌭</div>
              <h3 className="text-2xl font-bold text-foreground">
                Be the First Explorer!
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                No one has started collecting hot dog stamps yet. 
                Start your journey and claim the top spot!
              </p>
              <Button onClick={() => navigate("/")}>
                Start Exploring
              </Button>
            </div>
          )}

          {/* Leaderboard Cards */}
          {!isLoadingLeaderboard && leaderboard.length > 0 && (
            <div className="space-y-3">
              {leaderboard.map((entry, index) => (
                <LeaderboardCard
                  key={entry.user_id}
                  rank={index + 1}
                  displayName={entry.display_name}
                  stampCount={entry.stamp_count}
                  totalHotdogs={totalHotdogs}
                  userId={entry.user_id}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Leaderboard;

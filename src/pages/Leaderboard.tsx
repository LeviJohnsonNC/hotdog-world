import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { AtlasBackdrop } from "@/components/leaderboard/AtlasBackdrop";
import { LeaderboardHeader } from "@/components/leaderboard/LeaderboardHeader";
import { PassportStandingCard } from "@/components/leaderboard/PassportStandingCard";
import { PodiumCard } from "@/components/leaderboard/PodiumCard";
import { StandingsRow } from "@/components/leaderboard/StandingsRow";
import { RankLadderCard } from "@/components/leaderboard/RankLadderCard";

interface LeaderboardEntry {
  user_id: string;
  display_name: string | null;
  stamp_count: number;
  first_stamp_time: number;
}

const Leaderboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

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

  const { data: allEntries = [], isLoading } = useQuery<LeaderboardEntry[]>({
    queryKey: ["leaderboard-all"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_leaderboard_data");
      if (error) throw error;
      return (data || []) as LeaderboardEntry[];
    },
  });

  const top10 = allEntries.slice(0, 10);
  const podium = top10.slice(0, 3);
  const rest = top10.slice(3);

  const userIndex = user ? allEntries.findIndex((e) => e.user_id === user.id) : -1;
  const userEntry = userIndex >= 0 ? allEntries[userIndex] : null;
  const userRank = userIndex >= 0 ? userIndex + 1 : null;
  const userInTop10 = userRank !== null && userRank <= 10;

  const totalStamps = allEntries.reduce((sum, e) => sum + Number(e.stamp_count || 0), 0);
  const totalExplorers = allEntries.length;
  const siteUrl = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <div className="relative min-h-screen w-full text-[hsl(var(--paper))]">
      <Helmet>
        <title>Explorer Club Standings — Hot Dog World Leaderboard</title>
        <meta
          name="description"
          content="The Hot Dog Explorers Club hall of fame. See who has stamped the most dogs across the global atlas and climb the rank ladder."
        />
        <link rel="canonical" href={`${siteUrl}/leaderboard`} />
        <meta property="og:title" content="Explorer Club Standings — Hot Dog World" />
        <meta property="og:description" content="The Hot Dog Explorers Club hall of fame. Climb the rank ladder." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${siteUrl}/leaderboard`} />
      </Helmet>

      <AtlasBackdrop />

      <LeaderboardHeader
        totalExplorers={totalExplorers}
        totalStamps={totalStamps}
        totalHotdogs={totalHotdogs}
      />

      <main className="container mx-auto px-4 pb-20 max-w-6xl">
        {/* User standing */}
        {user && userEntry && (
          <div className="mb-10 max-w-2xl mx-auto">
            <PassportStandingCard
              rank={userRank}
              totalExplorers={totalExplorers}
              userId={userEntry.user_id}
              displayName={userEntry.display_name}
              stampCount={Number(userEntry.stamp_count)}
              totalHotdogs={totalHotdogs}
            />
          </div>
        )}

        {!user && (
          <div className="mb-10 max-w-2xl mx-auto paper-card p-5 text-center">
            <p className="text-[hsl(var(--ink))] text-sm mb-3">
              Sign in to claim a rank, earn stamps, and climb the Explorer Club ladder.
            </p>
            <Button onClick={() => navigate("/auth")} className="brass-button">
              Join the Club
            </Button>
          </div>
        )}

        {isLoading && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3 sm:gap-5 mb-8">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-64 w-full bg-[hsl(var(--paper))]/10" />
              ))}
            </div>
            {[...Array(7)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full bg-[hsl(var(--paper))]/10" />
            ))}
          </div>
        )}

        {!isLoading && top10.length === 0 && (
          <div className="text-center py-20 paper-card max-w-xl mx-auto p-10">
            <div className="text-6xl mb-4">🌭</div>
            <h3
              className="text-[hsl(var(--ink))] text-3xl mb-2"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              The Hall Is Empty
            </h3>
            <p className="text-[hsl(var(--ink))]/70 mb-6">
              No explorer has stamped a dog yet. The first name on this wall could be yours.
            </p>
            <Button onClick={() => navigate("/")} className="brass-button">
              Start Exploring
            </Button>
          </div>
        )}

        {!isLoading && top10.length > 0 && (
          <div className="grid lg:grid-cols-[1fr_18rem] gap-8 items-start">
            <div>
              {/* Podium */}
              {podium.length > 0 && (
                <section className="mb-10">
                  <h2
                    className="text-[hsl(var(--paper))] text-sm tracking-[0.28em] uppercase mb-4 text-center"
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                  >
                    The Podium
                  </h2>
                  <div className="grid grid-cols-3 gap-3 sm:gap-5 items-end">
                    {/* Visual order: 2, 1, 3 */}
                    {podium[1] && (
                      <PodiumCard
                        rank={2}
                        userId={podium[1].user_id}
                        displayName={podium[1].display_name}
                        stampCount={Number(podium[1].stamp_count)}
                        totalHotdogs={totalHotdogs}
                        isCurrentUser={user?.id === podium[1].user_id}
                      />
                    )}
                    {podium[0] && (
                      <PodiumCard
                        rank={1}
                        userId={podium[0].user_id}
                        displayName={podium[0].display_name}
                        stampCount={Number(podium[0].stamp_count)}
                        totalHotdogs={totalHotdogs}
                        isCurrentUser={user?.id === podium[0].user_id}
                      />
                    )}
                    {podium[2] && (
                      <PodiumCard
                        rank={3}
                        userId={podium[2].user_id}
                        displayName={podium[2].display_name}
                        stampCount={Number(podium[2].stamp_count)}
                        totalHotdogs={totalHotdogs}
                        isCurrentUser={user?.id === podium[2].user_id}
                      />
                    )}
                  </div>
                </section>
              )}

              {/* Standings 4-10 */}
              {rest.length > 0 && (
                <section>
                  <h2
                    className="text-[hsl(var(--paper))] text-sm tracking-[0.28em] uppercase mb-3"
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                  >
                    Top Passport Stampers
                  </h2>
                  <div className="space-y-2">
                    {rest.map((entry, i) => (
                      <StandingsRow
                        key={entry.user_id}
                        rank={i + 4}
                        userId={entry.user_id}
                        displayName={entry.display_name}
                        stampCount={Number(entry.stamp_count)}
                        totalHotdogs={totalHotdogs}
                        isCurrentUser={user?.id === entry.user_id}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* User row if outside top 10 */}
              {user && userEntry && !userInTop10 && (
                <section className="mt-6">
                  <div className="text-center text-[hsl(var(--paper))]/50 text-xs tracking-[0.2em] uppercase my-3">
                    · · ·
                  </div>
                  <StandingsRow
                    rank={userRank!}
                    userId={userEntry.user_id}
                    displayName={userEntry.display_name}
                    stampCount={Number(userEntry.stamp_count)}
                    totalHotdogs={totalHotdogs}
                    isCurrentUser
                  />
                </section>
              )}
            </div>

            {/* Right rail: rank ladder */}
            <aside>
              <RankLadderCard currentStampCount={Number(userEntry?.stamp_count || 0)} />
            </aside>
          </div>
        )}
      </main>
    </div>
  );
};

export default Leaderboard;

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { displayNameFor } from "@/utils/callsign";
import { getRankForCount } from "@/utils/rankLadder";

interface PodiumCardProps {
  rank: 1 | 2 | 3;
  userId: string;
  displayName: string | null;
  stampCount: number;
  totalHotdogs: number;
  isCurrentUser?: boolean;
}

const RANK_META = {
  1: { label: "Gold", color: "hsl(45 80% 58%)", height: "h-72 sm:h-80", scale: "scale-105" },
  2: { label: "Silver", color: "hsl(210 12% 72%)", height: "h-64 sm:h-72", scale: "" },
  3: { label: "Bronze", color: "hsl(28 55% 50%)", height: "h-60 sm:h-68", scale: "" },
} as const;

export const PodiumCard = ({ rank, userId, displayName, stampCount, totalHotdogs, isCurrentUser }: PodiumCardProps) => {
  const meta = RANK_META[rank];
  const name = displayNameFor(userId, displayName);
  const initials = name.slice(0, 2).toUpperCase();
  const tier = getRankForCount(stampCount);
  const pct = totalHotdogs ? Math.round((stampCount / totalHotdogs) * 100) : 0;

  return (
    <div className={`${meta.scale} transition-transform`}>
      <div
        className={`paper-card ${meta.height} flex flex-col items-center justify-between p-5 text-center relative ${
          rank === 1 ? "ring-2 ring-[hsl(45_80%_58%)]/60 leaderboard-podium-shimmer" : ""
        } ${isCurrentUser ? "outline outline-2 outline-[hsl(var(--mustard-yellow))]" : ""}`}
        style={{ borderTop: `4px solid ${meta.color}` }}
      >
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 text-[hsl(var(--paper))] text-xs tracking-[0.2em] rounded"
          style={{ backgroundColor: meta.color, fontFamily: "'Bebas Neue', sans-serif" }}
        >
          {meta.label} · #{rank}
        </div>

        <div className="flex flex-col items-center gap-3 mt-4">
          <div className="relative">
            <Avatar className="h-20 w-20 border-2" style={{ borderColor: meta.color }}>
              <AvatarFallback className="bg-[hsl(var(--paper))] text-[hsl(var(--ink))] text-xl font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <img
              src={tier.image}
              alt={tier.name}
              className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full bg-[hsl(var(--paper))] p-0.5 shadow-md"
            />
          </div>

          <div>
            <h3
              className="text-[hsl(var(--ink))] text-lg leading-tight"
              style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.04em" }}
            >
              {name}
            </h3>
            <p className="text-[hsl(var(--ink))]/60 text-[0.7rem] tracking-wider uppercase mt-0.5">
              {tier.name}
            </p>
          </div>
        </div>

        <div className="w-full pt-3 border-t border-dashed border-[hsl(var(--paper-edge))]">
          <div
            className="text-[hsl(var(--stamp-red))] text-3xl"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            {stampCount}
          </div>
          <div className="text-[hsl(var(--ink))]/60 text-[0.65rem] tracking-[0.2em] uppercase">
            Stamps · {pct}%
          </div>
        </div>
      </div>
    </div>
  );
};

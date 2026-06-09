import { RANK_LADDER, getRankForCount } from "@/utils/rankLadder";

interface RankLadderCardProps {
  currentStampCount: number;
}

export const RankLadderCard = ({ currentStampCount }: RankLadderCardProps) => {
  const current = getRankForCount(currentStampCount);

  return (
    <div className="paper-card p-4 sm:p-5">
      <div className="flex items-center justify-between mb-4">
        <h3
          className="text-[hsl(var(--ink))] text-lg tracking-wider"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          THE RANK LADDER
        </h3>
        <span className="text-[hsl(var(--ink))]/50 text-[0.65rem] tracking-[0.18em] uppercase">
          10 Tiers
        </span>
      </div>

      <ol className="space-y-1.5">
        {RANK_LADDER.map((tier) => {
          const isCurrent = tier.id === current.id;
          const unlocked = currentStampCount >= tier.dogsTried;
          return (
            <li
              key={tier.id}
              className={`flex items-center gap-3 px-2 py-1.5 rounded transition-colors ${
                isCurrent
                  ? "bg-[hsl(var(--mustard-yellow))]/25 ring-1 ring-[hsl(var(--mustard-yellow))]/60"
                  : ""
              }`}
            >
              <img
                src={tier.image}
                alt=""
                className={`w-8 h-8 flex-shrink-0 ${unlocked ? "" : "opacity-30 grayscale"}`}
              />
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm leading-tight truncate ${
                    unlocked ? "text-[hsl(var(--ink))]" : "text-[hsl(var(--ink))]/45"
                  }`}
                  style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.04em" }}
                >
                  {tier.name}
                </p>
              </div>
              <span
                className={`text-xs tabular-nums ${
                  unlocked ? "text-[hsl(var(--stamp-red))]" : "text-[hsl(var(--ink))]/40"
                }`}
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                {tier.dogsTried}+
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

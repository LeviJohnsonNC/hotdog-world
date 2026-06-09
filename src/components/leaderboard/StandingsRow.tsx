import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { displayNameFor } from "@/utils/callsign";
import { getRankForCount } from "@/utils/rankLadder";

interface StandingsRowProps {
  rank: number;
  userId: string;
  displayName: string | null;
  stampCount: number;
  totalHotdogs: number;
  isCurrentUser?: boolean;
}

export const StandingsRow = ({ rank, userId, displayName, stampCount, totalHotdogs, isCurrentUser }: StandingsRowProps) => {
  const name = displayNameFor(userId, displayName);
  const initials = name.slice(0, 2).toUpperCase();
  const tier = getRankForCount(stampCount);
  const pct = totalHotdogs ? Math.round((stampCount / totalHotdogs) * 100) : 0;

  return (
    <div
      className={`paper-card flex items-center gap-3 sm:gap-4 px-3 sm:px-5 py-3 ${
        isCurrentUser
          ? "outline outline-2 outline-[hsl(var(--mustard-yellow))] shadow-[0_0_24px_hsl(var(--mustard-yellow)/0.35)]"
          : ""
      }`}
    >
      <div
        className="w-9 text-center text-[hsl(var(--ink))] text-2xl flex-shrink-0"
        style={{ fontFamily: "'Bebas Neue', sans-serif" }}
      >
        {rank.toString().padStart(2, "0")}
      </div>

      <Avatar className="h-10 w-10 border border-[hsl(var(--paper-edge))] flex-shrink-0">
        <AvatarFallback className="bg-[hsl(var(--bun-beige))] text-[hsl(var(--ink))] text-sm font-semibold">
          {initials}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-[hsl(var(--ink))] font-semibold text-sm sm:text-base truncate">
            {name}
          </p>
          {isCurrentUser && (
            <span
              className="text-[0.55rem] tracking-[0.18em] px-1.5 py-0.5 bg-[hsl(var(--mustard-yellow))] text-[hsl(var(--ink))] rounded"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              YOU
            </span>
          )}
        </div>
        <p className="text-[hsl(var(--ink))]/60 text-[0.7rem] tracking-wide uppercase truncate">
          {tier.name}
        </p>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        <img
          src={tier.image}
          alt=""
          className="hidden sm:block w-9 h-9"
        />
        <div className="text-right">
          <div
            className="text-[hsl(var(--stamp-red))] text-xl sm:text-2xl leading-none"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            {stampCount}
          </div>
          <div className="text-[hsl(var(--ink))]/55 text-[0.6rem] tracking-wider uppercase mt-0.5">
            {pct}% done
          </div>
        </div>
      </div>
    </div>
  );
};

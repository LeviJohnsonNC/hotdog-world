import { Link } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { displayNameFor } from "@/utils/callsign";
import { getNextRank, getProgressToNext, getRankForCount } from "@/utils/rankLadder";

interface PassportStandingCardProps {
  rank: number | null;
  totalExplorers: number;
  userId: string;
  displayName: string | null;
  stampCount: number;
  totalHotdogs: number;
}

export const PassportStandingCard = ({
  rank,
  totalExplorers,
  userId,
  displayName,
  stampCount,
  totalHotdogs,
}: PassportStandingCardProps) => {
  const name = displayNameFor(userId, displayName);
  const initials = name.slice(0, 2).toUpperCase();
  const current = getRankForCount(stampCount);
  const next = getNextRank(stampCount);
  const progress = getProgressToNext(stampCount);
  const stampsToNext = next ? next.dogsTried - stampCount : 0;

  return (
    <div className="paper-card p-5 sm:p-6 relative overflow-hidden">
      <div className="absolute top-3 right-3 stamp-label text-[0.65rem]">YOUR STANDING</div>

      <div className="flex items-start gap-4">
        <div className="relative flex-shrink-0">
          <Avatar className="h-16 w-16 border-2 border-[hsl(var(--stamp-red))]">
            <AvatarFallback className="bg-[hsl(var(--bun-beige))] text-[hsl(var(--ink))] text-lg font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <img
            src={current.image}
            alt={current.name}
            className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-[hsl(var(--paper))] p-0.5 shadow-md"
          />
        </div>

        <div className="flex-1 min-w-0 pt-1">
          <h2
            className="text-[hsl(var(--ink))] text-xl sm:text-2xl leading-tight"
            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.03em" }}
          >
            {name}
          </h2>
          <p className="text-[hsl(var(--ink))]/70 text-sm italic mt-0.5">
            {current.name}
          </p>
          <p className="text-[hsl(var(--ink))]/60 text-xs mt-1">
            {rank
              ? `Ranked #${rank} of ${totalExplorers.toLocaleString()} explorers`
              : "Stamp your first dog to enter the standings."}
          </p>
        </div>
      </div>

      <div className="mt-5">
        <div className="flex justify-between items-end mb-1.5 text-xs">
          <span className="text-[hsl(var(--ink))]/70 tracking-wider uppercase">
            {next ? `Next: ${next.name}` : "Max rank achieved"}
          </span>
          <span
            className="text-[hsl(var(--stamp-red))] text-sm"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            {stampCount}{next ? ` / ${next.dogsTried}` : ""}
          </span>
        </div>
        <div className="h-2.5 bg-[hsl(var(--paper-edge))]/40 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${progress * 100}%`,
              background: "linear-gradient(90deg, hsl(var(--mustard-yellow)), hsl(var(--stamp-red)))",
            }}
          />
        </div>
        {next && stampsToNext > 0 && (
          <p className="text-[hsl(var(--ink))]/60 text-[0.7rem] mt-1.5 italic">
            {stampsToNext} more stamp{stampsToNext === 1 ? "" : "s"} to climb the ladder.
          </p>
        )}
      </div>

      <div className="mt-5 flex items-center justify-between pt-4 border-t border-dashed border-[hsl(var(--paper-edge))]">
        <div>
          <div
            className="text-[hsl(var(--ink))] text-2xl leading-none"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            {stampCount}
            <span className="text-[hsl(var(--ink))]/40 text-base"> / {totalHotdogs}</span>
          </div>
          <div className="text-[hsl(var(--ink))]/60 text-[0.65rem] tracking-[0.2em] uppercase mt-0.5">
            Atlas Progress
          </div>
        </div>
        <Link
          to="/passport"
          className="text-[hsl(var(--stamp-red))] text-xs tracking-[0.2em] uppercase hover:underline"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          View Passport →
        </Link>
      </div>
    </div>
  );
};

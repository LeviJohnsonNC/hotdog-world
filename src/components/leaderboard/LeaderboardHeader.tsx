import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface LeaderboardHeaderProps {
  totalExplorers: number;
  totalStamps: number;
  totalHotdogs: number;
}

export const LeaderboardHeader = ({ totalExplorers, totalStamps, totalHotdogs }: LeaderboardHeaderProps) => {
  return (
    <header className="relative z-10 px-4 pt-6 pb-8">
      <div className="container mx-auto max-w-5xl">
        <Link
          to="/"
          className="visa-pill inline-flex hover:-rotate-1 transition-transform"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Map
        </Link>

        <div className="mt-8 text-center">
          <p
            className="text-[hsl(var(--brass))] tracking-[0.32em] text-xs sm:text-sm mb-3"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            HOT DOG EXPLORERS CLUB · EST. 2025
          </p>
          <h1
            className="text-[hsl(var(--paper))] text-4xl sm:text-6xl lg:text-7xl leading-none"
            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.04em" }}
          >
            Explorer Club Standings
          </h1>
          <p className="mt-4 text-[hsl(var(--paper))]/70 max-w-xl mx-auto text-sm sm:text-base italic">
            A hall of fame of passport-stamping eaters, ranked by dogs discovered across the globe.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-6 sm:gap-12 text-center">
          <Stat label="Explorers" value={totalExplorers.toLocaleString()} />
          <Divider />
          <Stat label="Stamps Collected" value={totalStamps.toLocaleString()} />
          <Divider />
          <Stat label="Dogs in Atlas" value={totalHotdogs.toLocaleString()} />
        </div>
      </div>
    </header>
  );
};

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div>
    <div
      className="text-[hsl(var(--paper))] text-3xl sm:text-4xl"
      style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.06em" }}
    >
      {value}
    </div>
    <div className="text-[hsl(var(--brass))] text-[0.65rem] sm:text-xs tracking-[0.22em] uppercase mt-1">
      {label}
    </div>
  </div>
);

const Divider = () => (
  <div className="hidden sm:block w-px self-stretch bg-[hsl(var(--brass))]/30" />
);

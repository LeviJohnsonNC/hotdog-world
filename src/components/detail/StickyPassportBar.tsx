import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Stamp } from "lucide-react";
import { Hotdog } from "@/types/hotdog";

interface Props {
  hotdog: Hotdog;
  revealedCount: number;
  totalFacts: number;
  onStampClick: () => void;
}

export function StickyPassportBar({ hotdog, revealedCount, totalFacts, onStampClick }: Props) {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`hidden md:block fixed top-0 inset-x-0 z-50 transition-transform duration-300 ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="bg-[hsl(var(--ink))] text-[hsl(var(--paper))] border-b border-white/10 shadow-lg">
        <div className="max-w-[1180px] mx-auto px-6 h-14 flex items-center justify-between gap-6">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm font-medium hover:text-[hsl(var(--pineapple))] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Map
          </button>
          <div className="flex-1 text-center">
            <div className="font-heading font-semibold text-sm leading-tight truncate">
              {hotdog.name}
            </div>
            <div className="text-[11px] opacity-70 uppercase tracking-wider">
              {hotdog.city}, {hotdog.country}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-[11px] uppercase tracking-wider opacity-80">
              Trivia {revealedCount}/{totalFacts}
            </div>
            <button onClick={onStampClick} className="brass-button text-sm flex items-center gap-2">
              <Stamp className="h-4 w-4" />
              Stamp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MobileActionBar({ onStampClick }: { onStampClick: () => void }) {
  const navigate = useNavigate();
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-[hsl(var(--ink))] text-[hsl(var(--paper))] border-t border-white/10 px-4 py-3 flex gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.25)]">
      <button
        onClick={() => navigate("/")}
        className="flex-1 flex items-center justify-center gap-2 text-sm font-medium border border-white/25 rounded-md py-2.5"
      >
        <ArrowLeft className="h-4 w-4" /> Map
      </button>
      <button onClick={onStampClick} className="brass-button flex-1 flex items-center justify-center gap-2 text-sm">
        <Stamp className="h-4 w-4" /> Stamp Passport
      </button>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Stamp } from "lucide-react";
import { Hotdog } from "@/types/hotdog";

interface Props {
  hotdog: Hotdog;
  revealedCount: number;
  totalFacts: number;
  onStampClick: () => void;
  backTo?: { path: string; label: string };
}

export function StickyPassportBar({ hotdog, revealedCount, totalFacts, onStampClick, backTo }: Props) {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  const destination = backTo ?? { path: "/", label: "Atlas" };

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
      <div
        className="border-b backdrop-blur-md"
        style={{
          background: "hsl(var(--paper) / 0.92)",
          borderColor: "hsl(var(--ink) / 0.14)",
          boxShadow: "0 1px 0 hsl(var(--ink) / 0.04), 0 8px 24px -18px hsl(var(--ink) / 0.35)",
        }}
      >
        <div className="max-w-[1180px] mx-auto px-6 h-12 flex items-center justify-between gap-6 text-[hsl(var(--ink))]">
          <button
            onClick={() => navigate(destination.path)}
            className="flex items-center gap-1.5 text-[13px] font-medium uppercase tracking-[0.18em] text-[hsl(var(--ink))]/70 hover:text-[hsl(var(--ink))] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {destination.label}
          </button>
          <div className="flex-1 min-w-0 text-center flex items-baseline justify-center gap-2 truncate">
            <span className="font-heading font-semibold text-sm truncate">
              {hotdog.name}
            </span>
            <span className="text-[11px] uppercase tracking-[0.18em] text-[hsl(var(--ink))]/55 truncate">
              · {hotdog.city}, {hotdog.country}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-[11px] uppercase tracking-[0.18em] text-[hsl(var(--ink))]/60 font-mono">
              {revealedCount}/{totalFacts} field notes
            </div>
            <button
              onClick={onStampClick}
              className="text-[12px] uppercase tracking-[0.18em] font-semibold px-3 py-1.5 rounded-sm border flex items-center gap-1.5 hover:bg-[hsl(var(--ink))] hover:text-[hsl(var(--paper))] transition-colors"
              style={{ borderColor: "hsl(var(--ink) / 0.35)" }}
            >
              <Stamp className="h-3.5 w-3.5" />
              Stamp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MobileActionBar({ onStampClick, backTo }: { onStampClick: () => void; backTo?: { path: string; label: string } }) {
  const navigate = useNavigate();
  const destination = backTo ?? { path: "/", label: "Atlas" };
  return (
    <div
      className="md:hidden fixed bottom-0 inset-x-0 z-50 border-t px-4 py-3 flex gap-3 backdrop-blur-md"
      style={{
        background: "hsl(var(--paper) / 0.95)",
        borderColor: "hsl(var(--ink) / 0.14)",
        boxShadow: "0 -6px 24px -12px hsl(var(--ink) / 0.35)",
      }}
    >
      <button
        onClick={() => navigate(destination.path)}
        className="flex-1 flex items-center justify-center gap-2 text-sm font-medium border rounded-md py-2.5 text-[hsl(var(--ink))]"
        style={{ borderColor: "hsl(var(--ink) / 0.25)" }}
      >
        <ArrowLeft className="h-4 w-4" /> {destination.label}
      </button>
      <button onClick={onStampClick} className="brass-button flex-1 flex items-center justify-center gap-2 text-sm">
        <Stamp className="h-4 w-4" /> Stamp Passport
      </button>
    </div>
  );
}

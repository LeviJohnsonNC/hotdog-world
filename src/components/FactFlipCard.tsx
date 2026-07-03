import { useState, useEffect, useMemo } from "react";
import { Sparkles } from "lucide-react";
import { useTriviaBadges } from "@/hooks/useTriviaBadges";

interface FactFlipCardProps {
  fact: string;
  index: number;
  isRevealed: boolean;
  onReveal: () => void;
}

const parseFactContent = (fact: string): { teaser: string; reveal: string } => {
  if (fact.includes("Teaser:") && fact.includes("Reveal:")) {
    const parts = fact.split("Reveal:");
    const teaser = parts[0].replace("Teaser:", "").trim();
    const reveal = parts[1].trim();
    return { teaser, reveal };
  }
  const q = fact.indexOf("?");
  if (q !== -1) {
    return { teaser: fact.substring(0, q + 1).trim(), reveal: fact.substring(q + 1).trim() };
  }
  return { teaser: fact, reveal: fact };
};

const handSize = (text: string): string => {
  const len = text.length;
  if (len < 60) return "text-[26px] leading-[1.15]";
  if (len < 110) return "text-[22px] leading-[1.2]";
  if (len < 180) return "text-[19px] leading-[1.25]";
  if (len < 260) return "text-[17px] leading-[1.3]";
  return "text-[15px] leading-[1.35]";
};

export function FactFlipCard({ fact, index, isRevealed, onReveal }: FactFlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(isRevealed);
  const [showSparkle, setShowSparkle] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const { incrementTriviaClick } = useTriviaBadges();

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const h = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  useEffect(() => {
    setIsFlipped(isRevealed);
  }, [isRevealed]);

  const handleFlip = () => {
    if (isFlipped || isRevealed) return;
    onReveal();
    incrementTriviaClick();
    setIsFlipped(true);
    setShowSparkle(true);
    setTimeout(() => setShowSparkle(false), 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleFlip();
    }
  };

  // Deterministic per-card tilt & ink rotation for character
  const tilt = useMemo(() => (((index * 37) % 5) - 2) * 0.4, [index]); // -0.8 to 0.8 deg
  const inkRot = useMemo(() => (((index * 53) % 3) - 1) * 0.6, [index]);

  const { teaser, reveal } = parseFactContent(fact);
  const label = String(index + 1).padStart(2, "0");

  return (
    <div
      className="flip-card-container"
      style={{
        animationDelay: prefersReducedMotion ? "0ms" : `${index * 60}ms`,
        transform: `rotate(${tilt}deg)`,
      }}
    >
      <button
        className={`flip-card ${isFlipped ? "flipped" : ""} ${prefersReducedMotion ? "no-motion" : ""}`}
        onClick={handleFlip}
        onKeyDown={handleKeyPress}
        aria-label={`Postcard ${index + 1}, ${isFlipped ? "revealed" : "hidden"}, ${teaser}`}
        aria-pressed={isFlipped}
      >
        {/* FRONT — question side (address-lines postcard image) */}
        <div className="flip-card-face flip-card-front">
          {/* Number in the stamp box (top-right) */}
          <span className="absolute top-[7%] right-[7%] postcard-type text-[11px] tracking-[0.2em] opacity-70">
            N°{label}
          </span>

          {/* Question written across the left "message" panel */}
          <div className="absolute inset-y-0 left-0 w-[54%] flex items-center px-[7%]">
            <p
              className={`postcard-hand ${handSize(teaser)} text-left w-full`}
              style={{ transform: `rotate(${inkRot}deg)` }}
            >
              {teaser}
            </p>
          </div>

          {/* Tap hint bottom-right */}
          {!isRevealed && (
            <span className="absolute bottom-[6%] right-[8%] postcard-type text-[9px] uppercase tracking-[0.28em] opacity-60">
              Turn over →
            </span>
          )}
        </div>

        {/* BACK — answer side (open aged paper image) */}
        <div className="flip-card-face flip-card-back">
          {/* Tiny question echo, typewritten across top-left */}
          <span className="absolute top-[8%] left-[8%] right-[28%] postcard-type text-[10px] uppercase tracking-[0.22em] opacity-55 line-clamp-2">
            Re: {teaser}
          </span>

          {/* Handwritten answer body, avoiding stamp corner */}
          <div className="absolute inset-0 flex items-center justify-center px-[9%] pt-[16%] pb-[10%]">
            <p
              className={`postcard-hand ${handSize(reveal)} text-center max-w-[92%]`}
              style={{ transform: `rotate(${-inkRot}deg)` }}
            >
              {reveal}
            </p>
          </div>

          {/* Signature-style flourish */}
          <span className="absolute bottom-[7%] right-[9%] postcard-hand text-[16px] opacity-60 italic">
            — from the cart
          </span>
        </div>
      </button>

      {showSparkle && !prefersReducedMotion && (
        <div className="sparkle-effect">
          <Sparkles className="h-6 w-6 text-mustard" />
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

interface FactFlipCardProps {
  fact: string;
  index: number;
  isRevealed: boolean;
  onReveal: () => void;
}

const parseFactContent = (fact: string): { teaser: string; reveal: string } => {
  // Check if fact has explicit teaser/reveal format
  if (fact.includes("Teaser:") && fact.includes("Reveal:")) {
    const parts = fact.split("Reveal:");
    const teaser = parts[0].replace("Teaser:", "").trim();
    const reveal = parts[1].trim();
    return { teaser, reveal };
  }
  
  // Fallback: generate teaser from first 4-6 words
  const words = fact.split(" ");
  const teaser = words.slice(0, Math.min(6, words.length)).join(" ") + "...";
  return { teaser, reveal: fact };
};

const getCardColor = (index: number): string => {
  const colors = ["bg-mustard/20", "bg-relish/20", "bg-tomato/20"];
  return colors[index % colors.length];
};

const getTextSize = (text: string): string => {
  const length = text.length;
  if (length < 100) return "text-base"; // 16px
  if (length < 150) return "text-sm"; // 14px
  return "text-sm"; // 14px minimum for readability
};

export function FactFlipCard({ fact, index, isRevealed, onReveal }: FactFlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(isRevealed);
  const [showSparkle, setShowSparkle] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Sync isFlipped state with isRevealed prop
  useEffect(() => {
    setIsFlipped(isRevealed);
  }, [isRevealed]);

  const handleFlip = () => {
    // Only allow flipping if not already revealed
    if (isFlipped || isRevealed) return;
    
    onReveal();
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

  const { teaser, reveal } = parseFactContent(fact);

  return (
    <div
      className="flip-card-container"
      style={{
        animationDelay: prefersReducedMotion ? "0ms" : `${index * 60}ms`,
      }}
    >
      <button
        className={`flip-card ${isFlipped ? "flipped" : ""} ${prefersReducedMotion ? "no-motion" : ""}`}
        onClick={handleFlip}
        onKeyDown={handleKeyPress}
        aria-label={`Fun fact ${index + 1}, ${isFlipped ? "revealed" : "hidden"}, ${teaser}`}
        aria-pressed={isFlipped}
      >
        {/* Front Side */}
        <div className={`flip-card-face flip-card-front ${getCardColor(index)} border-2 border-poppy/30`}>
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <p className="text-lg font-heading font-semibold text-foreground leading-relaxed">
              {teaser}
            </p>
          </div>
        </div>

        {/* Back Side */}
        <div className="flip-card-face flip-card-back bg-white border-2 border-mustard/40">
          <div className="flex flex-col h-full p-8">
            <p className="text-sm font-heading font-medium text-foreground leading-relaxed mb-3">
              {teaser}
            </p>
            <div className="border-t border-mustard/30 my-3" />
            <p className={`${getTextSize(reveal)} text-foreground leading-relaxed flex-1`}>
              {reveal}
            </p>
          </div>
        </div>
      </button>

      {/* Sparkle Animation */}
      {showSparkle && !prefersReducedMotion && (
        <div className="sparkle-effect">
          <Sparkles className="h-6 w-6 text-mustard" />
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

interface FactFlipCardProps {
  fact: string;
  index: number;
  isRevealed: boolean;
  onReveal: () => void;
}

const getFactTeaser = (fact: string): string => {
  // Extract first 4-6 words as teaser
  const words = fact.split(" ");
  return words.slice(0, Math.min(6, words.length)).join(" ") + "...";
};

const getCardColor = (index: number): string => {
  const colors = ["bg-mustard/20", "bg-relish/20", "bg-tomato/20"];
  return colors[index % colors.length];
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
        aria-label={`Fun fact ${index + 1}, ${isFlipped ? "revealed" : "hidden"}, ${getFactTeaser(fact)}`}
        aria-pressed={isFlipped}
      >
        {/* Front Side */}
        <div className={`flip-card-face flip-card-front ${getCardColor(index)} border-2 border-poppy/30`}>
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <p className="text-base font-display tracking-wide text-foreground leading-relaxed">
              {getFactTeaser(fact)}
            </p>
          </div>
        </div>

        {/* Back Side */}
        <div className="flip-card-face flip-card-back bg-white border-2 border-mustard/40">
          <div className="flex flex-col h-full p-8">
            <Badge variant="secondary" className="self-start mb-4 text-xs font-display tracking-wider">
              DID YOU KNOW?
            </Badge>
            <p className="text-base text-foreground/90 leading-relaxed">
              {fact}
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

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import { useTriviaBadges } from "@/hooks/useTriviaBadges";

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
  
  // Check if fact is in Q&A format (question? answer)
  const questionMarkIndex = fact.indexOf("?");
  if (questionMarkIndex !== -1) {
    const question = fact.substring(0, questionMarkIndex + 1).trim();
    const answer = fact.substring(questionMarkIndex + 1).trim();
    return { teaser: question, reveal: answer };
  }
  
  // Fallback: use full fact for both
  return { teaser: fact, reveal: fact };
};

const getCardColor = (index: number): string => {
  const colors = ["bg-mustard/20", "bg-relish/20", "bg-tomato/20"];
  return colors[index % colors.length];
};

const getTextSize = (text: string): string => {
  const length = text.length;
  if (length < 60) return "text-base"; // 16px - short facts
  if (length < 100) return "text-sm"; // 14px - medium facts
  if (length < 150) return "text-xs"; // 12px - longer facts
  if (length < 220) return "text-[11px] leading-tight"; // 11px tighter - very long
  return "text-[10px] leading-tight"; // 10px minimum with tight leading for extra long content
};

const getTeaserSize = (text: string): string => {
  const length = text.length;
  if (length < 40) return "text-sm";
  if (length < 60) return "text-xs";
  return "text-xs leading-snug";
};

const getPadding = (text: string): string => {
  const length = text.length;
  if (length < 120) return "p-8";
  if (length < 180) return "p-6";
  if (length < 250) return "p-5";
  return "p-4"; // More aggressive padding reduction for very long text
};

export function FactFlipCard({ fact, index, isRevealed, onReveal }: FactFlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(isRevealed);
  const [showSparkle, setShowSparkle] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const { incrementTriviaClick } = useTriviaBadges();

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
        <div className="flip-card-face flip-card-back bg-white border-2 border-mustard/40 overflow-hidden">
          <div className={`flex flex-col h-full ${getPadding(reveal)} overflow-hidden`}>
            <p className={`${getTeaserSize(teaser)} font-heading font-medium text-foreground leading-relaxed mb-2`}>
              {teaser}
            </p>
            <div className="border-t border-mustard/30 my-2" />
            <div className="flex-1 flex items-center justify-center overflow-hidden">
              <p className={`${getTextSize(reveal)} text-foreground leading-relaxed`}>
                {reveal}
              </p>
            </div>
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

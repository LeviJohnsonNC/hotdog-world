import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import sparklesIcon from "@/assets/icons/sparkles-icon.png";
import hotdogIcon from "@/assets/icons/hotdog-icon.png";
import globeIcon from "@/assets/icons/globe-icon.png";
import fireIcon from "@/assets/icons/fire-icon.png";
import partyIcon from "@/assets/icons/party-icon.png";

interface FactFlipCardProps {
  fact: string;
  index: number;
  isRevealed: boolean;
  onReveal: () => void;
}

const getFactIcon = (index: number): string => {
  const icons = [sparklesIcon, hotdogIcon, globeIcon, fireIcon, partyIcon];
  return icons[index % icons.length];
};

const getFactTeaser = (fact: string): string => {
  // Extract first 3-5 words as teaser
  const words = fact.split(" ");
  return words.slice(0, Math.min(5, words.length)).join(" ") + "...";
};

const getCardColor = (index: number): string => {
  const colors = ["bg-mustard/20", "bg-relish/20", "bg-tomato/20"];
  return colors[index % colors.length];
};

export function FactFlipCard({ fact, index, isRevealed, onReveal }: FactFlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
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

  const handleFlip = () => {
    if (!isFlipped && !isRevealed) {
      onReveal();
    }
    setIsFlipped(!isFlipped);
    
    if (!isFlipped) {
      setShowSparkle(true);
      setTimeout(() => setShowSparkle(false), 1000);
    }
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
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <img 
              src={getFactIcon(index)} 
              alt="Fact icon" 
              className="w-16 h-16 mb-4 object-contain"
            />
            <p className="text-sm font-display tracking-wide text-foreground/70 mb-3">
              {getFactTeaser(fact)}
            </p>
            <span className="text-xs text-muted-foreground font-display">TAP TO REVEAL</span>
          </div>
        </div>

        {/* Back Side */}
        <div className="flip-card-face flip-card-back bg-white border-2 border-mustard/40">
          <div className="flex flex-col h-full p-6">
            <Badge variant="secondary" className="self-start mb-3 text-xs font-display tracking-wide">
              DID YOU KNOW?
            </Badge>
            <p className="text-sm text-foreground/90 leading-relaxed">
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

import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useOnboardingNudges } from "@/hooks/useOnboardingNudges";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { toast } from "@/hooks/use-toast";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OnboardingNudgeProps {
  isFirstVisit: boolean;
  isNewVisit: boolean;
  visitCount: number;
}

export const OnboardingNudge = ({ isFirstVisit, isNewVisit, visitCount }: OnboardingNudgeProps) => {
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();
  const {
    hasShownFirstBadgeToast,
    markFirstBadgeShown,
    hasShownProgress3Toast,
    markProgress3Shown,
    hasShownProgress7InSession,
    markProgress7Shown,
    areProgressNudgesEnabled,
    disableProgressNudges,
  } = useOnboardingNudges();

  const [scrollProgress, setScrollProgress] = useState(0);
  const [showProgress3Banner, setShowProgress3Banner] = useState(false);
  const hasTriggeredRef = useRef(false);

  // Track scroll position
  useEffect(() => {
    if (reducedMotion) return;

    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      console.log('Scroll detected:', { scrollTop, docHeight, progress });
      setScrollProgress(progress);
    };

    // Check initial position
    handleScroll();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('scroll', handleScroll);
    };
  }, [reducedMotion]);

  // Trigger appropriate nudge based on milestone
  useEffect(() => {
    if (hasTriggeredRef.current || !isNewVisit || visitCount === 0) return;

    // Lower threshold for first badge to ensure it shows
    const scrollThreshold = isFirstVisit ? 5 : 20; // 5% for first badge, 20% for others

    const checkTrigger = () => {
      // Calculate scroll progress at check time
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      
      console.log('Onboarding check:', { scrollProgress: currentProgress, scrollThreshold, isFirstVisit, visitCount });
      
      if (currentProgress >= scrollThreshold) {
        hasTriggeredRef.current = true;
        console.log('Triggering nudge for visit count:', visitCount);

        // First visit - show "Passport Opened" badge toast
        if (isFirstVisit && !hasShownFirstBadgeToast()) {
          console.log('Showing first badge toast');
          toast({
            title: "🎉 New Badge Earned: Passport Opened",
            description: "Tap to view your Passport",
            duration: 4000,
            action: (
              <button
                onClick={() => navigate("/passport?tab=stats")}
                className="text-primary hover:text-primary/80 font-medium text-sm"
              >
                View
              </button>
            ),
          });
          markFirstBadgeShown();
        }
        // 3 dogs - show progress banner
        else if (visitCount === 3 && !hasShownProgress3Toast() && areProgressNudgesEnabled()) {
          setShowProgress3Banner(true);
          markProgress3Shown();
        }
        // 7 dogs - show foreshadowing toast
        else if (visitCount === 7 && !hasShownProgress7InSession() && areProgressNudgesEnabled()) {
          toast({
            title: "You're close…",
            description: "Only 3 dogs until the Librarian badge!",
            duration: 3000,
          });
          markProgress7Shown();
        }
        // 10 dogs - celebration!
        else if (visitCount === 10) {
          toast({
            title: "🥳 Badge Earned: The Librarian!",
            description: "Your passport just got upgraded.",
            duration: 5000,
            action: (
              <button
                onClick={() => navigate("/passport?tab=stats")}
                className="text-primary hover:text-primary/80 font-medium text-sm"
              >
                View
              </button>
            ),
          });
        }
      }
    };

    const timeoutId = setTimeout(checkTrigger, 1500);
    return () => clearTimeout(timeoutId);
  }, [
    isFirstVisit,
    isNewVisit,
    visitCount,
    hasShownFirstBadgeToast,
    markFirstBadgeShown,
    hasShownProgress3Toast,
    markProgress3Shown,
    hasShownProgress7InSession,
    markProgress7Shown,
    areProgressNudgesEnabled,
    navigate,
  ]);

  const handleDismissProgress3 = () => {
    setShowProgress3Banner(false);
    disableProgressNudges();
  };

  if (!showProgress3Banner) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
      <div className="bg-background/95 backdrop-blur-sm border-2 border-primary/20 rounded-lg shadow-[var(--shadow-elevated)] px-6 py-4 flex items-center gap-4 max-w-md">
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">
            Progress: <span className="text-primary font-semibold">3/10</span> dogs viewed
          </p>
          <button
            onClick={() => navigate("/passport?tab=stats")}
            className="text-xs text-primary/70 hover:text-primary transition-colors mt-1 flex items-center gap-1"
          >
            Librarian badge unlocks at 10 →
          </button>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDismissProgress3}
          className="h-6 w-6 shrink-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

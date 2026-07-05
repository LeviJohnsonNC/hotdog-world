import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTriviaBadges } from "@/hooks/useTriviaBadges";

// Storage keys for localStorage
const STORAGE_KEYS = {
  FIRST_BADGE: 'onboarding_first_badge_shown',
  PROGRESS_3: 'onboarding_progress_3_shown',
  PROGRESS_7: 'onboarding_progress_7_session',
  PROGRESS_ENABLED: 'onboarding_progress_nudges_enabled',
} as const;

interface OnboardingNudgeProps {
  isFirstVisit: boolean;
  isNewVisit: boolean;
  visitCount: number;
}

export const OnboardingNudge = ({ isFirstVisit, isNewVisit, visitCount }: OnboardingNudgeProps) => {
  const navigate = useNavigate();
  const [showProgress3Banner, setShowProgress3Banner] = useState(false);
  const hasTriggeredRef = useRef(false);
  const { getTriviaClickCount, hasShownFirstTriviaBadgeToast, markFirstTriviaBadgeToastShown } = useTriviaBadges();

  // Effect to check for first trivia badge (runs on mount and when trivia count changes)
  useEffect(() => {
    const triviaCount = getTriviaClickCount();
    if (triviaCount >= 1 && !hasShownFirstTriviaBadgeToast()) {
      const timeoutId = setTimeout(() => {
        toast({
          title: "🎉 New Badge Earned: Curious Clicker",
          description: "Tap to view your badges",
          duration: 10000,
          action: (
            <button
              onClick={() => navigate("/passport?tab=stats")}
              className="text-primary hover:text-primary/80 font-medium text-sm"
            >
              View
            </button>
          ),
        });
        markFirstTriviaBadgeToastShown();
      }, 800);
      return () => clearTimeout(timeoutId);
    }
  }, [getTriviaClickCount, hasShownFirstTriviaBadgeToast, markFirstTriviaBadgeToastShown, navigate]);

  // Single effect to trigger nudges - minimal dependencies
  useEffect(() => {
    // Guard: skip if already triggered, not a new visit, or initial state
    if (hasTriggeredRef.current || !isNewVisit || visitCount === 0) {
      return;
    }

    const timeoutId = setTimeout(() => {
      // Double-check we haven't triggered (in case of race condition)
      if (hasTriggeredRef.current) return;
      hasTriggeredRef.current = true;

      if (import.meta.env.DEV) console.log('Onboarding nudge triggered:', { isFirstVisit, visitCount });

      // First visit - show "Passport Opened" badge toast
      if (isFirstVisit) {
        const alreadyShown = localStorage.getItem(STORAGE_KEYS.FIRST_BADGE) === 'true';
        if (!alreadyShown) {
          if (import.meta.env.DEV) console.log('Showing first badge toast');
          toast({
            title: "🎉 New Badge Earned: Passport Opened",
            description: "Tap to view your Passport",
            duration: 10000,
            action: (
              <button
                onClick={() => navigate("/passport?tab=stats")}
                className="text-primary hover:text-primary/80 font-medium text-sm"
              >
                View
              </button>
            ),
          });
          localStorage.setItem(STORAGE_KEYS.FIRST_BADGE, 'true');
        }
        return;
      }

      // 3 dogs - show progress banner
      if (visitCount === 3) {
        const alreadyShown = localStorage.getItem(STORAGE_KEYS.PROGRESS_3) === 'true';
        const enabled = localStorage.getItem(STORAGE_KEYS.PROGRESS_ENABLED) !== 'false';
        if (!alreadyShown && enabled) {
          setShowProgress3Banner(true);
          localStorage.setItem(STORAGE_KEYS.PROGRESS_3, 'true');
        }
        return;
      }

      // 7 dogs - foreshadowing toast
      if (visitCount === 7) {
        const enabled = localStorage.getItem(STORAGE_KEYS.PROGRESS_ENABLED) !== 'false';
        const sessionTimestamp = localStorage.getItem(STORAGE_KEYS.PROGRESS_7);
        const fourHoursMs = 4 * 60 * 60 * 1000;
        const shownRecently = sessionTimestamp && (Date.now() - parseInt(sessionTimestamp, 10)) < fourHoursMs;
        
        if (enabled && !shownRecently) {
          toast({
            title: "You're close…",
            description: "Only 3 dogs until the Librarian badge!",
            duration: 3000,
          });
          localStorage.setItem(STORAGE_KEYS.PROGRESS_7, Date.now().toString());
        }
        return;
      }

      // 10 dogs - celebration!
      if (visitCount === 10) {
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
    }, 1500);

    return () => clearTimeout(timeoutId);
  }, [isFirstVisit, isNewVisit, visitCount, navigate]);

  const handleDismissProgress3 = () => {
    setShowProgress3Banner(false);
    localStorage.setItem(STORAGE_KEYS.PROGRESS_ENABLED, 'false');
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

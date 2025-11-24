const STORAGE_KEYS = {
  FIRST_BADGE: 'onboarding_first_badge_shown',
  PROGRESS_3: 'onboarding_progress_3_shown',
  PROGRESS_7: 'onboarding_progress_7_session',
  PROGRESS_ENABLED: 'onboarding_progress_nudges_enabled',
} as const;

export const useOnboardingNudges = () => {
  const hasShownFirstBadgeToast = (): boolean => {
    try {
      return localStorage.getItem(STORAGE_KEYS.FIRST_BADGE) === 'true';
    } catch {
      return false;
    }
  };

  const markFirstBadgeShown = () => {
    try {
      localStorage.setItem(STORAGE_KEYS.FIRST_BADGE, 'true');
    } catch (error) {
      console.error('Failed to mark first badge shown:', error);
    }
  };

  const hasShownProgress3Toast = (): boolean => {
    try {
      return localStorage.getItem(STORAGE_KEYS.PROGRESS_3) === 'true';
    } catch {
      return false;
    }
  };

  const markProgress3Shown = () => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROGRESS_3, 'true');
    } catch (error) {
      console.error('Failed to mark progress 3 shown:', error);
    }
  };

  const hasShownProgress7InSession = (): boolean => {
    try {
      const sessionTimestamp = localStorage.getItem(STORAGE_KEYS.PROGRESS_7);
      if (!sessionTimestamp) return false;
      
      // Consider it a new session if more than 4 hours have passed
      const fourHoursMs = 4 * 60 * 60 * 1000;
      const now = Date.now();
      return (now - parseInt(sessionTimestamp, 10)) < fourHoursMs;
    } catch {
      return false;
    }
  };

  const markProgress7Shown = () => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROGRESS_7, Date.now().toString());
    } catch (error) {
      console.error('Failed to mark progress 7 shown:', error);
    }
  };

  const areProgressNudgesEnabled = (): boolean => {
    try {
      const value = localStorage.getItem(STORAGE_KEYS.PROGRESS_ENABLED);
      return value !== 'false'; // Enabled by default
    } catch {
      return true;
    }
  };

  const disableProgressNudges = () => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROGRESS_ENABLED, 'false');
    } catch (error) {
      console.error('Failed to disable progress nudges:', error);
    }
  };

  return {
    hasShownFirstBadgeToast,
    markFirstBadgeShown,
    hasShownProgress3Toast,
    markProgress3Shown,
    hasShownProgress7InSession,
    markProgress7Shown,
    areProgressNudgesEnabled,
    disableProgressNudges,
  };
};

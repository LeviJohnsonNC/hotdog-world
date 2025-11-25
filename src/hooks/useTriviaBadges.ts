import { useUserProgress } from '@/contexts/UserProgressContext';

const FIRST_TRIVIA_TOAST_KEY = 'first_trivia_badge_shown';

/**
 * Backward compatibility wrapper for useTriviaBadges
 * @deprecated Use useUserProgress directly
 */
export const useTriviaBadges = () => {
  const { triviaClickCount, incrementTriviaClick } = useUserProgress();

  const getTriviaClickCount = (): number => {
    return triviaClickCount;
  };

  const incrementTriviaClickLegacy = (): number => {
    incrementTriviaClick();
    return triviaClickCount + 1;
  };

  const hasShownFirstTriviaBadgeToast = (): boolean => {
    try {
      return localStorage.getItem(FIRST_TRIVIA_TOAST_KEY) === 'true';
    } catch {
      return false;
    }
  };

  const markFirstTriviaBadgeToastShown = () => {
    try {
      localStorage.setItem(FIRST_TRIVIA_TOAST_KEY, 'true');
    } catch (error) {
      console.error('Failed to mark first trivia badge toast shown:', error);
    }
  };

  const clearTriviaData = () => {
    try {
      localStorage.removeItem(FIRST_TRIVIA_TOAST_KEY);
    } catch (error) {
      console.error('Failed to clear trivia data:', error);
    }
  };

  return {
    getTriviaClickCount,
    incrementTriviaClick: incrementTriviaClickLegacy,
    hasShownFirstTriviaBadgeToast,
    markFirstTriviaBadgeToastShown,
    clearTriviaData,
  };
};

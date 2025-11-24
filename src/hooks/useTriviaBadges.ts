const STORAGE_KEY = 'trivia_clicks_count';
const FIRST_TRIVIA_TOAST_KEY = 'first_trivia_badge_shown';

export const useTriviaBadges = () => {
  const getTriviaClickCount = (): number => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? parseInt(stored, 10) : 0;
    } catch {
      return 0;
    }
  };

  const incrementTriviaClick = (): number => {
    try {
      const current = getTriviaClickCount();
      const newCount = current + 1;
      localStorage.setItem(STORAGE_KEY, newCount.toString());
      return newCount;
    } catch (error) {
      console.error('Failed to increment trivia click:', error);
      return getTriviaClickCount();
    }
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
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(FIRST_TRIVIA_TOAST_KEY);
    } catch (error) {
      console.error('Failed to clear trivia data:', error);
    }
  };

  return {
    getTriviaClickCount,
    incrementTriviaClick,
    hasShownFirstTriviaBadgeToast,
    markFirstTriviaBadgeToastShown,
    clearTriviaData,
  };
};

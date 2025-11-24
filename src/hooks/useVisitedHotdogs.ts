import { useEffect } from 'react';

const VISITED_HOTDOGS_KEY = 'visited_hotdogs';

export const useVisitedHotdogs = () => {
  const getVisitedHotdogs = (): Set<string> => {
    try {
      const stored = localStorage.getItem(VISITED_HOTDOGS_KEY);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  };

  const recordVisit = (hotdogId: string) => {
    try {
      const visited = getVisitedHotdogs();
      visited.add(hotdogId);
      localStorage.setItem(VISITED_HOTDOGS_KEY, JSON.stringify(Array.from(visited)));
    } catch (error) {
      console.error('Failed to record hotdog visit:', error);
    }
  };

  const getVisitCount = (): number => {
    return getVisitedHotdogs().size;
  };

  return {
    getVisitedHotdogs,
    recordVisit,
    getVisitCount
  };
};

// Hook to auto-record visit when component mounts
export const useRecordHotdogVisit = (hotdogId: string | undefined) => {
  const { recordVisit } = useVisitedHotdogs();

  useEffect(() => {
    if (hotdogId) {
      recordVisit(hotdogId);
    }
  }, [hotdogId]);
};

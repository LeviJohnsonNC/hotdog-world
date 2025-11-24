import { useEffect, useState } from 'react';

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

  const recordVisit = (hotdogId: string): { isNewVisit: boolean; visitCount: number } => {
    try {
      const visited = getVisitedHotdogs();
      const isNewVisit = !visited.has(hotdogId);
      visited.add(hotdogId);
      localStorage.setItem(VISITED_HOTDOGS_KEY, JSON.stringify(Array.from(visited)));
      return { isNewVisit, visitCount: visited.size };
    } catch (error) {
      console.error('Failed to record hotdog visit:', error);
      return { isNewVisit: false, visitCount: 0 };
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
  const [visitInfo, setVisitInfo] = useState<{ isFirstVisit: boolean; isNewVisit: boolean; visitCount: number }>({
    isFirstVisit: false,
    isNewVisit: false,
    visitCount: 0,
  });

  useEffect(() => {
    if (hotdogId) {
      const { isNewVisit, visitCount } = recordVisit(hotdogId);
      const isFirstVisit = visitCount === 1;
      setVisitInfo({ isFirstVisit, isNewVisit, visitCount });
    }
  }, [hotdogId]);

  return visitInfo;
};

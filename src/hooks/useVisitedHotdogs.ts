import { useEffect, useState } from 'react';
import { useUserProgress } from '@/contexts/UserProgressContext';

/**
 * Backward compatibility wrapper for useVisitedHotdogs
 * @deprecated Use useUserProgress directly
 */
export const useVisitedHotdogs = () => {
  const { visitedHotdogs, recordVisit } = useUserProgress();

  const getVisitedHotdogs = (): Set<string> => {
    return visitedHotdogs;
  };

  const getVisitCount = (): number => {
    return visitedHotdogs.size;
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
      recordVisit(hotdogId).then(({ isNewVisit, visitCount }) => {
        const isFirstVisit = visitCount === 1;
        console.log('Visit recorded:', { hotdogId, isNewVisit, isFirstVisit, visitCount });
        setVisitInfo({ isFirstVisit, isNewVisit, visitCount });
      });
    }
  }, [hotdogId]);

  return visitInfo;
};

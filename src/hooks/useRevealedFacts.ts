import { useState, useEffect } from 'react';
import { useUserProgress } from '@/contexts/UserProgressContext';

/**
 * Unified hook for managing revealed facts - uses UserProgressContext
 * @deprecated Use useUserProgress directly for better error handling
 */
export const useRevealedFacts = (hotdogId: string) => {
  const { getRevealedFacts, revealedFactsLoading, revealFact } = useUserProgress();
  const [revealedIndices, setRevealedIndices] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setRevealedIndices(getRevealedFacts(hotdogId));
    setLoading(revealedFactsLoading);
  }, [hotdogId, revealedFactsLoading, getRevealedFacts]);

  const revealFactLegacy = async (index: number): Promise<boolean> => {
    const result = await revealFact(hotdogId, index);
    if (result.success) {
      setRevealedIndices(prev => [...prev, index]);
    }
    return result.success;
  };

  const isRevealed = (index: number): boolean => {
    return revealedIndices.includes(index);
  };

  return {
    revealedIndices,
    loading,
    revealFact: revealFactLegacy,
    isRevealed
  };
};

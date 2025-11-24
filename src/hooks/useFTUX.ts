import { useState, useEffect, useCallback } from 'react';

const FTUX_STORAGE_KEY = 'hasSeenFTUX';

type FTUXPhase = 'loading' | 'static' | 'rotating' | 'pulsing' | 'hinting' | 'complete';

export const useFTUX = (prefersReducedMotion: boolean) => {
  const [hasSeenFTUX, setHasSeenFTUX] = useState(true); // Default to true until we check
  const [ftuxPhase, setFTUXPhase] = useState<FTUXPhase>('complete');

  useEffect(() => {
    const seen = localStorage.getItem(FTUX_STORAGE_KEY);
    if (!seen && !prefersReducedMotion) {
      setHasSeenFTUX(false);
      setFTUXPhase('loading');
      
      // Choreographed timeline
      setTimeout(() => setFTUXPhase('static'), 0);
      setTimeout(() => setFTUXPhase('rotating'), 400);
      setTimeout(() => setFTUXPhase('pulsing'), 600);
      setTimeout(() => setFTUXPhase('hinting'), 1200);
      setTimeout(() => setFTUXPhase('complete'), 6000); // Auto-complete after full sequence
    }
  }, [prefersReducedMotion]);

  const markFTUXComplete = useCallback(() => {
    localStorage.setItem(FTUX_STORAGE_KEY, 'true');
    setHasSeenFTUX(true);
    setFTUXPhase('complete');
  }, []);

  return {
    hasSeenFTUX,
    ftuxPhase,
    markFTUXComplete,
    shouldShowFTUX: !hasSeenFTUX && !prefersReducedMotion,
  };
};

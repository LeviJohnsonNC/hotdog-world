import { useState, useEffect, useCallback } from 'react';

const FTUX_STORAGE_KEY = 'hasSeenFTUX';

type FTUXPhase = 'loading' | 'static' | 'rotating' | 'pulsing' | 'hinting' | 'complete';

export const useFTUX = (prefersReducedMotion: boolean) => {
  // Check localStorage synchronously to avoid flash
  const [hasSeenFTUX, setHasSeenFTUX] = useState(() => {
    return localStorage.getItem(FTUX_STORAGE_KEY) === 'true';
  });
  const [ftuxPhase, setFTUXPhase] = useState<FTUXPhase>('complete');

  useEffect(() => {
    if (!hasSeenFTUX && !prefersReducedMotion) {
      setFTUXPhase('loading');
      
      // Choreographed timeline
      console.log('FTUX: Starting sequence');
      setTimeout(() => {
        setFTUXPhase('static');
        console.log('FTUX: Phase = static');
      }, 50);
      setTimeout(() => {
        setFTUXPhase('rotating');
        console.log('FTUX: Phase = rotating');
      }, 400);
      setTimeout(() => {
        setFTUXPhase('pulsing');
        console.log('FTUX: Phase = pulsing (pins start pulsing)');
      }, 600);
      setTimeout(() => {
        setFTUXPhase('hinting');
        console.log('FTUX: Phase = hinting');
      }, 1400); // Show hint after pins finish pulsing (600ms + 800ms = 1400ms)
      setTimeout(() => {
        setFTUXPhase('complete');
        console.log('FTUX: Phase = complete');
      }, 4900); // Hint stays for 3500ms (1400ms + 3500ms = 4900ms)
    }
  }, [hasSeenFTUX, prefersReducedMotion]);

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

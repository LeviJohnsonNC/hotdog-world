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
        console.log('FTUX: Phase = pulsing');
      }, 600);
      setTimeout(() => {
        setFTUXPhase('hinting');
        console.log('FTUX: Phase = hinting');
      }, 1200);
      setTimeout(() => {
        setFTUXPhase('complete');
        console.log('FTUX: Phase = complete');
      }, 4700); // Hint appears at 1200ms, stays for 3500ms total
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

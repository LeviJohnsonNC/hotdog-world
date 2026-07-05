import { useState, useEffect, useRef, useCallback } from 'react';

const FTUX_STORAGE_KEY = 'hasSeenFTUX';

type FTUXPhase = 'loading' | 'static' | 'rotating' | 'pulsing' | 'hinting' | 'complete';

const debug = (...args: unknown[]) => {
  if (import.meta.env.DEV) console.log(...args);
};

export const useFTUX = (prefersReducedMotion: boolean) => {
  // Check localStorage synchronously to avoid flash
  const [hasSeenFTUX, setHasSeenFTUX] = useState(() => {
    try {
      return localStorage.getItem(FTUX_STORAGE_KEY) === 'true';
    } catch {
      return true; // storage unavailable — skip FTUX rather than replay forever
    }
  });
  const [ftuxPhase, setFTUXPhase] = useState<FTUXPhase>('complete');
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  const persistSeen = () => {
    try {
      localStorage.setItem(FTUX_STORAGE_KEY, 'true');
    } catch {
      /* ignore — worst case FTUX replays next visit */
    }
  };

  useEffect(() => {
    if (!hasSeenFTUX && !prefersReducedMotion) {
      setFTUXPhase('loading');

      // Choreographed timeline
      debug('FTUX: Starting sequence');
      const schedule = (fn: () => void, ms: number) => {
        timersRef.current.push(setTimeout(fn, ms));
      };
      schedule(() => {
        setFTUXPhase('static');
        debug('FTUX: Phase = static');
      }, 50);
      schedule(() => {
        setFTUXPhase('rotating');
        debug('FTUX: Phase = rotating');
      }, 400);
      schedule(() => {
        setFTUXPhase('pulsing');
        debug('FTUX: Phase = pulsing (pins start pulsing)');
      }, 600);
      schedule(() => {
        setFTUXPhase('hinting');
        debug('FTUX: Phase = hinting');
      }, 1400); // Show hint after pins finish pulsing (600ms + 800ms = 1400ms)
      schedule(() => {
        timersRef.current = []; // sequence finished — nothing left to cancel
        setFTUXPhase('complete');
        persistSeen();
        setHasSeenFTUX(true);
        debug('FTUX: Phase = complete, saved to localStorage');
      }, 4900); // Hint stays for 3500ms (1400ms + 3500ms = 4900ms)

      return () => {
        // Unmounting mid-sequence: stop the timers and record FTUX as seen —
        // the orphan timers previously did this several seconds later anyway.
        if (timersRef.current.length > 0) {
          clearTimers();
          persistSeen();
        }
      };
    }
  }, [hasSeenFTUX, prefersReducedMotion]);

  const markFTUXComplete = useCallback(() => {
    clearTimers(); // don't let queued phase changes resurrect the sequence
    persistSeen();
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

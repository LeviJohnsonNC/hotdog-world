import { useRef, useCallback } from 'react';

export const useSound = (src: string, volume = 0.3) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const srcRef = useRef<string>(src);

  const play = useCallback(() => {
    try {
      // (Re)create the element lazily, and again if the source ever changes
      if (!audioRef.current || srcRef.current !== src) {
        audioRef.current = new Audio(src);
        srcRef.current = src;
      }
      audioRef.current.volume = volume;

      // Reset to start if already playing
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((error) => {
        // Autoplay restrictions etc. — expected before first user gesture
        if (import.meta.env.DEV) console.warn('Audio play failed:', error);
      });
    } catch (error) {
      if (import.meta.env.DEV) console.warn('Sound effect error:', error);
    }
  }, [src, volume]);

  return play;
};

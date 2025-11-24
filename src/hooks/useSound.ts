import { useRef, useCallback } from 'react';

export const useSound = (src: string, volume = 0.3) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const play = useCallback(() => {
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio(src);
        audioRef.current.volume = volume;
      }
      
      // Reset to start if already playing
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((error) => {
        console.log('Audio play failed:', error);
      });
    } catch (error) {
      console.log('Sound effect error:', error);
    }
  }, [src, volume]);

  return play;
};

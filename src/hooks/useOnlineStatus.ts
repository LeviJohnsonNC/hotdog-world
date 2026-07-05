import { useState, useEffect, useRef } from 'react';

/**
 * Hook to detect online/offline status and notify user
 */
export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [wasOffline, setWasOffline] = useState(false);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setWasOffline(true);

      // Reset wasOffline flag after 5 seconds
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      resetTimerRef.current = setTimeout(() => setWasOffline(false), 5000);
    };

    const handleOffline = () => {
      // Cancel a pending reset so a quick offline→online flap doesn't
      // clear the banner out from under the new online event
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  return { isOnline, wasOffline };
};

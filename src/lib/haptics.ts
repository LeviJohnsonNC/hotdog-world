/**
 * Tiny haptic feedback wrapper. Fires a short vibration on devices that
 * support it (Android Chrome); silently no-ops elsewhere (iOS Safari has
 * no navigator.vibrate). Never throws — haptics are pure garnish.
 */
export const vibrate = (ms = 10): void => {
  try {
    navigator.vibrate?.(ms);
  } catch {
    /* no-op */
  }
};

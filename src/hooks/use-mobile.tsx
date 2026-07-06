import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  // Initialize synchronously: this is a client-only app, and starting at
  // `false` made the first render always take the desktop path on phones
  // (desktop camera distance, desktop texture downloads) before snapping
  // to mobile after the effect ran.
  const [isMobile, setIsMobile] = React.useState<boolean>(
    () => window.innerWidth < MOBILE_BREAKPOINT
  );

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isMobile;
}

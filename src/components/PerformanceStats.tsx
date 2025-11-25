import { useFrame } from "@react-three/fiber";
import { useState, useRef } from "react";

/**
 * Optional performance monitoring component (dev only)
 * Shows FPS and render statistics
 */
export const PerformanceStats = ({ enabled = false }: { enabled?: boolean }) => {
  const [fps, setFps] = useState(0);
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());

  useFrame(() => {
    if (!enabled) return;

    frameCount.current++;
    const now = performance.now();

    if (now >= lastTime.current + 1000) {
      const currentFps = Math.round((frameCount.current * 1000) / (now - lastTime.current));
      setFps(currentFps);
      frameCount.current = 0;
      lastTime.current = now;
    }
  });

  if (!enabled || process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div 
      style={{
        position: 'absolute',
        top: 10,
        left: 10,
        background: 'rgba(0,0,0,0.7)',
        color: '#00ff00',
        padding: '8px 12px',
        borderRadius: '4px',
        fontFamily: 'monospace',
        fontSize: '12px',
        zIndex: 1000,
        pointerEvents: 'none',
      }}
    >
      <div>FPS: {fps}</div>
      <div style={{ fontSize: '10px', marginTop: '4px', color: '#888' }}>
        {fps >= 55 ? '✓ Optimal' : fps >= 30 ? '⚠ Fair' : '✗ Poor'}
      </div>
    </div>
  );
};

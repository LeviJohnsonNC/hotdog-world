import { useState, useRef, useEffect } from "react";
import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Group } from "three";
import { Hotdog } from "@/types/hotdog";
import { HotdogModel } from "./HotdogModel";

interface HotdogPinProps {
  position: [number, number, number];
  onClick: () => void;
  hotdog: Hotdog;
  shouldPulse?: boolean;
  pulseDelay?: number;
  introDelay?: number;
}

export function HotdogPin({
  position,
  onClick,
  hotdog,
  shouldPulse = false,
  pulseDelay = 0,
  introDelay = 0,
}: HotdogPinProps) {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef<Group>(null);
  const pulseStartRef = useRef<number | null>(null);
  const introStartRef = useRef<number>(performance.now() + introDelay);
  const hasStartedPulseRef = useRef(false);

  useEffect(() => {
    if (shouldPulse && !hasStartedPulseRef.current) {
      hasStartedPulseRef.current = true;
      const timer = setTimeout(() => {
        pulseStartRef.current = performance.now();
      }, pulseDelay);
      return () => clearTimeout(timer);
    }
    if (!shouldPulse) {
      pulseStartRef.current = null;
      hasStartedPulseRef.current = false;
    }
  }, [shouldPulse, pulseDelay]);

  useFrame(() => {
    const g = groupRef.current;
    if (!g) return;

    // INTRO: smooth scale-in
    const introT = (performance.now() - introStartRef.current) / 500;
    const introP = Math.min(Math.max(introT, 0), 1);
    const introScale = introP < 1 ? introP * introP * (3 - 2 * introP) : 1;

    if (pulseStartRef.current) {
      const duration = 1000;
      const elapsed = (performance.now() - pulseStartRef.current) % duration;
      const progress = elapsed / duration;
      g.scale.setScalar(introScale * (1 + 0.6 * Math.sin(progress * Math.PI)));
      return;
    }

    // Hover spring (relative to intro scale)
    const target = hovered ? 1.18 : 1;
    const currentRel = g.scale.x / Math.max(introScale, 0.001);
    const next = currentRel + (target - currentRel) * 0.18;
    g.scale.setScalar(introScale * next);
  });

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
    >
      <HotdogModel hovered={hovered} imageUrl={hotdog.globeImage ?? hotdog.image} position={position} />

      {hovered && (
        <Html
          position={[0, 0.3, 0]}
          center
          distanceFactor={8}
          style={{
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          <div className="bg-card/90 text-card-foreground px-2 py-1 rounded-md shadow-sm whitespace-nowrap animate-fade-in leading-tight">
            <p className="font-heading font-semibold text-[9px]">{hotdog.name}</p>
            <p className="text-[8px] font-normal text-muted-foreground/80">{hotdog.city}</p>
          </div>
        </Html>
      )}
    </group>
  );
}

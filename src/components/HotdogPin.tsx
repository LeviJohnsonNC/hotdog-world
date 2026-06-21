import { useState, useRef, useEffect, useMemo } from "react";
import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Group, AdditiveBlending, DoubleSide, Color, Quaternion, Vector3 } from "three";
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

const UP = new Vector3(0, 1, 0);

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
  const haloRef = useRef<any>(null);
  const pulseStartRef = useRef<number | null>(null);
  const introStartRef = useRef<number>(performance.now() + introDelay);
  const hasStartedPulseRef = useRef(false);

  // Orient halo flat against the surface (face outward from globe center)
  const haloQuaternion = useMemo(() => {
    const dir = new Vector3(...position).normalize();
    const q = new Quaternion().setFromUnitVectors(UP, dir);
    return q;
  }, [position]);

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

    // INTRO: rippled fade+scale-in (runs once)
    const introT = (performance.now() - introStartRef.current) / 600;
    const introP = Math.min(Math.max(introT, 0), 1);
    const introScale = introP < 1 ? introP * introP * (3 - 2 * introP) : 1; // smoothstep

    // PULSE (FTUX) — overrides idle scale
    let baseScale = introScale;
    if (pulseStartRef.current) {
      const duration = 1000;
      const elapsed = (performance.now() - pulseStartRef.current) % duration;
      const progress = elapsed / duration;
      baseScale = introScale * (1 + 0.6 * Math.sin(progress * Math.PI));
    } else {
      // Hover spring
      const target = hovered ? 1.18 : 1;
      const current = g.scale.x / Math.max(introScale, 0.001);
      const next = current + (target - current) * 0.18;
      baseScale = introScale * next;
    }
    g.scale.setScalar(baseScale);

    // Halo gentle breathing pulse
    if (haloRef.current) {
      const t = performance.now() * 0.001;
      const breath = 0.6 + 0.4 * (0.5 + 0.5 * Math.sin(t * 1.6));
      const hoverBoost = hovered ? 1.5 : 1;
      haloRef.current.material.opacity = 0.35 * breath * hoverBoost * introP;
      const haloScale = (hovered ? 1.35 : 1) * (0.95 + 0.05 * Math.sin(t * 1.6));
      haloRef.current.scale.setScalar(haloScale);
    }
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
      {/* Glowing ground halo flat against the globe */}
      <mesh
        ref={haloRef}
        quaternion={haloQuaternion}
        position={[0, 0, 0]}
        renderOrder={19}
      >
        <ringGeometry args={[0.05, 0.14, 32]} />
        <meshBasicMaterial
          color={new Color("#ffb347")}
          transparent
          opacity={0.35}
          blending={AdditiveBlending}
          depthWrite={false}
          depthTest={false}
          side={DoubleSide}
        />
      </mesh>

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

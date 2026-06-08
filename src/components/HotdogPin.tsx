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
}

export function HotdogPin({ position, onClick, hotdog, shouldPulse = false, pulseDelay = 0 }: HotdogPinProps) {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef<Group>(null);
  const pulseStartTime = useRef<number | null>(null);
  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    // Only start pulsing when shouldPulse becomes true
    if (shouldPulse && !pulseStartTime.current && !isPulsing) {
      console.log(`Pin "${hotdog.name}" will pulse in ${pulseDelay}ms`);
      setTimeout(() => {
        pulseStartTime.current = Date.now();
        setIsPulsing(true);
        console.log(`Pin "${hotdog.name}" PULSING NOW!`);
      }, pulseDelay);
    }
  }, [shouldPulse, pulseDelay, hotdog.name, isPulsing]);

  useFrame(() => {
    if (!isPulsing || !groupRef.current || !pulseStartTime.current) return;

    const elapsed = Date.now() - pulseStartTime.current;
    const duration = 1000; // Faster pulse: 1000ms

    if (elapsed > duration) {
      // Loop the pulse continuously during FTUX
      if (shouldPulse) {
        pulseStartTime.current = Date.now(); // Restart pulse immediately
      } else {
        groupRef.current.scale.setScalar(1);
        setIsPulsing(false);
        console.log(`Pin "${hotdog.name}" pulse complete`);
      }
      return;
    }

    // ULTRA dramatic breathing animation: 1.0 -> 1.6 -> 1.0 (60% size increase!)
    const progress = elapsed / duration;
    const scale = 1 + 0.6 * Math.sin(progress * Math.PI);
    groupRef.current.scale.setScalar(scale);
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

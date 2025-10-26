import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { Hotdog } from "@/types/hotdog";
import { HotdogModel } from "./HotdogModel";

interface HotdogPinProps {
  position: [number, number, number];
  onClick: () => void;
  hotdog: Hotdog;
}

export function HotdogPin({ position, onClick, hotdog }: HotdogPinProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Calculate rotation to make hotdog perpendicular to Earth surface
  const rotation = useMemo(() => {
    const posVector = new THREE.Vector3(...position);
    const up = new THREE.Vector3(0, 1, 0);
    const quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors(up, posVector.clone().normalize());
    return new THREE.Euler().setFromQuaternion(quaternion);
  }, [position]);

  useFrame((state) => {
    if (groupRef.current && hovered) {
      const baseY = position[1];
      groupRef.current.position.y = baseY + Math.sin(state.clock.elapsedTime * 3) * 0.05;
    } else if (groupRef.current) {
      groupRef.current.position.y = position[1];
    }
  });

  return (
    <group position={position}>
      <group
        ref={groupRef}
        rotation={rotation}
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
        <HotdogModel hovered={hovered} imageUrl={hotdog.image} />
      </group>
      
      {hovered && (
        <Html
          position={[0, 0.4, 0]}
          center
          distanceFactor={6}
          style={{
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          <div className="bg-card text-card-foreground px-3 py-2 rounded-lg shadow-lg border-2 border-primary whitespace-nowrap animate-fade-in">
            <p className="font-heading font-semibold text-sm">{hotdog.name}</p>
            <p className="text-xs text-muted-foreground">{hotdog.city}</p>
          </div>
        </Html>
      )}
    </group>
  );
}

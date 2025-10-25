import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { Hotdog } from "@/types/hotdog";

interface HotdogPinProps {
  position: [number, number, number];
  onClick: () => void;
  hotdog: Hotdog;
}

export function HotdogPin({ position, onClick, hotdog }: HotdogPinProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current && hovered) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    } else if (meshRef.current) {
      meshRef.current.position.y = position[1];
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
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
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color="#E63946"
          emissive="#E63946"
          emissiveIntensity={hovered ? 0.8 : 0.4}
          roughness={0.3}
        />
      </mesh>
      
      {hovered && (
        <Html
          position={[0, 0.3, 0]}
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

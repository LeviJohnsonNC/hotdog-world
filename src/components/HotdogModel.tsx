import { useRef } from "react";
import * as THREE from "three";

interface HotdogModelProps {
  hovered: boolean;
}

export function HotdogModel({ hovered }: HotdogModelProps) {
  const scale = hovered ? 1.1 : 1;
  
  return (
    <group scale={[scale, scale, scale]}>
      {/* Bun bottom */}
      <mesh position={[0, -0.05, 0]} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.04, 0.12, 8, 16]} />
        <meshStandardMaterial 
          color="#F3E9D2" 
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>
      
      {/* Bun top edge */}
      <mesh position={[0, 0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.035, 0.12, 8, 16]} />
        <meshStandardMaterial 
          color="#E8D5B5" 
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>
      
      {/* Sausage */}
      <mesh position={[0, -0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.03, 0.14, 8, 16]} />
        <meshStandardMaterial 
          color="#D84A4A" 
          roughness={0.5}
          metalness={0.2}
        />
      </mesh>
      
      {/* Mustard stripe */}
      <mesh position={[0, 0.01, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.008, 0.008, 0.12, 8]} />
        <meshStandardMaterial 
          color="#F6BD60" 
          emissive="#F6BD60" 
          emissiveIntensity={hovered ? 0.4 : 0.2}
          roughness={0.4}
        />
      </mesh>
      
      {/* Ketchup stripe */}
      <mesh position={[0, 0.005, 0.015]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.006, 0.006, 0.10, 8]} />
        <meshStandardMaterial 
          color="#E63946" 
          emissive="#E63946" 
          emissiveIntensity={hovered ? 0.3 : 0.1}
          roughness={0.3}
        />
      </mesh>
    </group>
  );
}

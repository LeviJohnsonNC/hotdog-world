import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useIsMobile } from "@/hooks/use-mobile";

export function Stars() {
  const points = useRef<THREE.Points>(null);
  const isMobile = useIsMobile();
  
  // Mobile optimization: reduce star count
  const starCount = isMobile ? 1000 : 2000;
  
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(starCount * 3);
    
    for (let i = 0; i < starCount; i++) {
      const distance = Math.random() * 15 + 8;
      const theta = THREE.MathUtils.randFloatSpread(360);
      const phi = THREE.MathUtils.randFloatSpread(360);
      
      const x = distance * Math.sin(theta) * Math.cos(phi);
      const y = distance * Math.sin(theta) * Math.sin(phi);
      const z = distance * Math.cos(theta);
      
      positions.set([x, y, z], i * 3);
    }
    
    return positions;
  }, [starCount]);

  useFrame(() => {
    if (points.current) {
      points.current.rotation.y += 0.0001;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesPosition.length / 3}
          array={particlesPosition}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#ffffff"
        sizeAttenuation
        transparent
        opacity={0.8}
      />
    </points>
  );
}

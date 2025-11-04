import { useLoader, useFrame, useThree } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";

interface HotdogModelProps {
  hovered: boolean;
  imageUrl: string;
  position: [number, number, number];
}

export function HotdogModel({ hovered, imageUrl, position }: HotdogModelProps) {
  const texture = useLoader(THREE.TextureLoader, imageUrl);
  const spriteRef = useRef<THREE.Sprite>(null);
  const { camera, size } = useThree();
  const [edgeFade, setEdgeFade] = useState(1);
  
  useFrame(() => {
    if (!spriteRef.current) return;
    
    // Calculate screen position
    const worldPos = new THREE.Vector3(...position);
    const screenPos = worldPos.clone().project(camera);
    
    // Calculate distance from edges (0 = edge, 1 = center)
    const edgeDistanceX = 1 - Math.abs(screenPos.x);
    const edgeDistanceY = 1 - Math.abs(screenPos.y);
    const minEdgeDistance = Math.min(edgeDistanceX, edgeDistanceY);
    
    // Fade out when getting close to edges (within 15% of edge)
    const fadeThreshold = 0.15;
    const fade = minEdgeDistance < fadeThreshold 
      ? Math.max(0.3, minEdgeDistance / fadeThreshold)
      : 1;
    
    setEdgeFade(fade);
  });
  
  const baseScale = hovered ? 0.24 : 0.18;
  const adjustedScale = baseScale * edgeFade;
  
  return (
    <sprite ref={spriteRef} scale={[adjustedScale, adjustedScale, 1]} renderOrder={10}>
      <spriteMaterial 
        map={texture} 
        transparent 
        opacity={edgeFade}
        sizeAttenuation={true}
        depthTest={true}
        depthWrite={false}
      />
    </sprite>
  );
}

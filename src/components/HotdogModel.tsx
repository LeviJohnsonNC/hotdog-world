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
    
    // Get world position of the sprite
    const worldPos = new THREE.Vector3();
    spriteRef.current.getWorldPosition(worldPos);
    
    // Calculate if this hotdog is facing the camera (backface culling)
    // Surface normal at hotdog position (normalized position vector from origin)
    const surfaceNormal = worldPos.clone().normalize();
    
    // Vector from hotdog to camera
    const toCamera = camera.position.clone().sub(worldPos).normalize();
    
    // Dot product: positive = facing camera, negative = facing away
    const dotProduct = surfaceNormal.dot(toCamera);
    
    // Hide pins on the back side (with small threshold for smooth transition)
    const isVisible = dotProduct > -0.1;
    spriteRef.current.visible = isVisible;
    
    // Only calculate edge fade if visible (performance optimization)
    if (!isVisible) {
      setEdgeFade(0);
      return;
    }
    
    // Calculate screen position for edge fade
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
        depthTest={false}
        depthWrite={false}
      />
    </sprite>
  );
}

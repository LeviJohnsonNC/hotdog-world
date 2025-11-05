import { useLoader, useFrame, useThree } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";

interface HotdogSpriteModelProps {
  hovered: boolean;
  spriteSheetUrl: string;
  spriteX: number;
  spriteY: number;
  spriteWidth: number;
  spriteHeight: number;
  position: [number, number, number];
}

export function HotdogSpriteModel({ 
  hovered, 
  spriteSheetUrl, 
  spriteX, 
  spriteY, 
  spriteWidth, 
  spriteHeight,
  position 
}: HotdogSpriteModelProps) {
  const texture = useLoader(THREE.TextureLoader, spriteSheetUrl);
  const spriteRef = useRef<THREE.Sprite>(null);
  const { camera } = useThree();
  const [edgeFade, setEdgeFade] = useState(1);
  
  // Calculate UV coordinates for this specific hotdog in the sprite sheet
  // Assuming sprite sheet is 2048x2048 (8x8 grid of 256x256 sprites)
  const SHEET_SIZE = 2048;
  
  const uvOffsetX = spriteX / SHEET_SIZE;
  const uvOffsetY = 1 - (spriteY + spriteHeight) / SHEET_SIZE; // Flip Y for WebGL
  const uvRepeatX = spriteWidth / SHEET_SIZE;
  const uvRepeatY = spriteHeight / SHEET_SIZE;
  
  // Configure texture UV mapping once
  if (texture) {
    texture.offset.set(uvOffsetX, uvOffsetY);
    texture.repeat.set(uvRepeatX, uvRepeatY);
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
  }
  
  useFrame(() => {
    if (!spriteRef.current) return;
    
    // Calculate screen position using actual world position after globe rotation
    const worldPos = new THREE.Vector3();
    spriteRef.current.getWorldPosition(worldPos);
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
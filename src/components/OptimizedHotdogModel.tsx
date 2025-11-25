import { useLoader, useFrame, useThree } from "@react-three/fiber";
import { useRef, useState, useMemo } from "react";
import * as THREE from "three";

interface OptimizedHotdogModelProps {
  hovered: boolean;
  imageUrl: string;
  position: [number, number, number];
  hotdogId: string;
}

// Frustum for culling (shared across all instances)
const frustum = new THREE.Frustum();
const projScreenMatrix = new THREE.Matrix4();

export function OptimizedHotdogModel({ hovered, imageUrl, position, hotdogId }: OptimizedHotdogModelProps) {
  const texture = useLoader(THREE.TextureLoader, imageUrl);
  const spriteRef = useRef<THREE.Sprite>(null);
  const { camera } = useThree();
  
  const [edgeFade, setEdgeFade] = useState(1);
  const [isVisible, setIsVisible] = useState(true);
  
  // Throttle visibility checks (only check every 4 frames = ~15 checks per second @ 60fps)
  const frameCounter = useRef(0);
  const VISIBILITY_CHECK_INTERVAL = 4;
  
  // Cache world position to avoid recalculating every frame
  const worldPosCache = useRef(new THREE.Vector3());
  const lastCameraPos = useRef(new THREE.Vector3());
  const POSITION_UPDATE_THRESHOLD = 0.1; // Only update if camera moved significantly
  
  // Memoize surface normal (constant for each hotdog)
  const surfaceNormal = useMemo(() => {
    return new THREE.Vector3(...position).normalize();
  }, [position[0], position[1], position[2]]);
  
  useFrame(() => {
    if (!spriteRef.current) return;
    
    // Throttle visibility checks
    frameCounter.current++;
    if (frameCounter.current % VISIBILITY_CHECK_INTERVAL !== 0) {
      return;
    }
    
    // Update cached world position only if camera moved significantly
    const cameraMoved = camera.position.distanceTo(lastCameraPos.current) > POSITION_UPDATE_THRESHOLD;
    if (cameraMoved || worldPosCache.current.lengthSq() === 0) {
      spriteRef.current.getWorldPosition(worldPosCache.current);
      lastCameraPos.current.copy(camera.position);
    }
    
    // Frustum culling - skip if outside camera view
    projScreenMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    frustum.setFromProjectionMatrix(projScreenMatrix);
    
    if (!frustum.containsPoint(worldPosCache.current)) {
      if (spriteRef.current.visible) {
        spriteRef.current.visible = false;
        setIsVisible(false);
        setEdgeFade(0);
      }
      return;
    }
    
    // Backface culling - use cached surface normal
    const toCamera = camera.position.clone().sub(worldPosCache.current).normalize();
    const dotProduct = surfaceNormal.dot(toCamera);
    
    const shouldBeVisible = dotProduct > -0.1;
    
    if (shouldBeVisible !== isVisible) {
      setIsVisible(shouldBeVisible);
      spriteRef.current.visible = shouldBeVisible;
    }
    
    // Only calculate edge fade if visible
    if (!shouldBeVisible) {
      if (edgeFade !== 0) setEdgeFade(0);
      return;
    }
    
    // Calculate screen position for edge fade (using cached world position)
    const screenPos = worldPosCache.current.clone().project(camera);
    
    // Calculate distance from edges
    const edgeDistanceX = 1 - Math.abs(screenPos.x);
    const edgeDistanceY = 1 - Math.abs(screenPos.y);
    const minEdgeDistance = Math.min(edgeDistanceX, edgeDistanceY);
    
    // Fade out when getting close to edges
    const fadeThreshold = 0.15;
    const newFade = minEdgeDistance < fadeThreshold 
      ? Math.max(0.3, minEdgeDistance / fadeThreshold)
      : 1;
    
    // Only update state if changed significantly (avoid unnecessary re-renders)
    if (Math.abs(newFade - edgeFade) > 0.05) {
      setEdgeFade(newFade);
    }
  });
  
  const baseScale = hovered ? 0.24 : 0.18;
  const adjustedScale = baseScale * edgeFade;
  
  return (
    <sprite 
      ref={spriteRef} 
      scale={[adjustedScale, adjustedScale, 1]} 
      renderOrder={20}
    >
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

import { useLoader, useFrame, useThree } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";

// Shared warm radial-gradient glow for pin hover, generated once at runtime
// and reused by every pin (a procedural halo, not pin imagery — the
// individual-image-URL rule applies to the hotdog art itself).
let glowTexture: THREE.CanvasTexture | null = null;
function getGlowTexture(): THREE.CanvasTexture {
  if (!glowTexture) {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 64;
    const ctx = canvas.getContext("2d")!;
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, "rgba(255, 214, 120, 0.9)");
    gradient.addColorStop(0.5, "rgba(255, 176, 80, 0.35)");
    gradient.addColorStop(1, "rgba(255, 176, 80, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    glowTexture = new THREE.CanvasTexture(canvas);
  }
  return glowTexture;
}

interface HotdogModelProps {
  hovered: boolean;
  imageUrl: string;
  position: [number, number, number];
}

export function HotdogModel({ hovered, imageUrl, position }: HotdogModelProps) {
  const texture = useLoader(THREE.TextureLoader, imageUrl);
  const spriteRef = useRef<THREE.Sprite>(null);
  const glowRef = useRef<THREE.Sprite>(null);
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

    // Hover glow mirrors the pin's visibility; opacity eases in/out
    const glow = glowRef.current;
    if (glow) {
      glow.visible = isVisible;
      const mat = glow.material as THREE.SpriteMaterial;
      const target = isVisible && hovered ? 1.0 * edgeFade : 0;
      mat.opacity += (target - mat.opacity) * 0.15;
    }

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
  
  const baseScale = 0.18;
  const adjustedScale = baseScale * edgeFade;
  const glowScale = 0.42 * edgeFade;

  return (
    <>
      {/* Hover halo — drawn just beneath the pin image (renderOrder 9 vs 10) */}
      <sprite ref={glowRef} scale={[glowScale, glowScale, 1]} renderOrder={9}>
        <spriteMaterial
          map={getGlowTexture()}
          transparent
          opacity={0}
          sizeAttenuation={true}
          depthTest={false}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>
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
    </>
  );
}

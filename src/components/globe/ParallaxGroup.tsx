import { useEffect, useRef, ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Subtle pointer parallax for the background starfield ONLY. The camera is
// owned by OrbitControls and the dolly/spin/zoom phases — never offset it.
// Rotating the star shell a few milliradians gives the same depth cue with
// zero risk to pin projection, backface culling, or the spin physics.

interface ParallaxGroupProps {
  children: ReactNode;
}

export function ParallaxGroup({ children }: ParallaxGroupProps) {
  const groupRef = useRef<THREE.Group>(null);
  const pointerRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      pointerRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointerRef.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, []);

  useFrame(() => {
    const g = groupRef.current;
    if (!g) return;
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, pointerRef.current.x * 0.035, 0.05);
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, -pointerRef.current.y * 0.025, 0.05);
  });

  return <group ref={groupRef}>{children}</group>;
}

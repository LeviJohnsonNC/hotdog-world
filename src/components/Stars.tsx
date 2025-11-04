import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function Stars() {
  const points = useRef<THREE.Points>(null);
  
  // Create circular gradient texture for stars
  const circularTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;
    
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.2, 'rgba(255,255,255,1)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    
    return new THREE.CanvasTexture(canvas);
  }, []);
  
  const { positions, sizes, colors, twinkleIndices } = useMemo(() => {
    const positions = new Float32Array(2000 * 3);
    const sizes = new Float32Array(2000);
    const colors = new Float32Array(2000 * 3);
    const twinkleIndices: number[] = [];
    
    // Color palettes (RGB values)
    const pureWhite = [1, 1, 1];
    const blueWhite = [0.94, 0.96, 1]; // #f0f4ff
    const warmWhite = [1, 0.97, 0.94]; // #fff8f0
    
    for (let i = 0; i < 2000; i++) {
      // Layer-based distance distribution for depth
      const rand = Math.random();
      let distance: number;
      let size: number;
      
      if (rand < 0.8) {
        // Background stars (80%) - distant and small
        distance = Math.random() * 8 + 12; // 12-20 units
        size = 0.008;
      } else if (rand < 0.95) {
        // Mid-ground stars (15%) - medium distance
        distance = Math.random() * 4 + 8; // 8-12 units
        size = 0.015;
      } else {
        // Foreground stars (5%) - closer and larger
        distance = Math.random() * 2 + 6; // 6-8 units
        size = 0.025;
        // Mark some foreground stars for twinkling (~10% of foreground = ~0.5% total)
        if (Math.random() < 0.1) {
          twinkleIndices.push(i);
        }
      }
      
      // Spherical distribution
      const theta = THREE.MathUtils.randFloatSpread(360);
      const phi = THREE.MathUtils.randFloatSpread(360);
      
      const x = distance * Math.sin(theta) * Math.cos(phi);
      const y = distance * Math.sin(theta) * Math.sin(phi);
      const z = distance * Math.cos(theta);
      
      positions.set([x, y, z], i * 3);
      
      // Vary size slightly within layer
      sizes[i] = size * (0.8 + Math.random() * 0.4);
      
      // Subtle color temperature variation
      const colorRand = Math.random();
      let color: number[];
      if (colorRand < 0.7) {
        color = pureWhite;
      } else if (colorRand < 0.9) {
        color = blueWhite;
      } else {
        color = warmWhite;
      }
      
      // Vary brightness (opacity through color intensity)
      const brightness = 0.2 + Math.random() * 0.4; // 0.2 to 0.6
      colors.set([
        color[0] * brightness,
        color[1] * brightness,
        color[2] * brightness
      ], i * 3);
    }
    
    return { positions, sizes, colors, twinkleIndices };
  }, []);

  // Gentle twinkle animation
  useFrame((state) => {
    if (points.current) {
      // Slow rotation
      points.current.rotation.y += 0.0001;
      
      // Animate twinkling stars
      const geometry = points.current.geometry;
      const sizeAttribute = geometry.getAttribute('size') as THREE.BufferAttribute;
      
      if (sizeAttribute) {
        const time = state.clock.getElapsedTime();
        
        twinkleIndices.forEach((index) => {
          const baseSize = sizes[index];
          // Slow, gentle pulse (3-5 second cycles with phase offset per star)
          const phase = index * 0.1;
          const cycle = 3 + (index % 20) * 0.1; // 3-5 second cycles
          const pulse = Math.sin(time / cycle + phase) * 0.5 + 0.5; // 0 to 1
          const scale = 0.7 + pulse * 0.6; // 0.7 to 1.3
          sizeAttribute.array[index] = baseSize * scale;
        });
        
        sizeAttribute.needsUpdate = true;
      }
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={sizes.length}
          array={sizes}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        map={circularTexture}
        size={1}
        vertexColors
        sizeAttenuation
        transparent
        opacity={1}
        depthWrite={false}
      />
    </points>
  );
}

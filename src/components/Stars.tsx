import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useIsMobile } from "@/hooks/use-mobile";

// Twinkling starfield with per-star size/color variety, plus occasional
// shooting stars. Under reduced motion the stars render at constant
// brightness and nothing drifts or shoots.

const starVertex = /* glsl */ `
  attribute float aSize;
  attribute vec3 aColor;
  attribute float aPhase;
  attribute float aSpeed;
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uBaseSize;
  uniform float uReduced;
  varying vec3 vColor;
  varying float vTwinkle;
  void main() {
    vColor = aColor;
    vTwinkle = uReduced > 0.5
      ? 1.0
      : 0.72 + 0.28 * sin(uTime * aSpeed + aPhase);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * uPixelRatio * uBaseSize * (1.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const starFragment = /* glsl */ `
  varying vec3 vColor;
  varying float vTwinkle;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.15, d) * vTwinkle * 0.9;
    gl_FragColor = vec4(vColor, a);
  }
`;

// 70% white, 20% pale blue, 10% warm — subtle spectral variety
const STAR_PALETTE: [number, number, number][] = [
  [1.0, 1.0, 1.0],
  [0.75, 0.85, 1.0],
  [1.0, 0.91, 0.77],
];
const pickStarColor = (): [number, number, number] => {
  const r = Math.random();
  return STAR_PALETTE[r < 0.7 ? 0 : r < 0.9 ? 1 : 2];
};

interface StarsProps {
  prefersReducedMotion?: boolean;
}

export function Stars({ prefersReducedMotion = false }: StarsProps) {
  const points = useRef<THREE.Points>(null);
  const shooting = useRef<THREE.Points>(null);
  const isMobile = useIsMobile();
  const gl = useThree((state) => state.gl);

  const starCount = isMobile ? 1000 : 2000;
  const shootingCount = 3;

  const starAttributes = useMemo(() => {
    const positions = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);
    const colors = new Float32Array(starCount * 3);
    const phases = new Float32Array(starCount);
    const speeds = new Float32Array(starCount);
    for (let i = 0; i < starCount; i++) {
      const distance = Math.random() * 15 + 8;
      const theta = THREE.MathUtils.randFloatSpread(360);
      const phi = THREE.MathUtils.randFloatSpread(360);
      positions.set(
        [
          distance * Math.sin(theta) * Math.cos(phi),
          distance * Math.sin(theta) * Math.sin(phi),
          distance * Math.cos(theta),
        ],
        i * 3
      );
      sizes[i] = 0.6 + Math.random();
      colors.set(pickStarColor(), i * 3);
      phases[i] = Math.random() * Math.PI * 2;
      speeds[i] = 0.5 + Math.random() * 1.5;
    }
    return { positions, sizes, colors, phases, speeds };
  }, [starCount]);

  const starMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: starVertex,
        fragmentShader: starFragment,
        uniforms: {
          uTime: { value: 0 },
          uPixelRatio: { value: gl.getPixelRatio() },
          uBaseSize: { value: 55.0 },
          uReduced: { value: prefersReducedMotion ? 1.0 : 0.0 },
        },
        transparent: true,
        depthWrite: false,
      }),
    [gl, prefersReducedMotion]
  );

  // Shooting star state: position + velocity + life
  const shooters = useMemo(() => {
    return Array.from({ length: shootingCount }, () => ({
      pos: new THREE.Vector3(),
      vel: new THREE.Vector3(),
      life: 0,
      nextSpawn: Math.random() * 6 + 2,
    }));
  }, []);

  const shootPositions = useMemo(() => new Float32Array(shootingCount * 3), []);

  useFrame((_, delta) => {
    if (prefersReducedMotion) return;

    starMaterial.uniforms.uTime.value += delta;
    if (points.current) points.current.rotation.y += 0.0001;

    if (shooting.current) {
      const attr = shooting.current.geometry.getAttribute("position") as THREE.BufferAttribute;
      shooters.forEach((s, i) => {
        if (s.life > 0) {
          s.pos.addScaledVector(s.vel, delta);
          s.life -= delta;
          if (s.life <= 0) {
            // hide far away
            s.pos.set(9999, 9999, 9999);
          }
        } else {
          s.nextSpawn -= delta;
          if (s.nextSpawn <= 0) {
            // Spawn at a random far point, fly across
            const r = 14;
            const theta = Math.random() * Math.PI * 2;
            const phi = (Math.random() - 0.5) * Math.PI * 0.6;
            s.pos.set(
              r * Math.cos(phi) * Math.cos(theta),
              r * Math.sin(phi) + 3,
              r * Math.cos(phi) * Math.sin(theta)
            );
            const dir = new THREE.Vector3(
              -s.pos.x + (Math.random() - 0.5) * 6,
              -s.pos.y + (Math.random() - 0.5) * 4,
              -s.pos.z + (Math.random() - 0.5) * 6
            ).normalize();
            s.vel.copy(dir.multiplyScalar(18));
            s.life = 1.2;
            s.nextSpawn = Math.random() * 8 + 5;
          } else {
            s.pos.set(9999, 9999, 9999);
          }
        }
        attr.setXYZ(i, s.pos.x, s.pos.y, s.pos.z);
      });
      attr.needsUpdate = true;
    }
  });

  return (
    <>
      <points ref={points} material={starMaterial}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={starCount}
            array={starAttributes.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-aSize"
            count={starCount}
            array={starAttributes.sizes}
            itemSize={1}
          />
          <bufferAttribute
            attach="attributes-aColor"
            count={starCount}
            array={starAttributes.colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-aPhase"
            count={starCount}
            array={starAttributes.phases}
            itemSize={1}
          />
          <bufferAttribute
            attach="attributes-aSpeed"
            count={starCount}
            array={starAttributes.speeds}
            itemSize={1}
          />
        </bufferGeometry>
      </points>

      <points ref={shooting}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={shootingCount}
            array={shootPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.12} color="#bfe8ff" sizeAttenuation transparent opacity={0.95} />
      </points>
    </>
  );
}

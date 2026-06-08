import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useIsMobile } from "@/hooks/use-mobile";

export function Stars() {
  const points = useRef<THREE.Points>(null);
  const shooting = useRef<THREE.Points>(null);
  const isMobile = useIsMobile();

  const starCount = isMobile ? 1000 : 2000;
  const shootingCount = 3;

  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(starCount * 3);
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
    }
    return positions;
  }, [starCount]);

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
      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particlesPosition.length / 3}
            array={particlesPosition}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.02} color="#ffffff" sizeAttenuation transparent opacity={0.8} />
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

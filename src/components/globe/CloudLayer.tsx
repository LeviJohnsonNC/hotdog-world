import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Procedural drifting clouds: 3D value-noise FBM evaluated on the sphere's
// object-space normal (no UV pole pinching), on a shell just above the
// terrain. The layer rotates independently of the earth group so clouds
// drift relative to the continents. Desktop-only (mounted conditionally by
// Globe); under reduced motion the drift is frozen but the layer remains.

const cloudVertex = /* glsl */ `
  varying vec3 vPos;
  varying vec3 vWorldNormal;
  void main() {
    vPos = normalize(position);
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const cloudFragment = /* glsl */ `
  uniform float uTime;
  uniform float uCoverage;
  uniform float uOpacity;
  uniform vec3 uSunDir;
  varying vec3 vPos;
  varying vec3 vWorldNormal;

  float hash(vec3 p) {
    return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453);
  }

  // Trilinear value noise
  float noise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    vec3 u = f * f * (3.0 - 2.0 * f);
    float n000 = hash(i);
    float n100 = hash(i + vec3(1.0, 0.0, 0.0));
    float n010 = hash(i + vec3(0.0, 1.0, 0.0));
    float n110 = hash(i + vec3(1.0, 1.0, 0.0));
    float n001 = hash(i + vec3(0.0, 0.0, 1.0));
    float n101 = hash(i + vec3(1.0, 0.0, 1.0));
    float n011 = hash(i + vec3(0.0, 1.0, 1.0));
    float n111 = hash(i + vec3(1.0, 1.0, 1.0));
    return mix(
      mix(mix(n000, n100, u.x), mix(n010, n110, u.x), u.y),
      mix(mix(n001, n101, u.x), mix(n011, n111, u.x), u.y),
      u.z
    );
  }

  float fbm(vec3 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 4; i++) {
      value += amplitude * noise(p);
      p *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    vec3 p = vPos * 3.5 + vec3(uTime * 0.015, 0.0, uTime * 0.01);
    float n = fbm(p);
    float alpha = smoothstep(uCoverage, uCoverage + 0.28, n) * uOpacity;
    // Brighten sunward, dim on the night side (matches the key light)
    float sun = 0.75 + 0.25 * clamp(dot(vWorldNormal, uSunDir), 0.0, 1.0);
    gl_FragColor = vec4(vec3(1.0, 0.98, 0.95) * sun, alpha);
  }
`;

const noRaycast = () => null;

interface CloudLayerProps {
  prefersReducedMotion: boolean;
}

export function CloudLayer({ prefersReducedMotion }: CloudLayerProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: cloudVertex,
        fragmentShader: cloudFragment,
        uniforms: {
          uTime: { value: 0 },
          uCoverage: { value: 0.52 },
          uOpacity: { value: 0.32 },
          uSunDir: { value: new THREE.Vector3(6, 3, 5).normalize() },
        },
        transparent: true,
        depthWrite: false,
        side: THREE.FrontSide,
      }),
    []
  );

  useFrame((_, delta) => {
    if (prefersReducedMotion) return;
    material.uniforms.uTime.value += delta;
    if (meshRef.current) {
      // Slow independent drift relative to the terrain
      meshRef.current.rotation.y += 0.00045;
    }
  });

  return (
    <mesh ref={meshRef} material={material} renderOrder={2} raycast={noRaycast}>
      <sphereGeometry args={[2.035, 64, 64]} />
    </mesh>
  );
}

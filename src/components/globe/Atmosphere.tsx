import { useMemo } from "react";
import * as THREE from "three";

// Fresnel atmosphere: an inner limb glow hugging the surface plus a soft
// outer halo behind the planet. Both are additive, write no depth, and
// ignore raycasts so they can never block pin clicks or OrbitControls.
// renderOrder 0/1 keeps them far below the pin sprites at renderOrder 10.

const limbVertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewDir = normalize(-mvPosition.xyz);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

// Inner glow: brightens at grazing angles (classic fresnel rim)
const limbFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uIntensity;
  uniform float uPower;
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    float fresnel = pow(1.0 - clamp(dot(vNormal, vViewDir), 0.0, 1.0), uPower);
    gl_FragColor = vec4(uColor, fresnel * uIntensity);
  }
`;

// Outer halo: rendered on the back faces of a larger sphere so the glow
// appears as a soft ring of scattered light around the planet's limb.
// Back-face normals point away from the camera, so dot(N, V) is negative;
// uBias shifts it positive near the limb, uFalloff shapes the fade.
const haloFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uIntensity;
  uniform float uBias;
  uniform float uFalloff;
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    float rim = pow(clamp(dot(vNormal, vViewDir) + uBias, 0.0, 1.0), uFalloff);
    gl_FragColor = vec4(uColor, rim * uIntensity);
  }
`;

const noRaycast = () => null;

export function Atmosphere() {
  const limbMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: limbVertex,
        fragmentShader: limbFragment,
        uniforms: {
          uColor: { value: new THREE.Color(0.45, 0.7, 1.0) },
          uIntensity: { value: 0.9 },
          uPower: { value: 3.0 },
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.FrontSide,
      }),
    []
  );

  const haloMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: limbVertex,
        fragmentShader: haloFragment,
        uniforms: {
          uColor: { value: new THREE.Color(0.35, 0.6, 1.0) },
          uIntensity: { value: 0.55 },
          uBias: { value: 0.68 },
          uFalloff: { value: 4.5 },
        },
        transparent: true,
        depthWrite: false,
        depthTest: false,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
      }),
    []
  );

  return (
    <>
      {/* Outer halo — behind everything (renderOrder 0) */}
      <mesh material={haloMaterial} renderOrder={0} raycast={noRaycast}>
        <sphereGeometry args={[2.35, 48, 48]} />
      </mesh>
      {/* Inner limb glow — depth-tested so the planet occludes its far side */}
      <mesh material={limbMaterial} renderOrder={1} raycast={noRaycast}>
        <sphereGeometry args={[2.012, 64, 64]} />
      </mesh>
    </>
  );
}

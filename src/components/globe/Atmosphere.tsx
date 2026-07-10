import { useMemo } from "react";
import * as THREE from "three";
import { SUN_DIRECTION } from "./sunDirection";

// Sun-aware fresnel atmosphere: an inner limb glow hugging the surface plus a
// soft outer halo behind the planet. Both are additive, write no depth, and
// ignore raycasts so they can never block pin clicks or OrbitControls.
// renderOrder 0/1 keeps them far below the pin sprites at renderOrder 10.
//
// The color of the rim now varies with the sun direction so the day side
// reads cyan (Rayleigh-ish), the terminator glows warm gold, and the night
// limb fades to a deep space blue — same two-mesh cost as before.

const limbVertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying vec3 vWorldNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewDir = normalize(-mvPosition.xyz);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

// Inner glow: brightens at grazing angles, tinted by sun direction.
// Day limb  -> cool cyan   (Rayleigh scatter)
// Terminator -> warm gold  (sunset ring)
// Night limb -> deep blue  (residual glow)
const limbFragment = /* glsl */ `
  uniform vec3 uSunDir;
  uniform vec3 uDayColor;
  uniform vec3 uTerminatorColor;
  uniform vec3 uNightColor;
  uniform float uIntensity;
  uniform float uPower;
  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying vec3 vWorldNormal;

  void main() {
    float fresnel = pow(1.0 - clamp(dot(vNormal, vViewDir), 0.0, 1.0), uPower);
    float sunDot = dot(normalize(vWorldNormal), normalize(uSunDir));
    // 1.0 = full day, 0.0 = terminator, -1.0 = full night
    float day   = smoothstep(0.05, 0.55, sunDot);
    float night = smoothstep(0.05, 0.55, -sunDot);
    float term  = 1.0 - day - night;
    vec3 tint = uDayColor * day + uTerminatorColor * term + uNightColor * night;
    // Slight boost at the terminator so the sunset ring reads clearly.
    float intensity = uIntensity * (1.0 + term * 0.4);
    gl_FragColor = vec4(tint, fresnel * intensity);
  }
`;

// Outer halo: rendered on the back faces of a larger sphere so the glow
// appears as a soft ring of scattered light around the planet's limb.
// Back-face normals point away from the camera, so dot(N, V) is negative;
// uBias shifts it positive near the limb, uFalloff shapes the fade.
const haloFragment = /* glsl */ `
  uniform vec3 uSunDir;
  uniform vec3 uDayColor;
  uniform vec3 uTerminatorColor;
  uniform vec3 uNightColor;
  uniform float uIntensity;
  uniform float uBias;
  uniform float uFalloff;
  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying vec3 vWorldNormal;

  void main() {
    float rim = pow(clamp(dot(vNormal, vViewDir) + uBias, 0.0, 1.0), uFalloff);
    // Use the outward-facing world normal for sun tint (back-face renders
    // invert the geometric normal, so flip it here).
    vec3 outward = -normalize(vWorldNormal);
    float sunDot = dot(outward, normalize(uSunDir));
    float day   = smoothstep(0.0, 0.6, sunDot);
    float night = smoothstep(0.0, 0.6, -sunDot);
    float term  = 1.0 - day - night;
    vec3 tint = uDayColor * day + uTerminatorColor * term + uNightColor * night;
    gl_FragColor = vec4(tint, rim * uIntensity);
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
          uSunDir: { value: SUN_DIRECTION.clone() },
          uDayColor: { value: new THREE.Color(0.42, 0.72, 1.05) },
          uTerminatorColor: { value: new THREE.Color(1.0, 0.72, 0.42) },
          uNightColor: { value: new THREE.Color(0.18, 0.32, 0.62) },
          uIntensity: { value: 0.95 },
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
          uSunDir: { value: SUN_DIRECTION.clone() },
          uDayColor: { value: new THREE.Color(0.32, 0.58, 1.0) },
          uTerminatorColor: { value: new THREE.Color(1.0, 0.65, 0.38) },
          uNightColor: { value: new THREE.Color(0.12, 0.22, 0.5) },
          uIntensity: { value: 0.6 },
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

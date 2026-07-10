import { useMemo } from "react";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { SUN_DIRECTION } from "./sunDirection";

// Additive "city lights" shell rendered just above the earth surface.
// We don't ship a black-marble texture; instead we detect land in-shader by
// sampling the same day map the surface uses and looking at how NOT-blue a
// pixel is (oceans are strongly blue-dominant). That landness value is
// multiplied by procedural FBM noise so lights cluster into pseudo-cities
// rather than lighting the entire continent uniformly. The whole layer is
// masked by the night hemisphere via dot(N, sunDir), with a soft terminator
// falloff so lights fade in as the sun sets.
//
// Desktop-only. RenderOrder 3 (above surface + clouds, below atmosphere limb).
// raycast disabled so pin hitboxes are never blocked.

const nightVertex = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorldNormal;
  void main() {
    vUv = uv;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const nightFragment = /* glsl */ `
  uniform sampler2D uMap;
  uniform vec3 uSunDir;
  uniform vec3 uLightColor;
  uniform float uIntensity;
  varying vec2 vUv;
  varying vec3 vWorldNormal;

  float hash(vec3 p) {
    return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453);
  }

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
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p *= 2.1;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    // Landness: oceans are blue-dominant on the day map. Land pixels have
    // red/green comparable to or above blue, so (r+g)*0.5 - b is a decent
    // proxy for "not-ocean" without needing a separate landmask.
    vec3 day = texture2D(uMap, vUv).rgb;
    float landness = clamp(((day.r + day.g) * 0.5 - day.b) * 3.0 + 0.15, 0.0, 1.0);

    // Pseudo-city density: two octaves of noise at different frequencies —
    // large clusters gated by fine sparkle so isolated pixels light up.
    vec3 p = vec3(vUv * 220.0, 0.0);
    float cluster = smoothstep(0.25, 0.70, fbm(p * 0.05));
    float sparkle = smoothstep(0.35, 0.85, fbm(p * 0.6));
    float density = cluster * sparkle + 0.15 * cluster;

    // Night mask with soft terminator ramp
    float ndl = dot(normalize(vWorldNormal), normalize(uSunDir));
    float night = smoothstep(0.30, -0.02, ndl);

    float alpha = landness * density * night * uIntensity;
    gl_FragColor = vec4(uLightColor * alpha, alpha);
  }
`;

const noRaycast = () => null;

export function NightLights() {
  // Reuse the same day texture the desktop surface already downloaded, so
  // this layer costs zero additional network bytes.
  const map = useLoader(THREE.TextureLoader, "/textures/earth-day-1920.webp");

  const material = useMemo(() => {
    map.colorSpace = THREE.SRGBColorSpace;
    map.wrapS = THREE.RepeatWrapping;
    map.wrapT = THREE.ClampToEdgeWrapping;
    return new THREE.ShaderMaterial({
      vertexShader: nightVertex,
      fragmentShader: nightFragment,
      uniforms: {
        uMap: { value: map },
        uSunDir: { value: SUN_DIRECTION.clone() },
        uLightColor: { value: new THREE.Color("#ffdca0") },
        uIntensity: { value: 2.6 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.FrontSide,
    });
  }, [map]);

  return (
    <mesh material={material} renderOrder={3} raycast={noRaycast}>
      <sphereGeometry args={[2.004, 64, 64]} />
    </mesh>
  );
}

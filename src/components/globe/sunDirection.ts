import * as THREE from "three";

// Shared sun direction — must match the warm key <directionalLight> in Globe.tsx.
// Threaded into every atmosphere/cloud/night-lights shader so lighting stays
// coherent across layers. Normalized so shaders can dot() it directly.
export const SUN_POSITION = new THREE.Vector3(6, 3, 5);
export const SUN_DIRECTION = SUN_POSITION.clone().normalize();

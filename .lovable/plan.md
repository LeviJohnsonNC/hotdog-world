# Make Night Lights Visible

## Why nothing looks different

The `NightLights` shell is rendering — it's just landing in a place you can't see and at an intensity you can't perceive.

- **Sun placement:** `SUN_POSITION = (6, 3, 5)` puts the sun on the same side as the default camera (front-right-top). The visible hemisphere is almost entirely "day," so the terminator sits near the left limb and everything past it — the actual night side — is on the back of the globe. Only a thin crescent of night is ever on-screen at rest.
- **Shader is too shy:** `smoothstep(0.55, 0.85, fbm) * smoothstep(0.62, 0.95, fbm) * landness * night * 1.35` produces very sparse dots at very low alpha. Additively blended over a nearly-black night surface, they read as noise, not cities.

## Fix

### 1. Shift the sun so the terminator sweeps across the visible face

Edit `src/components/globe/sunDirection.ts` to move the sun to the side/back instead of behind the camera. Target roughly one third of the visible hemisphere in shadow — enough to show a real night arc with a warm terminator, but not so much that day-side detail is lost.

```ts
export const SUN_POSITION = new THREE.Vector3(-4, 2.5, 3.5);
```

Then update the matching `<directionalLight position={[6, 3, 5]}>` in `Globe.tsx` (line 494) to `position={[-4, 2.5, 3.5]}` so the real scene lighting stays coherent with the shader uniform. Leave the two fill lights at lines 499 and 505 as-is — they're rim/back fill and don't reference the sun.

This single change also makes the *terminator glow* work from Step 1 pay off (you'll actually see the warm gold band).

### 2. Loosen the city-lights shader so the lit strip reads clearly

In `src/components/globe/NightLights.tsx`:

- Drop the cluster/sparkle thresholds so more pixels qualify:
  - `smoothstep(0.55, 0.85, ...)` → `smoothstep(0.35, 0.75, ...)`
  - `smoothstep(0.62, 0.95, ...)` → `smoothstep(0.45, 0.90, ...)`
- Widen the night ramp so lights fade in earlier (closer to the terminator, where they read best):
  - `smoothstep(0.15, -0.15, ndl)` → `smoothstep(0.25, -0.05, ndl)`
- Bump `uIntensity` from `1.35` → `2.6`.
- Nudge `uLightColor` slightly warmer/brighter: `#ffd28a` → `#ffdca0`.

These are all uniforms/constants — no structural change, still one draw call, still zero extra network cost.

### 3. Verify visibly

After the change, at rest the globe should show:
- A clear day hemisphere (Africa/Americas well lit as before).
- A warm terminator arc curving down through the visible face.
- Faint but recognizable clusters of golden pinpricks on the night side of visible landmasses (eastern Africa/Europe edge in the second screenshot's framing).

If clusters still look like fog, we tighten `smoothstep(0.55, 0.9, fbm * 0.6)` on sparkle to reintroduce point-like sparkle before shipping.

## Scope guardrails

- No changes to pin projection, spin/zoom, FTUX, mobile globe, or any data/backend code.
- Only `sunDirection.ts`, one `directionalLight` position in `Globe.tsx`, and `NightLights.tsx` are touched.
- Atmosphere shader from Step 1 automatically re-tints because it reads the same `SUN_DIRECTION` — nothing to change there.

## Out of scope

Ocean specular (Step 3), aurora, shooting stars, pin upgrades, post-processing, continent labels, audio bed — all still queued for later steps.

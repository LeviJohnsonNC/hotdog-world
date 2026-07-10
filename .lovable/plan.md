# Tone Down the Terminator Band + Actually Show City Lights

## What's happening

- **Bright tan wash:** The atmosphere **halo** (`renderOrder 0`, `depthTest: false`, back-face sphere at r=2.35) has `uIntensity: 0.6` with `uBias: 0.68` / `uFalloff: 4.5`. Combined with the warm terminator tint it bleeds deep into the night hemisphere as a broad tan band — that's what you're seeing wrap the right side of the globe.
- **City lights invisible:** The bloom pass amplifies that halo, and the halo's warm cast sits *over* the same pixels the NightLights layer paints. Additive gold pinpricks at `uIntensity: 2.6` get drowned by an already-warm background. The NightLights shell renders (renderOrder 3), it just doesn't read against the wash.

## Fix

### 1. `src/components/globe/Atmosphere.tsx` — shrink and cool the band

Halo (drop overall punch, tighten to the limb):
- `uIntensity: 0.6` → `0.28`
- `uBias: 0.68` → `0.80` (rim starts closer to the silhouette)
- `uFalloff: 4.5` → `6.5` (sharper fade so it stops encroaching on the disk)
- `uTerminatorColor: (1.0, 0.65, 0.38)` → `(0.95, 0.62, 0.42)` (marginally desaturated)

Inner limb (dial back terminator bloom):
- `uIntensity: 0.95` → `0.55`
- In `limbFragment`, change `intensity = uIntensity * (1.0 + term * 0.4)` → `* (1.0 + term * 0.15)`
- Narrow the terminator by moving the day/night ramps outward: `smoothstep(0.05, 0.55, sunDot)` → `smoothstep(-0.05, 0.35, sunDot)` (same for the `-sunDot` line). This makes `term` non-zero over a narrower band.

Result: silhouette still has a warm rim near the terminator, but it no longer paints half the night side tan.

### 2. `src/components/globe/NightLights.tsx` — make lights punch through

Uniforms:
- `uIntensity: 2.6` → `4.5`
- `uLightColor: #ffdca0` → `#fff2c8` (whiter/brighter — reads against any residual warm halo, and the bloom threshold picks it up as sparkle instead of tint)

Shader (denser + brighter clusters):
- `smoothstep(0.35, 0.75, fbm(p * 0.05))` → `smoothstep(0.25, 0.70, ...)` (cluster)
- `smoothstep(0.45, 0.90, fbm(p * 0.6))` → `smoothstep(0.35, 0.85, ...)` (sparkle)
- Add a small emissive floor for landmass mid-tones so faint city glow shows even outside cluster peaks: change `float density = cluster * sparkle;` → `float density = cluster * sparkle + 0.15 * cluster;`
- Pull lights slightly earlier past the terminator: `smoothstep(0.25, -0.05, ndl)` → `smoothstep(0.30, -0.02, ndl)`

Layer ordering (guarantee lights sit above the atmosphere wash regardless of bloom order):
- Change `renderOrder={3}` → `renderOrder={4}`
- Bump sphere radius `2.004` → `2.006` to avoid any z-fight with surface bumpMap at grazing angles.

### 3. Verify

Reload and confirm at rest:
- The terminator now reads as a thin warm arc hugging the silhouette (not a wide tan wash).
- On the night hemisphere of Africa/Europe/Middle East (visible in the current framing), warm pinpricks resolve into recognizable clusters — Nile delta, coastal Mediterranean, western Europe if in view.

If clusters still look muddy after this, next iteration would be raising the bloom threshold slightly so only the city sparkle blooms, not the halo — but I expect this round to be sufficient.

## Scope guardrails

- Only `src/components/globe/Atmosphere.tsx` and `src/components/globe/NightLights.tsx` change.
- No changes to sun direction (Step 2), ocean specular (Step 3), pins, spin/zoom, FTUX, mobile globe, data, or backend.
- Same draw-call count (2 atmosphere + 1 nightlights).

## Out of scope

Aurora, shooting stars, pin upgrades, post-processing tuning, continent labels, ambient audio.

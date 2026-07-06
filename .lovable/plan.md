## Two small, scoped tweaks to the globe

### 1. Hover jitter on hotdog pins

**Diagnosis**
When you hover a pin, two independent scale bumps stack on top of each other:

- `src/components/HotdogPin.tsx` (line 64): the whole pin group springs to `1.18×`.
- `src/components/HotdogModel.tsx` (line 91): the sprite's own `baseScale` jumps from `0.18` → `0.24`.

Combined, the sprite (and therefore its pointer hitbox) grows ~1.57× the instant `hovered` becomes true. If your cursor was near the original pin's edge, the enlarged sprite moves *under* the cursor for one frame — but then the spring/edge-fade math or a neighbouring pin can steal the pointer, `onPointerOut` fires, the sprite shrinks, the cursor is inside again, `onPointerOver` fires… classic hover feedback loop. That's the "sweet spot" feeling: only cursor positions that stay inside *both* the small and large hitboxes are stable.

**Fix**
Keep the pin's hitbox size constant on hover so `onPointerOver`/`onPointerOut` can't ping-pong. The warm glow sprite already conveys the hover state; we let it do the work.

- `src/components/HotdogPin.tsx`: remove the hover branch in the `useFrame` scale spring. Keep intro scale-in and FTUX pulse exactly as they are; the group just stays at `introScale × 1` when not pulsing.
- `src/components/HotdogModel.tsx`: make `baseScale` a constant (`0.18`) instead of `hovered ? 0.24 : 0.18`. Slightly boost the hover glow so the affordance still reads — bump the target opacity from `0.85` to `1.0` and the `glowScale` factor from `0.34` to `0.42`. Everything else (edge fade, backface culling, renderOrder) is unchanged.

Net effect: identical visuals on non-hover; on hover you get the same warm halo (a touch stronger) with zero geometric jitter and no cursor sweet spot.

### 2. Auto-rotation resumes too quickly after a manual drag

**Diagnosis**
`src/components/Globe.tsx` line 464: `handleInteractionEnd` sets a `1500` ms timeout before clearing `isInteracting`, which is what gates the idle auto-spin in the `Earth` `useFrame` (line 282).

**Fix**
Change that single timeout value from `1500` to `5000`. No other logic changes — the spin-to-hotdog flow uses `isSpinning`, not `isInteracting`, so it's unaffected. FTUX and reduced-motion paths already have their own guards.

### Files touched

- `src/components/HotdogPin.tsx` — remove hover scale in the frame loop only.
- `src/components/HotdogModel.tsx` — constant `baseScale`, slightly punchier glow on hover.
- `src/components/Globe.tsx` — `1500` → `5000` in `handleInteractionEnd`.

### Explicitly NOT changed

- Pin visuals when idle, intro scale-in, FTUX pulse, backface culling, edge fade, tooltip, click behaviour, spin/zoom physics, controls, auto-rotation speed, or the FTUX auto-rotation gate.

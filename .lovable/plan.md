
# Premium Globe: Performance + "Wow" Upgrades

Two parallel goals: **(1) load fast**, **(2) feel premium** (look, light, motion). Below are the concrete recommendations, grouped so you can approve all or pick a subset.

---

## 1. Why it's slow today

Measured from the codebase:

- `public/globe/` is **51 MB across 49 PNGs** (transparent pin art). Largest pins are 1.5–1.8 MB each. Every pin's texture is loaded as soon as the globe mounts.
- `public/textures/earth-map.png` is **1.9 MB PNG**. There's a much smaller `earth-equirect-clean.jpg` (138 KB) already in the repo that isn't used.
- No preload, no compression pipeline, no progressive reveal — the user stares at `LoadingGlobe` until everything is decoded.
- Pin geometry, FTUX pulse loop, and per-frame `Date.now()` work in every `HotdogPin` add CPU cost on weak devices.

## 2. Performance plan (biggest wins first)

1. **Earth texture**: switch to a compressed **1024×512 WebP** (~60–120 KB) generated from the existing equirect art. Add `<link rel="preload" as="image">` in `index.html` so it starts downloading before React mounts.
2. **Pin textures**: batch-convert all `public/globe/*.png` to **256×256 WebP** (target ~15–25 KB each → ~1 MB total instead of 51 MB). Keep PNG fallback only if needed. This alone cuts first-paint network by ~95%.
3. **Lazy pin loading**: render pins as cheap colored dots immediately, then swap to the textured "hotdog" model after the texture for that pin resolves. Globe is interactive in <1 s.
4. **KTX2/Basis** (optional, larger lift): compress earth + pins to GPU-native format via `@loaders.gl` or `gltf-transform`; decoded on the GPU, ~5× faster than PNG.
5. **Suspense polish**: replace the static `LoadingGlobe` with a low-poly Earth that's already on screen while textures stream in — no jarring swap.
6. **Lower idle cost**: pause `useFrame` work when tab is hidden; use `state.clock.elapsedTime` instead of `Date.now()` in `HotdogPin`; skip pulse math when `!isPulsing`.

Expected result: time-to-interactive **~4–6 s → ~1.0–1.5 s** on a typical connection.

## 3. "Wow" visual upgrades

A. **Atmosphere & rim light** — replace the two flat backside spheres with a real **Fresnel atmosphere shader** (custom `ShaderMaterial`): soft cyan halo that gets brighter at the limb, subtle blue scatter into the day side. This is the single biggest premium tell.

B. **Day/night with city lights** — add a second emissive texture (night-side city lights) blended by the dot product of the sun direction and the surface normal. Pins on the dark side glow warmer. Feels like Apple Weather / Stripe.

C. **Cinematic lighting** — drop the flat ambient + two directionals. Use one warm key light (sun) + cool fill + a subtle rim, plus `ACESFilmicToneMapping` and `outputColorSpace = SRGB`. Earth instantly looks rendered, not flat.

D. **Starfield depth** — current `Stars` is a flat layer. Add a slow-parallax distant nebula plane + 2–3 brighter twinkling stars; tiny touch, huge mood.

E. **Pin presentation** — instead of flat upright sprites, anchor each pin with a soft glowing **ground halo disc** on the surface + a thin vertical "rising line" + the hotdog floating just above. On hover, the halo pulses and the model gently lifts.

F. **Postprocessing** (optional, +1 dep `@react-three/postprocessing`): subtle **Bloom** on rim + pin halos, **Vignette**, and a touch of **ChromaticAberration**. This is what makes 3D look like a product, not a demo.

## 4. "Wow" motion upgrades

A. **Cinematic intro** — extend the existing 1.8 s dolly-in: start from far + tilted, ease-in the camera while the globe finishes a slow ¾ rotation, atmosphere fades in last. Pins fade/scale in with a staggered ripple from the equator outward.

B. **Inertial drag** — OrbitControls feels "sticky." Add `enableDamping`, `dampingFactor: 0.08`, `rotateSpeed: 0.35` for a heavy, satisfying spin. Mouse-wheel zoom uses an ease curve, not linear.

C. **Idle drift** — current drift is constant. Use a low-frequency noise (e.g. `simplex-noise`) so the globe gently breathes on two axes — never repeats, never feels mechanical.

D. **"Spin the Globe" upgrade** — currently flicks then aligns. Replace with: rapid spin-up → momentary motion blur (via postprocessing) → magnetic slow-down with a soft *thunk* haptic (Vibration API on mobile) → camera dolly + tilt onto the target pin → pin halo pulses → route transitions. Feels like a slot machine landing.

E. **Hover micro-interactions** — pin scales 1.0→1.15 with spring easing, halo expands, tooltip card uses the existing fade-in but slides up 4 px. Cursor becomes a custom dot that follows with lerp.

F. **Page transition** — when zooming into a pin, fade the globe to the detail page's hero image rather than a hard route swap.

## 5. Suggested rollout order

1. **Perf pass** (assets + preload + lazy pins) — invisible but unblocks everything else.
2. **Lighting + tone mapping + Fresnel atmosphere** — biggest visual jump for least code.
3. **Pin halos + hover springs**.
4. **Intro choreography + inertial controls**.
5. **Day/night texture + postprocessing bloom** (optional flourish).

---

## Questions before I build

1. **Scope** — do you want the full premium pass (1–5) or just perf + atmosphere + pin polish (1–3)?
2. **Postprocessing dependency** — OK to add `@react-three/postprocessing` (~25 KB gz) for bloom/vignette?
3. **Art direction** — keep the current "bright cartoon" Earth, or move toward a darker, more cinematic **photographic-but-stylized** look (Apple Weather / Stripe Atlas vibe)?

I'll wait for your answers, then implement.

# Make the Hero a 10/10

The globe itself is already the star — but right now it lands flat: a generic light banner sits on top of a beautiful 3D scene, the floating cards look like default chrome, and there's no "moment of arrival." Here's the plan to make first-time visitors stop scrolling.

## 1. Cinematic intro (the jaw-drop moment)

Today the globe just fades in. Replace that with a 2.5s choreographed reveal:

- **Black hold (250ms)** with just the title fading up in serif display type
- **Starfield ignites** — existing `Stars` component fades in first
- **Globe "rises"** — start zoomed-out + tilted, with a slow dolly-in to final position (camera animation in `Globe.tsx`)
- **Pins drop in** with a staggered scale+bounce sequence (50ms apart), creating a "world populating with food" feel
- **Atmospheric glow** ring around the planet pulses once on arrival
- **Title + subhead** settle into final position with a subtle blur-to-focus

This replaces the current FTUX pulse with something that feels designed, not didactic.

## 2. Kill the light banner, go full-bleed dark

The cream header band fights the deep navy space behind the globe. Fixes:

- Remove the opaque `bg-background/60` header — let space extend edge-to-edge
- Title overlays the starfield directly with a soft radial vignette behind it for legibility
- Title gets a typographic upgrade: larger, tighter tracking, mixed weights ("Hotdogs **Around the World**" with the second half in the mustard/ketchup gradient)
- Subhead becomes a smaller all-caps eyebrow above the title: "AN INTERACTIVE ATLAS OF STREET FOOD" — feels editorial, not utility

## 3. Reframe the floating action cards

The three grey rounded rectangles (Spin / Leaderboard / Passport) currently look like placeholder UI. Upgrade:

- Replace the grey glass with true glassmorphism: backdrop-blur-xl, 1px inner highlight border, soft drop-shadow, and a faint colored glow underneath (mustard for Spin, ketchup for Leaderboard, sky for Passport)
- Add micro-labels under each icon ("Spin", "Ranks", "Passport") so they read instantly
- Hover state: lift + glow intensifies + label slides up
- On mobile, collapse into a single bottom-anchored dock so the globe owns the whole viewport

## 4. Add ambient life to the scene

Small touches that compound:

- **Slow shooting stars** drift across the starfield every ~8s
- **Subtle atmospheric rim light** on the globe edge (cyan halo, ~3px feathered)
- **Pin "heartbeat"**: instead of all pins pulsing during FTUX, one random pin gently glows every few seconds in steady-state to draw the eye
- **Cursor parallax**: globe drifts ~5° based on mouse position when idle (desktop only) — makes it feel alive without spinning away

## 5. Hero copy + first-touch CTA

Right now the only call-to-action is "Click a pin" in muted text. Replace with:

- A pill-shaped primary CTA centered below the title: **"Spin the Globe →"** that triggers the existing spin function and pulses gently until first interaction
- Underneath, smaller helper text: "or click any pin to explore 60+ regional styles"
- After first interaction, the CTA fades out and the helper text becomes the persistent caption

## 6. Bottom bar refinement

The mustard/ketchup gradient bottom bar currently competes with the globe. Slim it down:

- Reduce height ~30%
- Drop the gradient — use the same glass treatment as the floating cards
- Right-align nav so Browse All sits next to Sign In as siblings

---

## Technical section

Files touched:
- `src/pages/Index.tsx` — restructure header, add intro sequence state, new CTA component, glass card styling
- `src/components/Globe.tsx` — add camera dolly-in on mount (lerp from `position.z * 1.8` → final over 1500ms with easeOutCubic), pin stagger-in, rim light pass, cursor parallax via raf loop on `pointermove`
- `src/components/Stars.tsx` — add shooting-star instances on interval
- `src/components/HotdogPin.tsx` — add idle-heartbeat prop driven by a parent random-picker
- `src/index.css` — new keyframes: `intro-rise`, `pin-drop`, `shooting-star`, `glass-glow`
- `src/hooks/useFTUX.ts` — repurpose as `useHeroIntro`, drop the didactic pulse phase, drive the cinematic timeline instead. Keep localStorage gate so returning visitors get a shorter version (no black hold, faster dolly)
- `tailwind.config.ts` — add the new keyframes/animations

Performance guardrails:
- All camera/parallax work uses `requestAnimationFrame`, gated by `useReducedMotion`
- Reduced-motion users get instant fade-in (no dolly, no parallax, no shooting stars)
- Pin stagger uses CSS animation-delay, not JS timers

Out of scope (call out for next round if you want them): redesigning detail pages, changing the globe texture, swapping the 3D pin models.

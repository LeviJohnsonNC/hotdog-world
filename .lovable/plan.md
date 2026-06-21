
# Fix: Strip the noise, keep the polish

The last pass added too many always-on effects. They fought each other and made the globe smaller and busier. This plan removes the offenders, keeps the real wins, and re-tunes what's left.

## What I'll remove (the regressions)

1. **Ground halo discs under every pin** — these are the "strange circles." Delete entirely. They were always on, depth-test disabled, and visible through the planet.
2. **Vignette** — darkens the corners, visually shrinks the globe. Remove.
3. **Bright/thick Fresnel rim** — replace the additive cyan rim with the original subtle backside-sphere glow (much thinner, much dimmer). The atmosphere should be *barely there*, not a halo.
4. **Aggressive Bloom** — drop intensity from 0.5 → 0.18 and raise the luminance threshold so only true highlights bloom (or remove entirely; see Q1).

## What I'll keep (the actual wins)

- 53 MB → 0.49 MB pin asset compression
- 1.9 MB → 152 KB earth texture + `<link rel=preload>`
- ACES Filmic tone mapping + sRGB output
- Cinematic three-point lighting (warm key / cool fill / rim)
- OrbitControls with `enableDamping` for heavy, satisfying drag
- Pin hover spring (subtle 1.0 → 1.18 scale lerp)
- Removed the per-frame `console.log` and `Date.now()` work
- Intro stagger — keep, but shorten and remove the lat-based delay (it caused the visible "pop-in" you saw on the lower pins)

## What "premium" actually means here

Looking at Apple Weather, Stripe Atlas, github.com/orbit — the move is **less, but better**:

- One soft atmosphere. No competing halos.
- Pins that sit *on* the planet, not floating in front of it.
- Restrained motion: gentle drift, gentle hover, dramatic only on user-triggered moments (spin-to-globe).

## After the fix — optional next steps (ask me)

A. **Night side**: I can generate a complementary night-lights texture and blend it by sun direction so the unlit side shimmers with city lights. Big "wow" but adds a texture.
B. **Pin treatment**: instead of halos, make each pin sit on a tiny soft **drop shadow** projected onto the sphere surface (uses a small radial gradient sprite, billboarded toward the surface normal, depth-tested so back-side pins are hidden cleanly). This gives pins "weight" without circles.

## Questions

1. **Postprocessing**: keep a tiny amount of Bloom (just barely lifts the warm pins/sun) or remove it completely? I lean **keep tiny**.
2. **Atmosphere style**: subtle blue limb glow (current, restored to the gentler version) or no glow at all — just the planet against deep space?
3. After the cleanup ships and you can judge baseline, do you want me to try (A) night-side lights, (B) drop-shadow pin treatment, or both?

I'll wait for your answers, then implement.

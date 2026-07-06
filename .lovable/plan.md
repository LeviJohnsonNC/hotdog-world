# Fix "Spin the Globe" overlap on iPhone Safari

## Root cause

The home page mixes two viewport reference systems that only agree in a chromeless preview:

- Bottom nav: `fixed bottom-0` → iOS Safari anchors this to the **visible (small) viewport**, above the URL bar.
- Spin CTA: `absolute bottom-24` inside an `h-screen` (`100vh`) container → anchored to the **large viewport**, which extends *behind* Safari's URL bar.

When Safari's bottom URL bar is visible, the nav slides up into the CTA's space and the two collide. The tagline ("or click any pin to explore 60+ regional styles") gets clipped by the nav for the same reason.

Neither element uses `env(safe-area-inset-bottom)`, so on iPhones with a home indicator the nav also sits flush against it.

## Fix (scoped to `src/pages/Index.tsx`)

Three small, deterministic changes — no design exploration needed:

1. **Use the dynamic viewport unit for the page shell**
   - `h-screen` → `h-[100dvh]` on the root `<div>` so the container matches the actually-visible viewport on iOS, not the theoretical max.

2. **Anchor the Spin CTA to the same reference as the nav, with a safe-area-aware offset**
   - Change the CTA wrapper from `absolute … bottom-24 md:bottom-28` to `fixed … bottom-[calc(env(safe-area-inset-bottom)+5.5rem)] md:bottom-[calc(env(safe-area-inset-bottom)+6rem)]`.
   - That guarantees the CTA sits a fixed distance above the nav bar regardless of whether Safari's URL bar is showing, and clears the home indicator on notch devices.

3. **Give the bottom nav home-indicator breathing room**
   - Add `pb-[env(safe-area-inset-bottom)]` to the fixed nav container so its buttons don't crowd the iOS home indicator.
   - Keep the existing `py-2 md:py-2.5` on the inner row; the safe-area padding is added on the outer bar.

## Why this is the right fix (vs alternatives)

- Simply increasing `bottom-24` → `bottom-36` would patch the visual on iOS but push the CTA too high on Android/desktop.
- Making the nav non-fixed would change scroll behavior on other pages and break the glass-nav pattern.
- `100dvh` + `env(safe-area-inset-bottom)` is the standard iOS Safari fix and degrades cleanly on browsers that don't support them (they fall back to `100vh` / `0px`).

## Verification checklist

- Lovable mobile preview: layout unchanged (CTA still ~1 row above nav, caption fully visible).
- iOS Safari with URL bar visible: CTA sits clearly above nav, caption not clipped.
- iOS Safari after scroll (URL bar collapsed): CTA stays anchored to nav (no jump).
- Notch iPhone: nav buttons don't touch the home indicator.
- Desktop: no visual change (safe-area insets resolve to `0px`).

## Out of scope

- No changes to nav content, CTA styling, or the glass cards.
- No changes to other routes — only `src/pages/Index.tsx` is touched.

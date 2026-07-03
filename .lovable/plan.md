## Goal
Replace the plain flip cards in "Postcards from the Cart" with realistic postcard-sized cards using the two uploaded vintage postcard textures as backgrounds — front (with stamp corner) for the question, back (with address lines) for the answer. Layer text directly on the images so flipping feels like turning a real postcard.

## Assets
Add the two uploads as static images:
- `public/postcards/postcard-front.png` — aged paper with stamp box + postmark (used for the ANSWER side, the "written" back of a postcard)
- `public/postcards/postcard-back.png` — aged paper with address lines + postmark (used for the QUESTION side, the "front" the user sees first)

Note: Traditionally the picture side is the front and the written side is the back. For our trivia UX the "teaser" shows first — we'll use the lined/address image for the question side (feels like an unwritten postcard waiting to be turned) and the stamped/blank image for the reveal (the written message side). We can swap if preferred.

## Layout & sizing
- Switch grid from 3-up to **2-up on desktop, 1-up on mobile** so each card gets a true postcard aspect ratio (~3:2, ~148×100mm). Use `aspect-[3/2]` on the flip container.
- Remove the current colored front (`bg-mustard/20` etc.) and white back — the postcard image IS the background.
- Remove the separate `postcard-perf`, `postcard-stamp` corner, and "TAP TO FLIP" absolute overlays that the current `TriviaPostcards.tsx` stacks on top; those details already exist in the image textures. Keep only: the small index number, a subtle "tap to flip" hint, and the "Discovered" stamp after reveal.

## Text layering
Front (question side, lined image):
- Question typed on the left "message" area, respecting the vertical divider in the image (text lives in the left ~55% of the card).
- Handwritten-style font (e.g. Caveat or Kalam via Google Fonts, already used elsewhere or added) at ~20–24px, ink color `hsl(var(--ink))` with slight rotation (-1deg) for authenticity.
- Small "No. 01" label in the stamp box area (top-right) using a mono/serif face.
- Bottom-right: tiny "Tap to flip →" hint in uppercase tracking.

Back (answer side, stamped image):
- Answer text centered in the open paper area, same handwritten font, slightly larger line-height, max width ~75% so it doesn't collide with the stamp/postmark in the top-right or map artwork in the corners.
- Small repeated question label at top in a lighter ink (so users remember what was asked) — tiny caps, not handwritten.
- "Discovered" wax-stamp badge relocated to bottom-left so it doesn't overlap the postmark.

## Flip mechanics
Keep existing 3D flip transform in `FactFlipCard.tsx`. Changes:
- Front/back faces get `bg-[url(/postcards/postcard-back.png)]` / `bg-[url(/postcards/postcard-front.png)]` with `bg-cover bg-center`, plus a subtle `drop-shadow` and 2–4deg random tilt per card for stack variety.
- Add a soft paper shadow (`shadow-[0_8px_24px_-8px_rgba(60,40,20,0.35)]`) and a hover lift.
- Preserve reduced-motion handling and current reveal callbacks (`onReveal`, trivia badge increment, sparkle).

## Files to change
- `src/components/FactFlipCard.tsx` — new visual structure, image backgrounds, handwritten typography, dynamic text sizing tuned to the postcard interior box.
- `src/components/detail/TriviaPostcards.tsx` — 2-col grid, remove stamp/perf overlays, adjust "Discovered" stamp position, drop the "Tap to flip" absolute label (moved inside card).
- `src/index.css` — add `.handwritten` font-family (import Caveat via Google Fonts) and a `.postcard-shadow` utility; keep existing `postcard-*` classes if still used elsewhere or remove if now dead.
- `public/postcards/postcard-front.png`, `public/postcards/postcard-back.png` — new assets from uploads.

## Open question
Should the **question** appear on the lined/address side (my recommendation — feels like an unturned postcard) or on the stamped side? I'll go with lined-for-question unless you say otherwise.

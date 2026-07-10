import * as THREE from "three";

// Derives a roughness map from the day earth texture: oceans (blue-dominant
// pixels) become slick (~0.35), land stays matte (~0.95). meshStandardMaterial
// samples the GREEN channel for roughness, so we encode the value there.
// Runs once per source image; downsampled to 1024px wide for speed — plenty
// of resolution for a specular ramp.
//
// Returns null if the source image isn't decoded yet or a canvas 2d context
// can't be acquired; the caller can fall back to a scalar roughness.
export function createOceanRoughnessMap(source: THREE.Texture): THREE.Texture | null {
  const img = source.image as HTMLImageElement | ImageBitmap | undefined;
  if (!img || !("width" in img) || !img.width || !img.height) return null;

  const targetW = Math.min(1024, img.width);
  const targetH = Math.round((img.height / img.width) * targetW);

  const canvas = document.createElement("canvas");
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext("2d", { willReadFrequently: false });
  if (!ctx) return null;

  ctx.drawImage(img as CanvasImageSource, 0, 0, targetW, targetH);
  const data = ctx.getImageData(0, 0, targetW, targetH);
  const px = data.data;

  for (let i = 0; i < px.length; i += 4) {
    const r = px[i];
    const g = px[i + 1];
    const b = px[i + 2];
    // Ocean-ness: how much blue dominates over red+green (0..1).
    const blueness = Math.max(0, (b - (r + g) * 0.5) / 128);
    const oceanness = Math.min(1, blueness * 2.2);
    // Roughness: 0.35 on open ocean → 0.95 on land.
    const roughness = 0.95 - oceanness * 0.6;
    const v = Math.round(roughness * 255);
    px[i] = v;
    px[i + 1] = v;
    px[i + 2] = v;
    px[i + 3] = 255;
  }
  ctx.putImageData(data, 0, 0);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.colorSpace = THREE.NoColorSpace;
  tex.anisotropy = 4;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Detects whether the browser can create a WebGL context, so the landing
 * page can swap the 3D globe for a static hero instead of a dead canvas.
 * Checked once at module scope on first use — context creation is cheap
 * but not free, and the answer never changes within a session.
 */
let cached: boolean | null = null;

export function isWebGLAvailable(): boolean {
  if (cached !== null) return cached;
  try {
    const canvas = document.createElement("canvas");
    cached = !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl2") || canvas.getContext("webgl"))
    );
  } catch {
    cached = false;
  }
  return cached;
}

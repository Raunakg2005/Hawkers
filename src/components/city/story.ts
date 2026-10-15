/**
 * Shared, mutable story state. ScrollTrigger writes `p` (0 → 1 across the
 * whole scroll story) and the pointer; the WebGL scene reads them every frame.
 * Kept outside React on purpose: per-frame values must never cause re-renders.
 */
export const story = {
  /** raw scroll progress through the story, 0..1 */
  p: 0,
  /** smoothed progress the scene actually renders with (eases toward p) */
  s: 0,
  /** pointer in -1..1, mouse only */
  px: 0,
  py: 0,
};

/** Number of acts; act i is centred at p = i / (ACTS - 1). */
export const ACTS = 6;

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/** progress of p through [a, b], clamped */
export const seg = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));

export const smooth = (t: number) => t * t * (3 - 2 * t);

export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export const easeOutBack = (t: number) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

/** seeded PRNG so the city is the same on every load (and on server/client) */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

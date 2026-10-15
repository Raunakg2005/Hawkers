'use client';

import { useEffect, useRef, type RefObject } from 'react';

/**
 * A tiny, dependency-free scroll engine for the hand-built effects.
 *
 * No scroll listeners: an IntersectionObserver wakes a requestAnimationFrame
 * loop only while the element is near the viewport, and the loop reads the
 * element's position once per frame. `onFrame` gets progress 0..1 through the
 * element's own scroll range and is expected to write styles directly (never
 * React state), so nothing re-renders while you scroll.
 *
 *   mode 'pin'   : 0 when the top hits the viewport top, 1 when the bottom hits the viewport bottom
 *   mode 'cross' : 0 when the top enters at the bottom, 1 when the bottom leaves at the top
 */
export function useScrollFx<T extends HTMLElement>(
  onFrame: (p: number, el: T) => void,
  { mode = 'cross' as 'pin' | 'cross' } = {},
): RefObject<T | null> {
  const ref = useRef<T>(null);
  const cb = useRef(onFrame);
  cb.current = onFrame;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lite = document.documentElement.dataset.lite === '1';
    if (reduce || lite) {
      // settled final state, no loop at all
      el.dataset.fx = 'static';
      cb.current(1, el);
      return;
    }
    el.dataset.fx = 'live';

    let raf = 0;
    let last = -1;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = mode === 'pin' ? -r.top / Math.max(1, r.height - vh) : (vh - r.top) / (vh + r.height);
      const c = p < 0 ? 0 : p > 1 ? 1 : p;
      if (Math.abs(c - last) < 0.0002) return;
      last = c;
      cb.current(c, el);
    };
    const io = new IntersectionObserver(
      ([e]) => {
        cancelAnimationFrame(raf);
        if (e.isIntersecting) raf = requestAnimationFrame(tick);
      },
      { rootMargin: '25% 0px' },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [mode]);

  return ref;
}

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
export const range = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
/** a block landing: overshoots a touch, then settles */
export const land = (t: number) => {
  if (t >= 1) return 1;
  const c = 1.4;
  return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
};

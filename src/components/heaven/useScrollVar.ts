'use client';

import { useEffect, useRef } from 'react';

/**
 * Writes the element's scroll progress (0 → 1 while it is pinned through the
 * viewport) to a CSS custom property, so all the choreography can live in CSS.
 *
 * No scroll listeners: an IntersectionObserver wakes a requestAnimationFrame
 * loop only while the element is on screen, and the loop eases the value so
 * motion stays smooth even on a jumpy mouse wheel.
 */
export function useScrollVar<T extends HTMLElement>(name = '--s', onAct?: (el: T, p: number) => void) {
  const ref = useRef<T>(null);
  const cb = useRef(onAct);
  cb.current = onAct;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let shown = -1;

    const target = () => {
      const r = el.getBoundingClientRect();
      const p = -r.top / Math.max(1, r.height - window.innerHeight);
      return p < 0 ? 0 : p > 1 ? 1 : p;
    };

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const t = target();
      // reduced motion: jump straight to the value, no easing
      const next = shown < 0 || reduce ? t : shown + (t - shown) * 0.14;
      if (Math.abs(next - shown) < 0.00005) return;
      shown = next;
      el.style.setProperty(name, next.toFixed(4));
      cb.current?.(el, next);
    };

    const io = new IntersectionObserver(([e]) => {
      cancelAnimationFrame(raf);
      if (e.isIntersecting) raf = requestAnimationFrame(tick);
    });
    io.observe(el);
    // first paint without waiting for a frame
    shown = target();
    el.style.setProperty(name, shown.toFixed(4));
    cb.current?.(el, shown);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [name]);

  return ref;
}

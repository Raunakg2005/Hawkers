'use client';

import { useEffect, useRef, useState } from 'react';

const calm = () =>
  typeof window === 'undefined' ||
  window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
  document.documentElement.dataset.lite === '1';

/**
 * Animated number that eases from its previous value to `target`.
 * (MotionManager's data-count only runs once per page; diary numbers change
 * whenever an entry is added or paid, so they animate here instead.)
 */
export function useCountUp(target: number, dur = 900) {
  const [value, setValue] = useState(0);
  const current = useRef(0);

  useEffect(() => {
    if (calm()) {
      current.current = target;
      setValue(target);
      return;
    }
    const from = current.current;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      const v = Math.round(from + (target - from) * eased);
      current.current = v;
      setValue(v);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, dur]);

  return value;
}

'use client';

import { useEffect, useRef } from 'react';
import { usePref } from '@/lib/prefs';

/**
 * Mounts the WebGL scene once the browser is idle so it never competes with
 * first paint. three.js lives in its own chunk, loaded only here. In low-data
 * mode (or without WebGL) the static poster underneath simply stays visible.
 */
export default function HeroCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  const lite = usePref('lite') === '1';

  useEffect(() => {
    const canvas = ref.current;
    const story = canvas?.closest<HTMLElement>('[data-story]');
    if (!canvas || !story || lite) return;

    let disposed = false;
    let cleanup = () => {};

    const boot = async () => {
      const { createHeroScene } = await import('@/lib/hero-scene');
      if (disposed) return;
      const scene = createHeroScene(canvas, {
        mobile: window.matchMedia('(max-width: 760px)').matches,
        reduce: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      });
      if (!scene) return;
      requestAnimationFrame(() => canvas.classList.add('is-ready'));

      const progress = () => {
        const r = story.getBoundingClientRect();
        scene.setProgress(-r.top / Math.max(r.height - window.innerHeight, 1));
      };
      const onPointer = (e: PointerEvent) => {
        if (e.pointerType !== 'mouse') return;
        scene.setPointer((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
      };
      const io = new IntersectionObserver(([entry]) => scene.setActive(entry.isIntersecting));
      io.observe(story);
      const mo = new MutationObserver(() => scene.refreshTheme());
      mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
      window.addEventListener('pointermove', onPointer, { passive: true });
      window.addEventListener('scroll', progress, { passive: true });
      progress();

      cleanup = () => {
        io.disconnect();
        mo.disconnect();
        window.removeEventListener('pointermove', onPointer);
        window.removeEventListener('scroll', progress);
        scene.destroy();
      };
    };

    const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
    const cic = window.cancelIdleCallback ?? window.clearTimeout;
    const id = ric(() => void boot(), { timeout: 900 });

    return () => {
      disposed = true;
      cic(id);
      cleanup();
      canvas.classList.remove('is-ready');
    };
  }, [lite]);

  return <canvas ref={ref} className="hero-canvas" aria-hidden="true" />;
}

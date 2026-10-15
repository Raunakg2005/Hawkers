'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import { usePref } from '@/lib/prefs';

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/**
 * Lenis smooth scrolling + the thin progress bar. Disabled for reduced-motion
 * users and in low-data mode (native scrolling is cheaper on old phones).
 */
export default function SmoothScroll() {
  const pathname = usePathname();
  const lite = usePref('lite') === '1';

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const bar = document.querySelector<HTMLElement>('.scroll-progress span');

    const lenis = reduce || lite ? null : new Lenis({ lerp: 0.1, smoothWheel: true, anchors: { offset: -90 }, autoRaf: true });
    if (lenis) window.__lenis = lenis;

    let ticking = false;
    const progress = () => {
      ticking = false;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (bar) bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(progress);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    progress();

    return () => {
      window.removeEventListener('scroll', onScroll);
      lenis?.destroy();
      delete window.__lenis;
    };
  }, [lite]);

  // New page → start at the top (or the #hash target), without smoothing.
  useEffect(() => {
    const lenis = window.__lenis;
    const hash = window.location.hash;
    const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
    if (lenis) {
      lenis.resize();
      lenis.scrollTo(target ?? 0, { immediate: true, offset: target ? -90 : 0, force: true });
    }
  }, [pathname]);

  return null;
}

'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/*
 * One lightweight engine for all page motion, driven by data-attributes so
 * pages can stay server components (no per-component JS):
 *
 *   data-reveal[="tilt|left|right|zoom"]   fade/3D-in when scrolled into view
 *   data-count="2000"                      count-up number
 *   data-tilt                              pointer-driven 3D tilt
 *   data-magnetic                          buttons that lean toward the cursor
 *   data-story                             sticky scroll story → sets --sp (0..1)
 *   data-stack-card                        sticky cards that tip back as the next arrives
 *   data-parallax="0.2"                    vertical parallax
 *
 * Everything is skipped for reduced-motion users and in low-data mode.
 */

const clamp = (v: number, a = 0, b = 1) => Math.min(Math.max(v, a), b);

/** Wait until the page's DOM is hydrated before touching it (avoids mismatches). */
function whenHydrated(root: HTMLElement, cb: () => void) {
  let raf = 0;
  let tries = 0;
  const check = () => {
    const probe = root.querySelector('section:last-of-type') ?? root.lastElementChild ?? root;
    if (Object.keys(probe).some((k) => k.startsWith('__reactFiber')) || tries++ > 120) cb();
    else raf = requestAnimationFrame(check);
  };
  check();
  return () => cancelAnimationFrame(raf);
}

const calm = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.dataset.lite === '1';

export default function MotionManager() {
  const pathname = usePathname();

  // Pointer effects: document-level delegation, bound once.
  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!fine) return;

    let tiltEl: HTMLElement | null = null;
    let magEl: HTMLElement | null = null;

    const resetTilt = (el: HTMLElement | null) => {
      if (!el) return;
      el.style.setProperty('--rx', '0deg');
      el.style.setProperty('--ry', '0deg');
      el.classList.remove('is-tilting');
    };
    const resetMag = (el: HTMLElement | null) => el?.style.setProperty('--mag', 'translate3d(0,0,0)');

    const onMove = (e: PointerEvent) => {
      if (calm()) return;
      const target = e.target as Element | null;
      const t = target?.closest?.<HTMLElement>('[data-tilt]') ?? null;
      if (t !== tiltEl) {
        resetTilt(tiltEl);
        tiltEl = t;
      }
      if (t) {
        const r = t.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        t.classList.add('is-tilting');
        t.style.setProperty('--rx', `${(-py * 9).toFixed(2)}deg`);
        t.style.setProperty('--ry', `${(px * 11).toFixed(2)}deg`);
        t.style.setProperty('--gx', `${((px + 0.5) * 100).toFixed(1)}%`);
        t.style.setProperty('--gy', `${((py + 0.5) * 100).toFixed(1)}%`);
      }

      const m = target?.closest?.<HTMLElement>('[data-magnetic]') ?? null;
      if (m !== magEl) {
        resetMag(magEl);
        magEl = m;
      }
      if (m) {
        const r = m.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        m.style.setProperty('--mag', `translate3d(${(dx * 0.2).toFixed(1)}px, ${(dy * 0.28).toFixed(1)}px, 0)`);
      }
    };
    const onLeave = () => {
      resetTilt(tiltEl);
      resetMag(magEl);
      tiltEl = magEl = null;
    };

    document.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    window.addEventListener('blur', onLeave);
    return () => {
      document.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('blur', onLeave);
    };
  }, []);

  // Scroll effects: (re)bound per page, after hydration.
  useEffect(() => {
    const main = document.getElementById('main');
    if (!main) return;
    let dispose = () => {};
    const cancel = whenHydrated(main, () => {
      dispose = bindPageEffects(main);
    });
    return () => {
      cancel();
      dispose();
    };
  }, [pathname]);

  return null;
}

function bindPageEffects(root: HTMLElement): () => void {
  const still = calm();
  const cleanups: Array<() => void> = [];
  const $$ = (sel: string) => Array.from(root.querySelectorAll<HTMLElement>(sel));

  // ── Reveal on scroll (also picks up elements added later, e.g. filtered lists)
  const io =
    'IntersectionObserver' in window && !still
      ? new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              if (entry.isIntersecting) {
                entry.target.classList.add('is-in');
                io?.unobserve(entry.target);
              }
            }
          },
          { threshold: 0.1, rootMargin: '0px 0px -5% 0px' },
        )
      : null;
  const watch = (el: HTMLElement) => (io ? io.observe(el) : el.classList.add('is-in'));
  $$('[data-reveal]').forEach(watch);
  const mo = new MutationObserver((records) => {
    for (const r of records)
      r.addedNodes.forEach((n) => {
        if (!(n instanceof HTMLElement)) return;
        if (n.matches('[data-reveal]')) watch(n);
        n.querySelectorAll<HTMLElement>('[data-reveal]').forEach(watch);
      });
  });
  mo.observe(root, { childList: true, subtree: true });
  cleanups.push(() => {
    io?.disconnect();
    mo.disconnect();
  });

  // ── Count-up numbers
  const counters = $$('[data-count]');
  if (counters.length) {
    const fmt = (n: number, el: HTMLElement) => (el.dataset.format === 'in' ? n.toLocaleString('en-IN') : String(n));
    const run = (el: HTMLElement) => {
      const target = Number(el.dataset.count) || 0;
      if (still) {
        el.textContent = fmt(target, el);
        return;
      }
      const start = performance.now();
      const dur = 1600;
      const tick = (now: number) => {
        const t = clamp((now - start) / dur);
        const eased = 1 - Math.pow(2, -10 * t);
        el.textContent = fmt(Math.round(target * (t === 1 ? 1 : eased)), el);
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const cio = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            run(entry.target as HTMLElement);
            cio.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.5 },
    );
    counters.forEach((el) => cio.observe(el));
    cleanups.push(() => cio.disconnect());
  }

  // ── Scroll-linked effects: one rAF, only while scrolling
  const stories = $$('[data-story]');
  const stackCards = $$('[data-stack-card]');
  const parallax = $$('[data-parallax]');
  let vh = window.innerHeight;

  const update = () => {
    ticking = false;
    for (const el of stories) {
      const r = el.getBoundingClientRect();
      const p = clamp(-r.top / Math.max(r.height - vh, 1));
      el.style.setProperty('--sp', p.toFixed(4));
    }
    if (still) return;
    for (let i = 0; i < stackCards.length - 1; i++) {
      const card = stackCards[i];
      const next = stackCards[i + 1];
      const top = parseFloat(getComputedStyle(card).top) || 0;
      const p = clamp(1 - (next.getBoundingClientRect().top - top) / card.offsetHeight);
      card.style.setProperty('--stp', p.toFixed(3));
    }
    for (const el of parallax) {
      const r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) continue;
      const speed = Number(el.dataset.parallax) || 0.15;
      el.style.transform = `translate3d(0, ${((r.top + r.height / 2 - vh / 2) * -speed).toFixed(1)}px, 0)`;
    }
  };

  let ticking = false;
  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };
  const onResize = () => {
    vh = window.innerHeight;
    onScroll();
  };

  update();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize);
  cleanups.push(() => {
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onResize);
  });

  return () => cleanups.forEach((fn) => fn());
}

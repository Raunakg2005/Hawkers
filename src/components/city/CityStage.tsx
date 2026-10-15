'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePref } from '@/lib/prefs';
import { ACTS, story } from './story';

// three.js + the scene live in their own chunk, fetched only when 3D will run
const CityCanvas = dynamic(() => import('./CityCanvas'), { ssr: false });

function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

/**
 * The scroll story: a sticky full-screen stage with the 3D city, and the acts
 * scrolling over it. Low-data mode, reduced motion or no WebGL get a painted
 * dawn backdrop instead; every word and button is identical either way.
 */
export default function CityStage({ rail, children }: { rail: ReactNode; children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const lite = usePref('lite') === '1';
  const [mode, setMode] = useState<'pending' | '3d' | 'static'>('pending');
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(true);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (lite || reduce || !hasWebGL()) {
      setMode('static');
      return;
    }
    // Let the headline animation finish and the pixel font load first: compiling
    // the scene's shaders blocks the main thread for a moment.
    let cancelled = false;
    const fam = getComputedStyle(document.documentElement).getPropertyValue('--font-pixel').trim();
    const fonts = fam ? document.fonts.load(`700 40px ${fam}`).catch(() => undefined) : Promise.resolve();
    const wait = new Promise((r) => window.setTimeout(r, 1300));
    void Promise.all([fonts, wait]).then(() => {
      if (!cancelled) setMode('3d');
    });
    return () => {
      cancelled = true;
    };
  }, [lite]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    el.dataset.act = '0';
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (st) => {
          story.p = st.progress;
          const act = Math.round(st.progress * (ACTS - 1));
          if (el.dataset.act !== String(act)) el.dataset.act = String(act);
          el.style.setProperty('--story', st.progress.toFixed(4));
        },
      });

      if (reduce) return;
      // each act's lines rise in as it arrives, and settle back as you leave
      gsap.utils.toArray<HTMLElement>('.act').forEach((act) => {
        const parts = act.querySelectorAll('[data-a]');
        gsap.fromTo(
          parts,
          { y: 56, opacity: 0, filter: 'blur(8px)' },
          {
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 1.1,
            ease: 'expo.out',
            stagger: 0.08,
            scrollTrigger: { trigger: act, start: 'top 62%', end: 'bottom 30%', toggleActions: 'play reverse play reverse' },
          },
        );
      });
      // headline words fall into place one by one
      gsap.utils.toArray<HTMLElement>('.act [data-words]').forEach((h) => {
        const words = h.querySelectorAll('.w');
        gsap.fromTo(
          words,
          { yPercent: 110, rotate: 4 },
          {
            yPercent: 0,
            rotate: 0,
            duration: 1.05,
            ease: 'expo.out',
            stagger: 0.05,
            scrollTrigger: { trigger: h, start: 'top 75%', toggleActions: 'play none none reverse' },
          },
        );
      });
    }, el);

    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { rootMargin: '100px' });
    io.observe(el);
    return () => {
      io.disconnect();
      ctx.revert();
    };
  }, []);

  return (
    <div ref={root} className="story" data-mode={mode} data-active={active ? 'true' : 'false'}>
      <div className="story-stage" aria-hidden="true">
        <div className="stage-backdrop" />
        {mode === '3d' && (
          <div className={`stage-canvas${ready ? ' is-ready' : ''}`}>
            <CityCanvas active={active} onReady={() => setReady(true)} />
          </div>
        )}
        <div className="stage-scrim" />
      </div>
      {rail}
      <div className="story-acts">{children}</div>
    </div>
  );
}

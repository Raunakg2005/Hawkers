'use client';

import { useSyncExternalStore } from 'react';
import type { L, Lang } from '@/data/types';

/**
 * User preferences live as data-attributes on <html> so that CSS (and server
 * rendered markup) can react to them with zero JS re-rendering:
 *
 *   data-theme  light | dark      colour scheme
 *   data-lang   en | hi | mr | gu which language spans are visible
 *   data-size   md | lg | xl      text scale for low-vision / older users
 *   data-lite   0 | 1             low-data mode: no 3D, no smooth scroll
 *
 * The inline script in ./prefs-script.ts applies saved values before paint.
 */

export type PrefName = 'theme' | 'lang' | 'size' | 'lite';

export const PREF_DEFAULTS: Record<PrefName, string> = { theme: 'light', lang: 'en', size: 'md', lite: '0' };

const KEY = (name: PrefName) => `naka-${name}`;

export function getPref(name: PrefName): string {
  if (typeof document === 'undefined') return PREF_DEFAULTS[name];
  return document.documentElement.dataset[name] ?? PREF_DEFAULTS[name];
}

export function setPref(name: PrefName, value: string) {
  const root = document.documentElement;
  root.dataset[name] = value;
  if (name === 'lang') root.lang = value;
  if (name === 'theme') {
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', value === 'dark' ? '#0b0c15' : '#fdfbf7');
  }
  try {
    localStorage.setItem(KEY(name), value);
  } catch {
    /* storage blocked — preference simply won't persist */
  }
}

function subscribe(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'data-lang', 'data-size', 'data-lite'] });
  return () => mo.disconnect();
}

/** Reactive read of a preference. Server snapshot = default, so hydration is stable. */
export function usePref(name: PrefName): string {
  return useSyncExternalStore(
    subscribe,
    () => getPref(name),
    () => PREF_DEFAULTS[name],
  );
}

/**
 * Pick a string for the active language — for attributes (placeholder,
 * aria-label, share text…) in client components.
 *   t('Listen', 'सुनें', 'ऐका', 'સાંભળો')   or   tl(someL)
 */
export function useLang() {
  const lang = usePref('lang') as Lang;
  const t = (en: string, hi: string, mr: string, gu: string) => ({ en, hi, mr, gu })[lang] ?? en;
  const tl = (l: L) => l[lang] ?? l.en;
  return { lang, t, tl };
}

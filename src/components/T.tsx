import type { ReactNode } from 'react';
import type { L } from '@/data/types';

/**
 * Bilingual text that needs no JavaScript: both languages are server rendered
 * and CSS shows the one matching <html data-lang>. Switching language is
 * instant, works in server components and never causes a hydration mismatch.
 */
export function T({ en, hi }: { en: ReactNode; hi: ReactNode }) {
  return (
    <>
      <span className="l-en" lang="en">
        {en}
      </span>
      <span className="l-hi" lang="hi">
        {hi}
      </span>
    </>
  );
}

/** Same as <T>, for a { en, hi } object from the mock data. */
export function Tx({ l }: { l: L }) {
  return <T en={l.en} hi={l.hi} />;
}

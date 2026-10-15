import type { ReactNode } from 'react';
import type { L } from '@/data/types';

/**
 * Multilingual text that needs no JavaScript: every language is server
 * rendered and CSS shows the one matching <html data-lang> (en / hi / mr / gu).
 * Switching language is instant, works in server components and never causes
 * a hydration mismatch. All four languages are required props, so TypeScript
 * flags any missing translation.
 */
export function T({ en, hi, mr, gu }: { en: ReactNode; hi: ReactNode; mr: ReactNode; gu: ReactNode }) {
  return (
    <>
      <span className="l-en" lang="en">
        {en}
      </span>
      <span className="l-hi" lang="hi">
        {hi}
      </span>
      <span className="l-mr" lang="mr">
        {mr}
      </span>
      <span className="l-gu" lang="gu">
        {gu}
      </span>
    </>
  );
}

/** Same as <T>, for an { en, hi, mr, gu } object from the mock data. */
export function Tx({ l }: { l: L }) {
  return <T en={l.en} hi={l.hi} mr={l.mr} gu={l.gu} />;
}

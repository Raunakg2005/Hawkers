'use client';

import { useEffect, useState } from 'react';
import { Languages, X } from 'lucide-react';
import { LangGrid } from './PrefControls';

const ASKED = 'naka-lang-asked';

/**
 * First visit only: a small, non-blocking sheet asking which language to read
 * in. The question is written in all four languages so anyone can answer it.
 */
export default function LanguageWelcome() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(ASKED) && !localStorage.getItem('naka-lang')) {
        const id = window.setTimeout(() => setShow(true), 1200);
        return () => window.clearTimeout(id);
      }
    } catch {
      /* storage blocked: never nag */
    }
  }, []);

  const done = () => {
    setShow(false);
    try {
      localStorage.setItem(ASKED, '1');
    } catch {
      /* ignore */
    }
  };

  if (!show) return null;
  return (
    <div className="lang-welcome" role="dialog" aria-labelledby="lang-welcome-h">
      <div className="lang-welcome-head">
        <Languages aria-hidden="true" />
        <p id="lang-welcome-h">
          <span lang="en">Choose your language</span> · <span lang="hi">भाषा चुनें</span> · <span lang="mr">भाषा निवडा</span> ·{' '}
          <span lang="gu">ભાષા પસંદ કરો</span>
        </p>
        <button type="button" className="icon-btn" onClick={done} aria-label="Close · बंद करें · बंद करा · બંધ કરો">
          <X aria-hidden="true" />
        </button>
      </div>
      <LangGrid onPick={done} />
    </div>
  );
}

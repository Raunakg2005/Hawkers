'use client';

import { useEffect, useState } from 'react';
import { Volume2, Square } from 'lucide-react';
import { useLang } from '@/lib/prefs';
import { localeOf } from '@/lib/i18n';
import type { Lang } from '@/data/types';

type Texts = { en: string; hi: string; mr: string; gu: string };

/**
 * Pick what to say and which voice to say it with. Phones often lack a
 * Marathi or Gujarati voice: Marathi falls back to a Hindi voice (same
 * Devanagari script, very close pronunciation); Gujarati falls back to
 * reading the English text rather than garbling Gujarati script.
 */
function plan(lang: Lang, texts: Texts, voices: SpeechSynthesisVoice[]) {
  const find = (l: Lang) => voices.find((v) => v.lang.replace('_', '-') === localeOf(l)) ?? voices.find((v) => v.lang.toLowerCase().startsWith(l));
  const own = find(lang);
  if (own || lang === 'en' || voices.length === 0) return { text: texts[lang], locale: localeOf(lang), voice: own };
  if (lang === 'mr') {
    const hiVoice = find('hi');
    if (hiVoice) return { text: texts.mr, locale: 'hi-IN', voice: hiVoice };
  }
  if (lang === 'gu') return { text: texts.en, locale: 'en-IN', voice: find('en') };
  return { text: texts[lang], locale: localeOf(lang), voice: undefined };
}

/**
 * Speaks text in the active language using the browser's built-in voices
 * (no network). For workers who find reading hard, every key card has one.
 */
export default function ReadAloud({ en, hi, mr, gu, label, className = 'icon-btn' }: Texts & { label?: string; className?: string }) {
  const { lang, t } = useLang();
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    setSupported('speechSynthesis' in window);
    return () => {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, []);

  if (!supported) return null;

  const speak = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const synth = window.speechSynthesis;
    if (speaking) {
      synth.cancel();
      setSpeaking(false);
      return;
    }
    synth.cancel();
    const p = plan(lang, { en, hi, mr, gu }, synth.getVoices());
    const u = new SpeechSynthesisUtterance(p.text);
    u.lang = p.locale;
    if (p.voice) u.voice = p.voice;
    u.rate = 0.92;
    u.onend = u.onerror = () => setSpeaking(false);
    setSpeaking(true);
    synth.speak(u);
  };

  const text = label ?? t('Listen', 'सुनें', 'ऐका', 'સાંભળો');
  const stop = t('Stop', 'रोकें', 'थांबवा', 'બંધ કરો');
  return (
    <button type="button" className={`${className} speak-btn${speaking ? ' is-speaking' : ''}`} onClick={speak} aria-label={speaking ? stop : text} title={text}>
      {speaking ? <Square aria-hidden="true" /> : <Volume2 aria-hidden="true" />}
      {className.includes('btn ') || className.startsWith('btn') ? <span>{speaking ? stop : text}</span> : null}
    </button>
  );
}

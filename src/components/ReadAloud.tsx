'use client';

import { useEffect, useState } from 'react';
import { Volume2, Square } from 'lucide-react';
import { useLang } from '@/lib/prefs';

/**
 * Speaks text in the active language using the browser's built-in voices
 * (no network). For workers who find reading hard, every key card has one.
 */
export default function ReadAloud({ en, hi, label, className = 'icon-btn' }: { en: string; hi: string; label?: string; className?: string }) {
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
    const u = new SpeechSynthesisUtterance(lang === 'hi' ? hi : en);
    u.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    const voice = synth.getVoices().find((v) => v.lang === u.lang) ?? synth.getVoices().find((v) => v.lang.startsWith(lang));
    if (voice) u.voice = voice;
    u.rate = 0.92;
    u.onend = u.onerror = () => setSpeaking(false);
    setSpeaking(true);
    synth.speak(u);
  };

  const text = label ?? t('Listen', 'सुनें');
  return (
    <button type="button" className={`${className} speak-btn${speaking ? ' is-speaking' : ''}`} onClick={speak} aria-label={speaking ? t('Stop', 'रोकें') : text} title={text}>
      {speaking ? <Square aria-hidden="true" /> : <Volume2 aria-hidden="true" />}
      {className.includes('btn ') || className.startsWith('btn') ? <span>{speaking ? t('Stop', 'रोकें') : text}</span> : null}
    </button>
  );
}

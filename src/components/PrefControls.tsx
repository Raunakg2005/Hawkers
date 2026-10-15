'use client';

import { useEffect, useRef, useState } from 'react';
import { Accessibility, Moon, Sun, Type, WifiOff, X } from 'lucide-react';
import { setPref, usePref, useLang } from '@/lib/prefs';

/** Big "A | अ" switch — recognisable without reading English. */
export function LangToggle() {
  const lang = usePref('lang');
  return (
    <div className="lang-toggle" role="group" aria-label="Language / भाषा">
      <button type="button" aria-pressed={lang === 'en'} onClick={() => setPref('lang', 'en')} lang="en" title="English">
        A
      </button>
      <button type="button" aria-pressed={lang === 'hi'} onClick={() => setPref('lang', 'hi')} lang="hi" title="हिंदी">
        अ
      </button>
    </div>
  );
}

export function ThemeToggle() {
  const { t } = useLang();
  const toggle = () => setPref('theme', document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
  return (
    <button className="icon-btn theme-toggle" type="button" onClick={toggle} aria-label={t('Switch light / dark mode', 'लाइट / डार्क मोड बदलें')}>
      <Moon className="moon" aria-hidden="true" />
      <Sun className="sun" aria-hidden="true" />
    </button>
  );
}

/** Text size + low-data mode, grouped behind one universally-recognised icon. */
export function A11yMenu() {
  const [open, setOpen] = useState(false);
  const size = usePref('size');
  const lite = usePref('lite');
  const { t } = useLang();
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="a11y-wrap" ref={wrap}>
      <button
        className="icon-btn"
        type="button"
        aria-expanded={open}
        aria-controls="a11y-pop"
        aria-label={t('Reading & data settings', 'पढ़ने और डेटा की सेटिंग')}
        onClick={() => setOpen((o) => !o)}
      >
        {open ? <X aria-hidden="true" /> : <Accessibility aria-hidden="true" />}
      </button>
      {open && (
        <div className="a11y-pop" id="a11y-pop" role="dialog" aria-label={t('Reading & data settings', 'पढ़ने और डेटा की सेटिंग')}>
          <h3>{t('Make it easier', 'आसान बनाएँ')}</h3>
          <div className="a11y-row">
            <span className="label">
              <Type aria-hidden="true" /> {t('Text size', 'अक्षर का आकार')}
            </span>
            <div className="size-buttons">
              {(['md', 'lg', 'xl'] as const).map((s, i) => (
                <button
                  key={s}
                  type="button"
                  aria-pressed={size === s}
                  onClick={() => setPref('size', s)}
                  style={{ fontSize: `${1 + i * 0.22}rem` }}
                  aria-label={t(['Normal', 'Large', 'Extra large'][i], ['सामान्य', 'बड़ा', 'बहुत बड़ा'][i])}
                >
                  {t('A', 'अ')}
                </button>
              ))}
            </div>
          </div>
          <button className="a11y-switch" type="button" role="switch" aria-checked={lite === '1'} onClick={() => setPref('lite', lite === '1' ? '0' : '1')}>
            <span className="a11y-row">
              <span className="label">
                <WifiOff aria-hidden="true" /> {t('Low data mode', 'कम डेटा मोड')}
              </span>
              <span className="subtle">{t('Turns off 3D and animations. Faster on slow internet.', '3D और एनिमेशन बंद। धीमे इंटरनेट पर तेज़।')}</span>
            </span>
            <span className="switch" aria-hidden="true" data-on={lite === "1"} />
          </button>
        </div>
      )}
    </div>
  );
}

/** The same settings, laid out flat for the mobile drawer (no popover on small screens). */
export function PrefPanel() {
  const theme = usePref('theme');
  const size = usePref('size');
  const lite = usePref('lite');
  const { t } = useLang();
  return (
    <div className="pref-panel">
      <div className="a11y-row">
        <span className="label">{t('Screen', 'स्क्रीन')}</span>
        <div className="segmented" role="group" aria-label={t('Theme', 'थीम')}>
          <button type="button" aria-pressed={theme === 'light'} onClick={() => setPref('theme', 'light')}>
            <Sun aria-hidden="true" /> {t('Light', 'लाइट')}
          </button>
          <button type="button" aria-pressed={theme === 'dark'} onClick={() => setPref('theme', 'dark')}>
            <Moon aria-hidden="true" /> {t('Dark', 'डार्क')}
          </button>
        </div>
      </div>
      <div className="a11y-row">
        <span className="label">
          <Type aria-hidden="true" /> {t('Text size', 'अक्षर का आकार')}
        </span>
        <div className="size-buttons">
          {(['md', 'lg', 'xl'] as const).map((s, i) => (
            <button
              key={s}
              type="button"
              aria-pressed={size === s}
              onClick={() => setPref('size', s)}
              style={{ fontSize: `${1 + i * 0.22}rem` }}
              aria-label={t(['Normal', 'Large', 'Extra large'][i], ['सामान्य', 'बड़ा', 'बहुत बड़ा'][i])}
            >
              {t('A', 'अ')}
            </button>
          ))}
        </div>
      </div>
      <button className="a11y-switch" type="button" role="switch" aria-checked={lite === '1'} onClick={() => setPref('lite', lite === '1' ? '0' : '1')}>
        <span className="a11y-row">
          <span className="label">
            <WifiOff aria-hidden="true" /> {t('Low data mode', 'कम डेटा मोड')}
          </span>
          <span className="subtle">{t('No 3D or animations', '3D और एनिमेशन बंद')}</span>
        </span>
        <span className="switch" aria-hidden="true" data-on={lite === '1'} />
      </button>
    </div>
  );
}

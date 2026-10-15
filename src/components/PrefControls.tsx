'use client';

import { useEffect, useRef, useState } from 'react';
import { Accessibility, Check, ChevronDown, Languages, Moon, Sun, Type, WifiOff, X } from 'lucide-react';
import { setPref, usePref, useLang } from '@/lib/prefs';
import { LANGS } from '@/lib/i18n';

/** Close a popover on outside tap or Escape. */
function useDismiss(open: boolean, close: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, close]);
  return ref;
}

/**
 * Language picker. Each language is written in its own script (English,
 * हिंदी, मराठी, ગુજરાતી) so people recognise theirs without reading English.
 */
export function LangPicker() {
  const lang = usePref('lang');
  const [open, setOpen] = useState(false);
  const wrap = useDismiss(open, () => setOpen(false));
  const current = LANGS.find((l) => l.id === lang) ?? LANGS[0];

  return (
    <div className="lang-picker" ref={wrap}>
      <button
        type="button"
        className="lang-btn"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls="lang-pop"
        aria-label="Language · भाषा · ભાષા"
        onClick={() => setOpen((o) => !o)}
      >
        <Languages aria-hidden="true" />
        <span lang={current.id}>{current.short}</span>
        <ChevronDown aria-hidden="true" className={open ? 'rot' : ''} />
      </button>
      {open && (
        <div className="lang-pop" id="lang-pop" role="menu" aria-label="Language · भाषा · ભાષા">
          {LANGS.map((l) => (
            <button
              key={l.id}
              type="button"
              role="menuitemradio"
              aria-checked={lang === l.id}
              lang={l.id}
              onClick={() => {
                setPref('lang', l.id);
                setOpen(false);
              }}
            >
              <span className="lang-native">{l.native}</span>
              {l.id !== 'en' && <span className="lang-en">{l.english}</span>}
              {lang === l.id && <Check aria-hidden="true" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/** Flat 2×2 grid of languages — used in the mobile drawer and the welcome banner. */
export function LangGrid({ onPick }: { onPick?: () => void }) {
  const lang = usePref('lang');
  return (
    <div className="lang-grid" role="group" aria-label="Language · भाषा · ભાષા">
      {LANGS.map((l) => (
        <button
          key={l.id}
          type="button"
          lang={l.id}
          aria-pressed={lang === l.id}
          onClick={() => {
            setPref('lang', l.id);
            onPick?.();
          }}
        >
          <span className="lang-native">{l.native}</span>
          {l.id !== 'en' && <span className="lang-en">{l.english}</span>}
        </button>
      ))}
    </div>
  );
}

export function ThemeToggle() {
  const { t } = useLang();
  const toggle = () => setPref('theme', document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
  return (
    <button
      className="icon-btn theme-toggle"
      type="button"
      onClick={toggle}
      aria-label={t('Switch light / dark mode', 'लाइट / डार्क मोड बदलें', 'लाइट / डार्क मोड बदला', 'લાઇટ / ડાર્ક મોડ બદલો')}
    >
      <Moon className="moon" aria-hidden="true" />
      <Sun className="sun" aria-hidden="true" />
    </button>
  );
}

const SIZE_NAMES = [
  ['Normal', 'सामान्य', 'सामान्य', 'સામાન્ય'],
  ['Large', 'बड़ा', 'मोठा', 'મોટું'],
  ['Extra large', 'बहुत बड़ा', 'खूप मोठा', 'ખૂબ મોટું'],
] as const;

function SizeButtons() {
  const size = usePref('size');
  const { t } = useLang();
  return (
    <div className="size-buttons">
      {(['md', 'lg', 'xl'] as const).map((s, i) => (
        <button
          key={s}
          type="button"
          aria-pressed={size === s}
          onClick={() => setPref('size', s)}
          style={{ fontSize: `${1 + i * 0.22}rem` }}
          aria-label={t(SIZE_NAMES[i][0], SIZE_NAMES[i][1], SIZE_NAMES[i][2], SIZE_NAMES[i][3])}
        >
          {t('A', 'अ', 'अ', 'અ')}
        </button>
      ))}
    </div>
  );
}

function LiteSwitch({ long }: { long?: boolean }) {
  const lite = usePref('lite');
  const { t } = useLang();
  return (
    <button className="a11y-switch" type="button" role="switch" aria-checked={lite === '1'} onClick={() => setPref('lite', lite === '1' ? '0' : '1')}>
      <span className="a11y-row">
        <span className="label">
          <WifiOff aria-hidden="true" /> {t('Low data mode', 'कम डेटा मोड', 'कमी डेटा मोड', 'ઓછો ડેટા મોડ')}
        </span>
        <span className="subtle">
          {long
            ? t(
                'Turns off animations. Faster on slow internet.',
                'एनिमेशन बंद। धीमे इंटरनेट पर तेज़।',
                'ॲनिमेशन बंद. हळू इंटरनेटवर जलद.',
                'એનિમેશન બંધ. ધીમા ઇન્ટરનેટ પર ઝડપી.',
              )
            : t('No animations', 'एनिमेशन बंद', 'ॲनिमेशन बंद', 'એનિમેશન બંધ')}
        </span>
      </span>
      <span className="switch" aria-hidden="true" data-on={lite === '1'} />
    </button>
  );
}

/** Text size + low-data mode, grouped behind one universally-recognised icon. */
export function A11yMenu() {
  const [open, setOpen] = useState(false);
  const { t } = useLang();
  const wrap = useDismiss(open, () => setOpen(false));
  const label = t('Reading & data settings', 'पढ़ने और डेटा की सेटिंग', 'वाचन आणि डेटा सेटिंग्ज', 'વાંચન અને ડેટા સેટિંગ્સ');

  return (
    <div className="a11y-wrap" ref={wrap}>
      <button className="icon-btn" type="button" aria-expanded={open} aria-controls="a11y-pop" aria-label={label} onClick={() => setOpen((o) => !o)}>
        {open ? <X aria-hidden="true" /> : <Accessibility aria-hidden="true" />}
      </button>
      {open && (
        <div className="a11y-pop" id="a11y-pop" role="dialog" aria-label={label}>
          <h3>{t('Make it easier', 'आसान बनाएँ', 'सोपे करा', 'સરળ બનાવો')}</h3>
          <div className="a11y-row">
            <span className="label">
              <Type aria-hidden="true" /> {t('Text size', 'अक्षर का आकार', 'अक्षरांचा आकार', 'અક્ષરનું કદ')}
            </span>
            <SizeButtons />
          </div>
          <LiteSwitch long />
        </div>
      )}
    </div>
  );
}

/** The same settings, laid out flat for the mobile drawer (no popovers on small screens). */
export function PrefPanel() {
  const theme = usePref('theme');
  const { t } = useLang();
  return (
    <div className="pref-panel">
      <div className="a11y-row">
        <span className="label">
          <Languages aria-hidden="true" /> {t('Language', 'भाषा', 'भाषा', 'ભાષા')}
        </span>
        <LangGrid />
      </div>
      <div className="a11y-row">
        <span className="label">{t('Screen', 'स्क्रीन', 'स्क्रीन', 'સ્ક્રીન')}</span>
        <div className="segmented" role="group" aria-label={t('Theme', 'थीम', 'थीम', 'થીમ')}>
          <button type="button" aria-pressed={theme === 'light'} onClick={() => setPref('theme', 'light')}>
            <Sun aria-hidden="true" /> {t('Light', 'लाइट', 'लाइट', 'લાઇટ')}
          </button>
          <button type="button" aria-pressed={theme === 'dark'} onClick={() => setPref('theme', 'dark')}>
            <Moon aria-hidden="true" /> {t('Dark', 'डार्क', 'डार्क', 'ડાર્ક')}
          </button>
        </div>
      </div>
      <div className="a11y-row">
        <span className="label">
          <Type aria-hidden="true" /> {t('Text size', 'अक्षर का आकार', 'अक्षरांचा आकार', 'અક્ષરનું કદ')}
        </span>
        <SizeButtons />
      </div>
      <LiteSwitch />
    </div>
  );
}

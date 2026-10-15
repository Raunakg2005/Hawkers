import type { L, Lang } from '@/data/types';

export type { L, Lang };

/** Every supported language, in the order shown in the picker. */
export const LANGS: { id: Lang; native: string; english: string; short: string; locale: string }[] = [
  { id: 'en', native: 'English', english: 'English', short: 'EN', locale: 'en-IN' },
  { id: 'hi', native: 'हिंदी', english: 'Hindi', short: 'हिं', locale: 'hi-IN' },
  { id: 'mr', native: 'मराठी', english: 'Marathi', short: 'मरा', locale: 'mr-IN' },
  { id: 'gu', native: 'ગુજરાતી', english: 'Gujarati', short: 'ગુજ', locale: 'gu-IN' },
];

export const LANG_IDS = LANGS.map((l) => l.id);

export const isLang = (v: unknown): v is Lang => typeof v === 'string' && (LANG_IDS as string[]).includes(v);

/** BCP-47 locale for Intl date/number formatting and speech (e.g. 'mr-IN'). */
export const localeOf = (lang: Lang) => LANGS.find((l) => l.id === lang)!.locale;

/** The string for one language. */
export const pick = (l: L, lang: Lang) => l[lang];

/** Build an L from four strings (handy for template literals). */
export const l4 = (en: string, hi: string, mr: string, gu: string): L => ({ en, hi, mr, gu });

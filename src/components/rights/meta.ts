import {
  Baby,
  Camera,
  CalendarCheck,
  FileText,
  FingerprintPattern,
  HandCoins,
  HeartHandshake,
  HeartPulse,
  House,
  IdCard,
  Landmark,
  MonitorSmartphone,
  PiggyBank,
  Scale,
  ShieldPlus,
  ShoppingBasket,
  Siren,
  Smartphone,
  Store,
  UsersRound,
  type LucideIcon,
} from 'lucide-react';
import type { L, Scheme, SchemeNeed } from '@/data/types';

/** Icon + colour for each "need" — the visual word a worker taps on. */
export const NEED_META: Record<SchemeNeed, { icon: LucideIcon; color: string }> = {
  id: { icon: IdCard, color: 'var(--color-accent)' },
  health: { icon: HeartPulse, color: 'var(--color-danger)' },
  insurance: { icon: ShieldPlus, color: 'var(--color-trust)' },
  pension: { icon: PiggyBank, color: 'var(--trade-painter)' },
  loan: { icon: HandCoins, color: 'var(--color-success)' },
  housing: { icon: House, color: 'var(--trade-carpenter)' },
  food: { icon: ShoppingBasket, color: 'var(--color-brand)' },
  family: { icon: UsersRound, color: 'var(--trade-plumber)' },
};

export const DOC_ICON: Record<string, LucideIcon> = {
  aadhaar: FingerprintPattern,
  mobile: Smartphone,
  bank: Landmark,
  ration: ShoppingBasket,
  photo: Camera,
  work90: CalendarCheck,
  vendor: Store,
  income: FileText,
};

/** Helpline number → icon (falls back to a phone in the UI). */
export const HELPLINE_META: Record<string, { icon: LucideIcon; color: string }> = {
  '112': { icon: Siren, color: 'var(--color-danger)' },
  '181': { icon: HeartHandshake, color: 'var(--trade-painter)' },
  '14434': { icon: IdCard, color: 'var(--color-accent)' },
  '15100': { icon: Scale, color: 'var(--color-trust)' },
  '1098': { icon: Baby, color: 'var(--color-brand)' },
  '1930': { icon: MonitorSmartphone, color: 'var(--color-warning)' },
};

export const telHref = (n: string) => `tel:${n.replace(/[^\d+]/g, '')}`;

/** What the read-aloud button says for a scheme card. */
export function schemeSpeech(s: Scheme): L {
  return {
    en: `${s.name}. ${s.short.en}. ${s.benefit.en} Who can apply: ${s.who.en} Cost: ${s.cost.en}. Where to go: ${s.where.en}.${s.helpline ? ` Helpline: ${s.helpline.replace(/\s/g, '').split('').join(' ')}.` : ''}`,
    hi: `${s.name}। ${s.short.hi}। ${s.benefit.hi} कौन ले सकता है: ${s.who.hi} ख़र्च: ${s.cost.hi}। कहाँ जाएँ: ${s.where.hi}।${s.helpline ? ` हेल्पलाइन: ${s.helpline.replace(/\s/g, '').split('').join(' ')}।` : ''}`,
  };
}

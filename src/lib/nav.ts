import type { L } from '@/data/types';

export type NavItem = { href: string; label: L; hint: L; icon: 'search' | 'users' | 'card' | 'rights' | 'shield' | 'wallet' | 'post' | 'home' };

/** Primary navigation — ordered by what a worker needs first. */
export const NAV: NavItem[] = [
  { href: '/jobs', label: { en: 'Find work', hi: 'काम खोजें' }, hint: { en: 'Nearby jobs with clear pay', hi: 'पास के काम, साफ़ मज़दूरी' }, icon: 'search' },
  { href: '/workers', label: { en: 'Hire', hi: 'कारीगर बुलाएँ' }, hint: { en: 'Verified skilled workers', hi: 'जाँचे हुए कारीगर' }, icon: 'users' },
  { href: '/profile', label: { en: 'Skill card', hi: 'स्किल कार्ड' }, hint: { en: 'Your work identity — no résumé', hi: 'आपकी काम की पहचान — बिना बायोडाटा' }, icon: 'card' },
  { href: '/rights', label: { en: 'Rights', hi: 'अधिकार' }, hint: { en: 'Schemes, documents, help', hi: 'योजनाएँ, कागज़, मदद' }, icon: 'rights' },
  { href: '/safety', label: { en: 'Safety', hi: 'सुरक्षा' }, hint: { en: 'Check a job before you go', hi: 'जाने से पहले काम जाँचें' }, icon: 'shield' },
];

export const NAV_MORE: NavItem[] = [
  { href: '/my-work', label: { en: 'My work diary', hi: 'मेरी काम डायरी' }, hint: { en: 'Earnings, dues & upcoming jobs', hi: 'कमाई, बकाया और आने वाले काम' }, icon: 'wallet' },
  { href: '/post-job', label: { en: 'Post a job', hi: 'काम डालें' }, hint: { en: 'For employers — 2 minutes', hi: 'मालिकों के लिए — 2 मिनट' }, icon: 'post' },
];

export const isActive = (pathname: string, href: string) => (href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/'));

import type { L } from '@/data/types';

export type NavItem = { href: string; label: L; hint: L; icon: 'search' | 'users' | 'card' | 'rights' | 'shield' | 'wallet' | 'post' | 'home' };

/** Primary navigation — ordered by what a worker needs first. */
export const NAV: NavItem[] = [
  { href: '/jobs', label: { en: 'Find work', hi: 'काम खोजें', mr: 'काम शोधा', gu: 'કામ શોધો' }, hint: { en: 'Nearby jobs with clear pay', hi: 'पास के काम, साफ़ मज़दूरी', mr: 'जवळची कामे, स्पष्ट मजुरी', gu: 'નજીકનાં કામ, સ્પષ્ટ મજૂરી' }, icon: 'search' },
  { href: '/workers', label: { en: 'Hire', hi: 'कारीगर बुलाएँ', mr: 'कारागीर बोलवा', gu: 'કારીગર બોલાવો' }, hint: { en: 'Verified skilled workers', hi: 'जाँचे हुए कारीगर', mr: 'पडताळलेले कारागीर', gu: 'ચકાસાયેલ કારીગરો' }, icon: 'users' },
  { href: '/profile', label: { en: 'Skill card', hi: 'स्किल कार्ड', mr: 'स्किल कार्ड', gu: 'સ્કિલ કાર્ડ' }, hint: { en: 'Your work identity, no résumé', hi: 'आपकी काम की पहचान, बिना बायोडाटा', mr: 'तुमची कामाची ओळख, बायोडाटाशिवाय', gu: 'તમારા કામની ઓળખ, બાયોડેટા વગર' }, icon: 'card' },
  { href: '/rights', label: { en: 'Rights', hi: 'अधिकार', mr: 'हक्क', gu: 'અધિકાર' }, hint: { en: 'Schemes, documents, help', hi: 'योजनाएँ, कागज़, मदद', mr: 'योजना, कागदपत्रे, मदत', gu: 'યોજનાઓ, દસ્તાવેજ, મદદ' }, icon: 'rights' },
  { href: '/safety', label: { en: 'Safety', hi: 'सुरक्षा', mr: 'सुरक्षा', gu: 'સુરક્ષા' }, hint: { en: 'Check a job before you go', hi: 'जाने से पहले काम जाँचें', mr: 'जाण्याआधी काम तपासा', gu: 'જતાં પહેલાં કામ તપાસો' }, icon: 'shield' },
];

export const NAV_MORE: NavItem[] = [
  { href: '/my-work', label: { en: 'My work diary', hi: 'मेरी काम डायरी', mr: 'माझी कामाची डायरी', gu: 'મારી કામની ડાયરી' }, hint: { en: 'Earnings, dues & upcoming jobs', hi: 'कमाई, बकाया और आने वाले काम', mr: 'कमाई, बाकी पैसे आणि पुढची कामे', gu: 'કમાણી, બાકી પૈસા અને આવનારાં કામ' }, icon: 'wallet' },
  { href: '/post-job', label: { en: 'Post a job', hi: 'काम डालें', mr: 'काम टाका', gu: 'કામ મૂકો' }, hint: { en: 'For employers, 2 minutes', hi: 'मालिकों के लिए, 2 मिनट', mr: 'मालकांसाठी, 2 मिनिटे', gu: 'માલિકો માટે, 2 મિનિટ' }, icon: 'post' },
];

export const isActive = (pathname: string, href: string) => (href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/'));

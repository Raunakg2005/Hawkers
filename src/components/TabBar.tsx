'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { House, IdCard, Landmark, Search, WalletCards } from 'lucide-react';
import { T } from './T';
import { isActive } from '@/lib/nav';

/**
 * App-style bottom navigation for phones: the five things a worker does most,
 * as big icons within thumb reach. "Find work" sits in the raised centre.
 */
const TABS = [
  { href: '/', icon: House, en: 'Home', hi: 'होम' },
  { href: '/rights', icon: Landmark, en: 'Rights', hi: 'अधिकार' },
  { href: '/jobs', icon: Search, en: 'Find work', hi: 'काम खोजें', main: true },
  { href: '/profile', icon: IdCard, en: 'My card', hi: 'मेरा कार्ड' },
  { href: '/my-work', icon: WalletCards, en: 'Diary', hi: 'डायरी' },
];

export default function TabBar() {
  const pathname = usePathname();
  return (
    <nav className="tabbar" aria-label="Quick">
      {TABS.map(({ href, icon: Icon, en, hi, main }) => {
        const current = isActive(pathname, href) ? 'page' : undefined;
        return main ? (
          <Link key={href} href={href} className="tab-main" aria-current={current}>
            <span className="tab-icon">
              <Icon aria-hidden="true" />
            </span>
            <span className="tab-label">
              <T en={en} hi={hi} />
            </span>
          </Link>
        ) : (
          <Link key={href} href={href} aria-current={current}>
            <Icon aria-hidden="true" />
            <span>
              <T en={en} hi={hi} />
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

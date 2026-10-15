'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import Logo from './Logo';
import NavIcon from './NavIcon';
import { T, Tx } from './T';
import { A11yMenu, LangPicker, PrefPanel, ThemeToggle } from './PrefControls';
import { NAV, NAV_MORE, isActive } from '@/lib/nav';
import { useLang } from '@/lib/prefs';

export default function Header() {
  const pathname = usePathname();
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [prevPath, setPrevPath] = useState(pathname);

  // Close the drawer whenever the route changes.
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    let last = window.scrollY;
    let ticking = false;
    const update = () => {
      ticking = false;
      const y = window.scrollY;
      setScrolled(y > 16);
      setHidden((h) => (y > 480 && y > last + 6 ? true : y < last - 6 ? false : h));
      last = y;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', open);
    if (open) window.__lenis?.stop();
    else window.__lenis?.start();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const cls = ['site-header', (scrolled || open) && 'is-scrolled', hidden && !open && 'is-hidden'].filter(Boolean).join(' ');

  return (
    <>
      <header className={cls}>
        <div className="container header-inner">
          <Link className="brand" href="/" aria-label={t('Naka, home', 'नाका, होम', 'नाका, होम', 'નાકા, હોમ')}>
            <Logo />
            <span>
              naka
              <small>
                <T en="beyond the waiting line" hi="इंतज़ार से आगे" mr="प्रतीक्षेच्या पलीकडे" gu="રાહથી આગળ" />
              </small>
            </span>
          </Link>

          <nav className="main-nav" aria-label="Main">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} aria-current={isActive(pathname, item.href) ? 'page' : undefined}>
                <NavIcon name={item.icon} size={17} />
                <Tx l={item.label} />
              </Link>
            ))}
          </nav>

          <div className="header-actions">
            <LangPicker />
            <span className="hide-sm">
              <ThemeToggle />
            </span>
            <span className="hide-sm">
              <A11yMenu />
            </span>
            <Link className="btn btn-primary btn-sm header-cta" href="/my-work" data-magnetic="">
              <T en="My work" hi="मेरा काम" mr="माझे काम" gu="મારું કામ" />
              <ArrowRight aria-hidden="true" />
            </Link>
            <button
              className="burger"
              type="button"
              aria-label={open ? t('Close menu', 'मेनू बंद करें', 'मेनू बंद करा', 'મેનૂ બંધ કરો') : t('Open menu', 'मेनू खोलें', 'मेनू उघडा', 'મેનૂ ખોલો')}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((o) => !o)}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <div className={open ? 'mobile-menu is-open' : 'mobile-menu'} id="mobile-menu" aria-hidden={!open} inert={!open} data-lenis-prevent="">
        <nav aria-label="Mobile">
          {[...NAV, ...NAV_MORE].map((item, i) => (
            <Link key={item.href} href={item.href} style={{ '--i': i } as React.CSSProperties} aria-current={isActive(pathname, item.href) ? 'page' : undefined}>
              <span className="icon-tile sm">
                <NavIcon name={item.icon} />
              </span>
              <span>
                <Tx l={item.label} />
                <small>
                  <Tx l={item.hint} />
                </small>
              </span>
            </Link>
          ))}
        </nav>
        <PrefPanel />
      </div>
    </>
  );
}

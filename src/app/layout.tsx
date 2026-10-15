import type { Metadata, Viewport } from 'next';
import { Bricolage_Grotesque, Mukta, Mukta_Vaani } from 'next/font/google';
import 'lenis/dist/lenis.css';
import './globals.css';
/*
 * All page styles ship as one site-wide stylesheet (~40 KB gzipped). Route-split
 * CSS made Next preload every linked page's stylesheet on prefetch, which
 * Chrome reports as "preloaded but not used" warnings — and one sheet also
 * makes every navigation instant.
 */
import '@/styles/landing.css';
import '@/styles/jobs.css';
import '@/app/rights/rights.module.css';
import '@/app/safety/safety.module.css';
import '@/components/rights/rights-ui.module.css';
import '@/components/safety/safety-ui.module.css';
import '@/components/profile/profile.module.css';
import '@/components/diary/diary.module.css';
import '@/components/workers/workers.module.css';
import '@/components/post-job/postjob.module.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TabBar from '@/components/TabBar';
import LanguageWelcome from '@/components/LanguageWelcome';
import SmoothScroll from '@/components/SmoothScroll';
import MotionManager from '@/components/MotionManager';
import { T } from '@/components/T';
import { PREFS_SCRIPT } from '@/lib/prefs-script';

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-bricolage',
  display: 'swap',
});

const mukta = Mukta({
  subsets: ['latin', 'devanagari'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-mukta',
  display: 'swap',
});

// Gujarati glyphs only; not preloaded, so it downloads just for Gujarati readers.
const muktaVaani = Mukta_Vaani({
  subsets: ['gujarati'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-mukta-vaani',
  display: 'swap',
  preload: false,
});

const DESCRIPTION =
  'Naka connects India’s daily-wage workers — plumbers, electricians, painters, masons, helpers — to nearby work with clear pay, a skill card without a résumé, scam protection and welfare schemes.';

export const metadata: Metadata = {
  metadataBase: new URL('https://naka.example'),
  title: { default: 'Naka — Beyond the waiting line', template: '%s · Naka' },
  description: DESCRIPTION,
  applicationName: 'Naka',
  openGraph: { type: 'website', siteName: 'Naka', title: 'Naka — Beyond the waiting line', description: DESCRIPTION },
  twitter: { card: 'summary_large_image', title: 'Naka — Beyond the waiting line', description: DESCRIPTION },
};

export const viewport: Viewport = {
  themeColor: '#fdfbf7',
  colorScheme: 'light dark',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light" className={`${bricolage.variable} ${mukta.variable} ${muktaVaani.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: PREFS_SCRIPT }} />
      </head>
      {/* extensions (Grammarly, translators…) add attributes to <body>; ignore those diffs */}
      <body suppressHydrationWarning>
        <noscript>
          <style>{'[data-reveal]{opacity:1!important;transform:none!important}'}</style>
        </noscript>
        <a className="skip-link" href="#main">
          <T en="Skip to content" hi="सामग्री पर जाएँ" mr="मजकुराकडे जा" gu="સામગ્રી પર જાઓ" />
        </a>
        <div className="grain" aria-hidden="true" />
        <div className="scroll-progress" aria-hidden="true">
          <span />
        </div>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <TabBar />
        <LanguageWelcome />
        <SmoothScroll />
        <MotionManager />
      </body>
    </html>
  );
}

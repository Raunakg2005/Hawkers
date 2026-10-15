import type { Metadata } from 'next';
import { Clock, FileX, Handshake, Lightbulb, Smartphone } from 'lucide-react';
import PageHero from '@/components/PageHero';
import ReadAloud from '@/components/ReadAloud';
import { T } from '@/components/T';
import SkillCardBuilder from '@/components/profile/SkillCardBuilder';
import s from '@/components/profile/profile.module.css';

export const metadata: Metadata = {
  title: 'Skill Card',
  description:
    'Make your Naka Skill Card in 2 minutes — tap your trade, years, area and fair daily rate, add your voice and work photos. No résumé or certificate needed.',
};

const WHY = [
  {
    icon: FileX,
    tile: 'var(--color-brand)',
    title: { en: 'No résumé needed', hi: 'बायोडाटा की ज़रूरत नहीं' },
    text: { en: 'Tap pictures, not forms. Your years of work speak for you.', hi: 'फ़ॉर्म नहीं, तस्वीरें दबाइए। आपके सालों का काम ख़ुद बोलता है।' },
  },
  {
    icon: Handshake,
    tile: 'var(--color-trust)',
    title: { en: 'Employers trust it', hi: 'मालिक भरोसा करते हैं' },
    text: { en: 'Skills, fair rate and good words from past employers — in one look.', hi: 'हुनर, सही मज़दूरी और पुराने मालिकों की तारीफ़ — एक नज़र में।' },
  },
  {
    icon: Smartphone,
    tile: 'var(--color-accent)',
    title: { en: 'Works on any phone', hi: 'हर फ़ोन पर चलता है' },
    text: { en: 'Send it on WhatsApp, print it, or show the QR at your naka.', hi: 'WhatsApp पर भेजें, प्रिंट करें या नाके पर QR दिखाएँ।' },
  },
];

export default function ProfilePage() {
  return (
    <>
      <PageHero
        eyebrow={<T en="Skill card · no résumé" hi="स्किल कार्ड · बिना बायोडाटा" />}
        title={
          <T
            en={
              <>
                Your skill is your <span className="gradient-text">résumé.</span>
              </>
            }
            hi={
              <>
                आपका हुनर ही आपका <span className="gradient-text">बायोडाटा</span> है।
              </>
            }
          />
        }
        lead={
          <T
            en="Answer 4 easy questions by tapping pictures. Get a work ID card you can show, send or print — and find work that matches it."
            hi="तस्वीरें दबाकर 4 आसान सवालों के जवाब दें। काम का पहचान कार्ड पाएँ जिसे आप दिखा, भेज या प्रिंट कर सकें — और उसके हिसाब से काम पाएँ।"
          />
        }
      >
        <div className="row">
          <ReadAloud
            className="btn btn-sm"
            en="Make your skill card. Answer four easy questions by tapping pictures: your work, your years, your area and pay, and your voice. No résumé needed."
            hi="अपना स्किल कार्ड बनाइए। तस्वीरें दबाकर चार आसान सवालों के जवाब दीजिए: आपका काम, आपके साल, आपका इलाका और मज़दूरी, और आपकी आवाज़। बायोडाटा की ज़रूरत नहीं।"
          />
          <span className="chip chip-trust">
            <Clock aria-hidden="true" />
            <T en="Takes 2 minutes" hi="सिर्फ़ 2 मिनट" />
          </span>
        </div>
      </PageHero>

      <section className={`container ${s.why}`} aria-labelledby="why-card">
        <h2 id="why-card" className={s.whyTitle}>
          <Lightbulb aria-hidden="true" width={20} height={20} />
          <T en="Why a skill card?" hi="स्किल कार्ड क्यों?" />
        </h2>
        <ul className={s.whyGrid}>
          {WHY.map((w, i) => {
            const Icon = w.icon;
            return (
              <li key={w.title.en} className={s.whyItem} data-reveal="" style={{ '--d': i } as React.CSSProperties}>
                <span className="icon-tile sm" style={{ '--tile': w.tile } as React.CSSProperties}>
                  <Icon aria-hidden="true" />
                </span>
                <div>
                  <strong>
                    <T en={w.title.en} hi={w.title.hi} />
                  </strong>
                  <p>
                    <T en={w.text.en} hi={w.text.hi} />
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="section-tight" aria-labelledby="builder-title">
        <div className="container">
          <h2 id="builder-title" className="sr-only">
            <T en="Make your skill card" hi="अपना स्किल कार्ड बनाएँ" />
          </h2>
          <SkillCardBuilder />
        </div>
      </section>
    </>
  );
}

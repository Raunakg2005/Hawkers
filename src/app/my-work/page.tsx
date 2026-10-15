import type { Metadata } from 'next';
import { Lock, NotebookPen } from 'lucide-react';
import PageHero from '@/components/PageHero';
import { T } from '@/components/T';
import WorkDiary from '@/components/diary/WorkDiary';
import s from '@/components/diary/diary.module.css';

export const metadata: Metadata = {
  title: 'My work diary',
  description:
    'Write down every day of work in seconds, see what you earned this week, who still owes you money, send polite payment reminders and build proof of work for welfare schemes.',
};

export default function MyWorkPage() {
  return (
    <>
      <PageHero
        tint="var(--color-accent)"
        eyebrow={<T en="My work diary" hi="मेरी काम डायरी" mr="माझी कामाची डायरी" gu="મારી કામની ડાયરી" />}
        title={
          <T
            en={
              <>
                Every day of work, <span className="gradient-text">counted.</span>
              </>
            }
            hi={
              <>
                हर दिन का काम, <span className="gradient-text">गिना हुआ।</span>
              </>
            }
            mr={
              <>
                प्रत्येक दिवसाचे काम, <span className="gradient-text">मोजलेले.</span>
              </>
            }
            gu={
              <>
                દરેક દિવસનું કામ, <span className="gradient-text">ગણેલું.</span>
              </>
            }
          />
        }
        lead={
          <T
            en="Daily-wage money comes and goes. Your diary shows what you earned, who still owes you, and keeps proof of every day you worked."
            hi="दिहाड़ी का पैसा आता-जाता रहता है। आपकी डायरी बताती है आपने कितना कमाया, किस पर पैसा बाक़ी है, और हर काम के दिन का सबूत रखती है।"
            mr="रोजंदारीचा पैसा येतो-जातो. तुमची डायरी सांगते तुम्ही किती कमावले, कोणाकडे पैसे बाकी आहेत, आणि कामाच्या प्रत्येक दिवसाचा पुरावा ठेवते."
            gu="રોજિંદી મજૂરીના પૈસા આવે-જાય છે. તમારી ડાયરી બતાવે છે કે તમે કેટલું કમાયા, કોની પાસે પૈસા બાકી છે, અને કામના દરેક દિવસનો પુરાવો રાખે છે."
          />
        }
      >
        <div className={s.heroNote}>
          <span className="chip chip-brand">
            <NotebookPen aria-hidden="true" />
            <T en="10 seconds a day" hi="रोज़ सिर्फ़ 10 सेकंड" mr="रोज फक्त 10 सेकंद" gu="રોજ ફક્ત 10 સેકન્ડ" />
          </span>
          <span className="chip chip-trust">
            <Lock aria-hidden="true" />
            <T en="Stays on your phone" hi="आपके फ़ोन में ही रहती है" mr="तुमच्या फोनमध्येच राहते" gu="તમારા ફોનમાં જ રહે છે" />
          </span>
        </div>
      </PageHero>

      <section className="section-tight" style={{ paddingTop: 0 }} aria-labelledby="diary-title">
        <div className="container">
          <h2 id="diary-title" className="sr-only">
            <T en="Your diary" hi="आपकी डायरी" mr="तुमची डायरी" gu="તમારી ડાયરી" />
          </h2>
          <WorkDiary />
        </div>
      </section>
    </>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, BadgeCheck, Briefcase, ChevronRight, CircleCheck, Hourglass, IdCard, Images, Info, Languages, MapPin, Quote, ShieldCheck, Star } from 'lucide-react';
import { T, Tx } from '@/components/T';
import ReadAloud from '@/components/ReadAloud';
import WorkerAvatar from '@/components/WorkerAvatar';
import WorkerCard from '@/components/WorkerCard';
import { TradeIcon, tradeColor } from '@/components/TradeIcon';
import FairBand, { fairStatus } from '@/components/workers/FairBand';
import HirePanel from '@/components/workers/HirePanel';
import ProfileActions from '@/components/workers/ProfileActions';
import { PAY_UNIT, TRADE, rupee } from '@/data/trades';
import { WORKERS, getWorker } from '@/data/workers';
import type { Worker } from '@/data/types';
import s from '@/components/workers/workers.module.css';

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return WORKERS.map((w) => ({ id: w.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const w = getWorker(id);
  if (!w) return { title: 'Worker not found' };
  const trade = TRADE[w.trade].name.en;
  return {
    title: `${w.name}, ${trade}`,
    description: `${w.name}, ${trade.toLowerCase()} with ${w.years} years of experience near ${w.area.en}. Rated ${w.rating}★ across ${w.jobsDone} jobs. ${w.intro.en}`,
  };
}

function Stars({ n, label }: { n: number; label: string }) {
  return (
    <span className={s.stars} role="img" aria-label={label}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} aria-hidden="true" className={i <= Math.round(n) ? s.starOn : s.starOff} />
      ))}
    </span>
  );
}

const CHECKS = [
  { key: 'id', Icon: IdCard, en: 'ID checked', hi: 'पहचान जाँची', mr: 'ओळखपत्र तपासले', gu: 'ઓળખપત્ર તપાસ્યું' },
  { key: 'eshram', Icon: BadgeCheck, en: 'e-Shram', hi: 'ई-श्रम', mr: 'ई-श्रम', gu: 'ઈ-શ્રમ' },
  { key: 'police', Icon: ShieldCheck, en: 'Police verified', hi: 'पुलिस सत्यापन', mr: 'पोलीस पडताळणी', gu: 'પોલીસ ચકાસણી' },
] as const;

function similarTo(w: Worker) {
  return WORKERS.filter((x) => x.id !== w.id)
    .map((x) => {
      const sameTrade = x.trade === w.trade || x.otherTrades.includes(w.trade) || w.otherTrades.includes(x.trade);
      return { x, score: (sameTrade ? 0 : 10) + Math.abs(x.distanceKm - w.distanceKm) };
    })
    .sort((a, b) => a.score - b.score)
    .slice(0, 3)
    .map((r) => r.x);
}

export default async function WorkerProfilePage({ params }: Props) {
  const { id } = await params;
  const w = getWorker(id);
  if (!w) notFound();

  const idx = WORKERS.indexOf(w);
  const trade = TRADE[w.trade];
  const first = w.name.split(' ')[0];
  const monthly = w.rateUnit === 'month';
  const status = fairStatus(w.trade, w.rate);
  const checks = [w.verified.id, w.verified.eshram, w.verified.police].filter(Boolean).length;
  const relay = `+91 22 4000 ${1100 + idx}`;
  const similar = similarTo(w);

  return (
    <>
      <section className={s.profileSection}>
        <div className="container">
          <nav className="crumbs">
            <Link href="/workers">
              <ArrowLeft aria-hidden="true" />
              <T en="All workers" hi="सभी कारीगर" mr="सर्व कारागीर" gu="બધા કારીગરો" />
            </Link>
            <ChevronRight aria-hidden="true" />
            <Link href={`/workers?trade=${w.trade}`}>
              <Tx l={trade.name} />
            </Link>
            <ChevronRight aria-hidden="true" />
            <span aria-current="page">{w.name}</span>
          </nav>

          {/* ── Profile header */}
          <header className={s.profileHead} style={{ '--hue': w.hue, '--tile': tradeColor(w.trade) } as React.CSSProperties}>
            <div className={s.headBg} aria-hidden="true">
              <TradeIcon trade={w.trade} />
            </div>
            <div className={s.headMain}>
              <div className={s.avatarWrap}>
                <WorkerAvatar name={w.name} trade={w.trade} hue={w.hue} hair={w.hair} size={120} />
              </div>
              <div className={s.headInfo}>
                <span className={`chip ${w.availableToday ? 'chip-success' : 'chip-warning'}`}>
                  {w.availableToday ? <span className="dot dot-live" aria-hidden="true" /> : <Hourglass aria-hidden="true" />}
                  <Tx l={w.nextFree} />
                </span>
                <h1 className={s.name}>{w.name}</h1>
                <p className={s.headTrade}>
                  <TradeIcon trade={w.trade} />
                  <Tx l={trade.name} />
                  <span className={s.sep} aria-hidden="true">
                    ·
                  </span>
                  <span>
                    {w.years} <T en="years’ experience" hi="साल का अनुभव" mr="वर्षांचा अनुभव" gu="વર્ષનો અનુભવ" />
                  </span>
                </p>
                <p className={`muted ${s.headArea}`}>
                  <MapPin aria-hidden="true" />
                  <span>
                    <Tx l={w.area} /> · {w.distanceKm} km <T en="from Kurla naka" hi="कुर्ला नाका से" mr="कुर्ला नाक्यापासून" gu="કુર્લા નાકાથી" />
                  </span>
                </p>
                {w.otherTrades.length > 0 && (
                  <p className="subtle">
                    <T en="Also does:" hi="यह भी करते हैं:" mr="हेही करतात:" gu="આ પણ કરે છે:" />{' '}
                    {w.otherTrades.map((o, i) => (
                      <span key={o}>
                        {i > 0 && ', '}
                        <Tx l={TRADE[o].name} />
                      </span>
                    ))}
                  </p>
                )}
              </div>
              <dl className={s.headStats}>
                <div>
                  <dt>
                    <T en="Rating" hi="रेटिंग" mr="रेटिंग" gu="રેટિંગ" />
                  </dt>
                  <dd>
                    <span className="money">
                      <Star aria-hidden="true" className="star" /> {w.rating}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt>
                    <T en="Jobs done" hi="किए गए काम" mr="केलेली कामे" gu="કરેલાં કામ" />
                  </dt>
                  <dd className="money">{w.jobsDone}</dd>
                </div>
                <div>
                  <dt>
                    <T en="Checks" hi="जाँच" mr="तपासणी" gu="ચકાસણી" />
                  </dt>
                  <dd className="money">{checks}/3</dd>
                </div>
              </dl>
            </div>

            <ul className={s.badges}>
              {CHECKS.map(({ key, Icon, en, hi, mr, gu }) => {
                const ok = w.verified[key];
                return (
                  <li key={key} className={`chip ${ok ? 'chip-trust' : 'chip-warning'}`}>
                    <Icon aria-hidden="true" />
                    <T en={en} hi={hi} mr={mr} gu={gu} />
                    <span className={s.badgeState}>
                      {ok ? <CircleCheck aria-hidden="true" /> : <Hourglass aria-hidden="true" />}
                      {ok ? <T en="Verified" hi="हो गया" mr="पडताळलेले" gu="ચકાસાયેલ" /> : <T en="Pending" hi="बाकी है" mr="बाकी आहे" gu="બાકી છે" />}
                    </span>
                  </li>
                );
              })}
            </ul>

            <ProfileActions id={w.id} name={w.name} relay={relay} />
          </header>

          {/* ── Body */}
          <div className={s.profileGrid}>
            <div className={s.mainCol}>
              {/* Rate */}
              <article className={`card ${s.block}`} data-reveal="">
                <div className={s.blockHead}>
                  <span className="eyebrow">
                    <T en="Rate & fair pay" hi="रेट और सही मज़दूरी" mr="दर आणि योग्य मजुरी" gu="દર અને યોગ્ય મજૂરી" />
                  </span>
                </div>
                <p className={s.bigRate}>
                  <span className="money">{rupee(w.rate)}</span>
                  <span className="muted">
                    <Tx l={PAY_UNIT[w.rateUnit]} />
                  </span>
                </p>
                {monthly ? (
                  <p className="callout">
                    <Info aria-hidden="true" />
                    <span>
                      <T
                        en={`A monthly rate for a fixed daily slot (usually 2-3 hours a day). For a full-day event, the fair band for ${trade.name.en.toLowerCase()} work is ${rupee(trade.fair[0])}, ${rupee(trade.fair[1])} a day.`}
                        hi={`महीने का रेट, रोज़ तय समय के लिए (आम तौर पर दिन में 2-3 घंटे)। पूरे दिन के कार्यक्रम के लिए ${trade.name.hi} का सही दाम ${rupee(trade.fair[0])}, ${rupee(trade.fair[1])} रोज़ है।`}
                        mr={`महिन्याचा दर, रोज ठरलेल्या वेळेसाठी (साधारण दिवसाला 2-3 तास). पूर्ण दिवसाच्या कार्यक्रमासाठी ${trade.name.mr} कामाची योग्य मर्यादा रोज ${rupee(trade.fair[0])}, ${rupee(trade.fair[1])} आहे.`}
                        gu={`મહિનાનો દર, રોજ નક્કી સમય માટે (સામાન્ય રીતે દિવસના 2-3 કલાક). આખા દિવસના પ્રસંગ માટે ${trade.name.gu}ના કામની યોગ્ય મર્યાદા રોજના ${rupee(trade.fair[0])}, ${rupee(trade.fair[1])} છે.`}
                      />
                    </span>
                  </p>
                ) : (
                  <>
                    <FairBand trade={w.trade} perDay={w.rate} />
                    <p className="muted">
                      {status === 'fair' && (
                        <T
                          en={`${first}’s rate sits inside the fair band for ${trade.name.en.toLowerCase()} work near you. Fair pay means they show up, on time, again.`}
                          hi={`${first} का रेट आपके इलाके में ${trade.name.hi} के सही दाम के अंदर है। सही मज़दूरी का मतलब, समय पर आना, बार-बार आना।`}
                          mr={`${first} यांचा दर तुमच्या भागातील ${trade.name.mr} कामाच्या योग्य मर्यादेत आहे. योग्य मजुरी म्हणजे, वेळेवर येणे, पुन्हा पुन्हा येणे.`}
                          gu={`${first}નો દર તમારા વિસ્તારમાં ${trade.name.gu}ના કામની યોગ્ય મર્યાદામાં છે. યોગ્ય મજૂરી એટલે, સમયસર આવવું, વારંવાર આવવું.`}
                        />
                      )}
                      {status === 'above' && (
                        <T
                          en={`A little above the usual band, that reflects ${w.years} years of experience and a ${w.rating}★ rating.`}
                          hi={`आम दाम से थोड़ा ऊपर, ${w.years} साल का अनुभव और ${w.rating}★ रेटिंग इसकी वजह है।`}
                          mr={`नेहमीच्या दरापेक्षा थोडे जास्त, ${w.years} वर्षांचा अनुभव आणि ${w.rating}★ रेटिंग हे त्याचे कारण आहे.`}
                          gu={`સામાન્ય દર કરતાં થોડું વધારે, ${w.years} વર્ષનો અનુભવ અને ${w.rating}★ રેટિંગ એનું કારણ છે.`}
                        />
                      )}
                      {status === 'below' && (
                        <T
                          en={`${first} asks less than the usual band. Please consider paying at least ${rupee(trade.fair[0])}, it is the fair rate for this work.`}
                          hi={`${first} आम दाम से कम माँगते हैं। कृपया कम से कम ${rupee(trade.fair[0])} देने का सोचें, इस काम का यही सही दाम है।`}
                          mr={`${first} नेहमीच्या दरापेक्षा कमी मागतात. कृपया किमान ${rupee(trade.fair[0])} देण्याचा विचार करा, या कामाचा हाच योग्य दर आहे.`}
                          gu={`${first} સામાન્ય દર કરતાં ઓછું માગે છે. મહેરબાની કરીને ઓછામાં ઓછા ${rupee(trade.fair[0])} આપવાનું વિચારો, આ કામનો આ જ યોગ્ય દર છે.`}
                        />
                      )}
                    </p>
                  </>
                )}
                <p className="subtle">
                  <T en="Indicative band from local naka rates, not an official wage." hi="नाके के आम रेट से अनुमान, सरकारी दर नहीं।" mr="नाक्यावरच्या नेहमीच्या दरांवरून अंदाज, सरकारी दर नाही." gu="નાકાના સામાન્ય દર પરથી અંદાજ, સરકારી દર નથી." />
                </p>
              </article>

              {/* About */}
              <article className={`card ${s.block}`} data-reveal="">
                <div className={s.blockHead}>
                  <span className="eyebrow">
                    <T en={`In ${first}’s words`} hi={`${first} के शब्दों में`} mr={`${first} यांच्या शब्दांत`} gu={`${first}ના શબ્દોમાં`} />
                  </span>
                  <ReadAloud en={w.intro.en} hi={w.intro.hi} mr={w.intro.mr} gu={w.intro.gu} className="btn btn-sm" />
                </div>
                <blockquote className={s.quote}>
                  <Quote aria-hidden="true" />
                  <p>
                    <Tx l={w.intro} />
                  </p>
                </blockquote>
                <div className={s.aboutGrid}>
                  <div>
                    <h3 className={s.miniHead}>
                      <T en="Skills" hi="हुनर" mr="कौशल्ये" gu="આવડત" />
                    </h3>
                    <ul className={s.chipList}>
                      {w.skills.map((k) => (
                        <li key={k.en} className="chip" style={{ '--tile': tradeColor(w.trade) } as React.CSSProperties}>
                          <CircleCheck aria-hidden="true" className={s.skillTick} />
                          <Tx l={k} />
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className={s.miniHead}>
                      <Languages aria-hidden="true" />
                      <T en="Speaks" hi="भाषाएँ" mr="भाषा" gu="ભાષાઓ" />
                    </h3>
                    <ul className={s.chipList}>
                      {w.languages.map((l) => (
                        <li key={l} className="chip chip-accent">
                          {l}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>

              {/* Gallery */}
              <article className={`card ${s.block}`} data-reveal="">
                <div className={s.blockHead}>
                  <span className="eyebrow">
                    <T en="Work gallery" hi="किए हुए काम" mr="केलेली कामे" gu="કરેલાં કામ" />
                  </span>
                  <span className="subtle">
                    <Images aria-hidden="true" className={s.inlineIcon} /> {w.works.length} <T en={w.works.length === 1 ? 'job' : 'jobs'} hi="काम" mr="कामे" gu="કામ" />
                  </span>
                </div>
                <ul className={s.gallery}>
                  {w.works.map((wk, i) => (
                    <li key={wk.title.en} className={s.tile} style={{ '--h': wk.hue, '--d': i } as React.CSSProperties}>
                      <span className={s.tileArt} aria-hidden="true">
                        <TradeIcon trade={w.trade} />
                      </span>
                      <span className={s.tileCap}>
                        <Tx l={wk.title} />
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="subtle">
                  <T
                    en="Photos are kept private until you hire, workers choose what to share."
                    hi="फ़ोटो काम पक्का होने तक निजी रहती हैं, क्या दिखाना है, कारीगर खुद तय करते हैं।"
                    mr="काम पक्के होईपर्यंत फोटो खासगी राहतात, काय दाखवायचे ते कारागीर स्वतः ठरवतात."
                    gu="કામ પાકું થાય ત્યાં સુધી ફોટા ખાનગી રહે છે, શું બતાવવું એ કારીગર જાતે નક્કી કરે છે."
                  />
                </p>
              </article>

              {/* Endorsements */}
              <article className={`card ${s.block}`} data-reveal="">
                <div className={s.blockHead}>
                  <span className="eyebrow">
                    <T en="Endorsements from real employers" hi="असली मालिकों की राय" mr="खऱ्या मालकांचे मत" gu="સાચા માલિકોનો અભિપ્રાય" />
                  </span>
                  <span className="subtle">
                    {w.endorsements.length} · <T en="only from verified hires" hi="सिर्फ़ जाँचे हुए काम से" mr="फक्त पडताळलेल्या कामांतून" gu="ફક્ત ચકાસાયેલાં કામમાંથી" />
                  </span>
                </div>
                <ul className={s.endorse}>
                  {w.endorsements.map((e) => (
                    <li key={e.by + e.when}>
                      <div className={s.endorseTop}>
                        <span className={s.endorseAvatar} aria-hidden="true">
                          {e.by
                            .split(' ')
                            .map((p) => p[0])
                            .join('')
                            .slice(0, 2)}
                        </span>
                        <div>
                          <b>{e.by}</b>
                          <span className="subtle">
                            <Tx l={e.role} /> · {e.when}
                          </span>
                        </div>
                        <Stars n={e.rating} label={`${e.rating} / 5`} />
                      </div>
                      <p>
                        “<Tx l={e.text} />”
                      </p>
                    </li>
                  ))}
                </ul>
              </article>
            </div>

            <aside id="hire" className={s.hireAside} data-lenis-prevent="">
              <HirePanel worker={w} />
            </aside>
          </div>
        </div>
      </section>

      {/* ── Similar workers */}
      <section className="section section-alt">
        <div className="container">
          <div className={s.similarHead}>
            <div className="section-head" data-reveal="">
              <span className="eyebrow">
                <T en="Also near you" hi="आपके पास और भी" mr="तुमच्या जवळ आणखी" gu="તમારી નજીક બીજા પણ" />
              </span>
              <h2 className="h2">
                <T en="Similar workers" hi="ऐसे ही कारीगर" mr="असेच कारागीर" gu="આવા જ કારીગરો" />
              </h2>
            </div>
            <Link href={`/workers?trade=${w.trade}`} className="btn">
              <T en="See all" hi="सभी देखें" mr="सर्व पाहा" gu="બધા જુઓ" />: <Tx l={trade.name} />
              <ArrowRight aria-hidden="true" />
            </Link>
          </div>
          <div className="cards-grid">
            {similar.map((x, i) => (
              <WorkerCard key={x.id} worker={x} index={i} />
            ))}
          </div>
          <p className={`callout callout-trust ${s.postNudge}`} data-reveal="">
            <Briefcase aria-hidden="true" />
            <span>
              <T en="Need a team, or work for many days? " hi="टीम चाहिए, या कई दिन का काम है? " mr="टीम हवी आहे, की अनेक दिवसांचे काम आहे? " gu="ટીમ જોઈએ છે, કે ઘણા દિવસનું કામ છે? " />
              <Link href={`/post-job?trade=${w.trade}`} className={s.textLink}>
                <T en="Post a job, 2 minutes" hi="काम डालें, 2 मिनट" mr="काम टाका, 2 मिनिटे" gu="કામ મૂકો, 2 મિનિટ" />
              </Link>
            </span>
          </p>
        </div>
      </section>
    </>
  );
}

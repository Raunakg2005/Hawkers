'use client';

import Link from 'next/link';
import { ArrowRight, BadgeCheck, CalendarDays, Camera, IdCard, Languages, MapPin, Mic, ShieldAlert, UserRound } from 'lucide-react';
import { T, Tx } from '@/components/T';
import { TradeIcon, tradeColor } from '@/components/TradeIcon';
import WorkerAvatar from '@/components/WorkerAvatar';
import ReadAloud from '@/components/ReadAloud';
import { TRADE, rupee } from '@/data/trades';
import { useLang } from '@/lib/prefs';
import DemoQR from './DemoQR';
import { DAYS, areaLabel, cardNumber, cardSpeech, langLabel, profileHue, rateBand, yearsLevel, type SkillProfile } from './profile-data';
import s from './profile.module.css';

/**
 * The finished "ID card" for work. Same component powers the live preview in
 * the builder, the final card and the print-only copy.
 */
export default function SkillCard({
  p,
  photoUrls = [],
  variant = 'full',
}: {
  p: SkillProfile;
  photoUrls?: (string | null)[];
  /** preview: inside the builder · full: finished card · print: paper copy */
  variant?: 'preview' | 'full' | 'print';
}) {
  const { t } = useLang();
  const trade = p.trade ? TRADE[p.trade] : null;
  const area = areaLabel(p.area);
  const band = p.trade && p.rate ? rateBand(p.trade, p.rate) : null;
  const speech = cardSpeech(p);
  const name = p.name.trim();
  const qrSeed = `${name}|${p.trade}|${p.years}|${p.rate}|${p.area}|${p.skills.map((x) => x.en).join(',')}|${p.createdAt}`;
  const shownPhotos = Array.from({ length: p.photos }, (_, i) => photoUrls[i] ?? null);

  return (
    <article
      className={`${s.card} ${variant === 'preview' ? s.cardPreview : ''} ${variant === 'print' ? s.cardPrint : ''}`}
      style={{ '--tile': p.trade ? tradeColor(p.trade) : 'var(--color-brand)' } as React.CSSProperties}
      aria-label={t('Skill card', 'स्किल कार्ड', 'स्किल कार्ड', 'સ્કિલ કાર્ડ')}
    >
      <header className={s.cardBand}>
        <span className={s.cardBrand}>
          <IdCard aria-hidden="true" />
          <T en="Naka Skill Card" hi="नाका स्किल कार्ड" mr="नाका स्किल कार्ड" gu="નાકા સ્કિલ કાર્ડ" />
        </span>
        <span className={s.cardNo}>{cardNumber(p)}</span>
        <span className={s.bandIcon} aria-hidden="true">
          {p.trade ? <TradeIcon trade={p.trade} /> : <IdCard />}
        </span>
      </header>

      <div className={s.cardBody}>
        <div className={s.cardIdentity}>
          <div className={s.avatarRing}>
            {p.trade ? (
              <WorkerAvatar
                /* The avatar's gradient id comes from the name; the print copy appends 5 letters so its id is unique
                   while the skin tone (name length mod 5) stays identical. */
                name={`${name || 'Naka worker'}${variant === 'print' ? 'Print' : ''}`}
                trade={p.trade}
                hue={profileHue(p)}
                size={84}
              />
            ) : (
              <span className={s.avatarEmpty}>
                <UserRound aria-hidden="true" />
              </span>
            )}
          </div>
          <div className={s.cardWho}>
            <h3 className={s.cardName}>{name || <span className={s.placeholder}>{t('Your name', 'आपका नाम', 'तुमचं नाव', 'તમારું નામ')}</span>}</h3>
            <p className={s.cardTrade}>
              {p.trade && <TradeIcon trade={p.trade} size={18} />}
              {trade ? <Tx l={trade.name} /> : <span className={s.placeholder}>{t('Your work', 'आपका काम', 'तुमचं काम', 'તમારું કામ')}</span>}
            </p>
            {p.otherTrades.length > 0 && (
              <p className={s.cardAlso}>
                <T en="Also:" hi="और भी:" mr="आणखी:" gu="બીજું પણ:" />{' '}
                {p.otherTrades.map((o, i) => (
                  <span key={o}>
                    {i > 0 && ', '}
                    <Tx l={TRADE[o].name} />
                  </span>
                ))}
              </p>
            )}
          </div>
          {variant !== 'print' && (
            <div className={s.cardListen} data-print-hide="">
              <ReadAloud en={speech.en} hi={speech.hi} mr={speech.mr} gu={speech.gu} label={t('Listen to card', 'कार्ड सुनें', 'कार्ड ऐका', 'કાર્ડ સાંભળો')} />
            </div>
          )}
        </div>

        <div className={s.cardStatus}>
          {p.availableToday ? (
            <span className="chip chip-success">
              <span className="dot dot-live" aria-hidden="true" />
              <T en="Available today" hi="आज खाली हैं" mr="आज मोकळे आहेत" gu="આજે ખાલી છે" />
            </span>
          ) : (
            <span className="chip">
              <span className="dot" aria-hidden="true" />
              <T en="Busy today" hi="आज व्यस्त हैं" mr="आज कामात आहेत" gu="આજે કામમાં છે" />
            </span>
          )}
          <span className="chip chip-brand">
            <Tx l={yearsLevel(p.years)} />
          </span>
        </div>

        <dl className={s.cardStats}>
          <div>
            <dt>
              <T en="Experience" hi="अनुभव" mr="अनुभव" gu="અનુભવ" />
            </dt>
            <dd className="money">
              {p.years}
              {p.years >= 20 && '+'} <small>{p.years === 1 ? t('yr', 'साल', 'वर्ष', 'વર્ષ') : t('yrs', 'साल', 'वर्षं', 'વર્ષ')}</small>
            </dd>
          </div>
          <div>
            <dt>
              <T en="Daily rate" hi="रोज़ की मज़दूरी" mr="रोजचा दर" gu="રોજનો દર" />
            </dt>
            <dd className="money">{p.rate ? rupee(p.rate) : '—'}</dd>
            {band && (
              <dd className={`${s.bandTag} ${s[`band_${band}`]}`}>
                {band === 'fair' && <T en="Fair pay" hi="सही मज़दूरी" mr="योग्य मजुरी" gu="યોગ્ય મજૂરી" />}
                {band === 'below' && <T en="Below usual" hi="आम से कम" mr="नेहमीपेक्षा कमी" gu="સામાન્ય કરતાં ઓછું" />}
                {band === 'above' && <T en="Above usual" hi="आम से ज़्यादा" mr="नेहमीपेक्षा जास्त" gu="સામાન્ય કરતાં વધારે" />}
              </dd>
            )}
          </div>
          <div>
            <dt>
              <T en="Work days" hi="काम के दिन" mr="कामाचे दिवस" gu="કામના દિવસ" />
            </dt>
            <dd className="money">
              {p.days.length}
              <small>/7</small>
            </dd>
          </div>
        </dl>

        <ul className={s.cardRows}>
          <li>
            <MapPin aria-hidden="true" />
            <span>
              <span className={s.rowLabel}>
                <T en="Find me at" hi="यहाँ मिलूँगा" mr="इथे भेटेन" gu="અહીં મળીશ" />
              </span>
              {area ? <Tx l={area} /> : '—'}
              {p.spot.trim() && <span className={s.rowExtra}> · {p.spot.trim()}</span>}
            </span>
          </li>
          <li>
            <CalendarDays aria-hidden="true" />
            <span>
              <span className={s.rowLabel}>
                <T en="Days I work" hi="काम के दिन" mr="कामाचे दिवस" gu="કામના દિવસ" />
              </span>
              <span className={s.dayRow} role="list">
                {DAYS.map((d) => {
                  const on = p.days.includes(d.id);
                  return (
                    <span key={d.id} role="listitem" className={`${s.dayDot} ${on ? s.dayOn : ''}`} title={`${d.short.en}: ${on ? 'yes' : 'no'}`}>
                      <span aria-hidden="true">
                        <Tx l={d.tiny} />
                      </span>
                      <span className="sr-only">
                        <Tx l={d.short} /> {on ? t('available', 'उपलब्ध', 'मोकळा', 'ખાલી') : t('not available', 'उपलब्ध नहीं', 'मोकळा नाही', 'ખાલી નથી')}
                      </span>
                    </span>
                  );
                })}
              </span>
            </span>
          </li>
          <li>
            <Languages aria-hidden="true" />
            <span>
              <span className={s.rowLabel}>
                <T en="I speak" hi="मेरी भाषा" mr="माझी भाषा" gu="મારી ભાષા" />
              </span>
              {p.languages.length
                ? p.languages.map((l, i) => (
                    <span key={l}>
                      {i > 0 && ', '}
                      <Tx l={langLabel(l)} />
                    </span>
                  ))
                : '—'}
            </span>
          </li>
        </ul>

        <div className={s.cardSkills}>
          {p.skills.length ? (
            p.skills.map((sk) => (
              <span key={sk.en} className="chip">
                <Tx l={sk} />
              </span>
            ))
          ) : (
            <span className={s.placeholder}>
              <T en="Your skills will show here" hi="आपके हुनर यहाँ दिखेंगे" mr="तुमची कौशल्यं इथे दिसतील" gu="તમારી આવડત અહીં દેખાશે" />
            </span>
          )}
        </div>

        {(p.voice || p.photos > 0) && (
          <div className={s.cardMedia}>
            {p.voice && (
              <span className="chip chip-accent">
                <Mic aria-hidden="true" />
                <T en="Voice intro" hi="आवाज़ में परिचय" mr="आवाजात ओळख" gu="અવાજમાં ઓળખ" /> · 0:{String(p.voice.secs).padStart(2, '0')}
              </span>
            )}
            {shownPhotos.length > 0 && (
              <span className={s.thumbs}>
                {shownPhotos.map((url, i) =>
                  url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={i} src={url} alt={t(`Work photo ${i + 1}`, `काम की फ़ोटो ${i + 1}`, `कामाचा फोटो ${i + 1}`, `કામનો ફોટો ${i + 1}`)} className={s.thumb} />
                  ) : (
                    <span key={i} className={`${s.thumb} ${s.thumbEmpty}`} style={{ '--h': (profileHue(p) + i * 40) % 360 } as React.CSSProperties}>
                      <Camera aria-hidden="true" />
                    </span>
                  ),
                )}
                <span className={s.thumbCount}>
                  {p.photos} <T en={p.photos === 1 ? 'work photo' : 'work photos'} hi="काम की फ़ोटो" mr={p.photos === 1 ? 'कामाचा फोटो' : 'कामाचे फोटो'} gu={p.photos === 1 ? 'કામનો ફોટો' : 'કામના ફોટા'} />
                </span>
              </span>
            )}
          </div>
        )}

        <footer className={s.cardFoot}>
          <ul className={s.badges} aria-label={t('Checks', 'जाँच', 'तपासणी', 'ચકાસણી')}>
            <li className="chip chip-trust">
              <BadgeCheck aria-hidden="true" />
              <T en="Made on Naka" hi="नाका पर बना" mr="नाकावर बनवलेलं" gu="નાકા પર બનેલું" />
            </li>
            {p.eshram ? (
              <li className="chip chip-success">
                <BadgeCheck aria-hidden="true" />
                <T en="e-Shram linked" hi="ई-श्रम जुड़ा" mr="ई-श्रम जोडलेलं" gu="ઈ-શ્રમ જોડાયેલું" />
              </li>
            ) : (
              <li className="chip chip-warning">
                <ShieldAlert aria-hidden="true" />
                <T en="e-Shram: not yet" hi="ई-श्रम: अभी नहीं" mr="ई-श्रम: अजून नाही" gu="ઈ-શ્રમ: હજી નહીં" />
              </li>
            )}
            {!p.eshram && variant !== 'print' && (
              <li data-print-hide="">
                <Link href="/rights#e-shram" className={s.eshramLink}>
                  <T en="Link e-Shram — free" hi="ई-श्रम जोड़ें — मुफ़्त" mr="ई-श्रम जोडा — मोफत" gu="ઈ-શ્રમ જોડો — મફત" />
                  <ArrowRight aria-hidden="true" />
                </Link>
              </li>
            )}
          </ul>
          <figure className={s.qr}>
            <DemoQR seed={qrSeed} className={s.qrSvg} label={t('Demo QR code for this card', 'इस कार्ड का डेमो QR कोड', 'या कार्डचा डेमो QR कोड', 'આ કાર્ડનો ડેમો QR કોડ')} />
            <figcaption>
              <T en="Demo QR" hi="डेमो QR" mr="डेमो QR" gu="ડેમો QR" />
            </figcaption>
          </figure>
        </footer>
      </div>
    </article>
  );
}

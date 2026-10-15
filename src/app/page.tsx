import Link from 'next/link';
import {
  ArrowRight,
  AudioLines,
  BadgeCheck,
  Briefcase,
  Eye,
  Handshake,
  HeartHandshake,
  IdCard,
  Landmark,
  Languages,
  MapPin,
  Mic,
  PersonStanding,
  MousePointerClick,
  ShieldCheck,
  Smartphone,
  Sprout,
  TrendingUp,
  Type,
  UsersRound,
  WalletCards,
  WifiOff,
} from 'lucide-react';
import NakaScene from '@/components/NakaScene';
import JobCard from '@/components/JobCard';
import { T, Tx } from '@/components/T';
import { TradeIcon, TradeTile, tradeColor } from '@/components/TradeIcon';
import { PAY_UNIT, TRADE, TRADES, rupee } from '@/data/trades';
import { JOBS } from '@/data/jobs';
import { SCHEMES } from '@/data/schemes';
import type { L } from '@/data/types';

const HERO_JOBS = ['bathroom-pipe-repair-powai', 'wiring-shop-ghatkopar'].map((id) => JOBS.find((j) => j.id === id)!);

export default function Home() {
  const demoJob = JOBS[0];
  return (
    <>
      {/* ───────────── 1 · Hero: who it's for, and the naka in 2D */}
      <section className="hero2" aria-labelledby="hero-title">
        <div className="container hero2-grid">
          <div className="hero2-copy">
            <span className="eyebrow">
              <T
                en="For plumbers, painters, masons, electricians & helpers"
                hi="प्लंबर, पेंटर, राजमिस्त्री, बिजली मिस्त्री और हेल्पर के लिए"
                mr="प्लंबर, पेंटर, गवंडी, इलेक्ट्रिशियन आणि मदतनीसांसाठी"
                gu="પ્લમ્બર, પેઇન્ટર, કડિયા, ઇલેક્ટ્રિશિયન અને હેલ્પર માટે"
              />
            </span>
            <h1 id="hero-title" className="hero2-title">
              <T
                en={
                  <>
                    Skill doesn’t need a <span className="gradient-text">résumé.</span>
                  </>
                }
                hi={
                  <>
                    हुनर को <span className="gradient-text">बायोडाटा</span> नहीं चाहिए।
                  </>
                }
                mr={
                  <>
                    कौशल्याला <span className="gradient-text">बायोडाटा</span> लागत नाही.
                  </>
                }
                gu={
                  <>
                    આવડતને <span className="gradient-text">બાયોડેટા</span> જોઈતો નથી.
                  </>
                }
              />
            </h1>
            <p className="lead">
              <T
                en="Find daily work near your naka — with the pay written first. No agent, no fee, no résumé."
                hi="अपने नाके के पास रोज़ का काम खोजें — मज़दूरी सबसे पहले लिखी हुई। न एजेंट, न फ़ीस, न बायोडाटा।"
                mr="तुमच्या नाक्याजवळ रोजचे काम शोधा — मजुरी सर्वात आधी लिहिलेली. एजंट नाही, फी नाही, बायोडाटा नाही."
                gu="તમારા નાકા પાસે રોજનું કામ શોધો — મજૂરી સૌથી પહેલાં લખેલી. એજન્ટ નહીં, ફી નહીં, બાયોડેટા નહીં."
              />
            </p>
            <div className="hero-actions">
              <Link href="/jobs" className="btn btn-primary btn-lg" data-magnetic="">
                <Briefcase aria-hidden="true" />
                <T en="I need work" hi="मुझे काम चाहिए" mr="मला काम हवे आहे" gu="મને કામ જોઈએ છે" />
              </Link>
              <Link href="/workers" className="btn btn-lg hero-btn-2" data-magnetic="">
                <UsersRound aria-hidden="true" />
                <T en="I need a worker" hi="मुझे कारीगर चाहिए" mr="मला कारागीर हवा आहे" gu="મને કારીગર જોઈએ છે" />
              </Link>
            </div>
            <ul className="hero2-trust">
              <li>
                <BadgeCheck aria-hidden="true" />
                <T en="Free for workers" hi="मज़दूरों के लिए मुफ़्त" mr="कामगारांसाठी मोफत" gu="કામદારો માટે મફત" />
              </li>
              <li>
                <Languages aria-hidden="true" />
                <span>हिंदी · मराठी · ગુજરાતી · English</span>
              </li>
              <li>
                <WifiOff aria-hidden="true" />
                <T en="Works on 2G" hi="2G पर चलता है" mr="2G वर चालते" gu="2G પર ચાલે છે" />
              </li>
            </ul>
          </div>

          <div className="naka-art">
            <NakaScene />
            {HERO_JOBS.map((job, i) => (
              <Link key={job.id} href={`/jobs/${job.id}`} className={`ticket ticket-${i + 1}`}>
                <TradeTile trade={job.trade} size="sm" />
                <span className="ticket-trade">
                  <Tx l={TRADE[job.trade].name} />
                </span>
                <span className="money">
                  {rupee(job.pay.amount)} <small><Tx l={PAY_UNIT[job.pay.unit]} /></small>
                </span>
                <span className="ticket-where">
                  <MapPin aria-hidden="true" />
                  <Tx l={job.area} /> · {job.distanceKm} km
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── 2 · Trades marquee */}
      <section className="marquee" aria-label="Trades">
        <div className="marquee-track">
          {[0, 1].map((k) => (
            <ul key={k} aria-hidden={k === 1}>
              {TRADES.map((t) => (
                <li key={t.id} style={{ '--tile': tradeColor(t.id) } as React.CSSProperties}>
                  <TradeIcon trade={t.id} />
                  <Tx l={t.name} />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </section>

      {/* ───────────── 3 · The problem */}
      <section className="section">
        <div className="container">
          <div className="section-head" data-reveal="">
            <span className="eyebrow">
              <T en="The waiting line, today" hi="आज की इंतज़ार की कतार" mr="आजची प्रतीक्षेची रांग" gu="આજની રાહની કતાર" />
            </span>
            <h2 className="h2">
              <T en="Years of experience. Zero visibility." hi="सालों का अनुभव। फिर भी कोई पहचान नहीं।" mr="वर्षांचा अनुभव. तरीही कोणतीही ओळख नाही." gu="વર્ષોનો અનુભવ. છતાં કોઈ ઓળખ નહીં." />
            </h2>
            <p className="lead">
              <T
                en="A mason with 17 years of perfect tile lines has no profile, no network beyond the naka, and no proof of the work he has done. Employers who need him don’t know where to look."
                hi="17 साल से सीधी टाइल लगाने वाले राजमिस्त्री की कोई प्रोफ़ाइल नहीं, नाके से आगे कोई पहचान नहीं, किए हुए काम का कोई सबूत नहीं। जिन्हें उसकी ज़रूरत है, उन्हें पता नहीं कहाँ ढूँढें।"
                mr="17 वर्षे सरळ टाइल लावणाऱ्या गवंड्याचे कोणतेही प्रोफाइल नाही, नाक्याच्या पलीकडे ओळख नाही, केलेल्या कामाचा पुरावा नाही. ज्यांना त्याची गरज आहे, त्यांना कुठे शोधावे ते कळत नाही."
                gu="17 વર્ષથી સીધી ટાઇલ લગાવતા કડિયાની કોઈ પ્રોફાઇલ નથી, નાકાથી આગળ કોઈ ઓળખ નથી, કરેલા કામનો કોઈ પુરાવો નથી. જેમને તેની જરૂર છે, તેમને ખબર નથી કે ક્યાં શોધવો."
              />
            </p>
          </div>

          <div className="naka-day">
            <figure className="ninety" data-reveal="left">
              <div className="ninety-line" aria-hidden="true">
                {Array.from({ length: 10 }, (_, i) => (
                  <PersonStanding key={i} className={i === 9 ? 'is-out' : undefined} />
                ))}
              </div>
              <p className="ninety-big">
                <T en="9 in 10" hi="10 में से 9" mr="10 पैकी 9" gu="10માંથી 9" />
              </p>
              <figcaption>
                <p className="ninety-text">
                  <T
                    en="workers in India earn without a contract, a payslip or a fixed employer."
                    hi="भारत में मज़दूर बिना कॉन्ट्रैक्ट, बिना पगार-पर्ची और बिना पक्के मालिक के कमाते हैं।"
                    mr="भारतातील कामगार करार, पगार-पावती किंवा कायम मालकाशिवाय कमावतात."
                    gu="ભારતમાં કામદારો કરાર, પગાર-સ્લિપ કે કાયમી માલિક વગર કમાય છે."
                  />
                </p>
                <p className="ninety-foot">
                  <T
                    en="30 crore+ have signed up on e-Shram. Most still find work by standing at the naka."
                    hi="30 करोड़+ ई-श्रम पर पंजीकृत हैं। ज़्यादातर अब भी नाके पर खड़े होकर काम ढूँढते हैं।"
                    mr="30 कोटी+ ई-श्रमवर नोंदणीकृत आहेत. बहुतेक अजूनही नाक्यावर उभे राहूनच काम शोधतात."
                    gu="30 કરોડ+ ઈ-શ્રમ પર નોંધાયેલા છે. મોટા ભાગના હજી નાકા પર ઊભા રહીને જ કામ શોધે છે."
                  />
                </p>
              </figcaption>
            </figure>

            <div className="day" data-reveal="right">
              <h3 className="day-title">
                <T en="A morning at Kurla naka" hi="कुर्ला नाके की एक सुबह" mr="कुर्ला नाक्यावरची एक सकाळ" gu="કુર્લા નાકાની એક સવાર" />
              </h3>
              <ol className="day-line">
                {MORNING.map((m) => (
                  <li key={m.time} className={m.end ? 'is-end' : undefined}>
                    <time>{m.time}</time>
                    <div className="day-text">
                      <p>
                        <Tx l={m.text} />
                      </p>
                      {m.pain && (
                        <p className="day-pain">
                          <Tx l={m.pain} />
                        </p>
                      )}
                      {m.end && (
                        <p className="day-zero">
                          <T en="₹0 earned today" hi="आज की कमाई ₹0" mr="आजची कमाई ₹0" gu="આજની કમાણી ₹0" />
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── 4 · How it works — sticky stacking cards */}
      <section className="section section-alt" id="how">
        <div className="container">
          <div className="section-head center" data-reveal="">
            <span className="eyebrow">
              <T en="How Naka works" hi="नाका कैसे काम करता है" mr="नाका कसे काम करते" gu="નાકા કેવી રીતે કામ કરે છે" />
            </span>
            <h2 className="h2">
              <T en="Four taps from the kerb to a fair day’s pay." hi="नाके से सही मज़दूरी तक — बस चार टैप।" mr="नाक्यापासून योग्य मजुरीपर्यंत — फक्त चार टॅप." gu="નાકાથી યોગ્ય મજૂરી સુધી — ફક્ત ચાર ટૅપ." />
            </h2>
          </div>

          <div className="steps">
            {STEPS.map((s, i) => (
              <article key={s.n} className="step-card" data-stack-card="" style={{ '--i': i, '--tile': s.color } as React.CSSProperties}>
                <div className="step-text">
                  <span className="step-n">0{s.n}</span>
                  <h3 className="h2">
                    <Tx l={s.title} />
                  </h3>
                  <p className="lead">
                    <Tx l={s.body} />
                  </p>
                  <Link href={s.href} className="btn">
                    <Tx l={s.cta} />
                    <ArrowRight aria-hidden="true" />
                  </Link>
                </div>
                <div className="step-visual" aria-hidden="true">
                  <s.icon />
                  <ul>
                    {s.points.map((pt) => (
                      <li key={pt.en}>
                        <BadgeCheck />
                        <Tx l={pt} />
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── 5 · Phone demo */}
      <section className="section">
        <div className="container demo">
          <div className="demo-copy" data-reveal="left">
            <span className="eyebrow">
              <T en="Designed for a ₹6,000 phone" hi="₹6,000 के फ़ोन के लिए बना" mr="₹6,000 च्या फोनसाठी बनवलेले" gu="₹6,000ના ફોન માટે બનાવેલું" />
            </span>
            <h2 className="h2">
              <T en="Readable in three seconds. Even without reading." hi="तीन सेकंड में समझ आए। बिना पढ़े भी।" mr="तीन सेकंदात समजेल. न वाचताही." gu="ત્રણ સેકન્ડમાં સમજાય. વાંચ્યા વગર પણ." />
            </h2>
            <p className="lead">
              <T
                en="Every job card follows the same order: icon for the trade, the rupees in big numbers, then place, time and day. Tap the speaker to hear it in your language."
                hi="हर काम का कार्ड एक ही क्रम में: काम का चित्र, बड़े अक्षरों में रुपये, फिर जगह, समय और दिन। स्पीकर दबाएँ और अपनी भाषा में सुनें।"
                mr="प्रत्येक कामाचे कार्ड एकाच क्रमाने: कामाचे चित्र, मोठ्या अक्षरात रुपये, मग जागा, वेळ आणि दिवस. तुमच्या भाषेत ऐकण्यासाठी स्पीकर दाबा."
                gu="દરેક કામનું કાર્ડ એક જ ક્રમમાં: કામનું ચિત્ર, મોટા અક્ષરે રૂપિયા, પછી જગ્યા, સમય અને દિવસ. તમારી ભાષામાં સાંભળવા સ્પીકર દબાવો."
              />
            </p>
            <ul className="feature-list">
              {FEATURES.map((f) => (
                <li key={f.title.en}>
                  <span className="icon-tile sm" style={{ '--tile': f.color } as React.CSSProperties}>
                    <f.icon aria-hidden="true" />
                  </span>
                  <span>
                    <strong>
                      <Tx l={f.title} />
                    </strong>
                    <span className="muted">
                      <Tx l={f.body} />
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="phone-wrap" data-reveal="zoom">
            <div className="phone" data-tilt="">
              <div className="phone-notch" />
              <div className="phone-screen">
                <div className="phone-bar">
                  <span>9:41</span>
                  <span className="chip chip-success">
                    <span className="dot dot-live" />
                    <T en="Available today" hi="आज खाली हूँ" mr="आज मोकळा आहे" gu="આજે ખાલી છું" />
                  </span>
                </div>
                <p className="phone-hello">
                  <T en="Namaste Ramesh 👋" hi="नमस्ते रमेश 👋" mr="नमस्कार रमेश 👋" gu="નમસ્તે રમેશ 👋" />
                </p>
                <p className="phone-sub">
                  <T en="3 plumbing jobs near Kurla naka" hi="कुर्ला नाका के पास प्लंबिंग के 3 काम" mr="कुर्ला नाक्याजवळ प्लंबिंगची 3 कामे" gu="કુર્લા નાકા પાસે પ્લમ્બિંગના 3 કામ" />
                </p>
                <JobCard job={demoJob} />
                <div className="phone-voice">
                  <Mic aria-hidden="true" />
                  <T en="“Plumber work near me”" hi="“मेरे पास प्लंबर का काम”" mr="“माझ्या जवळ प्लंबरचे काम”" gu="“મારી નજીક પ્લમ્બરનું કામ”" />
                </div>
              </div>
            </div>
            <div className="float-chip fc-1" data-parallax="0.08">
              <ShieldCheck aria-hidden="true" />
              <T en="Employer verified" hi="मालिक की जाँच हुई" mr="मालकाची पडताळणी झाली" gu="માલિકની ચકાસણી થઈ" />
            </div>
            <div className="float-chip fc-2" data-parallax="-0.06">
              <WalletCards aria-hidden="true" />
              <T en="Paid same evening" hi="उसी शाम भुगतान" mr="त्याच संध्याकाळी पैसे" gu="એ જ સાંજે ચુકવણી" />
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── 6 · Two sides */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-head center" data-reveal="">
            <span className="eyebrow">
              <T en="One naka, two sides" hi="एक नाका, दो पक्ष" mr="एक नाका, दोन बाजू" gu="એક નાકા, બે પક્ષ" />
            </span>
            <h2 className="h2">
              <T en="Built for the worker first. Better for the employer too." hi="पहले मज़दूर के लिए बना। मालिक के लिए भी बेहतर।" mr="आधी कामगारासाठी बनवले. मालकासाठीही चांगले." gu="પહેલાં કામદાર માટે બનાવ્યું. માલિક માટે પણ વધુ સારું." />
            </h2>
          </div>
          <div className="sides">
            <article className="side-card side-worker" data-tilt="" data-reveal="">
              <Sprout className="side-bg" aria-hidden="true" />
              <h3 className="h3">
                <T en="If you work with your hands" hi="अगर आप हाथ से काम करते हैं" mr="तुम्ही हाताने काम करत असाल तर" gu="જો તમે હાથથી કામ કરો છો" />
              </h3>
              <ul>
                {WORKER_POINTS.map((p) => (
                  <li key={p.en}>
                    <BadgeCheck aria-hidden="true" />
                    <Tx l={p} />
                  </li>
                ))}
              </ul>
              <div className="row">
                <Link className="btn btn-primary" href="/profile">
                  <IdCard aria-hidden="true" />
                  <T en="Make my skill card" hi="मेरा स्किल कार्ड बनाएँ" mr="माझे स्किल कार्ड बनवा" gu="મારું સ્કિલ કાર્ડ બનાવો" />
                </Link>
                <Link className="btn btn-ghost" href="/jobs">
                  <T en="See jobs" hi="काम देखें" mr="कामे पाहा" gu="કામ જુઓ" />
                  <ArrowRight aria-hidden="true" />
                </Link>
              </div>
            </article>
            <article className="side-card side-employer" data-tilt="" data-reveal="" style={{ '--d': 1 } as React.CSSProperties}>
              <Handshake className="side-bg" aria-hidden="true" />
              <h3 className="h3">
                <T en="If you need reliable hands" hi="अगर आपको भरोसेमंद कारीगर चाहिए" mr="तुम्हाला विश्वासू कारागीर हवा असेल तर" gu="જો તમને ભરોસાપાત્ર કારીગર જોઈએ" />
              </h3>
              <ul>
                {EMPLOYER_POINTS.map((p) => (
                  <li key={p.en}>
                    <BadgeCheck aria-hidden="true" />
                    <Tx l={p} />
                  </li>
                ))}
              </ul>
              <div className="row">
                <Link className="btn btn-accent" href="/post-job">
                  <Briefcase aria-hidden="true" />
                  <T en="Post a job" hi="काम डालें" mr="काम टाका" gu="કામ મૂકો" />
                </Link>
                <Link className="btn btn-ghost" href="/workers">
                  <T en="Browse workers" hi="कारीगर देखें" mr="कारागीर पाहा" gu="કારીગર જુઓ" />
                  <ArrowRight aria-hidden="true" />
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ───────────── 7 · Design principles (Self-Determination Theory) */}
      <section className="section">
        <div className="container">
          <div className="section-head" data-reveal="">
            <span className="eyebrow">
              <T en="Design thinking · Self-Determination Theory" hi="डिज़ाइन सोच · आत्म-निर्णय सिद्धांत" mr="डिझाइन विचार · आत्म-निर्णय सिद्धांत" gu="ડિઝાઇન વિચાર · સ્વ-નિર્ણય સિદ્ધાંત" />
            </span>
            <h2 className="h2">
              <T en="Dignity is a design requirement." hi="सम्मान — डिज़ाइन की ज़रूरी शर्त।" mr="सन्मान — डिझाइनची आवश्यक अट." gu="સન્માન — ડિઝાઇનની જરૂરી શરત." />
            </h2>
            <p className="lead">
              <T
                en="People stick with tools that respect three human needs: control over their choices, a sense of being good at something, and belonging. Every screen in Naka is checked against them."
                hi="लोग उन्हीं चीज़ों से जुड़ते हैं जो तीन ज़रूरतों का सम्मान करें: अपने फ़ैसले ख़ुद लेना, अपने हुनर पर गर्व, और अपनापन। नाका की हर स्क्रीन इन पर परखी गई है।"
                mr="लोक अशाच साधनांशी जोडलेले राहतात जी तीन गरजांचा आदर करतात: स्वतःचे निर्णय स्वतः घेणे, आपल्या कौशल्याचा अभिमान आणि आपलेपणा. नाक्याची प्रत्येक स्क्रीन यावर तपासली आहे."
                gu="લોકો એવાં સાધનો સાથે જોડાયેલા રહે છે જે ત્રણ જરૂરિયાતોનું માન રાખે: પોતાના નિર્ણય જાતે લેવા, પોતાની આવડતનો ગર્વ અને પોતીકાપણું. નાકાની દરેક સ્ક્રીન આના પર ચકાસાઈ છે."
              />
            </p>
          </div>
          <div className="sdt-grid">
            {SDT.map((s, i) => (
              <article key={s.title.en} className="sdt-card" data-reveal="tilt" style={{ '--d': i, '--tile': s.color } as React.CSSProperties}>
                <span className="icon-tile lg">
                  <s.icon aria-hidden="true" />
                </span>
                <h3 className="h3">
                  <Tx l={s.title} />
                </h3>
                <p className="muted">
                  <Tx l={s.body} />
                </p>
                <ul>
                  {s.how.map((h) => (
                    <li key={h.en}>
                      <Tx l={h} />
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <div className="a11y-strip" data-reveal="">
            {A11Y.map((a) => (
              <div key={a.en}>
                <a.icon aria-hidden="true" />
                <T en={a.en} hi={a.hi} mr={a.mr} gu={a.gu} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── 8 · Rights teaser */}
      <section className="section section-alt">
        <div className="container rights-teaser">
          <div data-reveal="left">
            <span className="eyebrow">
              <T en="Rights & support" hi="अधिकार और सहायता" mr="हक्क आणि मदत" gu="અધિકાર અને મદદ" />
            </span>
            <h2 className="h2">
              <T en="₹2 lakh accident cover costs ₹20 a year. Most workers never hear about it." hi="₹20 सालाना में ₹2 लाख का दुर्घटना बीमा। ज़्यादातर मज़दूरों को पता ही नहीं।" mr="वर्षाला ₹20 मध्ये ₹2 लाखांचा अपघात विमा. बहुतेक कामगारांना याबद्दल माहितीच नसते." gu="વર્ષે ₹20માં ₹2 લાખનો અકસ્માત વીમો. મોટા ભાગના કામદારોને એની ખબર જ નથી." />
            </h2>
            <p className="lead">
              <T
                en="Naka turns government schemes into plain answers: what you get, who can apply, which papers to carry, and where to go — with the helpline one tap away."
                hi="नाका सरकारी योजनाओं को आसान जवाब में बदलता है: क्या मिलेगा, कौन ले सकता है, कौन से कागज़ चाहिए, और कहाँ जाना है — हेल्पलाइन बस एक टैप दूर।"
                mr="नाका सरकारी योजनांना सोप्या उत्तरांत बदलतो: काय मिळेल, कोण अर्ज करू शकतो, कोणती कागदपत्रे लागतील आणि कुठे जायचे — हेल्पलाइन फक्त एका टॅपवर."
                gu="નાકા સરકારી યોજનાઓને સરળ જવાબમાં ફેરવે છે: શું મળશે, કોણ અરજી કરી શકે, કયા કાગળો જોઈએ અને ક્યાં જવું — હેલ્પલાઇન ફક્ત એક ટૅપ દૂર."
              />
            </p>
            <Link className="btn btn-primary" href="/rights">
              <Landmark aria-hidden="true" />
              <T en="Find schemes for me" hi="मेरे लिए योजनाएँ खोजें" mr="माझ्यासाठी योजना शोधा" gu="મારા માટે યોજનાઓ શોધો" />
            </Link>
          </div>
          <ul className="scheme-cloud" data-reveal="right">
            {SCHEMES.map((s, i) => (
              <li key={s.id} style={{ '--i': i } as React.CSSProperties}>
                <Link href={`/rights#${s.id}`}>
                  <strong>{s.name}</strong>
                  <span>
                    <Tx l={s.short} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ───────────── 9 · SDG impact */}
      <section className="section">
        <div className="container">
          <div className="section-head center" data-reveal="">
            <span className="eyebrow">
              <T en="Impact · UN Sustainable Development Goals" hi="असर · संयुक्त राष्ट्र सतत विकास लक्ष्य" mr="परिणाम · संयुक्त राष्ट्र शाश्वत विकास उद्दिष्टे" gu="અસર · સંયુક્ત રાષ્ટ્ર ટકાઉ વિકાસ લક્ષ્યો" />
            </span>
            <h2 className="h2">
              <T en="Small daily wins that add up to big goals." hi="रोज़ की छोटी जीत, बड़े लक्ष्यों की ओर।" mr="रोजचे छोटे विजय, मोठ्या उद्दिष्टांकडे." gu="રોજની નાની જીત, મોટા લક્ષ્યો તરફ." />
            </h2>
          </div>
          <div className="sdg-grid">
            {SDGS.map((g, i) => (
              <article key={g.n} className="sdg-card" data-reveal="" style={{ '--d': i, '--sdg': g.color } as React.CSSProperties}>
                <span className="sdg-n">{g.n}</span>
                <h3>
                  <Tx l={g.title} />
                </h3>
                <p className="muted">
                  <Tx l={g.body} />
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── 10 · Personas */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-head" data-reveal="">
            <span className="eyebrow">
              <T en="Who we designed for" hi="किसके लिए बनाया" mr="कोणासाठी बनवले" gu="કોના માટે બનાવ્યું" />
            </span>
            <h2 className="h2">
              <T en="Design personas from the naka." hi="नाके से निकले डिज़ाइन पर्सोना।" mr="नाक्यावरून आलेले डिझाइन पर्सोना." gu="નાકા પરથી આવેલા ડિઝાઇન પર્સોના." />
            </h2>
          </div>
          <div className="persona-grid">
            {PERSONAS.map((p, i) => (
              <figure key={p.name} className="persona" data-reveal="" style={{ '--d': i, '--tile': p.color } as React.CSSProperties}>
                <blockquote>
                  <Tx l={p.quote} />
                </blockquote>
                <figcaption>
                  <strong>{p.name}</strong>
                  <span>
                    <Tx l={p.role} />
                  </span>
                  <span className="persona-need">
                    <MousePointerClick aria-hidden="true" /> <Tx l={p.need} />
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── 11 · Final CTA */}
      <section className="section">
        <div className="container">
          <div className="cta-panel" data-reveal="zoom">
            <div className="cta-glow" aria-hidden="true" />
            <span className="eyebrow">
              <T en="Your naka, in your pocket" hi="आपका नाका, आपकी जेब में" mr="तुमचा नाका, तुमच्या खिशात" gu="તમારું નાકા, તમારા ખિસ્સામાં" />
            </span>
            <h2 className="display">
              <T en="Stop waiting. Start working." hi="इंतज़ार बंद। काम शुरू।" mr="वाट पाहणे बंद. काम सुरू." gu="રાહ જોવાનું બંધ. કામ શરૂ." />
            </h2>
            <div className="row" style={{ justifyContent: 'center' }}>
              <Link href="/jobs" className="btn btn-primary btn-lg" data-magnetic="">
                <MapPin aria-hidden="true" />
                <T en="Find work near me" hi="मेरे पास काम खोजें" mr="माझ्या जवळ काम शोधा" gu="મારી નજીક કામ શોધો" />
              </Link>
              <Link href="/post-job" className="btn btn-lg" data-magnetic="">
                <Briefcase aria-hidden="true" />
                <T en="Post a job" hi="काम डालें" mr="काम टाका" gu="કામ મૂકો" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* ───────────── content */

const MORNING: { time: string; text: L; pain?: L; end?: boolean }[] = [
  {
    time: '6:00',
    text: {
      en: 'Ramesh reaches the naka with his tools and a tiffin. Forty men are already standing there.',
      hi: 'रमेश औज़ार और टिफ़िन लेकर नाके पहुँचता है। वहाँ चालीस लोग पहले से खड़े हैं।',
      mr: 'रमेश अवजारे आणि डबा घेऊन नाक्यावर पोहोचतो. तिथे आधीच चाळीस जण उभे आहेत.',
      gu: 'રમેશ ઓજારો અને ટિફિન લઈને નાકા પર પહોંચે છે. ત્યાં પહેલેથી ચાળીસ લોકો ઊભા છે.',
    },
  },
  {
    time: '8:30',
    text: {
      en: 'A contractor’s tempo stops, picks six men and drives off.',
      hi: 'एक ठेकेदार का टेम्पो रुकता है, छह लोगों को बैठाता है और चला जाता है।',
      mr: 'एका ठेकेदाराचा टेम्पो थांबतो, सहा जणांना घेतो आणि निघून जातो.',
      gu: 'એક ઠેકેદારનો ટેમ્પો ઊભો રહે છે, છ જણને બેસાડે છે અને જતો રહે છે.',
    },
    pain: { en: 'Work depends on who walks by', hi: 'काम इस पर निर्भर कि कौन आ जाए', mr: 'कोण येईल यावरच काम अवलंबून', gu: 'કોણ આવે તેના પર જ કામ આધાર રાખે છે' },
  },
  {
    time: '9:15',
    text: {
      en: 'Someone needs a plumber “for a small job”. Nobody says the rate. “We’ll see after.”',
      hi: 'किसी को “छोटे काम” के लिए प्लंबर चाहिए। रेट कोई नहीं बताता। “बाद में देख लेंगे।”',
      mr: 'कोणाला तरी “छोट्या कामासाठी” प्लंबर हवा आहे. दर कोणी सांगत नाही. “नंतर बघू.”',
      gu: 'કોઈને “નાના કામ” માટે પ્લમ્બર જોઈએ છે. ભાવ કોઈ કહેતું નથી. “પછી જોઈ લઈશું.”',
    },
    pain: { en: 'Pay is settled after the work', hi: 'मज़दूरी काम के बाद तय होती है', mr: 'मजुरी काम झाल्यावर ठरते', gu: 'મજૂરી કામ પછી નક્કી થાય છે' },
  },
  {
    time: '10:40',
    text: {
      en: 'An “agent” promises a Dubai job — after a ₹2,000 registration fee.',
      hi: 'एक “एजेंट” दुबई के काम का वादा करता है — ₹2,000 रजिस्ट्रेशन फ़ीस के बाद।',
      mr: 'एक “एजंट” दुबईच्या कामाचे वचन देतो — ₹2,000 नोंदणी फी घेतल्यावर.',
      gu: 'એક “એજન્ટ” દુબઈના કામનું વચન આપે છે — ₹2,000 રજિસ્ટ્રેશન ફી પછી.',
    },
    pain: { en: 'Fake agents take “registration fees”', hi: 'नकली एजेंट “रजिस्ट्रेशन फ़ीस” लेते हैं', mr: 'बनावट एजंट “नोंदणी फी” घेतात', gu: 'નકલી એજન્ટ “રજિસ્ટ્રેશન ફી” લે છે' },
  },
  {
    time: '12:30',
    end: true,
    text: {
      en: 'He walks home. He has never heard of the ₹20-a-year accident cover he qualifies for.',
      hi: 'वह घर लौट जाता है। जिस ₹20 सालाना दुर्घटना बीमे का वह हक़दार है, उसके बारे में उसने कभी सुना ही नहीं।',
      mr: 'तो घरी परततो. ज्या ₹20 वार्षिक अपघात विम्याचा तो हक्कदार आहे, त्याबद्दल त्याने कधी ऐकलेलेच नाही.',
      gu: 'તે ઘરે પાછો ફરે છે. જે ₹20 વાર્ષિક અકસ્માત વીમાનો તે હકદાર છે, તેના વિશે તેણે ક્યારેય સાંભળ્યું જ નથી.',
    },
    pain: { en: 'Welfare schemes feel out of reach', hi: 'सरकारी योजनाएँ पहुँच से बाहर लगती हैं', mr: 'सरकारी योजना आवाक्याबाहेर वाटतात', gu: 'સરકારી યોજનાઓ પહોંચની બહાર લાગે છે' },
  },
];


const STEPS = [
  {
    n: 1,
    icon: Mic,
    color: 'var(--color-brand)',
    href: '/profile',
    title: { en: 'Say your skill. Get a card.', hi: 'अपना हुनर बोलिए। कार्ड पाइए।', mr: 'तुमचे कौशल्य सांगा. कार्ड मिळवा.', gu: 'તમારી આવડત કહો. કાર્ડ મેળવો.' },
    body: {
      en: 'Pick your trade from pictures, tap your years of experience, record a 20-second intro. Naka builds a Skill Card with a QR code you can show at any naka or site.',
      hi: 'चित्रों से अपना काम चुनें, अनुभव के साल चुनें, 20 सेकंड का परिचय रिकॉर्ड करें। नाका QR कोड वाला स्किल कार्ड बनाता है जो आप किसी भी नाके या साइट पर दिखा सकते हैं।',
      mr: 'चित्रांमधून तुमचे काम निवडा, अनुभवाची वर्षे निवडा, 20 सेकंदांची ओळख रेकॉर्ड करा. नाका QR कोड असलेले स्किल कार्ड बनवतो जे तुम्ही कोणत्याही नाक्यावर किंवा साइटवर दाखवू शकता.',
      gu: 'ચિત્રોમાંથી તમારું કામ પસંદ કરો, અનુભવનાં વર્ષ પસંદ કરો, 20 સેકન્ડનો પરિચય રેકોર્ડ કરો. નાકા QR કોડવાળું સ્કિલ કાર્ડ બનાવે છે જે તમે કોઈ પણ નાકા કે સાઇટ પર બતાવી શકો.',
    },
    cta: { en: 'Make a skill card', hi: 'स्किल कार्ड बनाएँ', mr: 'स्किल कार्ड बनवा', gu: 'સ્કિલ કાર્ડ બનાવો' },
    points: [
      { en: 'No typing needed', hi: 'टाइप करने की ज़रूरत नहीं', mr: 'टाइप करण्याची गरज नाही', gu: 'ટાઇપ કરવાની જરૂર નથી' },
      { en: 'Past employers vouch for you', hi: 'पुराने मालिक आपकी गवाही देते हैं', mr: 'जुने मालक तुमची हमी देतात', gu: 'જૂના માલિકો તમારી ખાતરી આપે છે' },
      { en: 'Works on a shared phone', hi: 'साझा फ़ोन पर भी चलता है', mr: 'शेअर केलेल्या फोनवरही चालते', gu: 'વહેંચેલા ફોન પર પણ ચાલે છે' },
    ],
  },
  {
    n: 2,
    icon: MapPin,
    color: 'var(--color-short)',
    href: '/jobs',
    title: { en: 'See work near you — pay first.', hi: 'पास का काम देखें — पहले मज़दूरी।', mr: 'जवळचे काम पाहा — आधी मजुरी.', gu: 'નજીકનું કામ જુઓ — પહેલાં મજૂરી.' },
    body: {
      en: 'Today, a few days, or months — filter by what your week needs. Every listing shows rupees, hours, distance and when you get paid, before anything else.',
      hi: 'आज का, कुछ दिनों का, या महीनों का — अपने हफ़्ते के हिसाब से चुनें। हर काम में सबसे पहले रुपये, समय, दूरी और भुगतान का दिन दिखता है।',
      mr: 'आजचे, काही दिवसांचे किंवा महिन्यांचे — तुमच्या आठवड्याच्या गरजेनुसार निवडा. प्रत्येक कामात सर्वात आधी रुपये, वेळ, अंतर आणि पैसे कधी मिळतील ते दिसते.',
      gu: 'આજનું, થોડા દિવસનું કે મહિનાઓનું — તમારા અઠવાડિયાની જરૂર મુજબ પસંદ કરો. દરેક કામમાં સૌથી પહેલાં રૂપિયા, સમય, અંતર અને ચુકવણી ક્યારે મળશે તે દેખાય છે.',
    },
    cta: { en: 'Browse jobs', hi: 'काम देखें', mr: 'कामे पाहा', gu: 'કામ જુઓ' },
    points: [
      { en: 'Daily, short & long-term', hi: 'दिहाड़ी, थोड़े दिन और लंबा काम', mr: 'रोजंदारी, काही दिवसांचे आणि दीर्घ काम', gu: 'રોજમદારી, થોડા દિવસનું અને લાંબું કામ' },
      { en: 'Map with distance from your naka', hi: 'नाके से दूरी के साथ नक़्शा', mr: 'नाक्यापासूनच्या अंतरासह नकाशा', gu: 'નાકાથી અંતર સાથેનો નકશો' },
      { en: 'Fair-pay meter for every trade', hi: 'हर काम के लिए सही-मज़दूरी मीटर', mr: 'प्रत्येक कामासाठी योग्य-मजुरी मीटर', gu: 'દરેક કામ માટે યોગ્ય-મજૂરી મીટર' },
    ],
  },
  {
    n: 3,
    icon: ShieldCheck,
    color: 'var(--color-trust)',
    href: '/safety',
    title: { en: 'Check it. Agree in writing.', hi: 'जाँचिए। लिखित में तय कीजिए।', mr: 'तपासा. लेखी ठरवा.', gu: 'તપાસો. લેખિતમાં નક્કી કરો.' },
    body: {
      en: 'A Trust Shield flags fees, missing addresses and too-good-to-be-true pay. Before you go, both sides confirm a simple Work Promise: tasks, hours, pay, payday.',
      hi: 'ट्रस्ट शील्ड फ़ीस, ग़ायब पता और ज़रूरत से ज़्यादा मज़दूरी जैसे ख़तरे बताती है। जाने से पहले दोनों पक्ष आसान “काम का वादा” पक्का करते हैं: काम, समय, मज़दूरी, भुगतान का दिन।',
      mr: 'ट्रस्ट शील्ड फी, गायब पत्ता आणि खऱ्या वाटणार नाहीत इतकी जास्त मजुरी यांसारखे धोके दाखवते. जाण्यापूर्वी दोन्ही बाजू सोपे कामाचे वचन पक्के करतात: काम, वेळ, मजुरी, पैसे मिळण्याचा दिवस.',
      gu: 'ટ્રસ્ટ શીલ્ડ ફી, ગાયબ સરનામું અને માની ન શકાય એટલી વધુ મજૂરી જેવા જોખમ બતાવે છે. જતાં પહેલાં બંને પક્ષ સરળ કામનું વચન પાકું કરે છે: કામ, સમય, મજૂરી, ચુકવણીનો દિવસ.',
    },
    cta: { en: 'Check a job', hi: 'काम जाँचें', mr: 'काम तपासा', gu: 'કામ તપાસો' },
    points: [
      { en: 'Scam signals in plain words', hi: 'धोखे के संकेत आसान शब्दों में', mr: 'फसवणुकीच्या खुणा सोप्या शब्दांत', gu: 'છેતરપિંડીના સંકેત સરળ શબ્દોમાં' },
      { en: 'Share job details with family', hi: 'काम की जानकारी परिवार को भेजें', mr: 'कामाची माहिती कुटुंबाला पाठवा', gu: 'કામની માહિતી પરિવારને મોકલો' },
      { en: 'One-tap helpline', hi: 'एक टैप में हेल्पलाइन', mr: 'एका टॅपवर हेल्पलाइन', gu: 'એક ટૅપમાં હેલ્પલાઇન' },
    ],
  },
  {
    n: 4,
    icon: WalletCards,
    color: 'var(--color-long)',
    href: '/my-work',
    title: { en: 'Get paid. Build a record.', hi: 'भुगतान पाइए। रिकॉर्ड बनाइए।', mr: 'पैसे मिळवा. नोंद ठेवा.', gu: 'ચુકવણી મેળવો. રેકોર્ડ બનાવો.' },
    body: {
      en: 'Your work diary tracks days worked, money received and money still owed. That history becomes proof of work for welfare boards and loans.',
      hi: 'आपकी काम डायरी में काम के दिन, मिला पैसा और बकाया पैसा दर्ज रहता है। यही रिकॉर्ड कल्याण बोर्ड और कर्ज़ के लिए काम का सबूत बनता है।',
      mr: 'तुमच्या कामाच्या डायरीत कामाचे दिवस, मिळालेले पैसे आणि थकबाकी नोंदवली जाते. हीच नोंद कल्याण मंडळ आणि कर्जासाठी कामाचा पुरावा बनते.',
      gu: 'તમારી કામની ડાયરીમાં કામના દિવસ, મળેલા પૈસા અને બાકી રકમ નોંધાય છે. આ જ રેકોર્ડ કલ્યાણ બોર્ડ અને લોન માટે કામનો પુરાવો બને છે.',
    },
    cta: { en: 'Open my diary', hi: 'मेरी डायरी खोलें', mr: 'माझी डायरी उघडा', gu: 'મારી ડાયરી ખોલો' },
    points: [
      { en: 'Reminders for unpaid dues', hi: 'बकाया पैसे की याद', mr: 'थकबाकीची आठवण', gu: 'બાકી રકમની યાદ' },
      { en: '90-day work proof for BOCW', hi: 'BOCW के लिए 90 दिन का सबूत', mr: 'BOCW साठी 90 दिवसांचा पुरावा', gu: 'BOCW માટે 90 દિવસનો પુરાવો' },
      { en: 'Weekly earnings at a glance', hi: 'हफ़्ते की कमाई एक नज़र में', mr: 'आठवड्याची कमाई एका नजरेत', gu: 'અઠવાડિયાની કમાણી એક નજરે' },
    ],
  },
];

const FEATURES = [
  { icon: AudioLines, color: 'var(--color-brand)', title: { en: 'Voice first', hi: 'आवाज़ पहले', mr: 'आवाज आधी', gu: 'અવાજ પહેલાં' }, body: { en: 'Search by speaking, hear every card read aloud.', hi: 'बोलकर खोजें, हर कार्ड सुनें।', mr: 'बोलून शोधा, प्रत्येक कार्ड ऐका.', gu: 'બોલીને શોધો, દરેક કાર્ડ સાંભળો.' } },
  { icon: Languages, color: 'var(--color-accent)', title: { en: '4 languages, instantly', hi: '4 भाषाएँ, तुरंत', mr: '4 भाषा, लगेच', gu: '4 ભાષા, તરત જ' }, body: { en: 'Pick English, हिंदी, मराठी or ગુજરાતી — everything switches.', hi: 'English, हिंदी, मराठी या ગુજરાતી चुनें — सब कुछ बदल जाता है।', mr: 'English, हिंदी, मराठी किंवा ગુજરાતી निवडा — सर्व काही बदलते.', gu: 'English, हिंदी, मराठी કે ગુજરાતી પસંદ કરો — બધું બદલાઈ જાય છે.' } },
  { icon: WifiOff, color: 'var(--color-trust)', title: { en: 'Low data mode', hi: 'कम डेटा मोड', mr: 'कमी डेटा मोड', gu: 'ઓછો ડેટા મોડ' }, body: { en: 'Turns off animation on slow 2G.', hi: 'धीमे 2G पर एनिमेशन बंद।', mr: 'हळू 2G वर ॲनिमेशन बंद.', gu: 'ધીમા 2G પર એનિમેશન બંધ.' } },
];

const WORKER_POINTS = [
  { en: 'Get found for your trade, not your English', hi: 'अंग्रेज़ी से नहीं, अपने हुनर से पहचाने जाएँ', mr: 'इंग्रजीने नव्हे, तुमच्या कौशल्याने ओळख मिळवा', gu: 'અંગ્રેજીથી નહીં, તમારી આવડતથી ઓળખ મેળવો' },
  { en: 'Know the pay and payday before you go', hi: 'जाने से पहले मज़दूरी और भुगतान का दिन जानें', mr: 'जाण्यापूर्वी मजुरी आणि पैसे मिळण्याचा दिवस जाणा', gu: 'જતાં પહેલાં મજૂરી અને ચુકવણીનો દિવસ જાણો' },
  { en: 'Set your own rate and days off', hi: 'अपना रेट और छुट्टी ख़ुद तय करें', mr: 'तुमचा दर आणि सुट्टी स्वतः ठरवा', gu: 'તમારો દર અને રજા જાતે નક્કી કરો' },
  { en: 'Turn your work history into welfare benefits', hi: 'काम के रिकॉर्ड से सरकारी लाभ पाएँ', mr: 'कामाच्या नोंदीतून सरकारी लाभ मिळवा', gu: 'કામના રેકોર્ડથી સરકારી લાભ મેળવો' },
];

const EMPLOYER_POINTS = [
  { en: 'Verified workers with real endorsements', hi: 'असली गवाही वाले जाँचे हुए कारीगर', mr: 'खऱ्या शिफारशींसह पडताळलेले कारागीर', gu: 'સાચી ભલામણો સાથે ચકાસાયેલા કારીગર' },
  { en: 'Fair-pay guide so offers are accepted fast', hi: 'सही मज़दूरी गाइड, ताकि ऑफ़र जल्दी माना जाए', mr: 'योग्य मजुरी मार्गदर्शक, म्हणजे ऑफर लवकर स्वीकारली जाते', gu: 'યોગ્ય મજૂરી માર્ગદર્શિકા, જેથી ઑફર જલદી સ્વીકારાય' },
  { en: 'Clear Work Promise — fewer disputes', hi: 'साफ़ “काम का वादा” — कम झगड़े', mr: 'स्पष्ट कामाचे वचन — कमी वाद', gu: 'સ્પષ્ટ કામનું વચન — ઓછા ઝઘડા' },
  { en: 'Rehire the people you trust in one tap', hi: 'भरोसेमंद लोगों को एक टैप में दोबारा बुलाएँ', mr: 'विश्वासू लोकांना एका टॅपमध्ये पुन्हा बोलवा', gu: 'ભરોસાના લોકોને એક ટૅપમાં ફરી બોલાવો' },
];

const SDT = [
  {
    icon: HeartHandshake,
    color: 'var(--color-brand)',
    title: { en: 'Autonomy', hi: 'स्वतंत्रता', mr: 'स्वातंत्र्य', gu: 'સ્વતંત્રતા' },
    body: { en: 'Workers stay in charge: they choose jobs, set rates and decide when they are available.', hi: 'मज़दूर ख़ुद फ़ैसला करें: कौन सा काम, क्या रेट, कब खाली।', mr: 'कामगार स्वतः ठरवतात: कोणते काम, कोणता दर, आणि कधी मोकळे आहेत.', gu: 'કામદારો જાતે નક્કી કરે: કયું કામ, કયો દર, અને ક્યારે ખાલી છે.' },
    how: [
      { en: '“Available today” switch', hi: '“आज खाली हूँ” बटन', mr: '“आज मोकळा आहे” बटण', gu: '“આજે ખાલી છું” બટન' },
      { en: 'Own rate, never auctioned', hi: 'अपना रेट, बोली नहीं', mr: 'स्वतःचा दर, लिलाव नाही', gu: 'પોતાનો દર, હરાજી નહીં' },
      { en: 'Keep using the physical naka', hi: 'असली नाका भी चलता रहे', mr: 'खरा नाकाही चालू राहतो', gu: 'સાચું નાકા પણ ચાલુ રહે' },
    ],
  },
  {
    icon: TrendingUp,
    color: 'var(--color-trust)',
    title: { en: 'Competence', hi: 'हुनर का गर्व', mr: 'कौशल्याचा अभिमान', gu: 'આવડતનો ગર્વ' },
    body: { en: 'Skill is shown, not certified: photos of work, years, endorsements and badges earned on the job.', hi: 'हुनर दिखाया जाए, सर्टिफ़िकेट नहीं: काम की फ़ोटो, साल, गवाही और काम से मिले बैज।', mr: 'कौशल्य दाखवले जाते, प्रमाणपत्र नाही: कामाचे फोटो, वर्षे, शिफारशी आणि कामातून मिळालेले बॅज.', gu: 'આવડત બતાવાય છે, પ્રમાણપત્ર નહીં: કામના ફોટા, વર્ષ, ભલામણો અને કામથી મળેલા બૅજ.' },
    how: [
      { en: 'Skill Card with QR', hi: 'QR वाला स्किल कार्ड', mr: 'QR असलेले स्किल कार्ड', gu: 'QRવાળું સ્કિલ કાર્ડ' },
      { en: 'Before/after work gallery', hi: 'काम की फ़ोटो गैलरी', mr: 'कामाच्या फोटोंची गॅलरी', gu: 'કામના ફોટાની ગૅલેરી' },
      { en: 'Earned badges, not tests', hi: 'परीक्षा नहीं, काम से बैज', mr: 'परीक्षा नाही, कामातून बॅज', gu: 'પરીક્ષા નહીં, કામથી બૅજ' },
    ],
  },
  {
    icon: UsersRound,
    color: 'var(--color-accent)',
    title: { en: 'Relatedness', hi: 'अपनापन', mr: 'आपलेपणा', gu: 'પોતીકાપણું' },
    body: { en: 'Work in India travels through people. Naka keeps crews, mentors and trusted employers together.', hi: 'भारत में काम लोगों से मिलता है। नाका टीम, उस्ताद और भरोसेमंद मालिकों को साथ रखता है।', mr: 'भारतात काम माणसांतून मिळते. नाका टोळी, उस्ताद आणि विश्वासू मालकांना एकत्र ठेवतो.', gu: 'ભારતમાં કામ લોકો મારફતે મળે છે. નાકા ટુકડી, ઉસ્તાદ અને ભરોસાના માલિકોને સાથે રાખે છે.' },
    how: [
      { en: 'Vouch for a fellow worker', hi: 'साथी की गवाही दें', mr: 'सहकाऱ्याची हमी द्या', gu: 'સાથીની ખાતરી આપો' },
      { en: 'Hire as a crew', hi: 'पूरी टोली को काम', mr: 'संपूर्ण टोळीला काम', gu: 'આખી ટુકડીને કામ' },
      { en: 'Share job with family', hi: 'परिवार को काम भेजें', mr: 'कुटुंबाला काम पाठवा', gu: 'પરિવારને કામ મોકલો' },
    ],
  },
];

const A11Y = [
  { icon: Eye, en: 'Icons + colour + words, never colour alone', hi: 'चित्र + रंग + शब्द, सिर्फ़ रंग नहीं', mr: 'चित्र + रंग + शब्द, फक्त रंग नाही', gu: 'ચિત્ર + રંગ + શબ્દ, ફક્ત રંગ નહીં' },
  { icon: Type, en: '3 text sizes', hi: '3 अक्षर आकार', mr: 'अक्षरांचे 3 आकार', gu: 'અક્ષરનાં 3 કદ' },
  { icon: AudioLines, en: 'Read aloud everywhere', hi: 'हर जगह सुनने की सुविधा', mr: 'सगळीकडे ऐकण्याची सोय', gu: 'દરેક જગ્યાએ સાંભળવાની સુવિધા' },
  { icon: Smartphone, en: '48px+ tap targets', hi: '48px+ बड़े बटन', mr: '48px+ मोठी बटणे', gu: '48px+ મોટાં બટન' },
  { icon: WifiOff, en: 'Works on 2G', hi: '2G पर चलता है', mr: '2G वर चालते', gu: '2G પર ચાલે છે' },
  { icon: Languages, en: 'English · हिंदी · मराठी · ગુજરાતી', hi: 'English · हिंदी · मराठी · ગુજરાતી', mr: 'English · हिंदी · मराठी · ગુજરાતી', gu: 'English · हिंदी · मराठी · ગુજરાતી' },
];

const SDGS = [
  { n: 8, color: '#a21942', title: { en: 'Decent work & growth', hi: 'अच्छा काम और विकास', mr: 'चांगले काम आणि प्रगती', gu: 'સારું કામ અને પ્રગતિ' }, body: { en: 'More paid days, clear terms, safer sites.', hi: 'ज़्यादा काम के दिन, साफ़ शर्तें, सुरक्षित साइट।', mr: 'जास्त कामाचे दिवस, स्पष्ट अटी, सुरक्षित साइट.', gu: 'વધુ કામના દિવસ, સ્પષ્ટ શરતો, સુરક્ષિત સાઇટ.' } },
  { n: 10, color: '#dd1367', title: { en: 'Reduced inequalities', hi: 'असमानता कम', mr: 'कमी असमानता', gu: 'ઓછી અસમાનતા' }, body: { en: 'Access without English, literacy or a résumé.', hi: 'बिना अंग्रेज़ी, पढ़ाई या बायोडाटा के पहुँच।', mr: 'इंग्रजी, शिक्षण किंवा बायोडाटाशिवाय प्रवेश.', gu: 'અંગ્રેજી, ભણતર કે બાયોડેટા વગર પહોંચ.' } },
  { n: 1, color: '#e5243b', title: { en: 'No poverty', hi: 'ग़रीबी नहीं', mr: 'गरिबी नाही', gu: 'ગરીબી નહીં' }, body: { en: 'Insurance, pension and ration reach the worker.', hi: 'बीमा, पेंशन और राशन मज़दूर तक पहुँचे।', mr: 'विमा, पेन्शन आणि रेशन कामगारापर्यंत पोहोचते.', gu: 'વીમો, પેન્શન અને રેશન કામદાર સુધી પહોંચે.' } },
  { n: 5, color: '#ff3a21', title: { en: 'Gender equality', hi: 'लैंगिक समानता', mr: 'लिंग समानता', gu: 'લૈંગિક સમાનતા' }, body: { en: 'Women crews, equal pay checks, safety lines.', hi: 'महिला टीमें, बराबर मज़दूरी, सुरक्षा हेल्पलाइन।', mr: 'महिला टोळ्या, समान मजुरी, सुरक्षा हेल्पलाइन.', gu: 'મહિલા ટુકડીઓ, સમાન મજૂરી, સુરક્ષા હેલ્પલાઇન.' } },
];

const PERSONAS = [
  {
    name: 'Ramesh, 41',
    color: 'var(--trade-plumber)',
    role: { en: 'Plumber, 14 yrs · Kurla naka', hi: 'प्लंबर, 14 साल · कुर्ला नाका', mr: 'प्लंबर, 14 वर्षे · कुर्ला नाका', gu: 'પ્લમ્બર, 14 વર્ષ · કુર્લા નાકા' },
    quote: { en: '“Some days I wait till noon and go home with nothing. I’m good at my work — people just can’t find me.”', hi: '“कभी-कभी दोपहर तक इंतज़ार करके ख़ाली हाथ घर जाता हूँ। काम अच्छा करता हूँ — बस लोग मुझे ढूँढ नहीं पाते।”', mr: '“कधी कधी दुपारपर्यंत वाट पाहून रिकाम्या हाताने घरी जातो. मी काम चांगले करतो — फक्त लोकांना मी सापडत नाही.”', gu: '“ક્યારેક બપોર સુધી રાહ જોઈને ખાલી હાથે ઘરે જાઉં છું. હું કામ સારું કરું છું — બસ લોકો મને શોધી શકતા નથી.”' },
    need: { en: 'Be found by trade & area', hi: 'काम और इलाक़े से पहचान', mr: 'काम आणि भागानुसार ओळख', gu: 'કામ અને વિસ્તારથી ઓળખ' },
  },
  {
    name: 'Sunita, 34',
    color: 'var(--trade-painter)',
    role: { en: 'Painter, leads a women’s crew', hi: 'पेंटर, महिला टीम की मुखिया', mr: 'रंगारी, महिला टोळीची प्रमुख', gu: 'પેઇન્ટર, મહિલા ટુકડીની આગેવાન' },
    quote: { en: '“Contractors pay us less than men for the same wall. I want the rate written before we start.”', hi: '“ठेकेदार एक ही दीवार के लिए हमें आदमियों से कम देते हैं। मुझे काम से पहले रेट लिखित में चाहिए।”', mr: '“एकाच भिंतीसाठी ठेकेदार आम्हाला पुरुषांपेक्षा कमी पैसे देतात. काम सुरू करण्यापूर्वी मला दर लेखी हवा.”', gu: '“એક જ દીવાલ માટે ઠેકેદાર અમને પુરુષો કરતાં ઓછા પૈસા આપે છે. કામ શરૂ કરતાં પહેલાં મને દર લેખિતમાં જોઈએ.”' },
    need: { en: 'Pay agreed upfront', hi: 'पहले से तय मज़दूरी', mr: 'आधीच ठरलेली मजुरी', gu: 'પહેલેથી નક્કી મજૂરી' },
  },
  {
    name: 'Arjun, 22',
    color: 'var(--trade-labour)',
    role: { en: 'Helper, new to Mumbai', hi: 'हेल्पर, मुंबई में नया', mr: 'मदतनीस, मुंबईत नवीन', gu: 'હેલ્પર, મુંબઈમાં નવો' },
    quote: { en: '“An agent took ₹2,000 for a Dubai job. There was no job. I didn’t know who to ask.”', hi: '“एक एजेंट ने दुबई के काम के लिए ₹2,000 ले लिए। काम था ही नहीं। पता नहीं था किससे पूछूँ।”', mr: '“एका एजंटने दुबईच्या कामासाठी ₹2,000 घेतले. काम नव्हतेच. कोणाला विचारायचे ते कळले नाही.”', gu: '“એક એજન્ટે દુબઈના કામ માટે ₹2,000 લીધા. કામ હતું જ નહીં. કોને પૂછવું તે ખબર ન પડી.”' },
    need: { en: 'Spot scams, get help', hi: 'धोखा पहचानें, मदद पाएँ', mr: 'फसवणूक ओळखा, मदत मिळवा', gu: 'છેતરપિંડી ઓળખો, મદદ મેળવો' },
  },
  {
    name: 'Shalini, 52',
    color: 'var(--color-accent)',
    role: { en: 'Homeowner, Powai', hi: 'घर मालकिन, पवई', mr: 'घरमालकीण, पवई', gu: 'ઘરમાલિક, પવઈ' },
    quote: { en: '“I need a plumber I can trust inside my home — today, not next week.”', hi: '“मुझे ऐसा प्लंबर चाहिए जिस पर घर के अंदर भरोसा कर सकूँ — आज, अगले हफ़्ते नहीं।”', mr: '“मला असा प्लंबर हवा ज्याच्यावर घरात विश्वास ठेवता येईल — आज, पुढच्या आठवड्यात नाही.”', gu: '“મને એવો પ્લમ્બર જોઈએ જેના પર ઘરમાં ભરોસો કરી શકું — આજે, આવતા અઠવાડિયે નહીં.”' },
    need: { en: 'Verified help, fast', hi: 'जाँची हुई मदद, जल्दी', mr: 'पडताळलेली मदत, लवकर', gu: 'ચકાસાયેલી મદદ, જલદી' },
  },
];

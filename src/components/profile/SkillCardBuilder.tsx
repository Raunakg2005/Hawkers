'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  CalendarDays,
  Check,
  ChevronDown,
  CircleAlert,
  Eye,
  Hourglass,
  Languages,
  MapPin,
  MessageCircle,
  Mic,
  Minus,
  NotebookPen,
  PartyPopper,
  Pencil,
  Plus,
  Printer,
  RotateCcw,
  Search,
  Share2,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  Sun,
  UserRound,
} from 'lucide-react';
import { T, Tx } from '@/components/T';
import { TradeIcon, TradeTile, tradeColor } from '@/components/TradeIcon';
import ReadAloud from '@/components/ReadAloud';
import { TRADE, TRADES, rupee } from '@/data/trades';
import type { L, TradeId } from '@/data/types';
import { useLang } from '@/lib/prefs';
import SkillCard from './SkillCard';
import VoiceRecorder, { type VoiceMeta } from './VoiceRecorder';
import PhotoSlots from './PhotoSlots';
import Toast, { type ToastMsg } from './Toast';
import {
  AREAS,
  DAYS,
  LANGUAGES,
  MAX_YEARS,
  PHOTO_SLOTS,
  SKILL_SUGGESTIONS,
  VOICE_KEY,
  YEAR_CHIPS,
  clamp,
  clearProfile,
  completion,
  emptyProfile,
  fairMid,
  loadProfile,
  rateBand,
  rateRange,
  saveProfile,
  shareText,
  yearsLevel,
  type DayId,
  type SkillProfile,
} from './profile-data';
import s from './profile.module.css';

const STEPS: { icon: typeof Briefcase; title: L; short: L; help: L }[] = [
  {
    icon: Briefcase,
    title: { en: 'What work do you do?', hi: 'आप क्या काम करते हैं?', mr: 'तुम्ही कोणतं काम करता?', gu: 'તમે શું કામ કરો છો?' },
    short: { en: 'Work', hi: 'काम', mr: 'काम', gu: 'કામ' },
    help: {
      en: 'Tap the picture of your main work. If you do other work too, tap those below.',
      hi: 'अपने मुख्य काम की तस्वीर दबाएँ। अगर आप और काम भी करते हैं, तो नीचे उन्हें भी दबाएँ।',
      mr: 'तुमच्या मुख्य कामाचं चित्र दाबा. तुम्ही दुसरी कामंही करत असाल, तर खाली तीही दाबा.',
      gu: 'તમારા મુખ્ય કામનું ચિત્ર દબાવો. જો તમે બીજાં કામ પણ કરતા હો, તો નીચે એ પણ દબાવો.',
    },
  },
  {
    icon: Hourglass,
    title: { en: 'How many years?', hi: 'कितने साल का अनुभव?', mr: 'किती वर्षांचा अनुभव?', gu: 'કેટલાં વર્ષનો અનુભવ?' },
    short: { en: 'Experience', hi: 'अनुभव', mr: 'अनुभव', gu: 'અનુભવ' },
    help: {
      en: 'Use plus and minus to set your years of work. Then tap the things you are good at.',
      hi: 'प्लस और माइनस से अपने काम के साल चुनें। फिर वो काम दबाएँ जिनमें आप माहिर हैं।',
      mr: 'प्लस आणि मायनस दाबून तुमच्या कामाची वर्षं निवडा. मग तुम्हाला जी कामं चांगली जमतात ती दाबा.',
      gu: 'પ્લસ અને માઇનસથી તમારા કામનાં વર્ષ પસંદ કરો. પછી જે કામ તમને સારું આવડે છે તે દબાવો.',
    },
  },
  {
    icon: MapPin,
    title: { en: 'Where & when', hi: 'कहाँ और कब', mr: 'कुठे आणि कधी', gu: 'ક્યાં અને ક્યારે' },
    short: { en: 'Place & pay', hi: 'जगह और मज़दूरी', mr: 'ठिकाण आणि मजुरी', gu: 'જગ્યા અને મજૂરી' },
    help: {
      en: 'Choose your naka or area, the days you can work, and your daily rate. Green means fair pay.',
      hi: 'अपना नाका या इलाका, काम के दिन और रोज़ की मज़दूरी चुनें। हरा रंग मतलब सही मज़दूरी।',
      mr: 'तुमचा नाका किंवा भाग, कामाचे दिवस आणि रोजचा दर निवडा. हिरवा रंग म्हणजे योग्य मजुरी.',
      gu: 'તમારું નાકા કે વિસ્તાર, કામના દિવસ અને રોજનો દર પસંદ કરો. લીલો રંગ એટલે યોગ્ય મજૂરી.',
    },
  },
  {
    icon: Mic,
    title: { en: 'Your voice & photos', hi: 'आपकी आवाज़ और फ़ोटो', mr: 'तुमचा आवाज आणि फोटो', gu: 'તમારો અવાજ અને ફોટા' },
    short: { en: 'Voice & photos', hi: 'आवाज़ और फ़ोटो', mr: 'आवाज आणि फोटो', gu: 'અવાજ અને ફોટા' },
    help: {
      en: 'Write your name, pick the languages you speak, record a short hello and add photos of your work.',
      hi: 'अपना नाम लिखें, अपनी भाषाएँ चुनें, छोटा सा परिचय रिकॉर्ड करें और अपने काम की फ़ोटो जोड़ें।',
      mr: 'तुमचं नाव लिहा, तुमच्या भाषा निवडा, छोटीशी ओळख रेकॉर्ड करा आणि तुमच्या कामाचे फोटो जोडा.',
      gu: 'તમારું નામ લખો, તમારી ભાષાઓ પસંદ કરો, નાની ઓળખ રેકોર્ડ કરો અને તમારા કામના ફોટા ઉમેરો.',
    },
  },
];

const sameSkill = (a: L, b: L) => a.en.toLowerCase() === b.en.toLowerCase();

function scrollToEl(el: HTMLElement | null) {
  if (!el) return;
  const top = el.getBoundingClientRect().top;
  if (top > 70 && top < window.innerHeight * 0.4) return;
  const lenis = window.__lenis;
  if (lenis) lenis.scrollTo(el, { offset: -100 });
  else el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function SkillCardBuilder() {
  const { t, lang } = useLang();
  const [ready, setReady] = useState(false);
  const [p, setP] = useState<SkillProfile>(emptyProfile);
  const [view, setView] = useState<'wizard' | 'card'>('wizard');
  const [step, setStep] = useState(0);
  const [maxStep, setMaxStep] = useState(0);
  const [announce, setAnnounce] = useState('');
  const [error, setError] = useState<L | null>(null);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [voiceUrl, setVoiceUrl] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [customSkill, setCustomSkill] = useState('');
  const [toast, setToast] = useState<ToastMsg | null>(null);

  const rootRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const doneRef = useRef<HTMLHeadingElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const dirty = useRef(false);
  const focusNext = useRef<'step' | 'done' | null>(null);
  const urlsRef = useRef<string[]>([]);

  /* ── Load saved profile (client only, after hydration) */
  useEffect(() => {
    const saved = loadProfile();
    if (saved) {
      setP(saved);
      if (saved.complete) setView('card');
      else {
        setStep(clamp(saved.step, 0, STEPS.length - 1));
        setMaxStep(clamp(saved.step, 0, STEPS.length - 1));
      }
      try {
        const v = localStorage.getItem(VOICE_KEY);
        if (v && saved.voice) setVoiceUrl(v);
      } catch {
        /* ignore */
      }
    }
    setReady(true);
  }, []);

  /* ── Autosave (so an interrupted worker can come back) */
  useEffect(() => {
    if (ready && dirty.current) saveProfile(p);
  }, [p, ready]);

  /* ── Release photo/voice object URLs on unmount */
  useEffect(() => {
    const urls = urlsRef.current;
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, []);

  /* ── Move focus to the new heading after a step / view change */
  useEffect(() => {
    const target = focusNext.current === 'done' ? doneRef.current : focusNext.current === 'step' ? headingRef.current : null;
    focusNext.current = null;
    if (!target) return;
    scrollToEl(rootRef.current);
    target.focus({ preventScroll: true });
  }, [step, view]);

  const update = useCallback((patch: Partial<SkillProfile> | ((prev: SkillProfile) => Partial<SkillProfile>)) => {
    dirty.current = true;
    setP((prev) => {
      const next = typeof patch === 'function' ? patch(prev) : patch;
      const now = new Date().toISOString();
      return { ...prev, ...next, createdAt: prev.createdAt || now, updatedAt: now };
    });
  }, []);

  const showToast = (text: React.ReactNode, action?: ToastMsg['action']) => setToast({ id: Date.now(), text, action });
  const closeToast = useCallback(() => setToast(null), []);

  /* ── Navigation */
  const validate = (n: number): L | null => {
    if (n === 0 && !p.trade) return { en: 'Please tap your main work first.', hi: 'कृपया पहले अपना मुख्य काम दबाएँ।', mr: 'कृपया आधी तुमचं मुख्य काम दाबा.', gu: 'કૃપા કરીને પહેલાં તમારું મુખ્ય કામ દબાવો.' };
    if (n === 3 && p.name.trim().length < 2) return { en: 'Please write your name so employers know who you are.', hi: 'कृपया अपना नाम लिखें ताकि मालिक आपको पहचानें।', mr: 'कृपया तुमचं नाव लिहा, म्हणजे मालकांना तुम्ही कोण ते कळेल.', gu: 'કૃપા કરીને તમારું નામ લખો, જેથી માલિક તમને ઓળખે.' };
    return null;
  };

  const goTo = (n: number) => {
    setError(null);
    const target = clamp(n, 0, STEPS.length - 1);
    focusNext.current = 'step';
    setStep(target);
    setMaxStep((m) => Math.max(m, target));
    update({ step: Math.max(p.step, target) });
    setAnnounce(
      t(
        `Step ${target + 1} of ${STEPS.length}: ${STEPS[target].title.en}`,
        `कदम ${target + 1}, कुल ${STEPS.length}: ${STEPS[target].title.hi}`,
        `पायरी ${target + 1} / ${STEPS.length}: ${STEPS[target].title.mr}`,
        `પગલું ${target + 1} / ${STEPS.length}: ${STEPS[target].title.gu}`,
      ),
    );
  };

  const next = () => {
    const err = validate(step);
    if (err) {
      setError(err);
      setAnnounce(err[lang]);
      if (step === 3) nameRef.current?.focus();
      return;
    }
    if (step < STEPS.length - 1) goTo(step + 1);
    else finish();
  };

  const finish = () => {
    update({ complete: true, step: STEPS.length - 1 });
    focusNext.current = 'done';
    setView('card');
    setPreviewOpen(false);
    setAnnounce(t('Your skill card is ready.', 'आपका स्किल कार्ड तैयार है।', 'तुमचं स्किल कार्ड तयार आहे.', 'તમારું સ્કિલ કાર્ડ તૈયાર છે.'));
    showToast(<T en="Card saved on this phone" hi="कार्ड इस फ़ोन में सेव हुआ" mr="कार्ड या फोनमध्ये सेव्ह झालं" gu="કાર્ડ આ ફોનમાં સેવ થયું" />);
  };

  const edit = () => {
    setError(null);
    focusNext.current = 'step';
    setView('wizard');
    setStep(0);
    setMaxStep(STEPS.length - 1);
    setAnnounce(t('Editing your card. Step 1 of 4.', 'कार्ड बदल रहे हैं। कदम 1, कुल 4।', 'तुमचं कार्ड बदलत आहात. पायरी 1 / 4.', 'તમારું કાર્ડ બદલી રહ્યા છો. પગલું 1 / 4.'));
  };

  const startOver = () => {
    if (!window.confirm(t('Delete this card and start again?', 'यह कार्ड मिटाकर फिर से शुरू करें?', 'हे कार्ड पुसून पुन्हा सुरू करायचं?', 'આ કાર્ડ ભૂંસીને ફરી શરૂ કરવું છે?'))) return;
    clearProfile();
    dirty.current = false;
    setP(emptyProfile());
    setVoiceUrl(null);
    setPhotoUrls([]);
    setMaxStep(0);
    focusNext.current = 'step';
    setView('wizard');
    setStep(0);
  };

  /* ── Step 1: trades */
  const pickMain = (id: TradeId) => {
    setError(null);
    update((prev) => {
      const prevMid = prev.trade ? fairMid(prev.trade) : 0;
      const keepRate = prev.rate > 0 && prev.rate !== prevMid;
      return {
        trade: id,
        otherTrades: prev.otherTrades.filter((o) => o !== id),
        rate: keepRate ? prev.rate : fairMid(id),
      };
    });
  };
  const toggleOther = (id: TradeId) =>
    update((prev) => ({ otherTrades: prev.otherTrades.includes(id) ? prev.otherTrades.filter((o) => o !== id) : [...prev.otherTrades, id] }));

  /* ── Step 2: skills */
  const suggestions: L[] = [];
  for (const tr of [p.trade, ...p.otherTrades]) {
    if (!tr) continue;
    for (const sk of SKILL_SUGGESTIONS[tr]) if (!suggestions.some((x) => sameSkill(x, sk))) suggestions.push(sk);
  }
  for (const sk of p.skills) if (!suggestions.some((x) => sameSkill(x, sk))) suggestions.push(sk);

  const toggleSkill = (sk: L) =>
    update((prev) => ({ skills: prev.skills.some((x) => sameSkill(x, sk)) ? prev.skills.filter((x) => !sameSkill(x, sk)) : [...prev.skills, sk] }));

  const addCustomSkill = () => {
    const v = customSkill.trim();
    if (!v) return;
    const sk = { en: v, hi: v, mr: v, gu: v };
    if (!p.skills.some((x) => sameSkill(x, sk))) update((prev) => ({ skills: [...prev.skills, sk] }));
    setCustomSkill('');
  };

  /* ── Step 3: days */
  const toggleDay = (d: DayId) =>
    update((prev) => ({
      days: prev.days.includes(d) ? prev.days.filter((x) => x !== d) : DAYS.map((x) => x.id).filter((x) => x === d || prev.days.includes(x)),
    }));

  /* ── Step 4: photos & voice */
  const addPhoto = (_slot: number, file: File) => {
    const url = URL.createObjectURL(file);
    urlsRef.current.push(url);
    const nextUrls = [...photoUrls, url].slice(0, PHOTO_SLOTS);
    setPhotoUrls(nextUrls);
    update((prev) => ({ photos: clamp(Math.max(prev.photos, nextUrls.length), 0, PHOTO_SLOTS) }));
  };
  const removePhoto = (slot: number) => {
    if (slot < photoUrls.length) setPhotoUrls((u) => u.filter((_, i) => i !== slot));
    update((prev) => ({ photos: Math.max(0, prev.photos - 1) }));
  };

  const saveVoice = (meta: VoiceMeta, blob: Blob | null) => {
    update({ voice: meta });
    if (!blob) {
      setVoiceUrl(null);
      try {
        localStorage.removeItem(VOICE_KEY);
      } catch {
        /* ignore */
      }
      return;
    }
    const url = URL.createObjectURL(blob);
    urlsRef.current.push(url);
    setVoiceUrl(url);
    if (blob.size < 700_000) {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          localStorage.setItem(VOICE_KEY, String(reader.result));
        } catch {
          /* too big for storage — plays this visit only */
        }
      };
      reader.readAsDataURL(blob);
    }
  };
  const clearVoice = () => {
    update({ voice: null });
    setVoiceUrl(null);
    try {
      localStorage.removeItem(VOICE_KEY);
    } catch {
      /* ignore */
    }
  };

  const introSpeech: L = {
    en: `Namaste, my name is ${p.name.trim() || 'a Karigar craftsperson'}. I am a ${p.trade ? TRADE[p.trade].name.en.toLowerCase() : 'worker'} with ${p.years} years of experience.`,
    hi: `नमस्ते, मेरा नाम ${p.name.trim() || 'कारीगर'} है। मैं ${p.trade ? TRADE[p.trade].name.hi : 'कारीगर'} हूँ और मुझे ${p.years} साल का अनुभव है।`,
    mr: `नमस्कार, माझं नाव ${p.name.trim() || 'कारागीर'}. मी ${p.trade ? TRADE[p.trade].name.mr : 'कारागीर'} आहे आणि मला ${p.years} वर्षांचा अनुभव आहे.`,
    gu: `નમસ્તે, મારું નામ ${p.name.trim() || 'કારીગર'} છે. હું ${p.trade ? TRADE[p.trade].name.gu : 'કારીગર'} છું અને મને ${p.years} વર્ષનો અનુભવ છે.`,
  };

  /* ── Final card actions */
  const share = async () => {
    const text = shareText(p, lang);
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: t('My Karigar Skill Card', 'मेरा कारीगर स्किल कार्ड', 'माझं कारागीर स्किल कार्ड', 'મારું કારીગર સ્કિલ કાર્ડ'), text, url });
        return;
      } catch (e) {
        if ((e as DOMException)?.name === 'AbortError') return;
      }
    }
    try {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      showToast(<T en="Copied! Paste it in WhatsApp or SMS." hi="कॉपी हो गया! WhatsApp या SMS में पेस्ट करें।" mr="कॉपी झालं! WhatsApp किंवा SMS मध्ये पेस्ट करा." gu="કૉપી થઈ ગયું! WhatsApp કે SMSમાં પેસ્ટ કરો." />);
    } catch {
      showToast(<T en="Could not copy. Try the WhatsApp button." hi="कॉपी नहीं हुआ। WhatsApp बटन आज़माएँ।" mr="कॉपी झालं नाही. WhatsApp बटण वापरून पाहा." gu="કૉપી ન થયું. WhatsApp બટન અજમાવો." />);
    }
  };

  const pct = completion(p);
  const band = p.trade && p.rate ? rateBand(p.trade, p.rate) : null;

  /* ── Skeleton until saved data is read (avoids a flash of the wrong view) */
  if (!ready) {
    return (
      <div className={s.skeleton} aria-busy="true">
        <span className="sr-only">
          <T en="Loading your card…" hi="आपका कार्ड खुल रहा है…" mr="तुमचं कार्ड उघडत आहे…" gu="તમારું કાર્ડ ખૂલી રહ્યું છે…" />
        </span>
        <div className={s.skelBlock} />
        <div className={s.skelBlock} />
      </div>
    );
  }

  const live = (
    <p className="sr-only" aria-live="polite" role="status">
      {announce}
    </p>
  );

  /* ════════════════════════════════ FINISHED CARD ═════════════════════════ */
  if (view === 'card') {
    const waText = encodeURIComponent(`${shareText(p, lang)}\n${typeof window !== 'undefined' ? window.location.href : ''}`);
    return (
      <div ref={rootRef} className={s.done}>
        {live}
        <div className={s.doneHead}>
          <span className="chip chip-success">
            <PartyPopper aria-hidden="true" />
            <T en="Your card is ready" hi="आपका कार्ड तैयार है" mr="तुमचं कार्ड तयार आहे" gu="તમારું કાર્ડ તૈયાર છે" />
          </span>
          <h2 className="h2" ref={doneRef} tabIndex={-1}>
            <T en="Show this card. Get work." hi="यह कार्ड दिखाइए। काम पाइए।" mr="हे कार्ड दाखवा. काम मिळवा." gu="આ કાર્ડ બતાવો. કામ મેળવો." />
          </h2>
          <p className="lead">
            <T
              en="Employers see your skill, years and fair rate at a glance — no résumé, no certificate needed."
              hi="मालिक एक नज़र में आपका हुनर, अनुभव और सही मज़दूरी देख लेते हैं — न बायोडाटा, न सर्टिफ़िकेट।"
              mr="मालकांना एका नजरेत तुमचं कौशल्य, अनुभव आणि योग्य मजुरी दिसते — ना बायोडाटा, ना सर्टिफिकेट."
              gu="માલિકને એક નજરમાં તમારી આવડત, અનુભવ અને યોગ્ય મજૂરી દેખાય છે — ન બાયોડેટા, ન સર્ટિફિકેટ."
            />
          </p>
        </div>

        <div className={s.doneGrid}>
          <div className={s.cardStage}>
            <div className={s.tiltWrap} data-tilt="">
              <SkillCard p={p} photoUrls={photoUrls} />
            </div>
          </div>

          <div className={s.doneSide}>
            <div className={s.actions}>
              {p.trade && (
                <Link href={`/jobs?trade=${p.trade}`} className="btn btn-primary btn-lg btn-block" data-magnetic="">
                  <Search aria-hidden="true" />
                  <T en="See matching jobs" hi="मेरे लायक काम देखें" mr="माझ्यासाठी योग्य कामं पाहा" gu="મારા લાયક કામ જુઓ" />
                </Link>
              )}
              <div className={s.actionGrid}>
                <button type="button" className="btn btn-accent" onClick={share}>
                  <Share2 aria-hidden="true" />
                  <T en="Share" hi="भेजें" mr="पाठवा" gu="મોકલો" />
                </button>
                <a className="btn" href={`https://wa.me/?text=${waText}`} target="_blank" rel="noopener noreferrer">
                  <MessageCircle aria-hidden="true" />
                  WhatsApp
                </a>
                <button type="button" className="btn" onClick={() => window.print()}>
                  <Printer aria-hidden="true" />
                  <T en="Print" hi="प्रिंट" mr="प्रिंट" gu="પ્રિન્ટ" />
                </button>
                <button type="button" className="btn" onClick={edit}>
                  <Pencil aria-hidden="true" />
                  <T en="Edit" hi="बदलें" mr="बदला" gu="બદલો" />
                </button>
              </div>
            </div>

            <section className={`card ${s.nextSteps}`} aria-labelledby="next-steps-title">
              <h3 id="next-steps-title" className="h3">
                <T en="Make your card stronger" hi="अपना कार्ड और मज़बूत बनाएँ" mr="तुमचं कार्ड आणखी मजबूत करा" gu="તમારું કાર્ડ વધુ મજબૂત બનાવો" />
              </h3>
              <ol>
                <li>
                  <span className={s.nsIcon} style={{ '--tile': 'var(--color-trust)' } as React.CSSProperties}>
                    <ShieldCheck aria-hidden="true" />
                  </span>
                  <span>
                    <strong>
                      <T en="Link your e-Shram card" hi="अपना ई-श्रम कार्ड जोड़ें" mr="तुमचं ई-श्रम कार्ड जोडा" gu="તમારું ઈ-શ્રમ કાર્ડ જોડો" />
                    </strong>
                    <span className="subtle">
                      <T en="Free government ID for workers. ₹2 lakh accident cover." hi="कामगारों का मुफ़्त सरकारी कार्ड। ₹2 लाख का दुर्घटना बीमा।" mr="कामगारांसाठी मोफत सरकारी कार्ड. ₹2 लाखांचा अपघात विमा." gu="કામદારો માટે મફત સરકારી કાર્ડ. ₹2 લાખનો અકસ્માત વીમો." />
                    </span>
                    <Link href="/rights#e-shram" className={s.nsLink}>
                      <T en="How to get it" hi="कैसे बनवाएँ" mr="कसं काढायचं" gu="કેવી રીતે કઢાવવું" /> <ArrowRight aria-hidden="true" />
                    </Link>
                  </span>
                </li>
                <li>
                  <span className={s.nsIcon} style={{ '--tile': 'var(--color-brand)' } as React.CSSProperties}>
                    <Star aria-hidden="true" />
                  </span>
                  <span>
                    <strong>
                      <T en="Ask employers to vouch for you" hi="मालिकों से अपनी तारीफ़ लिखवाएँ" mr="मालकांकडून तुमचं कौतुक लिहून घ्या" gu="માલિક પાસે તમારા વખાણ લખાવો" />
                    </strong>
                    <span className="subtle">
                      <T en="Share your card after a job. Good words bring more calls." hi="काम के बाद अपना कार्ड भेजें। अच्छी बातें ज़्यादा काम लाती हैं।" mr="काम झाल्यावर तुमचं कार्ड पाठवा. चांगल्या शब्दांमुळे जास्त कामं मिळतात." gu="કામ પછી તમારું કાર્ડ મોકલો. સારા શબ્દો વધુ કામ લાવે છે." />
                    </span>
                  </span>
                </li>
                <li>
                  <span className={s.nsIcon} style={{ '--tile': 'var(--color-accent)' } as React.CSSProperties}>
                    <NotebookPen aria-hidden="true" />
                  </span>
                  <span>
                    <strong>
                      <T en="Write every work day in your diary" hi="हर काम का दिन डायरी में लिखें" mr="प्रत्येक कामाचा दिवस डायरीत लिहा" gu="દરેક કામનો દિવસ ડાયરીમાં લખો" />
                    </strong>
                    <span className="subtle">
                      <T en="It becomes proof of work for welfare schemes." hi="यह योजनाओं के लिए काम का सबूत बनता है।" mr="सरकारी योजनांसाठी हा कामाचा पुरावा बनतो." gu="સરકારી યોજનાઓ માટે આ કામનો પુરાવો બને છે." />
                    </span>
                    <Link href="/my-work" className={s.nsLink}>
                      <T en="Open my diary" hi="मेरी डायरी खोलें" mr="माझी डायरी उघडा" gu="મારી ડાયરી ખોલો" /> <ArrowRight aria-hidden="true" />
                    </Link>
                  </span>
                </li>
              </ol>
            </section>

            <div className={s.privacy}>
              <Smartphone aria-hidden="true" />
              <p className="subtle">
                <T en="Your card is saved only on this phone. Nobody else can see it until you share it." hi="आपका कार्ड सिर्फ़ इसी फ़ोन में सेव है। जब तक आप न भेजें, कोई और नहीं देख सकता।" mr="तुमचं कार्ड फक्त याच फोनमध्ये सेव्ह आहे. तुम्ही पाठवेपर्यंत दुसरं कोणी ते पाहू शकत नाही." gu="તમારું કાર્ડ ફક્ત આ જ ફોનમાં સેવ છે. તમે મોકલો નહીં ત્યાં સુધી બીજું કોઈ જોઈ શકતું નથી." />
              </p>
              <button type="button" className="btn btn-sm btn-ghost" onClick={startOver}>
                <RotateCcw aria-hidden="true" />
                <T en="Start over" hi="फिर से शुरू करें" mr="पुन्हा सुरू करा" gu="ફરી શરૂ કરો" />
              </button>
            </div>
          </div>
        </div>

        {createPortal(
          <div data-print-root="" className={s.printRoot}>
            <style>{`@media screen{[data-print-root]{display:none!important}}@media print{body>*:not([data-print-root]){display:none!important}[data-print-root]{display:block!important}[data-print-hide]{display:none!important}@page{margin:12mm}}`}</style>
            <SkillCard p={p} photoUrls={photoUrls} variant="print" />
            <p className={s.printNote}>
              <T en="Made with Karigar — skill cards for daily-wage craftspeople. The QR code is a demo." hi="कारीगर से बना — दिहाड़ी कारीगरों का स्किल कार्ड। QR कोड डेमो है।" mr="कारागीरवर बनवलेलं — रोजंदारी कारागिरांसाठी स्किल कार्ड. QR कोड डेमो आहे." gu="કારીગર પર બનાવેલું — રોજમદાર કારીગરો માટે સ્કિલ કાર્ડ. QR કોડ ડેમો છે." />
            </p>
          </div>,
          document.body,
        )}
        <Toast msg={toast} onDone={closeToast} />
      </div>
    );
  }

  /* ════════════════════════════════ WIZARD ═════════════════════════════════ */
  const S = STEPS[step];
  const StepIcon = S.icon;
  const range = p.trade ? rateRange(p.trade) : ([300, 2000] as [number, number]);
  const fair = p.trade ? TRADE[p.trade].fair : null;
  const pctOf = (v: number) => ((v - range[0]) / (range[1] - range[0])) * 100;

  return (
    <div ref={rootRef} className={s.builder}>
      {live}

      {/* ── Wizard */}
      <section className={s.wizard} aria-labelledby="wizard-heading">
        <div className={s.progress}>
          <div className={s.progressTop}>
            <span className={s.stepCount}>
              <T en={`Step ${step + 1} of ${STEPS.length}`} hi={`कदम ${step + 1} / ${STEPS.length}`} mr={`पायरी ${step + 1} / ${STEPS.length}`} gu={`પગલું ${step + 1} / ${STEPS.length}`} />
            </span>
            <span className="subtle">
              <T en={`Card ${pct}% ready`} hi={`कार्ड ${pct}% तैयार`} mr={`कार्ड ${pct}% तयार`} gu={`કાર્ડ ${pct}% તૈયાર`} />
            </span>
          </div>
          <div className={`meter ${s.progressMeter}`} aria-hidden="true">
            <span style={{ transform: `scaleX(${(step + 1) / STEPS.length})` }} />
          </div>
          <ol className={s.stepDots}>
            {STEPS.map((st, i) => {
              const Icon = st.icon;
              const state = i === step ? s.dotNow : i <= maxStep ? s.dotDone : '';
              return (
                <li key={i}>
                  <button
                    type="button"
                    className={`${s.stepDot} ${state}`}
                    onClick={() => (i <= maxStep ? goTo(i) : undefined)}
                    disabled={i > maxStep}
                    aria-current={i === step ? 'step' : undefined}
                    aria-label={t(`Step ${i + 1}: ${st.title.en}`, `कदम ${i + 1}: ${st.title.hi}`, `पायरी ${i + 1}: ${st.title.mr}`, `પગલું ${i + 1}: ${st.title.gu}`)}
                  >
                    <span className={s.dotIcon}>{i < step || (i <= maxStep && i !== step) ? <Check aria-hidden="true" /> : <Icon aria-hidden="true" />}</span>
                    <span className={s.dotLabel}>
                      <Tx l={st.short} />
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        <div className={s.stepPanel} key={step}>
          <header className={s.stepHead}>
            <span className={s.stepIcon} aria-hidden="true">
              <StepIcon />
            </span>
            <div>
              <h2 id="wizard-heading" ref={headingRef} tabIndex={-1} className={s.stepTitle}>
                <Tx l={S.title} />
              </h2>
              <p className="muted">
                <Tx l={S.help} />
              </p>
            </div>
            <ReadAloud
              en={`${S.title.en}. ${S.help.en}`}
              hi={`${S.title.hi}। ${S.help.hi}`}
              mr={`${S.title.mr}. ${S.help.mr}`}
              gu={`${S.title.gu}. ${S.help.gu}`}
            />
          </header>

          {/* ── STEP 1 ─────────────────────────────── */}
          {step === 0 && (
            <div className={s.stepBody}>
              <fieldset className={s.fieldset}>
                <legend className={s.legend}>
                  <T en="My main work" hi="मेरा मुख्य काम" mr="माझं मुख्य काम" gu="મારું મુખ્ય કામ" />
                </legend>
                <div className={s.tradeGrid}>
                  {TRADES.map((tr, i) => {
                    const on = p.trade === tr.id;
                    return (
                      <button
                        key={tr.id}
                        type="button"
                        className={`${s.tradeBtn} ${on ? s.tradeOn : ''}`}
                        style={{ '--tile': tradeColor(tr.id), '--d': i } as React.CSSProperties}
                        aria-pressed={on}
                        onClick={() => pickMain(tr.id)}
                      >
                        <TradeTile trade={tr.id} size="lg" />
                        <span className={s.tradeName}>
                          <Tx l={tr.name} />
                        </span>
                        <span className={s.tradeVerb}>
                          <Tx l={tr.verb} />
                        </span>
                        {on && (
                          <span className={s.tradeCheck} aria-hidden="true">
                            <Check />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              {p.trade && (
                <fieldset className={s.fieldset}>
                  <legend className={s.legend}>
                    <T en="I also do (optional)" hi="मैं ये भी करता/करती हूँ (ज़रूरी नहीं)" mr="मी हेही करतो/करते (गरजेचं नाही)" gu="હું આ પણ કરું છું (જરૂરી નથી)" />
                  </legend>
                  <div className={s.chipWrap}>
                    {TRADES.filter((tr) => tr.id !== p.trade).map((tr) => (
                      <button key={tr.id} type="button" className="filter-chip" aria-pressed={p.otherTrades.includes(tr.id)} onClick={() => toggleOther(tr.id)}>
                        <span style={{ color: p.otherTrades.includes(tr.id) ? undefined : tradeColor(tr.id), display: 'inline-flex' }}>
                          <TradeIcon trade={tr.id} />
                        </span>
                        <Tx l={tr.name} />
                      </button>
                    ))}
                  </div>
                </fieldset>
              )}
            </div>
          )}

          {/* ── STEP 2 ─────────────────────────────── */}
          {step === 1 && (
            <div className={s.stepBody}>
              <div className={s.yearsBox}>
                <div className={s.stepper}>
                  <button
                    type="button"
                    className={s.stepBtn}
                    onClick={() => update((prev) => ({ years: clamp(prev.years - 1, 0, MAX_YEARS) }))}
                    disabled={p.years <= 0}
                    aria-label={t('One year less', 'एक साल कम', 'एक वर्ष कमी', 'એક વર્ષ ઓછું')}
                  >
                    <Minus aria-hidden="true" />
                  </button>
                  <div className={s.yearsValue}>
                    <output className={s.yearsNum} aria-live="polite" aria-label={t(`${p.years} years`, `${p.years} साल`, `${p.years} वर्षं`, `${p.years} વર્ષ`)}>
                      {p.years}
                    </output>
                    <span className={s.yearsUnit}>
                      <T en={p.years === 1 ? 'year' : 'years'} hi="साल" mr={p.years === 1 ? 'वर्ष' : 'वर्षं'} gu="વર્ષ" />
                    </span>
                  </div>
                  <button
                    type="button"
                    className={s.stepBtn}
                    onClick={() => update((prev) => ({ years: clamp(prev.years + 1, 0, MAX_YEARS) }))}
                    disabled={p.years >= MAX_YEARS}
                    aria-label={t('One year more', 'एक साल ज़्यादा', 'एक वर्ष जास्त', 'એક વર્ષ વધારે')}
                  >
                    <Plus aria-hidden="true" />
                  </button>
                </div>
                <p className={s.levelLine}>
                  <Sparkles aria-hidden="true" />
                  <Tx l={yearsLevel(p.years)} />
                </p>
                <div className={s.chipWrap} role="group" aria-label={t('Quick pick', 'जल्दी चुनें', 'पटकन निवडा', 'ઝટપટ પસંદ કરો')}>
                  {YEAR_CHIPS.map((y) => {
                    const on = y === 20 ? p.years >= 20 : p.years === y;
                    return (
                      <button key={y} type="button" className="filter-chip" aria-pressed={on} onClick={() => update({ years: y })}>
                        {y === 20 ? '20+' : y} <T en={y === 1 ? 'yr' : 'yrs'} hi="साल" mr={y === 1 ? 'वर्ष' : 'वर्षं'} gu="વર્ષ" />
                      </button>
                    );
                  })}
                </div>
              </div>

              <fieldset className={s.fieldset}>
                <legend className={s.legend}>
                  <T en="I am good at" hi="मैं इसमें माहिर हूँ" mr="मला हे चांगलं जमतं" gu="મને આ સારું આવડે છે" />
                  <span className={s.legendHint}>
                    <T en={`${p.skills.length} picked`} hi={`${p.skills.length} चुने`} mr={`${p.skills.length} निवडले`} gu={`${p.skills.length} પસંદ કર્યા`} />
                  </span>
                </legend>
                {suggestions.length ? (
                  <div className={s.chipWrap}>
                    {suggestions.map((sk) => {
                      const on = p.skills.some((x) => sameSkill(x, sk));
                      return (
                        <button key={sk.en} type="button" className={`filter-chip ${s.skillChip}`} aria-pressed={on} onClick={() => toggleSkill(sk)}>
                          {on ? <Check aria-hidden="true" /> : <Plus aria-hidden="true" />}
                          <Tx l={sk} />
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="muted">
                    <T en="Pick your work in step 1 to see suggestions." hi="सुझाव देखने के लिए कदम 1 में अपना काम चुनें।" mr="सूचना पाहण्यासाठी पायरी 1 मध्ये तुमचं काम निवडा." gu="સૂચનો જોવા માટે પગલું 1 માં તમારું કામ પસંદ કરો." />
                  </p>
                )}
                <form
                  className={s.customSkill}
                  onSubmit={(e) => {
                    e.preventDefault();
                    addCustomSkill();
                  }}
                >
                  <label htmlFor="custom-skill" className="sr-only">
                    <T en="Add another skill" hi="और हुनर जोड़ें" mr="आणखी कौशल्य जोडा" gu="બીજી આવડત ઉમેરો" />
                  </label>
                  <input
                    id="custom-skill"
                    className="input"
                    value={customSkill}
                    onChange={(e) => setCustomSkill(e.target.value)}
                    placeholder={t('Something else? Type it here', 'कुछ और? यहाँ लिखें', 'आणखी काही? इथे लिहा', 'બીજું કંઈ? અહીં લખો')}
                    maxLength={40}
                  />
                  <button type="submit" className="btn" disabled={!customSkill.trim()}>
                    <Plus aria-hidden="true" />
                    <T en="Add" hi="जोड़ें" mr="जोडा" gu="ઉમેરો" />
                  </button>
                </form>
              </fieldset>
            </div>
          )}

          {/* ── STEP 3 ─────────────────────────────── */}
          {step === 2 && (
            <div className={s.stepBody}>
              <div className={s.twoCol}>
                <div className="field">
                  <label className="label" htmlFor="area">
                    <MapPin aria-hidden="true" className={s.labelIcon} />
                    <T en="My naka / area" hi="मेरा नाका / इलाका" mr="माझा नाका / भाग" gu="મારું નાકા / વિસ્તાર" />
                  </label>
                  <select id="area" className="select" value={p.area} onChange={(e) => update({ area: e.target.value })}>
                    {AREAS.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.l[lang]}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label className="label" htmlFor="spot">
                    <T en="Exact spot (optional)" hi="सही जगह (ज़रूरी नहीं)" mr="नेमकी जागा (गरजेचं नाही)" gu="ચોક્કસ જગ્યા (જરૂરી નથી)" />
                  </label>
                  <input
                    id="spot"
                    className="input"
                    value={p.spot}
                    maxLength={60}
                    onChange={(e) => update({ spot: e.target.value })}
                    placeholder={t('e.g. Outside station, near tea stall', 'जैसे: स्टेशन के बाहर, चाय की टपरी के पास', 'उदा. स्टेशनबाहेर, चहाच्या टपरीजवळ', 'જેમ કે: સ્ટેશનની બહાર, ચાની કીટલી પાસે')}
                  />
                </div>
              </div>

              <fieldset className={s.fieldset}>
                <legend className={s.legend}>
                  <CalendarDays aria-hidden="true" className={s.labelIcon} />
                  <T en="Days I can work" hi="मैं इन दिनों काम कर सकता/सकती हूँ" mr="मी या दिवशी काम करू शकतो/शकते" gu="હું આ દિવસોમાં કામ કરી શકું છું" />
                </legend>
                <div className={s.dayGrid}>
                  {DAYS.map((d) => (
                    <button key={d.id} type="button" className={`filter-chip ${s.dayChip}`} aria-pressed={p.days.includes(d.id)} onClick={() => toggleDay(d.id)}>
                      <Tx l={d.short} />
                    </button>
                  ))}
                </div>
                <div className="row">
                  <button type="button" className="btn btn-sm btn-ghost" onClick={() => update({ days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'] })}>
                    <T en="Mon – Sat" hi="सोम – शनि" mr="सोम – शनि" gu="સોમ – શનિ" />
                  </button>
                  <button type="button" className="btn btn-sm btn-ghost" onClick={() => update({ days: DAYS.map((d) => d.id) })}>
                    <T en="All 7 days" hi="सातों दिन" mr="सातही दिवस" gu="સાતેય દિવસ" />
                  </button>
                </div>
              </fieldset>

              <div className={s.todayRow}>
                <span className={s.todayIcon} aria-hidden="true">
                  <Sun />
                </span>
                <span className={s.todayText}>
                  <strong id="today-label">
                    <T en="Available today" hi="आज काम के लिए खाली" mr="आज कामासाठी मोकळा/मोकळी" gu="આજે કામ માટે ખાલી" />
                  </strong>
                  <span className="subtle">
                    <T en="Employers nearby see a green dot" hi="पास के मालिकों को हरा निशान दिखेगा" mr="जवळच्या मालकांना हिरवी खूण दिसेल" gu="નજીકના માલિકોને લીલું નિશાન દેખાશે" />
                  </span>
                </span>
                <button
                  type="button"
                  role="switch"
                  className={`switch ${s.bigSwitch}`}
                  aria-checked={p.availableToday}
                  aria-labelledby="today-label"
                  onClick={() => update((prev) => ({ availableToday: !prev.availableToday }))}
                />
              </div>

              {p.trade && fair ? (
                <div className={s.rateBox}>
                  <div className={s.rateHead}>
                    <label htmlFor="rate" className="label">
                      <T en="My daily rate" hi="मेरी रोज़ की मज़दूरी" mr="माझा रोजचा दर" gu="મારો રોજનો દર" />
                    </label>
                    <span className="subtle">
                      <T en={`Fair for ${TRADE[p.trade].name.en}: ${rupee(fair[0])}–${rupee(fair[1])}`} hi={`${TRADE[p.trade].name.hi} के लिए सही: ${rupee(fair[0])}–${rupee(fair[1])}`}
                        mr={`${TRADE[p.trade].name.mr} साठी योग्य: ${rupee(fair[0])}–${rupee(fair[1])}`}
                        gu={`${TRADE[p.trade].name.gu} માટે યોગ્ય: ${rupee(fair[0])}–${rupee(fair[1])}`}
                      />
                    </span>
                  </div>
                  <div className={s.rateTop}>
                    <button
                      type="button"
                      className={s.stepBtn}
                      onClick={() => update((prev) => ({ rate: clamp(prev.rate - 50, range[0], range[1]) }))}
                      aria-label={t('₹50 less', '₹50 कम', '₹50 कमी', '₹50 ઓછા')}
                    >
                      <Minus aria-hidden="true" />
                    </button>
                    <span className={s.rateValue}>
                      <span className="money">{rupee(p.rate)}</span>
                      <span className="subtle">
                        <T en="per day" hi="प्रति दिन" mr="दर दिवशी" gu="દર દિવસે" />
                      </span>
                    </span>
                    <button
                      type="button"
                      className={s.stepBtn}
                      onClick={() => update((prev) => ({ rate: clamp(prev.rate + 50, range[0], range[1]) }))}
                      aria-label={t('₹50 more', '₹50 ज़्यादा', '₹50 जास्त', '₹50 વધારે')}
                    >
                      <Plus aria-hidden="true" />
                    </button>
                  </div>
                  <input
                    id="rate"
                    type="range"
                    className={s.range}
                    min={range[0]}
                    max={range[1]}
                    step={50}
                    value={p.rate}
                    onChange={(e) => update({ rate: Number(e.target.value) })}
                    aria-valuetext={`${rupee(p.rate)} ${t('per day', 'प्रति दिन', 'दर दिवशी', 'દર દિવસે')}, ${
                      band === 'fair' ? t('fair pay', 'सही मज़दूरी', 'योग्य मजुरी', 'યોગ્ય મજૂરી') : band === 'below' ? t('below fair pay', 'सही से कम', 'योग्य मजुरीपेक्षा कमी', 'યોગ્ય મજૂરી કરતાં ઓછું') : t('above usual', 'आम से ज़्यादा', 'नेहमीपेक्षा जास्त', 'સામાન્ય કરતાં વધારે')
                    }`}
                    style={{ '--lo': `${pctOf(fair[0])}%`, '--hi': `${pctOf(fair[1])}%` } as React.CSSProperties}
                  />
                  <div className={s.zones} aria-hidden="true" style={{ '--lo': `${pctOf(fair[0])}%`, '--hi': `${pctOf(fair[1])}%` } as React.CSSProperties}>
                    <span className={band === 'below' ? s.zoneOn : ''}>
                      <T en="Low" hi="कम" mr="कमी" gu="ઓછું" />
                    </span>
                    <span className={band === 'fair' ? s.zoneOn : ''}>
                      <T en="Fair" hi="सही" mr="योग्य" gu="યોગ્ય" />
                    </span>
                    <span className={band === 'above' ? s.zoneOn : ''}>
                      <T en="High" hi="ज़्यादा" mr="जास्त" gu="વધારે" />
                    </span>
                  </div>
                  <p className={`${s.rateMsg} ${band ? s[`msg_${band}`] : ''}`} aria-live="polite">
                    {band === 'fair' && (
                      <>
                        <Check aria-hidden="true" />
                        <T en="Fair pay. Employers will find this rate normal." hi="सही मज़दूरी। मालिकों को यह रेट ठीक लगेगा।" mr="योग्य मजुरी. मालकांना हा दर ठीक वाटेल." gu="યોગ્ય મજૂરી. માલિકોને આ દર બરાબર લાગશે." />
                      </>
                    )}
                    {band === 'below' && (
                      <>
                        <CircleAlert aria-hidden="true" />
                        <T en="This is below fair pay. Your skill is worth more — you can ask for more." hi="यह सही मज़दूरी से कम है। आपका हुनर ज़्यादा का हक़दार है — आप ज़्यादा माँग सकते हैं।" mr="हे योग्य मजुरीपेक्षा कमी आहे. तुमच्या कौशल्याची किंमत जास्त आहे — तुम्ही जास्त मागू शकता." gu="આ યોગ્ય મજૂરી કરતાં ઓછું છે. તમારી આવડતની કિંમત વધારે છે — તમે વધારે માગી શકો છો." />
                      </>
                    )}
                    {band === 'above' && (
                      <>
                        <Sparkles aria-hidden="true" />
                        <T en="Higher than usual. Fine if your work is special — explain why in your voice intro." hi="आम से ज़्यादा। अगर आपका काम ख़ास है तो ठीक — वजह अपने आवाज़ वाले परिचय में बताएँ।" mr="नेहमीपेक्षा जास्त. तुमचं काम खास असेल तर ठीक — कारण तुमच्या आवाजातल्या ओळखीत सांगा." gu="સામાન્ય કરતાં વધારે. તમારું કામ ખાસ હોય તો બરાબર — કારણ તમારી અવાજવાળી ઓળખમાં કહો." />
                      </>
                    )}
                  </p>
                </div>
              ) : (
                <p className="callout">
                  <CircleAlert aria-hidden="true" />
                  <T en="Pick your work in step 1 to set a fair rate." hi="सही मज़दूरी तय करने के लिए कदम 1 में अपना काम चुनें।" mr="योग्य मजुरी ठरवण्यासाठी पायरी 1 मध्ये तुमचं काम निवडा." gu="યોગ્ય મજૂરી નક્કી કરવા પગલું 1 માં તમારું કામ પસંદ કરો." />
                </p>
              )}
            </div>
          )}

          {/* ── STEP 4 ─────────────────────────────── */}
          {step === 3 && (
            <div className={s.stepBody}>
              <div className="field">
                <label className="label" htmlFor="worker-name">
                  <UserRound aria-hidden="true" className={s.labelIcon} />
                  <T en="My name" hi="मेरा नाम" mr="माझं नाव" gu="મારું નામ" />
                </label>
                <input
                  id="worker-name"
                  ref={nameRef}
                  className={`input ${s.nameInput}`}
                  value={p.name}
                  autoComplete="name"
                  maxLength={40}
                  aria-invalid={!!error && step === 3}
                  aria-describedby={error ? 'wizard-error' : undefined}
                  onChange={(e) => {
                    setError(null);
                    update({ name: e.target.value });
                  }}
                  placeholder={t('e.g. Ramesh Yadav', 'जैसे: रमेश यादव', 'उदा. रमेश यादव', 'જેમ કે: રમેશ યાદવ')}
                />
              </div>

              <fieldset className={s.fieldset}>
                <legend className={s.legend}>
                  <Languages aria-hidden="true" className={s.labelIcon} />
                  <T en="Languages I speak" hi="मेरी भाषाएँ" mr="मला येणाऱ्या भाषा" gu="મારી ભાષાઓ" />
                </legend>
                <div className={s.chipWrap}>
                  {LANGUAGES.map((l) => {
                    const on = p.languages.includes(l.id);
                    return (
                      <button
                        key={l.id}
                        type="button"
                        className="filter-chip"
                        aria-pressed={on}
                        onClick={() => update((prev) => ({ languages: on ? prev.languages.filter((x) => x !== l.id) : [...prev.languages, l.id] }))}
                      >
                        {on && <Check aria-hidden="true" />}
                        <Tx l={l.l} />
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <fieldset className={s.fieldset}>
                <legend className={s.legend}>
                  <Mic aria-hidden="true" className={s.labelIcon} />
                  <T en="Say hello in your own voice" hi="अपनी आवाज़ में नमस्ते कहें" mr="तुमच्या आवाजात नमस्कार म्हणा" gu="તમારા અવાજમાં નમસ્તે કહો" />
                  <span className={s.legendHint}>
                    <T en="optional" hi="ज़रूरी नहीं" mr="गरजेचं नाही" gu="જરૂરી નથી" />
                  </span>
                </legend>
                <p className={s.sayThis}>
                  <span className="subtle">
                    <T en="You can say:" hi="आप ऐसे बोल सकते हैं:" mr="तुम्ही असं बोलू शकता:" gu="તમે આવું બોલી શકો:" />
                  </span>
                  <q>
                    <Tx l={introSpeech} />
                  </q>
                </p>
                <VoiceRecorder meta={p.voice} url={voiceUrl} speech={introSpeech} onSave={saveVoice} onClear={clearVoice} />
              </fieldset>

              <fieldset className={s.fieldset}>
                <legend className={s.legend}>
                  <T en="Photos of my work" hi="मेरे काम की फ़ोटो" mr="माझ्या कामाचे फोटो" gu="મારા કામના ફોટા" />
                  <span className={s.legendHint}>
                    <T en="optional · up to 3" hi="ज़रूरी नहीं · 3 तक" mr="गरजेचं नाही · 3 पर्यंत" gu="જરૂરી નથી · 3 સુધી" />
                  </span>
                </legend>
                <PhotoSlots urls={photoUrls} count={p.photos} onAdd={addPhoto} onRemove={removePhoto} />
                <p className="subtle">
                  <T
                    en="A finished wall, a neat pipe joint, a polished door — photos speak louder than certificates. Photos stay on your phone in this demo."
                    hi="पूरी हुई दीवार, साफ़ पाइप जोड़, चमकता दरवाज़ा — फ़ोटो सर्टिफ़िकेट से ज़्यादा बोलती है। इस डेमो में फ़ोटो आपके फ़ोन में ही रहती हैं।"
                    mr="पूर्ण झालेली भिंत, नीट केलेला पाईपचा जोड, चमकणारं दार — फोटो सर्टिफिकेटपेक्षा जास्त बोलतात. या डेमोमध्ये फोटो तुमच्या फोनमध्येच राहतात."
                    gu="પૂરી થયેલી દીવાલ, સરસ પાઇપ જોડાણ, ચમકતો દરવાજો — ફોટા સર્ટિફિકેટ કરતાં વધારે બોલે છે. આ ડેમોમાં ફોટા તમારા ફોનમાં જ રહે છે."
                  />
                </p>
              </fieldset>
            </div>
          )}

          {error && (
            <p id="wizard-error" className={`callout callout-danger ${s.error}`} role="alert">
              <CircleAlert aria-hidden="true" />
              <Tx l={error} />
            </p>
          )}

          <div className={s.navRow}>
            {step > 0 ? (
              <button type="button" className="btn btn-lg btn-ghost" onClick={() => goTo(step - 1)}>
                <ArrowLeft aria-hidden="true" />
                <T en="Back" hi="पीछे" mr="मागे" gu="પાછળ" />
              </button>
            ) : (
              <span />
            )}
            <button type="button" className={`btn btn-lg ${step === STEPS.length - 1 ? 'btn-accent' : 'btn-primary'}`} onClick={next} aria-disabled={!!validate(step)}>
              {step === STEPS.length - 1 ? (
                <>
                  <Sparkles aria-hidden="true" />
                  <T en="Make my card" hi="मेरा कार्ड बनाएँ" mr="माझं कार्ड बनवा" gu="મારું કાર્ડ બનાવો" />
                </>
              ) : (
                <>
                  <T en="Next" hi="आगे" mr="पुढे" gu="આગળ" />
                  <ArrowRight aria-hidden="true" />
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* ── Live preview */}
      <aside className={`${s.previewPane} ${previewOpen ? s.previewOpen : ''}`} aria-label={t('Live card preview', 'कार्ड की झलक', 'कार्डची झलक', 'કાર્ડની ઝલક')}>
        <button type="button" className={s.previewToggle} aria-expanded={previewOpen} aria-controls="card-preview" onClick={() => setPreviewOpen((o) => !o)}>
          <span className={s.ring} style={{ '--p': pct } as React.CSSProperties} aria-hidden="true">
            {p.trade ? <TradeIcon trade={p.trade} /> : <Eye />}
          </span>
          <span className={s.toggleText}>
            <strong>{previewOpen ? <T en="Hide my card" hi="कार्ड छुपाएँ" mr="कार्ड लपवा" gu="કાર્ડ છુપાવો" /> : <T en="See my card" hi="मेरा कार्ड देखें" mr="माझं कार्ड पाहा" gu="મારું કાર્ડ જુઓ" />}</strong>
            <span className="subtle">
              <T en={`${pct}% ready`} hi={`${pct}% तैयार`} mr={`${pct}% तयार`} gu={`${pct}% તૈયાર`} />
            </span>
          </span>
          <ChevronDown aria-hidden="true" className={s.chev} />
        </button>
        <div id="card-preview" className={s.previewBody} data-lenis-prevent="">
          <p className={s.previewLabel}>
            <Eye aria-hidden="true" />
            <T en="Live preview — changes as you go" hi="लाइव झलक — भरते ही बदलती है" mr="लाइव्ह झलक — भरताच बदलते" gu="લાઇવ ઝલક — ભરતાં જ બદલાય છે" />
          </p>
          <SkillCard p={p} photoUrls={photoUrls} variant="preview" />
        </div>
      </aside>
      <Toast msg={toast} onDone={closeToast} />
    </div>
  );
}

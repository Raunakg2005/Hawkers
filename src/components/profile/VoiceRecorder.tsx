'use client';

import { useEffect, useRef, useState } from 'react';
import { Mic, Pause, Play, RotateCcw, Square, Trash2 } from 'lucide-react';
import { T } from '@/components/T';
import { useLang } from '@/lib/prefs';
import { localeOf } from '@/lib/i18n';
import type { L, Lang } from '@/data/types';
import s from './profile.module.css';

const MAX_SECS = 30;

type Phase = 'idle' | 'asking' | 'recording' | 'done';

/**
 * Text + voice for the practice playback, in the active language. Like
 * ReadAloud: Marathi may borrow a Hindi voice; with no Gujarati voice the
 * phone reads the English text instead of garbling Gujarati script.
 */
function speechPlan(lang: Lang, texts: L, voices: SpeechSynthesisVoice[]) {
  const find = (l: Lang) => voices.find((v) => v.lang.replace('_', '-') === localeOf(l)) ?? voices.find((v) => v.lang.toLowerCase().startsWith(l));
  const own = find(lang);
  if (own || lang === 'en' || voices.length === 0) return { text: texts[lang], locale: localeOf(lang), voice: own };
  if (lang === 'mr') {
    const hiVoice = find('hi');
    if (hiVoice) return { text: texts.mr, locale: 'hi-IN', voice: hiVoice };
  }
  if (lang === 'gu') return { text: texts.en, locale: 'en-IN', voice: find('en') };
  return { text: texts[lang], locale: localeOf(lang), voice: undefined };
}

export interface VoiceMeta {
  secs: number;
  simulated: boolean;
}

/**
 * Record a short voice intro. Uses the microphone (MediaRecorder) when the
 * phone allows it; if permission is denied or the browser can't record, it
 * falls back to a practice recording that plays back with the phone's voice.
 */
export default function VoiceRecorder({
  meta,
  url,
  speech,
  onSave,
  onClear,
}: {
  meta: VoiceMeta | null;
  url: string | null;
  /** text the phone reads aloud when playing a practice (simulated) recording */
  speech: L;
  onSave: (meta: VoiceMeta, blob: Blob | null) => void;
  onClear: () => void;
}) {
  const { t, lang } = useLang();
  const [phase, setPhase] = useState<Phase>(meta ? 'done' : 'idle');
  const [secs, setSecs] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [note, setNote] = useState<'denied' | 'unsupported' | null>(null);

  const recRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const startRef = useRef(0);
  const simRef = useRef(false);
  const secsRef = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Keep the phase in sync if the parent clears/loads a recording.
  const [prevMeta, setPrevMeta] = useState(meta);
  if (prevMeta !== meta) {
    setPrevMeta(meta);
    if (meta && phase === 'idle') setPhase('done');
    if (!meta && phase === 'done') setPhase('idle');
  }

  const stopTimer = () => {
    if (timerRef.current !== null) window.clearInterval(timerRef.current);
    timerRef.current = null;
  };

  const releaseMic = () => {
    streamRef.current?.getTracks().forEach((tr) => tr.stop());
    streamRef.current = null;
  };

  useEffect(
    () => () => {
      stopTimer();
      try {
        if (recRef.current && recRef.current.state !== 'inactive') recRef.current.stop();
      } catch {
        /* ignore */
      }
      releaseMic();
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    },
    [],
  );

  const startTimer = () => {
    startRef.current = Date.now();
    secsRef.current = 0;
    setSecs(0);
    timerRef.current = window.setInterval(() => {
      const n = Math.min(MAX_SECS, Math.floor((Date.now() - startRef.current) / 1000));
      secsRef.current = n;
      setSecs(n);
      if (n >= MAX_SECS) stop();
    }, 250);
  };

  const startSimulated = (why: 'denied' | 'unsupported') => {
    simRef.current = true;
    setNote(why);
    setPhase('recording');
    startTimer();
  };

  const start = async () => {
    setNote(null);
    stopPlayback();
    const canRecord = typeof window !== 'undefined' && !!navigator.mediaDevices?.getUserMedia && typeof MediaRecorder !== 'undefined';
    if (!canRecord) return startSimulated('unsupported');
    setPhase('asking');
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      return startSimulated('denied');
    }
    try {
      simRef.current = false;
      streamRef.current = stream;
      chunksRef.current = [];
      const rec = new MediaRecorder(stream);
      recRef.current = rec;
      rec.ondataavailable = (e) => {
        if (e.data.size) chunksRef.current.push(e.data);
      };
      rec.onstop = () => {
        releaseMic();
        const blob = new Blob(chunksRef.current, { type: rec.mimeType || 'audio/webm' });
        onSave({ secs: Math.max(1, secsRef.current), simulated: false }, blob);
        setPhase('done');
      };
      rec.start();
      setPhase('recording');
      startTimer();
    } catch {
      releaseMic();
      startSimulated('unsupported');
    }
  };

  function stop() {
    stopTimer();
    if (simRef.current) {
      onSave({ secs: Math.max(1, secsRef.current), simulated: true }, null);
      setPhase('done');
      return;
    }
    try {
      if (recRef.current && recRef.current.state !== 'inactive') recRef.current.stop();
    } catch {
      setPhase('done');
    }
  }

  function stopPlayback() {
    audioRef.current?.pause();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
    setPlaying(false);
  }

  const play = () => {
    if (playing) return stopPlayback();
    if (url && !meta?.simulated) {
      const a = audioRef.current ?? new Audio();
      audioRef.current = a;
      if (a.src !== url) a.src = url;
      a.currentTime = 0;
      a.onended = () => setPlaying(false);
      a.onerror = () => setPlaying(false);
      a.play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
      return;
    }
    if ('speechSynthesis' in window) {
      const synth = window.speechSynthesis;
      synth.cancel();
      const sp = speechPlan(lang, speech, synth.getVoices());
      const u = new SpeechSynthesisUtterance(sp.text);
      u.lang = sp.locale;
      if (sp.voice) u.voice = sp.voice;
      u.rate = 0.95;
      u.onend = u.onerror = () => setPlaying(false);
      setPlaying(true);
      synth.speak(u);
    }
  };

  const redo = () => {
    stopPlayback();
    onClear();
    setPhase('idle');
    void start();
  };

  const remove = () => {
    stopPlayback();
    onClear();
    setNote(null);
    setPhase('idle');
  };

  const fmt = (n: number) => `0:${String(n).padStart(2, '0')}`;
  const recording = phase === 'recording';
  const doneSecs = meta?.secs ?? 0;
  const noAudio = phase === 'done' && !!meta && !meta.simulated && !url;

  return (
    <div className={`${s.voice} ${recording ? s.voiceLive : ''}`}>
      <div className={s.voiceMain}>
        {phase !== 'done' ? (
          <button
            type="button"
            className={s.micBtn}
            onClick={recording ? stop : start}
            aria-pressed={recording}
            disabled={phase === 'asking'}
            aria-label={recording ? t('Stop recording', 'रिकॉर्डिंग रोकें', 'रेकॉर्डिंग थांबवा', 'રેકોર્ડિંગ બંધ કરો') : t('Start recording', 'रिकॉर्डिंग शुरू करें', 'रेकॉर्डिंग सुरू करा', 'રેકોર્ડિંગ શરૂ કરો')}
          >
            {recording ? <Square aria-hidden="true" /> : <Mic aria-hidden="true" />}
          </button>
        ) : (
          <button
            type="button"
            className={`${s.micBtn} ${s.micPlay}`}
            onClick={play}
            disabled={noAudio}
            aria-label={playing ? t('Pause', 'रोकें', 'थांबवा', 'રોકો') : t('Play my intro', 'मेरा परिचय सुनें', 'माझी ओळख ऐका', 'મારી ઓળખ સાંભળો')}
          >
            {playing ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
          </button>
        )}

        <div className={s.voiceText} aria-live="polite">
          {phase === 'idle' && (
            <>
              <strong>
                <T en="Tap the mic and speak" hi="माइक दबाएँ और बोलें" mr="माईक दाबा आणि बोला" gu="માઇક દબાવો અને બોલો" />
              </strong>
              <span className="subtle">
                <T en="Up to 30 seconds" hi="30 सेकंड तक" mr="30 सेकंदांपर्यंत" gu="30 સેકન્ડ સુધી" />
              </span>
            </>
          )}
          {phase === 'asking' && (
            <strong>
              <T en="Allow the microphone…" hi="माइक की अनुमति दें…" mr="माईकला परवानगी द्या…" gu="માઇકની મંજૂરી આપો…" />
            </strong>
          )}
          {recording && (
            <>
              <strong className={s.recLabel}>
                <span className={s.recDot} aria-hidden="true" />
                <T en="Recording" hi="रिकॉर्ड हो रहा है" mr="रेकॉर्ड होत आहे" gu="રેકોર્ડ થઈ રહ્યું છે" /> {fmt(secs)}
                <span className="subtle"> / {fmt(MAX_SECS)}</span>
              </strong>
              <span className="subtle">
                <T en="Tap the square to stop" hi="रोकने के लिए चौकोर बटन दबाएँ" mr="थांबवायला चौकोनी बटण दाबा" gu="બંધ કરવા ચોરસ બટન દબાવો" />
              </span>
            </>
          )}
          {phase === 'done' && (
            <>
              <strong>
                <T en="Voice intro saved" hi="आवाज़ में परिचय सेव हुआ" mr="आवाजातली ओळख सेव्ह झाली" gu="અવાજમાં ઓળખ સેવ થઈ" /> · {fmt(doneSecs)}
              </strong>
              <span className="subtle">
                {meta?.simulated ? (
                  <T en="Practice recording — phone reads it aloud" hi="अभ्यास रिकॉर्डिंग — फ़ोन पढ़कर सुनाएगा" mr="सरावाचं रेकॉर्डिंग — फोन वाचून ऐकवेल" gu="પ્રેક્ટિસ રેકોર્ડિંગ — ફોન વાંચીને સંભળાવશે" />
                ) : noAudio ? (
                  <T en="Saved earlier. Record again to hear it here." hi="पहले सेव हुआ था। यहाँ सुनने के लिए दोबारा रिकॉर्ड करें।" mr="आधी सेव्ह झालं होतं. इथे ऐकायला पुन्हा रेकॉर्ड करा." gu="પહેલાં સેવ થયું હતું. અહીં સાંભળવા ફરી રેકોર્ડ કરો." />
                ) : (
                  <T en="Tap play to hear it" hi="सुनने के लिए प्ले दबाएँ" mr="ऐकायला प्ले दाबा" gu="સાંભળવા પ્લે દબાવો" />
                )}
              </span>
            </>
          )}
        </div>

        <div className={s.wave} aria-hidden="true">
          {Array.from({ length: 14 }, (_, i) => (
            <i key={i} style={{ '--i': i } as React.CSSProperties} />
          ))}
        </div>
      </div>

      {recording && (
        <div className="meter" aria-hidden="true">
          <span style={{ transform: `scaleX(${secs / MAX_SECS})` }} />
        </div>
      )}

      {phase === 'done' && (
        <div className="row">
          <button type="button" className="btn btn-sm" onClick={redo}>
            <RotateCcw aria-hidden="true" />
            <T en="Record again" hi="फिर से रिकॉर्ड करें" mr="पुन्हा रेकॉर्ड करा" gu="ફરી રેકોર્ડ કરો" />
          </button>
          <button type="button" className="btn btn-sm btn-ghost" onClick={remove}>
            <Trash2 aria-hidden="true" />
            <T en="Remove" hi="हटाएँ" mr="काढा" gu="કાઢો" />
          </button>
        </div>
      )}

      {note && (
        <p className={s.voiceNote} role="status">
          {note === 'denied' ? (
            <T
              en="Microphone is off, so this is a practice recording. Your phone will read your intro aloud instead."
              hi="माइक बंद है, इसलिए यह अभ्यास रिकॉर्डिंग है। आपका फ़ोन आपका परिचय पढ़कर सुनाएगा।"
              mr="माईक बंद आहे, म्हणून हे सरावाचं रेकॉर्डिंग आहे. तुमचा फोन तुमची ओळख वाचून ऐकवेल."
              gu="માઇક બંધ છે, એટલે આ પ્રેક્ટિસ રેકોર્ડિંગ છે. તમારો ફોન તમારી ઓળખ વાંચીને સંભળાવશે."
            />
          ) : (
            <T
              en="This browser cannot record, so this is a practice recording."
              hi="यह ब्राउज़र रिकॉर्ड नहीं कर सकता, इसलिए यह अभ्यास रिकॉर्डिंग है।"
              mr="हा ब्राउझर रेकॉर्ड करू शकत नाही, म्हणून हे सरावाचं रेकॉर्डिंग आहे."
              gu="આ બ્રાઉઝર રેકોર્ડ કરી શકતું નથી, એટલે આ પ્રેક્ટિસ રેકોર્ડિંગ છે."
            />
          )}
        </p>
      )}
    </div>
  );
}

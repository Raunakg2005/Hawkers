'use client';

import { useEffect, useRef, useState } from 'react';
import { Mic, Pause, Play, RotateCcw, Square, Trash2 } from 'lucide-react';
import { T } from '@/components/T';
import { useLang } from '@/lib/prefs';
import s from './profile.module.css';

const MAX_SECS = 30;

type Phase = 'idle' | 'asking' | 'recording' | 'done';

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
  speech: { en: string; hi: string };
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
      const u = new SpeechSynthesisUtterance(lang === 'hi' ? speech.hi : speech.en);
      u.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
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
            aria-label={recording ? t('Stop recording', 'रिकॉर्डिंग रोकें') : t('Start recording', 'रिकॉर्डिंग शुरू करें')}
          >
            {recording ? <Square aria-hidden="true" /> : <Mic aria-hidden="true" />}
          </button>
        ) : (
          <button
            type="button"
            className={`${s.micBtn} ${s.micPlay}`}
            onClick={play}
            disabled={noAudio}
            aria-label={playing ? t('Pause', 'रोकें') : t('Play my intro', 'मेरा परिचय सुनें')}
          >
            {playing ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
          </button>
        )}

        <div className={s.voiceText} aria-live="polite">
          {phase === 'idle' && (
            <>
              <strong>
                <T en="Tap the mic and speak" hi="माइक दबाएँ और बोलें" />
              </strong>
              <span className="subtle">
                <T en="Up to 30 seconds" hi="30 सेकंड तक" />
              </span>
            </>
          )}
          {phase === 'asking' && (
            <strong>
              <T en="Allow the microphone…" hi="माइक की अनुमति दें…" />
            </strong>
          )}
          {recording && (
            <>
              <strong className={s.recLabel}>
                <span className={s.recDot} aria-hidden="true" />
                <T en="Recording" hi="रिकॉर्ड हो रहा है" /> {fmt(secs)}
                <span className="subtle"> / {fmt(MAX_SECS)}</span>
              </strong>
              <span className="subtle">
                <T en="Tap the square to stop" hi="रोकने के लिए चौकोर बटन दबाएँ" />
              </span>
            </>
          )}
          {phase === 'done' && (
            <>
              <strong>
                <T en="Voice intro saved" hi="आवाज़ में परिचय सेव हुआ" /> · {fmt(doneSecs)}
              </strong>
              <span className="subtle">
                {meta?.simulated ? (
                  <T en="Practice recording — phone reads it aloud" hi="अभ्यास रिकॉर्डिंग — फ़ोन पढ़कर सुनाएगा" />
                ) : noAudio ? (
                  <T en="Saved earlier. Record again to hear it here." hi="पहले सेव हुआ था। यहाँ सुनने के लिए दोबारा रिकॉर्ड करें।" />
                ) : (
                  <T en="Tap play to hear it" hi="सुनने के लिए प्ले दबाएँ" />
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
            <T en="Record again" hi="फिर से रिकॉर्ड करें" />
          </button>
          <button type="button" className="btn btn-sm btn-ghost" onClick={remove}>
            <Trash2 aria-hidden="true" />
            <T en="Remove" hi="हटाएँ" />
          </button>
        </div>
      )}

      {note && (
        <p className={s.voiceNote} role="status">
          {note === 'denied' ? (
            <T
              en="Microphone is off, so this is a practice recording. Your phone will read your intro aloud instead."
              hi="माइक बंद है, इसलिए यह अभ्यास रिकॉर्डिंग है। आपका फ़ोन आपका परिचय पढ़कर सुनाएगा।"
            />
          ) : (
            <T en="This browser cannot record, so this is a practice recording." hi="यह ब्राउज़र रिकॉर्ड नहीं कर सकता, इसलिए यह अभ्यास रिकॉर्डिंग है।" />
          )}
        </p>
      )}
    </div>
  );
}

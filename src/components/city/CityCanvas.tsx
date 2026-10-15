'use client';

import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerformanceMonitor, Sparkles } from '@react-three/drei';
import { Bloom, EffectComposer, ToneMapping, Vignette } from '@react-three/postprocessing';
import { ToneMappingMode } from 'postprocessing';
import * as THREE from 'three';
import { smooth, story } from './story';
import { ChaiStall, City, Scooter, Sky, Street, StreetLamp, Trees, useCity } from './real-world';
import { Arcs, GovOffice, JobPins, People, SkillCard, Trust, usePins } from './real-actors';

/* ────────────────────────────────────────────────────────────────────────────
 * Camera path. One key per act (held a little so you can read), plus the
 * horizontal shift that keeps the subject clear of the text column.
 *   sx: -1 = subject on the right (text left), +1 = subject on the left
 * ──────────────────────────────────────────────────────────────────────────── */

type Key = { p: number; pos: [number, number, number]; look: [number, number, number]; sx: number };

const KEYS: Key[] = [
  { p: 0.0, pos: [0.6, 2.7, 12], look: [0, 1.45, 0], sx: -0.6 },
  { p: 0.05, pos: [0.4, 2.8, 11.4], look: [0, 1.5, 0], sx: -0.6 },
  { p: 0.17, pos: [0, 30, 44], look: [0, 9, -18], sx: -0.35 },
  { p: 0.24, pos: [4, 28, 42], look: [0, 9, -18], sx: -0.35 },
  { p: 0.36, pos: [0.4, 2.3, 8.4], look: [1.9, 1.8, 1.6], sx: -0.7 },
  { p: 0.45, pos: [0.2, 2.2, 8], look: [2, 1.85, 1.8], sx: -0.7 },
  { p: 0.56, pos: [-0.4, 3.4, 10.6], look: [-3.3, 2.2, 2.4], sx: 0.7 },
  { p: 0.65, pos: [-0.8, 3.6, 10.2], look: [-3.3, 2.2, 2.4], sx: 0.7 },
  { p: 0.76, pos: [2.4, 4.9, 9.4], look: [7.4, 2.3, -2.6], sx: -0.7 },
  { p: 0.84, pos: [2.8, 5.1, 9], look: [7.4, 2.3, -2.6], sx: -0.7 },
  { p: 1.0, pos: [0, 26, 40], look: [0, 8, -18], sx: 0 },
];

const vA = new THREE.Vector3();
const vB = new THREE.Vector3();
const lookNow = new THREE.Vector3(0, 1.4, 0);
const posTarget = new THREE.Vector3();
const lookTarget = new THREE.Vector3();

function sample(p: number) {
  let i = 0;
  while (i < KEYS.length - 2 && p > KEYS[i + 1].p) i++;
  const a = KEYS[i];
  const b = KEYS[i + 1];
  const t = smooth(Math.min(1, Math.max(0, (p - a.p) / (b.p - a.p))));
  posTarget.copy(vA.fromArray(a.pos)).lerp(vB.fromArray(b.pos), t);
  lookTarget.copy(vA.fromArray(a.look)).lerp(vB.fromArray(b.look), t);
  return THREE.MathUtils.lerp(a.sx, b.sx, t);
}

function Rig() {
  const { camera, size } = useThree();
  const cam = camera as THREE.PerspectiveCamera;
  const shift = useMemo(() => ({ x: -0.55, y: 0 }), []);

  useFrame((_, dt) => {
    // ease the rendered progress toward the scroll position: buttery, never jumpy
    const k = 1 - Math.exp(-dt * 4.5);
    story.s += (story.p - story.s) * k;

    const portrait = size.width < size.height * 0.9;
    const sx = sample(story.s);

    cam.fov = portrait ? 56 : 38;
    // pointer parallax (mouse only); a hand-held toy, not a ride
    posTarget.x += story.px * 0.45;
    posTarget.y += -story.py * 0.25;
    cam.position.lerp(posTarget, 1 - Math.exp(-dt * 6));
    lookNow.lerp(lookTarget, 1 - Math.exp(-dt * 6));
    cam.lookAt(lookNow);

    // keep the subject clear of the text: sideways on desktop, lower on phones
    const tx = portrait ? 0 : sx * 0.24;
    const ty = portrait ? -0.2 : 0;
    shift.x += (tx - shift.x) * (1 - Math.exp(-dt * 5));
    shift.y += (ty - shift.y) * (1 - Math.exp(-dt * 5));
    cam.setViewOffset(size.width, size.height, shift.x * size.width, shift.y * size.height, size.width, size.height);
    cam.updateProjectionMatrix();
  });
  return null;
}

function Dust() {
  // warm dust motes in the morning light, only once the sun is up
  const [show, setShow] = useState(false);
  useFrame(() => {
    const v = story.s > 0.7;
    if (v !== show) setShow(v);
  });
  return show ? <Sparkles count={70} scale={[26, 6, 14]} position={[0, 3, -2]} size={3} speed={0.25} color="#ffd29a" opacity={0.7} /> : null;
}

/**
 * Mounts once every asset in the Suspense boundary has loaded, then compiles
 * all shaders in parallel (KHR_parallel_shader_compile) before the first frame,
 * so the page never freezes on a synchronous compile.
 */
function Ready({ onWarm }: { onWarm: () => void }) {
  const { gl, scene, camera } = useThree();
  useEffect(() => {
    let cancelled = false;
    gl.compileAsync(scene, camera)
      .catch(() => undefined)
      .then(() => {
        if (!cancelled) onWarm();
      });
    return () => {
      cancelled = true;
    };
  }, [gl, scene, camera, onWarm]);
  return null;
}

function Scene() {
  const buildings = useCity();
  const pins = usePins(buildings);
  return (
    <>
      <Sky />
      <Street />
      <City buildings={buildings} />
      <Trees />
      <ChaiStall />
      <StreetLamp x={0.15} />
      <StreetLamp x={-6.6} />
      <Scooter x={-5.5} z={4.4} color="#b3202e" rot={0.2} />
      <Scooter x={6.2} z={4.9} color="#1f6f78" rot={-0.3} />
      <People />
      <JobPins pins={pins} />
      <Arcs pins={pins} />
      <SkillCard />
      <Trust />
      <GovOffice />
      <Dust />
      <Rig />
    </>
  );
}

export default function CityCanvas({ active, onReady }: { active: boolean; onReady: () => void }) {
  const [warm, setWarm] = useState(false);
  const onWarm = useCallback(() => {
    setWarm(true);
    requestAnimationFrame(() => requestAnimationFrame(onReady));
  }, [onReady]);
  const [quality, setQuality] = useState<'high' | 'low'>('high');
  const [dpr, setDpr] = useState(1.5);

  useEffect(() => {
    const small = window.matchMedia('(max-width: 760px)').matches;
    const weak = (navigator.hardwareConcurrency ?? 8) <= 4;
    if (small || weak) {
      setQuality('low');
      setDpr(small ? 1.25 : 1);
    } else {
      setDpr(Math.min(window.devicePixelRatio, 1.75));
    }
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      story.px = (e.clientX / window.innerWidth) * 2 - 1;
      story.py = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onPointer, { passive: true });
    return () => window.removeEventListener('pointermove', onPointer);
  }, []);

  return (
    <Canvas
      className="city-canvas"
      frameloop={active && warm ? 'always' : 'never'}
      dpr={dpr}
      shadows={quality === 'high' ? 'soft' : false}
      camera={{ fov: 38, near: 0.1, far: 600, position: [0.6, 2.5, 10.5] }}
      gl={{ antialias: quality === 'high', powerPreference: 'high-performance', stencil: false }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
      }}
      aria-hidden="true"
    >
      <PerformanceMonitor
        onDecline={() => {
          setDpr(1);
          setQuality('low');
        }}
      />
      <Suspense fallback={null}>
        <Scene />
        <Ready onWarm={onWarm} />
      </Suspense>
      {quality === 'high' ? (
        <EffectComposer multisampling={0} enableNormalPass={false}>
          <Bloom mipmapBlur intensity={0.85} luminanceThreshold={0.85} luminanceSmoothing={0.2} radius={0.7} />
          <Vignette offset={0.3} darkness={0.55} />
          <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        </EffectComposer>
      ) : (
        <></>
      )}
    </Canvas>
  );
}

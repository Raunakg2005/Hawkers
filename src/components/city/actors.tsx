'use client';

import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { easeOutBack, easeOutCubic, rng, seg, smooth, story } from './story';
import type { Building } from './world';
import { pixelTexture, spriteVoxels, VoxelModel, type Palette, type Vox } from './voxel';
import { badgeTexture, cardBaseTexture, cardIdTexture, pillTexture, qrTexture, warnTexture } from './textures';

/* ════════════════════════════════════════════════════════════════════════════
 * Voxel cast. Characters use Minecraft proportions: 1 px = P units,
 * head 8×8×8, body 8×12×4, arms and legs 4×12×4.
 * ════════════════════════════════════════════════════════════════════════════ */

const P = 0.06;
const MARIGOLD = '#ffa41f';

type Hat = 'cap' | 'helmet' | 'gamcha' | 'paper' | 'pan' | 'hair';
type Tool = 'wrench' | 'coil' | 'broom' | 'saw' | 'roller' | 'none';
type Look = 'overalls' | 'belt' | 'vest' | 'apron' | 'splash' | 'plain';

type W = { x: number; skin: string; hair: string; shirt: string; pants: string; hat: Hat; hatCol: string; tool: Tool; look: Look; beard: boolean };

export const WORKERS: W[] = [
  { x: -5, skin: '#9a6338', hair: '#1a120c', shirt: '#2f7fd1', pants: '#1f3c88', hat: 'cap', hatCol: '#e5384a', tool: 'wrench', look: 'overalls', beard: false },
  { x: -3, skin: '#7a4a26', hair: '#140e0a', shirt: '#4a4fbf', pants: '#3a3022', hat: 'helmet', hatCol: '#ffd23f', tool: 'coil', look: 'belt', beard: true },
  { x: -1, skin: '#6e4020', hair: '#2a1a10', shirt: '#1aa58a', pants: '#2b2f45', hat: 'gamcha', hatCol: '#d9453b', tool: 'broom', look: 'vest', beard: false },
  { x: 1, skin: '#a8703f', hair: '#1a120c', shirt: '#e0a33a', pants: '#3b3a52', hat: 'hair', hatCol: '#1a120c', tool: 'saw', look: 'apron', beard: true },
  { x: 3, skin: '#9a5b2c', hair: '#0f0b08', shirt: '#efece4', pants: '#56607a', hat: 'paper', hatCol: '#f4f1e8', tool: 'roller', look: 'splash', beard: false },
  { x: 5, skin: '#8a5426', hair: '#1a120c', shirt: '#d9643a', pants: '#4a3b2a', hat: 'pan', hatCol: '#7d7f86', tool: 'none', look: 'plain', beard: true },
];

export const WORKER_Z = 1.25;

const shade = (hex: string, k: number) => '#' + new THREE.Color(hex).multiplyScalar(k).getHexString();

/* ── pixel skins ─────────────────────────────────────────────────────────── */

function faceRows(w: W): { rows: string[]; pal: Palette } {
  const pal: Palette = { S: w.skin, D: shade(w.skin, 0.78), H: w.hair, W: '#f4efe6', E: '#24180f', M: shade(w.hair, 1.4), C: w.hatCol, c: shade(w.hatCol, 0.75), R: '#9b3b2a' };
  const top =
    w.hat === 'helmet' || w.hat === 'cap'
      ? ['CCCCCCCC', 'cCCCCCCc']
      : w.hat === 'gamcha'
        ? ['CWCCWCCW', 'cccccccc']
        : ['HHHHHHHH', 'HHHHHHHH'];
  const rows = [
    ...top,
    'HSSSSSSH',
    'SWESSEWS',
    'SSSDDSSS',
    w.beard ? 'SMMMMMMS' : 'SSSSSSSS',
    w.beard ? 'SMSRRSMS' : 'SSRRRRSS',
    w.beard ? 'SMMMMMMS' : 'SSSSSSSS',
  ];
  return { rows, pal };
}

function sideRows(w: W, back = false) {
  const pal: Palette = { S: w.skin, H: w.hair, C: w.hatCol, c: shade(w.hatCol, 0.75), W: '#f4efe6', B: w.beard ? shade(w.hair, 1.4) : w.skin };
  const top = w.hat === 'helmet' || w.hat === 'cap' ? ['CCCCCCCC', 'cccccccc'] : w.hat === 'gamcha' ? ['CWCCWCCW', 'cccccccc'] : ['HHHHHHHH', 'HHHHHHHH'];
  const rows = back
    ? [...top, 'HHHHHHHH', 'HHHHHHHH', 'HHHHHHHH', 'SHHHHHHS', 'SSSSSSSS', 'SSSSSSSS']
    : [...top, 'HHHHHHSS', 'HHHHHSSS', 'HHHSSSSS', 'HHSSSSBB', 'SSSSSSBB', 'SSSSSBBS'];
  return { rows, pal };
}

function bodyRows(w: W): { rows: string[]; pal: Palette } {
  const pal: Palette = { T: w.shirt, t: shade(w.shirt, 0.8), P: w.pants, L: '#5b3a1e', G: '#d6b24a', Y: '#d8ff3c', O: '#ff7a1a', A: '#c98f4f', s: '#5240e3', r: '#e5384a', g: '#1aa58a', K: w.skin };
  const base = Array.from({ length: 12 }, () => 'TTTTTTTT');
  base[0] = 'TTTKKTTT';
  base[1] = 'tTTTTTTt';
  switch (w.look) {
    case 'overalls':
      return { rows: ['TTTKKTTT', 'TPTTTTPT', 'TPTTTTPT', 'TPPPPPPT', 'TPPGGPPT', 'TPPPPPPT', 'TPPPPPPT', 'TPPPPPPT', 'PPPPPPPP', 'PPPPPPPP', 'PPPPPPPP', 'PPPPPPPP'], pal };
    case 'belt':
      base[8] = 'LLLGLLLL';
      base[9] = 'TLLTTLLT';
      return { rows: base, pal };
    case 'vest':
      return { rows: ['OOOKKOOO', 'OOTTTTOO', 'OOTTTTOO', 'YYYYYYYY', 'OOOTTOOO', 'OOOTTOOO', 'YYYYYYYY', 'OOOTTOOO', 'OOOTTOOO', 'OOOTTOOO', 'TTTTTTTT', 'TTTTTTTT'], pal };
    case 'apron':
      return { rows: ['TTTKKTTT', 'tTATTATt', 'TTATTATT', 'TAAAAAAT', 'TAAAAAAT', 'TAALLAAT', 'TAAAAAAT', 'TAAAAAAT', 'TAAAAAAT', 'TAAAAAAT', 'TTTTTTTT', 'TTTTTTTT'], pal };
    case 'splash':
      return { rows: ['TTTKKTTT', 'TsTTTTTT', 'TTTTTrTT', 'TTgTTTTT', 'TTTTTTsT', 'TrTTTTTT', 'TTTTgTTT', 'TTsTTTTT', 'TTTTTTrT', 'TTTTTTTT', 'TgTTTsTT', 'TTTTTTTT'], pal };
    default:
      return { rows: base, pal };
  }
}

function limbRows(top: string, bottom: string, split: number, foot?: string) {
  const pal: Palette = { A: top, B: bottom, F: foot ?? bottom };
  const rows = Array.from({ length: 12 }, (_, i) => (i < split ? 'AAAA' : foot && i >= 10 ? 'FFFF' : 'BBBB'));
  return { rows, pal };
}

function useSkin(w: W) {
  return useMemo(() => {
    const t = (r: { rows: string[]; pal: Palette }) => pixelTexture(r.rows, r.pal);
    const m = (map: THREE.Texture) => new THREE.MeshStandardMaterial({ map, roughness: 0.92 });
    const face = m(t(faceRows(w)));
    const side = m(t(sideRows(w)));
    const back = m(t(sideRows(w, true)));
    const topCol = w.hat === 'helmet' || w.hat === 'cap' || w.hat === 'gamcha' ? w.hatCol : w.hair;
    const top = new THREE.MeshStandardMaterial({ color: topCol, roughness: 0.92 });
    const chin = new THREE.MeshStandardMaterial({ color: w.skin, roughness: 0.92 });
    const body = bodyRows(w);
    const bodyFront = m(t(body));
    const bodyPlain = new THREE.MeshStandardMaterial({ color: w.look === 'vest' ? '#ff7a1a' : w.look === 'overalls' ? w.pants : w.shirt, roughness: 0.92 });
    const arm = m(t(limbRows(w.look === 'vest' ? '#ff7a1a' : w.shirt, w.skin, 4)));
    const leg = m(t(limbRows(w.pants, w.pants, 0, '#2a1c14')));
    return {
      // BoxGeometry face order: +x, -x, +y, -y, +z (front), -z (back)
      head: [side, side, top, chin, face, back],
      body: [bodyPlain, bodyPlain, bodyPlain, bodyPlain, bodyFront, bodyPlain],
      arm,
      leg,
    };
  }, [w]);
}

/* ── held tools as extruded pixel sprites ────────────────────────────────── */

const TOOLS: Record<Exclude<Tool, 'none'>, { rows: string[]; pal: Palette; at: [number, number, number]; rot: number }> = {
  wrench: { rows: ['.GG.G', '.GGGG', '..GG.', '..D..', '..D..', '..D..', '..D..', '.DD..'], pal: { G: '#d7dbe4', D: '#8d94a4' }, at: [0, -0.62, 0.12], rot: 0.3 },
  coil: { rows: ['.RRR.', 'R...R', 'R.Y.R', 'R...R', '.RRR.'], pal: { R: '#e5384a', Y: '#ffd23f' }, at: [0, -0.66, 0.16], rot: 0 },
  broom: { rows: ['..B..', '..B..', '..B..', '..B..', '..B..', '..B..', '..B..', '..B..', '..B..', '..B..', '.yYy.', 'YYYYY', 'YyYyY', 'YYYYY'], pal: { B: '#8a5a2b', Y: '#e2c26a', y: '#c7a24c' }, at: [0, -0.62, 0.14], rot: 0 },
  saw: { rows: ['WWWWWWBB', 'WWWWWWB.', 'WWWWWWBB', 'T.T.T.T.'], pal: { W: '#d9dde6', B: '#8a4b22', T: '#9aa1b2' }, at: [0.18, -0.64, 0.12], rot: 0.1 },
  roller: { rows: ['PPPPPP', 'PpPpPP', '...K..', '...K..', '...K..', '...K..', '...K..'], pal: { P: '#5240e3', p: '#7d7ff8', K: '#2a2a33' }, at: [0, -0.6, 0.14], rot: -0.2 },
};

function HeldTool({ kind }: { kind: Tool }) {
  const vox = useMemo(() => (kind === 'none' ? [] : spriteVoxels(TOOLS[kind].rows, TOOLS[kind].pal, 1)), [kind]);
  if (kind === 'none') return null;
  const t = TOOLS[kind];
  return (
    <group position={t.at} rotation={[Math.PI / 2.2, 0, t.rot]}>
      <VoxelModel voxels={vox} size={0.055} />
    </group>
  );
}

/* the iron tasla carried on the head at every construction naka */
const PAN: Vox[] = (() => {
  const out: Vox[] = [];
  for (let x = -5; x <= 5; x++)
    for (let z = -5; z <= 5; z++) {
      const r = Math.hypot(x, z);
      if (r <= 5.4) out.push({ x, y: 0, z, c: r > 4.4 ? '#9a9ca4' : '#6f727a' });
      if (r > 4.4 && r <= 5.6) out.push({ x, y: 1, z, c: '#8a8c94' });
    }
  return out;
})();

const PAPER_HAT: Vox[] = (() => {
  const out: Vox[] = [];
  for (let y = 0; y < 4; y++)
    for (let x = -4 + y; x <= 4 - y; x++) for (let z = -1; z <= 1; z++) out.push({ x, y, z, c: y % 2 ? '#e8e3d6' : '#f6f2e8' });
  return out;
})();

function Worker({ i }: { i: number }) {
  const w = WORKERS[i];
  const skin = useSkin(w);
  const root = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const armL = useRef<THREE.Group>(null);
  const armR = useRef<THREE.Group>(null);
  const halo = useRef<THREE.Group>(null);

  const geo = useMemo(
    () => ({
      head: new THREE.BoxGeometry(8 * P, 8 * P, 8 * P),
      body: new THREE.BoxGeometry(8 * P, 12 * P, 4 * P),
      // limbs pivot at the shoulder / hip
      limb: new THREE.BoxGeometry(4 * P, 12 * P, 4 * P).translate(0, -6 * P, 0),
    }),
    [],
  );

  const haloVox = useMemo(() => spriteVoxels(['.OOO.', 'O...O', 'O...O', 'O...O', '.OOO.'], { O: MARIGOLD }), []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime + i * 1.7;
    const s = story.s;
    const joy = seg(s, 0.9, 0.98);
    if (root.current) {
      const hop = Math.abs(Math.sin(joy * Math.PI * 2)) * 0.3 * (joy > 0 && joy < 1 ? 1 : 0);
      root.current.position.y = 0.16 + hop;
      root.current.rotation.y = Math.sin(t * 0.4) * 0.15 + (i - 2.5) * -0.05;
    }
    if (head.current) {
      head.current.rotation.y = Math.sin(t * 0.55) * 0.45;
      head.current.rotation.x = Math.sin(t * 0.8) * 0.06;
    }
    // Minecraft idle sway; at sunrise the right arm goes up in a wave
    if (armL.current) armL.current.rotation.x = Math.sin(t * 1.1) * 0.06;
    if (armR.current) {
      const wave = smooth(seg(s, 0.88, 0.95));
      armR.current.rotation.x = Math.sin(t * 1.1 + 1) * 0.06 - 0.35 * (1 - wave) - wave * 2.7;
      armR.current.rotation.z = wave * Math.sin(t * 8) * 0.25;
    }
    const seen = smooth(seg(s, 0.07, 0.17)) * (1 - smooth(seg(s, 0.3, 0.36))) + smooth(seg(s, 0.84, 0.9));
    if (halo.current) {
      halo.current.visible = seen > 0.01;
      halo.current.scale.setScalar(Math.max(0.0001, seen));
      halo.current.rotation.y = t * 1.5;
      halo.current.position.y = 2.5 + Math.sin(t * 2) * 0.06;
    }
  });

  return (
    <group ref={root} position={[w.x, 0.16, WORKER_Z]}>
      {/* legs */}
      {[-2, 2].map((x) => (
        <mesh key={x} geometry={geo.limb} material={skin.leg} position={[x * P, 12 * P, 0]} castShadow />
      ))}
      <mesh geometry={geo.body} material={skin.body} position={[0, 18 * P, 0]} castShadow />
      <group ref={armL} position={[-6 * P, 24 * P, 0]}>
        <mesh geometry={geo.limb} material={skin.arm} castShadow />
      </group>
      <group ref={armR} position={[6 * P, 24 * P, 0]}>
        <mesh geometry={geo.limb} material={skin.arm} castShadow />
        <HeldTool kind={w.tool} />
      </group>
      <group ref={head} position={[0, 24 * P, 0]}>
        <mesh geometry={geo.head} material={skin.head} position={[0, 4 * P, 0]} castShadow />
        {w.hat === 'cap' && (
          <mesh position={[0, 7.4 * P, 5 * P]} castShadow>
            <boxGeometry args={[8 * P, 0.6 * P, 3 * P]} />
            <meshStandardMaterial color={w.hatCol} roughness={0.9} />
          </mesh>
        )}
        {w.hat === 'helmet' && (
          <mesh position={[0, 8.4 * P, 0]} castShadow>
            <boxGeometry args={[9 * P, 1.2 * P, 9 * P]} />
            <meshStandardMaterial color={w.hatCol} roughness={0.5} />
          </mesh>
        )}
        {w.hat === 'pan' && (
          <group position={[0, 8.6 * P, 0]}>
            <VoxelModel voxels={PAN} size={P * 1.05} />
          </group>
        )}
        {w.hat === 'paper' && (
          <group position={[0, 8.6 * P, 0]}>
            <VoxelModel voxels={PAPER_HAT} size={P} />
          </group>
        )}
      </group>
      <group ref={halo}>
        <VoxelModel voxels={haloVox} size={0.07} emissive={2.4} shadows={false} />
      </group>
    </group>
  );
}

export function Workers() {
  return (
    <>
      {WORKERS.map((_, i) => (
        <Worker key={i} i={i} />
      ))}
    </>
  );
}

/* ─────────────────────────── Job pins + arcs ─────────────────────────────── */

const PIN_ROWS = ['..OOO..', '.OOOOO.', 'OOOWOOO', 'OOWWWOO', 'OOOWOOO', '.OOOOO.', '..OOO..', '...O...', '...O...'];
const PRICES = ['₹900/day', '₹750/day', '₹1,100/day', '₹18k/month', '₹850/day', '₹4,500 job', '₹1,000/day', '₹680/day', '₹950/day', '₹22k/month', '₹800/day', '₹1,250/day', '₹700/day', '₹6,000 job'];

export type Pin = { pos: THREE.Vector3; price: string };

export function usePins(buildings: Building[]) {
  return useMemo(() => {
    const r = rng(99);
    const near = buildings
      .filter((b) => b.z > -34 && Math.abs(b.x) < 34)
      .sort(() => r() - 0.5)
      .slice(0, PRICES.length);
    return near.map((b, i) => ({ pos: new THREE.Vector3(b.x, b.h + 1, b.z), price: PRICES[i] }));
  }, [buildings]);
}

function JobPin({ pin, i, n }: { pin: Pin; i: number; n: number }) {
  const g = useRef<THREE.Group>(null);
  const tex = useMemo(() => pillTexture(pin.price, MARIGOLD, '#1a1206'), [pin.price]);
  const vox = useMemo(() => spriteVoxels(PIN_ROWS, { O: MARIGOLD, W: '#fff6dd' }, 2), []);
  useFrame(({ clock }) => {
    if (!g.current) return;
    const delay = (i / n) * 0.08;
    const t = easeOutBack(seg(story.s, 0.1 + delay, 0.17 + delay));
    g.current.visible = t > 0.001;
    g.current.scale.setScalar(Math.max(t, 0.0001));
    g.current.rotation.y = clock.elapsedTime * 1.2 + i;
    g.current.position.set(pin.pos.x, pin.pos.y + (1 - t) * -2 + Math.sin(clock.elapsedTime * 1.4 + i) * 0.15, pin.pos.z);
  });
  return (
    <group ref={g}>
      <VoxelModel voxels={vox} size={0.16} emissive={1.8} shadows={false} />
      <sprite position={[0, 1.4, 0]} scale={[3.3, 1.03, 1]}>
        <spriteMaterial map={tex} toneMapped={false} depthWrite={false} />
      </sprite>
    </group>
  );
}

export function JobPins({ pins }: { pins: Pin[] }) {
  return (
    <>
      {pins.map((p, i) => (
        <JobPin key={i} pin={p} i={i} n={pins.length} />
      ))}
    </>
  );
}

/** chains of glowing blocks from every worker to jobs across the city */
export function Arcs({ pins }: { pins: Pin[] }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const PER = 26;
  const data = useMemo(() => {
    const pts: { p: THREE.Vector3; arc: number; k: number }[] = [];
    WORKERS.forEach((w, i) => {
      for (let j = 0; j < 2; j++) {
        const arc = i * 2 + j;
        const pin = pins[arc % pins.length];
        const a = new THREE.Vector3(w.x, 2.5, WORKER_Z);
        const b = pin.pos.clone();
        const mid = a.clone().lerp(b, 0.5);
        mid.y += a.distanceTo(b) * 0.35 + 3;
        const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
        for (let k = 0; k < PER; k++) pts.push({ p: curve.getPoint(k / (PER - 1)), arc, k });
      }
    });
    return pts;
  }, [pins]);
  const geo = useMemo(() => new THREE.BoxGeometry(0.2, 0.2, 0.2), []);
  const mat = useMemo(() => new THREE.MeshBasicMaterial({ color: new THREE.Color(3, 1.7, 0.35), toneMapped: false }), []);
  const m = useMemo(() => new THREE.Matrix4(), []);
  const q = useMemo(() => new THREE.Quaternion(), []);
  const e = useMemo(() => new THREE.Euler(), []);
  const sc = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock }) => {
    const mesh = ref.current;
    if (!mesh) return;
    const s = story.s;
    mesh.visible = s > 0.85;
    if (!mesh.visible) return;
    const t = clock.elapsedTime;
    data.forEach((d, idx) => {
      const delay = d.arc * 0.005;
      const prog = easeOutCubic(seg(s, 0.86 + delay, 0.96 + delay)) * PER;
      const on = Math.min(1, Math.max(0, prog - d.k));
      e.set(t * 2 + d.k, t * 1.5 + d.arc, 0);
      q.setFromEuler(e);
      const pulse = 0.8 + 0.35 * Math.sin(t * 6 - d.k * 0.6);
      sc.setScalar(Math.max(0.0001, on * pulse));
      m.compose(d.p, q, sc);
      mesh.setMatrixAt(idx, m);
    });
    mesh.instanceMatrix.needsUpdate = true;
  });

  return <instancedMesh ref={ref} args={[geo, mat, data.length]} frustumCulled={false} />;
}

/* ──────────────────────────────── Skill card ─────────────────────────────── */

export const CARD_POS = new THREE.Vector3(2.55, 1.95, 2.3);

const crisp = (t: THREE.Texture) => {
  t.magFilter = THREE.NearestFilter;
  return t;
};

export function SkillCard() {
  const root = useRef<THREE.Group>(null);
  const id = useRef<THREE.Mesh>(null);
  const qr = useRef<THREE.Mesh>(null);
  const badge = useRef<THREE.Mesh>(null);
  const tex = useMemo(() => ({ base: cardBaseTexture(), id: cardIdTexture(), qr: crisp(qrTexture()), badge: badgeTexture() }), []);
  const frame = useMemo(() => {
    // chunky voxel frame around the card
    const out: Vox[] = [];
    const W = 20;
    const H = 13;
    for (let x = 0; x < W; x++)
      for (let y = 0; y < H; y++) if (x === 0 || y === 0 || x === W - 1 || y === H - 1) out.push({ x: x - (W - 1) / 2, y: y - (H - 1) / 2, z: 0, c: (x + y) % 2 ? MARIGOLD : '#ffbd4d' });
    return out;
  }, []);

  useFrame(({ clock }) => {
    const s = story.s;
    const t = clock.elapsedTime;
    const inT = easeOutBack(seg(s, 0.26, 0.34));
    const outT = smooth(seg(s, 0.5, 0.56));
    const g = root.current;
    if (!g) return;
    g.visible = inT > 0.001 && outT < 0.999;
    g.scale.setScalar(Math.max(0.0001, inT * (1 - outT)));
    const spin = smooth(seg(s, 0.43, 0.5)) * Math.PI * 2;
    g.rotation.set(Math.sin(t * 0.6) * 0.06 - 0.05 + story.py * 0.08, -0.38 + spin + Math.sin(t * 0.5) * 0.08 + story.px * 0.15, 0.02);
    g.position.set(CARD_POS.x, CARD_POS.y + Math.sin(t * 1.2) * 0.05, CARD_POS.z);

    const p1 = easeOutCubic(seg(s, 0.3, 0.355));
    const p2 = easeOutCubic(seg(s, 0.33, 0.385));
    const p3 = easeOutBack(seg(s, 0.355, 0.4));
    if (id.current) {
      id.current.position.set(-0.18 - (1 - p1) * 1.4, 0.2, 0.05 + (1 - p1) * 0.6);
      (id.current.material as THREE.MeshBasicMaterial).opacity = p1;
    }
    if (qr.current) {
      qr.current.position.set(0.56 + (1 - p2) * 1.2, -0.2, 0.05 + (1 - p2) * 0.8);
      qr.current.rotation.z = (1 - p2) * 1.2;
      (qr.current.material as THREE.MeshBasicMaterial).opacity = p2;
    }
    if (badge.current) {
      badge.current.position.set(-0.36, -0.24, 0.055);
      badge.current.scale.setScalar(Math.max(0.0001, p3));
    }
  });

  return (
    <group ref={root}>
      <mesh castShadow>
        <boxGeometry args={[1.9, 1.2, 0.08]} />
        <meshStandardMaterial color="#14163a" roughness={0.6} flatShading />
      </mesh>
      <group position={[0, 0, 0.02]}>
        <VoxelModel voxels={frame} size={0.098} emissive={1.25} shadows={false} />
      </group>
      <mesh position={[0, 0, 0.045]}>
        <planeGeometry args={[1.7, 1.02]} />
        <meshBasicMaterial map={tex.base} toneMapped={false} transparent />
      </mesh>
      <mesh ref={id}>
        <planeGeometry args={[1.42, 0.555]} />
        <meshBasicMaterial map={tex.id} toneMapped={false} transparent />
      </mesh>
      <mesh ref={qr}>
        <planeGeometry args={[0.46, 0.46]} />
        <meshBasicMaterial map={tex.qr} toneMapped={false} transparent />
      </mesh>
      <mesh ref={badge}>
        <planeGeometry args={[0.8, 0.2]} />
        <meshBasicMaterial map={tex.badge} toneMapped={false} transparent />
      </mesh>
    </group>
  );
}

/* ───────────────────── Trust: scam pin breaks, shield forms ──────────────── */

export const SHIELD_POS = new THREE.Vector3(-3.4, 2.3, 2.7);

const SHIELD_ROWS = [
  '.LLLLLLLLLLL.',
  'LTTTTTTTTTTTL',
  'LTtTTTTTTTTTL',
  'LTtTTTTTTTWTL',
  'LTtTTTTTTWWTL',
  'LTTTTTTTWWTTL',
  'LTWTTTTWWTTTL',
  'LTWWTTWWTTTTL',
  'LTTWWWWTTTTTL',
  '.LTTWWTTTTTL.',
  '.LTTTTTTTTTL.',
  '..LTTTTTTTL..',
  '...LTTTTTL...',
  '....LTTTL....',
  '.....LLL.....',
];
const BAD_PIN = ['..RRR..', '.RRWRR.', 'RRRWRRR', 'RRRWRRR', 'RRRRRRR', '.RRWRR.', '..RRR..', '...R...', '...R...'];
const COIN = ['.YYYY.', 'YYyyYY', 'YyYYyY', 'YyYYyY', 'YYyyYY', '.YYYY.'];

export function Trust() {
  const pin = useRef<THREE.Group>(null);
  const shards = useRef<THREE.InstancedMesh>(null);
  const shield = useRef<THREE.Group>(null);
  const coins = useRef<THREE.Group>(null);
  const warn = useMemo(() => warnTexture('₹3,000/day!', 'Pay ₹500 fee first'), []);
  const vox = useMemo(
    () => ({
      shield: spriteVoxels(SHIELD_ROWS, { L: '#5eead4', T: '#0f9f8e', t: '#38d6c2', W: '#ffffff' }, 2),
      bad: spriteVoxels(BAD_PIN, { R: '#ff3b4e', W: '#fff2f2' }, 2),
      coin: spriteVoxels(COIN, { Y: '#ffc24a', y: '#e09a1f' }, 1),
    }),
    [],
  );
  const parts = useMemo(() => {
    const r = rng(5);
    return Array.from({ length: 36 }, () => ({
      v: new THREE.Vector3(r() - 0.5, r() * 0.9 + 0.3, r() - 0.5).normalize().multiplyScalar(1.2 + r() * 2),
      s: 0.06 + r() * 0.08,
      spin: new THREE.Vector3(r() * 8, r() * 8, r() * 8),
    }));
  }, []);
  const m = useMemo(() => new THREE.Matrix4(), []);
  const q = useMemo(() => new THREE.Quaternion(), []);
  const e = useMemo(() => new THREE.Euler(), []);
  const pv = useMemo(() => new THREE.Vector3(), []);
  const sv = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock }) => {
    const s = story.s;
    const t = clock.elapsedTime;
    const show = seg(s, 0.48, 0.53);
    const crack = seg(s, 0.555, 0.62);
    const gone = smooth(seg(s, 0.72, 0.78));

    if (pin.current) {
      pin.current.visible = show > 0.001 && crack < 0.02;
      const shake = seg(s, 0.52, 0.555);
      pin.current.position.set(SHIELD_POS.x + Math.sin(t * 40) * 0.05 * shake, SHIELD_POS.y + 0.4 + (1 - easeOutBack(show)) * 1.5, SHIELD_POS.z - 0.2);
      pin.current.scale.setScalar(Math.max(0.0001, easeOutBack(show)));
      pin.current.rotation.y = Math.sin(t * 1.5) * 0.4;
    }
    // Minecraft block-break particles
    const sh = shards.current;
    if (sh) {
      sh.visible = crack > 0.001 && crack < 0.999;
      if (sh.visible) {
        parts.forEach((p, i) => {
          pv.set(SHIELD_POS.x + p.v.x * crack, SHIELD_POS.y + 0.9 + p.v.y * crack - crack * crack * 2.4, SHIELD_POS.z - 0.2 + p.v.z * crack);
          e.set(p.spin.x * crack, p.spin.y * crack, p.spin.z * crack);
          q.setFromEuler(e);
          sv.setScalar(Math.max(0.0001, p.s * (1 - crack)));
          m.compose(pv, q, sv);
          sh.setMatrixAt(i, m);
        });
        sh.instanceMatrix.needsUpdate = true;
      }
    }
    if (shield.current) {
      const grow = easeOutBack(seg(s, 0.57, 0.64));
      const sc = Math.max(0.0001, grow * (1 - gone));
      shield.current.visible = sc > 0.002;
      shield.current.scale.setScalar(sc);
      shield.current.rotation.set(story.py * 0.15, Math.sin(t * 0.8) * 0.35 + story.px * 0.3 + (1 - grow) * 3, 0);
      shield.current.position.set(SHIELD_POS.x, SHIELD_POS.y + 0.25 + Math.sin(t * 1.3) * 0.06, SHIELD_POS.z);
    }
    if (coins.current) {
      coins.current.children.forEach((c, i) => {
        const k = Math.max(0.0001, easeOutBack(seg(s, 0.6 + i * 0.008, 0.64 + i * 0.008)) * (1 - gone));
        c.visible = k > 0.002;
        c.scale.setScalar(k);
        c.position.set((i % 2) * 0.05, 0.2 + i * 0.11 + (1 - k) * 1.4, 0);
        c.rotation.y = t * 1.6 + i;
      });
    }
  });

  return (
    <group>
      <group ref={pin}>
        <group position={[0, 0.5, 0]}>
          <VoxelModel voxels={vox.bad} size={0.13} emissive={1.6} shadows={false} />
        </group>
        <sprite position={[0, 1.55, 0]} scale={[2.4, 0.83, 1]}>
          <spriteMaterial map={warn} toneMapped={false} depthWrite={false} />
        </sprite>
      </group>
      <instancedMesh ref={shards} args={[undefined, undefined, parts.length]} frustumCulled={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color={[2.6, 0.4, 0.5]} toneMapped={false} />
      </instancedMesh>
      <group ref={shield}>
        <VoxelModel voxels={vox.shield} size={0.095} />
      </group>
      <group ref={coins} position={[SHIELD_POS.x + 1.15, 0, SHIELD_POS.z + 0.15]}>
        {Array.from({ length: 5 }).map((_, i) => (
          <group key={i} rotation-x={Math.PI / 2}>
            <VoxelModel voxels={vox.coin} size={0.07} />
          </group>
        ))}
      </group>
    </group>
  );
}

/* ──────────── Rights: a government office builds itself, block by block ───── */

export const GOV_POS = new THREE.Vector3(7.6, 0.16, -2.8);
const B = 0.3;

const GOV_BLOCKS: Vox[] = (() => {
  const out: Vox[] = [];
  const add = (x: number, y: number, z: number, c: string) => out.push({ x, y, z, c });
  const STONE = '#d9d1bf';
  const STONE2 = '#c8bfab';
  const QUARTZ = '#f4efe4';
  const ROOF = '#5240e3';
  const ROOF2 = '#4533c8';
  for (let x = 0; x < 15; x++) for (let z = 0; z < 8; z++) add(x, 0, z, (x + z) % 3 ? STONE : STONE2);
  for (let x = 4; x < 11; x++) add(x, 0, 8, STONE2);
  for (let x = 0; x < 15; x++)
    for (let y = 1; y < 7; y++)
      for (let z = 0; z < 2; z++) {
        const door = x >= 6 && x <= 8 && y <= 4 && z === 1;
        add(x, y, z, door ? '#ffb347' : (x + y) % 4 ? STONE : STONE2);
      }
  for (const x of [1, 4, 10, 13]) for (let y = 1; y < 7; y++) add(x, y, 6, QUARTZ);
  for (let x = 0; x < 15; x++) for (let z = 0; z < 8; z++) add(x, 7, z, z === 7 ? STONE2 : QUARTZ);
  [[1, 13], [3, 11], [5, 9], [7, 7]].forEach(([a, b], k) => {
    for (let x = a; x <= b; x++) for (let z = 0; z < 8; z++) add(x, 8 + k, z, (x + z) % 2 ? ROOF : ROOF2);
  });
  // flag pole and tricolour
  for (let y = 12; y < 17; y++) add(7, y, 3, '#cfcfd6');
  const flag = ['#ff9933', '#ff9933', '#ffffff', '#ffffff', '#138808', '#138808'];
  flag.forEach((c, i) => {
    for (let x = 8; x < 12; x++) add(x, 16 - Math.floor(i / 2), 3, i === 2 && x === 9 ? '#1d2c8f' : c);
  });
  return out;
})();

export function GovOffice() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const done = useRef(-1);
  const order = useMemo(() => {
    // build bottom-up, rippling out from the door
    return GOV_BLOCKS.map((b, i) => ({ i, k: b.y * 10 + Math.abs(b.x - 7) * 0.6 + (8 - b.z) * 0.15 }))
      .sort((a, b) => a.k - b.k)
      .reduce<number[]>((acc, o, rank) => {
        acc[o.i] = rank / GOV_BLOCKS.length;
        return acc;
      }, []);
  }, []);
  const geo = useMemo(() => new THREE.BoxGeometry(B * 0.98, B * 0.98, B * 0.98), []);
  const mat = useMemo(() => new THREE.MeshStandardMaterial({ roughness: 0.9, flatShading: true }), []);
  const glow = useMemo(() => new THREE.Color(), []);
  const m = useMemo(() => new THREE.Matrix4(), []);
  const q = useMemo(() => new THREE.Quaternion(), []);
  const pv = useMemo(() => new THREE.Vector3(), []);
  const sv = useMemo(() => new THREE.Vector3(), []);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    GOV_BLOCKS.forEach((b, i) => {
      glow.set(b.c);
      if (b.c === '#ffb347') glow.multiplyScalar(2.2);
      mesh.setColorAt(i, glow);
    });
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [glow]);

  useFrame(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const build = seg(story.s, 0.64, 0.79);
    mesh.visible = build > 0;
    // skip the matrix work once settled (or not started)
    const key = build <= 0 ? 0 : build >= 1 ? 2 : 1;
    if (key !== 1 && done.current === key) return;
    done.current = key;
    GOV_BLOCKS.forEach((b, i) => {
      const t = easeOutCubic(Math.min(1, Math.max(0, (build - order[i] * 0.8) / 0.2)));
      pv.set((b.x - 7) * B, b.y * B + B / 2 + (1 - t) * 3, (b.z - 4) * B);
      sv.setScalar(Math.max(0.0001, t));
      m.compose(pv, q, sv);
      mesh.setMatrixAt(i, m);
    });
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <group position={GOV_POS} rotation-y={-0.45}>
      <instancedMesh ref={ref} args={[geo, mat, GOV_BLOCKS.length]} castShadow receiveShadow frustumCulled={false} />
      <pointLight position={[0, 1, 1.6]} color="#ffb347" intensity={6} distance={5} decay={2} />
      <Floaters />
    </group>
  );
}

/* papers, a free helpline and an official stamp float out of the door */
const DOC = ['WWWWWW', 'WbbbbW', 'WWWWWW', 'WggggW', 'WggWWW', 'WggggW', 'WWWWrW', 'WWWWWW'];
const PHONE = ['KKKKK', 'KTTTK', 'KTWTK', 'KTTTK', 'KTTTK', 'KKGKK'];
const STAMP = ['.BBB.', '..B..', '.BBB.', 'RRRRR'];

function Floaters() {
  const g = useRef<THREE.Group>(null);
  const v = useMemo(
    () => [
      spriteVoxels(DOC, { W: '#fbf7ee', b: '#5240e3', g: '#b9b2a3', r: '#e5384a' }, 1),
      spriteVoxels(PHONE, { K: '#14162a', T: '#14b8a6', W: '#ffffff', G: '#8a8ca0' }, 1),
      spriteVoxels(STAMP, { B: '#8a5a2b', R: '#e5384a' }, 2),
      spriteVoxels(DOC, { W: '#fbf7ee', b: '#e09a1f', g: '#b9b2a3', r: '#1aa58a' }, 1),
    ],
    [],
  );
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const grp = g.current;
    if (!grp) return;
    const out = easeOutBack(seg(story.s, 0.75, 0.82));
    grp.visible = out > 0.001;
    grp.children.forEach((c, i) => {
      const a = t * 0.4 + (i / grp.children.length) * Math.PI * 2;
      const r = 2.6 * out;
      c.position.set(Math.cos(a) * r, 2.6 + out * 1.2 + Math.sin(t * 1.1 + i) * 0.2, Math.sin(a) * r * 0.6 + 1.4);
      c.rotation.y = -a + Math.PI / 2;
      c.scale.setScalar(Math.max(0.0001, out));
    });
  });
  return (
    <group ref={g}>
      {v.map((vox, i) => (
        <group key={i}>
          <VoxelModel voxels={vox} size={0.09} shadows={false} />
        </group>
      ))}
    </group>
  );
}

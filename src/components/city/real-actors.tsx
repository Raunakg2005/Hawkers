'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { clone as cloneSkinned } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { easeOutBack, easeOutCubic, rng, seg, smooth, story } from './story';
import type { Building } from './real-world';
import { badgeTexture, cardBaseTexture, cardIdTexture, pillTexture, qrTexture, warnTexture } from './textures';

const MARIGOLD = new THREE.Color('#ffa41f');

/* ════════════════════════════════════════════════════════════════════════════
 * People: rigged, motion-captured characters from the three.js examples
 * (Mixamo). Each is an independent clone with its own animation mixer.
 * ════════════════════════════════════════════════════════════════════════════ */

export const WORKER_Z = 1.25;

type Cast = { x: number; model: 'soldier' | 'michelle'; turn: number; delay: number; walkTo?: [number, number] };

export const CAST: Cast[] = [
  { x: -5.2, model: 'soldier', turn: 0.15, delay: 0.0, walkTo: [-7, -6] },
  { x: -3, model: 'michelle', turn: -0.1, delay: 0.3 },
  { x: -0.9, model: 'soldier', turn: -0.25, delay: 0.7, walkTo: [-2, -7] },
  { x: 1.2, model: 'soldier', turn: 0.3, delay: 1.1, walkTo: [3, -7] },
  { x: 3.3, model: 'michelle', turn: 0.2, delay: 1.6 },
  { x: 5.4, model: 'soldier', turn: -0.2, delay: 2.1, walkTo: [7, -6] },
];

function Person({ c, src }: { c: Cast; src: { scene: THREE.Group; animations: THREE.AnimationClip[] } }) {
  const root = useRef<THREE.Group>(null);
  const { model, mixer, actions } = useMemo(() => {
    const m = cloneSkinned(src.scene) as THREE.Group;
    m.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.frustumCulled = false;
        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (mat) mat.envMapIntensity = 1.2;
      }
    });
    const mx = new THREE.AnimationMixer(m);
    const acts: Record<string, THREE.AnimationAction> = {};
    src.animations.forEach((clip) => {
      acts[clip.name] = mx.clipAction(clip);
    });
    return { model: m, mixer: mx, actions: acts };
  }, [src]);

  const mode = useRef<'idle' | 'walk' | 'dance'>('idle');

  useEffect(() => {
    if (c.model === 'soldier') {
      const idle = actions.Idle;
      idle.play();
      idle.time = c.delay;
      if (actions.Walk) {
        actions.Walk.play();
        actions.Walk.setEffectiveWeight(0);
      }
    } else {
      // Michelle only has a dance: hold its opening beat as a relaxed stand,
      // let it play for real when the sun is up
      const d = actions.SambaDance;
      d.play();
      d.time = 0.25 + c.delay * 0.1;
      d.timeScale = 0;
    }
    return () => {
      mixer.stopAllAction();
    };
  }, [actions, c, mixer]);

  useFrame((_, dt) => {
    const s = story.s;
    const g = root.current;
    if (!g) return;
    mixer.update(Math.min(dt, 0.05));

    const go = smooth(seg(s, 0.9, 0.99));
    if (c.model === 'soldier' && c.walkTo && actions.Walk) {
      // at sunrise the men head off to work
      const walking = go > 0.001 && go < 0.999;
      const w = walking ? 1 : 0;
      actions.Walk.setEffectiveWeight(THREE.MathUtils.lerp(actions.Walk.getEffectiveWeight(), w, 0.12));
      actions.Idle.setEffectiveWeight(1 - actions.Walk.getEffectiveWeight());
      const tx = THREE.MathUtils.lerp(c.x, c.walkTo[0], go);
      const tz = THREE.MathUtils.lerp(WORKER_Z, c.walkTo[1], go);
      g.position.set(tx, 0.16, tz);
      const face = go > 0.001 ? Math.atan2(c.walkTo[0] - c.x, c.walkTo[1] - WORKER_Z) + Math.PI : c.turn;
      g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, face, 0.08);
      mode.current = walking ? 'walk' : 'idle';
    } else if (c.model === 'michelle') {
      const dance = s > 0.9;
      actions.SambaDance.timeScale = THREE.MathUtils.lerp(actions.SambaDance.timeScale, dance ? 1 : 0, 0.06);
      g.position.set(c.x, 0.16, WORKER_Z);
      g.rotation.y = c.turn;
    } else {
      g.position.set(c.x, 0.16, WORKER_Z);
      g.rotation.y = c.turn;
    }
  });

  return (
    <group ref={root} position={[c.x, 0.16, WORKER_Z]} rotation-y={c.turn}>
      {/* the rigs face -Z; turn them toward the street */}
      <primitive object={model} rotation-y={Math.PI} />
    </group>
  );
}

export function People() {
  const soldier = useLoader(GLTFLoader, '/3d/Soldier.glb');
  const michelle = useLoader(GLTFLoader, '/3d/Michelle.glb');
  return (
    <>
      {CAST.map((c, i) => (
        <Person key={i} c={c} src={c.model === 'soldier' ? soldier : michelle} />
      ))}
      <Halos />
    </>
  );
}

/** a soft ring of light above every head: "seen" */
function Halos() {
  const g = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const s = story.s;
    const seen = smooth(seg(s, 0.07, 0.17)) * (1 - smooth(seg(s, 0.3, 0.36)));
    const grp = g.current;
    if (!grp) return;
    grp.visible = seen > 0.01;
    grp.children.forEach((c, i) => {
      c.scale.setScalar(Math.max(0.0001, seen) * (1 + Math.sin(clock.elapsedTime * 3 + i) * 0.05));
      c.position.y = 2.3 + Math.sin(clock.elapsedTime * 2 + i) * 0.05;
    });
  });
  return (
    <group ref={g}>
      {CAST.map((c, i) => (
        <mesh key={i} position={[c.x, 2.3, WORKER_Z]} rotation-x={Math.PI / 2}>
          <torusGeometry args={[0.22, 0.018, 12, 48]} />
          <meshBasicMaterial color={[3, 1.8, 0.5]} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

/* ─────────────────────────── Job pins + arcs ─────────────────────────────── */

const PRICES = ['₹900 / day', '₹750 / day', '₹1,100 / day', '₹18k / month', '₹850 / day', '₹4,500 job', '₹1,000 / day', '₹680 / day', '₹950 / day', '₹22k / month', '₹800 / day', '₹1,250 / day', '₹700 / day', '₹6,000 job'];

export type Pin = { pos: THREE.Vector3; price: string };

export function usePins(buildings: Building[]) {
  return useMemo(() => {
    const r = rng(99);
    const near = buildings
      .filter((b) => b.z > -40 && Math.abs(b.x) < 40)
      .sort(() => r() - 0.5)
      .slice(0, PRICES.length);
    return near.map((b, i) => ({ pos: new THREE.Vector3(b.x, b.h + 1.4, b.z), price: PRICES[i] }));
  }, [buildings]);
}

function JobPin({ pin, i, n }: { pin: Pin; i: number; n: number }) {
  const g = useRef<THREE.Group>(null);
  const tex = useMemo(() => pillTexture(pin.price, '#ffa41f', '#1a1206'), [pin.price]);
  useFrame(({ clock }) => {
    if (!g.current) return;
    const delay = (i / n) * 0.08;
    const t = easeOutBack(seg(story.s, 0.1 + delay, 0.17 + delay));
    g.current.visible = t > 0.001;
    g.current.scale.setScalar(Math.max(t, 0.0001) * 1.6);
    g.current.position.set(pin.pos.x, pin.pos.y + (1 - t) * -3 + Math.sin(clock.elapsedTime * 1.4 + i) * 0.2, pin.pos.z);
    g.current.rotation.y = Math.sin(clock.elapsedTime * 0.8 + i) * 0.4;
  });
  return (
    <group ref={g}>
      <mesh position={[0, 0.55, 0]}>
        <sphereGeometry args={[0.32, 32, 24]} />
        <meshPhysicalMaterial color="#ffa41f" emissive="#ff8a00" emissiveIntensity={1.4} roughness={0.15} clearcoat={1} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.1, 0]} rotation-x={Math.PI}>
        <coneGeometry args={[0.24, 0.6, 32]} />
        <meshPhysicalMaterial color="#ffa41f" emissive="#ff8a00" emissiveIntensity={1.1} roughness={0.15} clearcoat={1} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.55, 0.3]}>
        <sphereGeometry args={[0.1, 16, 12]} />
        <meshStandardMaterial color="#fff6dd" emissive="#fff6dd" emissiveIntensity={1.5} toneMapped={false} />
      </mesh>
      <sprite position={[0, 1.5, 0]} scale={[3.2, 1, 1]}>
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

export function Arcs({ pins }: { pins: Pin[] }) {
  const arcs = useMemo(() => {
    const out: { geo: THREE.TubeGeometry; delay: number }[] = [];
    CAST.forEach((w, i) => {
      for (let k = 0; k < 2; k++) {
        const pin = pins[(i * 2 + k) % pins.length];
        const a = new THREE.Vector3(w.x, 2.3, WORKER_Z);
        const b = pin.pos.clone().add(new THREE.Vector3(0, 1, 0));
        const mid = a.clone().lerp(b, 0.5);
        mid.y += a.distanceTo(b) * 0.35 + 4;
        const geo = new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(a, mid, b), 96, 0.05, 8, false);
        geo.setDrawRange(0, 0);
        out.push({ geo, delay: (i * 2 + k) * 0.005 });
      }
    });
    return out;
  }, [pins]);
  useFrame(() => {
    arcs.forEach((a) => {
      const t = easeOutCubic(seg(story.s, 0.86 + a.delay, 0.96 + a.delay));
      a.geo.setDrawRange(0, Math.floor((a.geo.index!.count * t) / 6) * 6);
    });
  });
  return (
    <>
      {arcs.map((a, i) => (
        <mesh key={i} geometry={a.geo} frustumCulled={false}>
          <meshBasicMaterial color={[3.2, 1.7, 0.35]} toneMapped={false} />
        </mesh>
      ))}
    </>
  );
}

/* ──────────────────────────── Skill card (glass) ─────────────────────────── */

export const CARD_POS = new THREE.Vector3(2.7, 1.75, 2.4);

export function SkillCard() {
  const root = useRef<THREE.Group>(null);
  const id = useRef<THREE.Mesh>(null);
  const qr = useRef<THREE.Mesh>(null);
  const badge = useRef<THREE.Mesh>(null);
  const tex = useMemo(() => ({ base: cardBaseTexture(), id: cardIdTexture(), qr: qrTexture(), badge: badgeTexture() }), []);

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
    g.rotation.set(Math.sin(t * 0.6) * 0.05 - 0.05 + story.py * 0.08, -0.38 + spin + Math.sin(t * 0.5) * 0.08 + story.px * 0.15, 0.02);
    g.position.set(CARD_POS.x, CARD_POS.y + Math.sin(t * 1.2) * 0.04, CARD_POS.z);
    const p1 = easeOutCubic(seg(s, 0.3, 0.355));
    const p2 = easeOutCubic(seg(s, 0.33, 0.385));
    const p3 = easeOutBack(seg(s, 0.355, 0.4));
    if (id.current) {
      id.current.position.set(-0.18 - (1 - p1) * 1.4, 0.2, 0.04 + (1 - p1) * 0.6);
      (id.current.material as THREE.MeshBasicMaterial).opacity = p1;
    }
    if (qr.current) {
      qr.current.position.set(0.56 + (1 - p2) * 1.2, -0.2, 0.04 + (1 - p2) * 0.8);
      qr.current.rotation.z = (1 - p2) * 1.2;
      (qr.current.material as THREE.MeshBasicMaterial).opacity = p2;
    }
    if (badge.current) {
      badge.current.position.set(-0.36, -0.24, 0.045);
      badge.current.scale.setScalar(Math.max(0.0001, p3));
    }
  });

  return (
    <group ref={root}>
      <RoundedBox args={[1.9, 1.2, 0.06]} radius={0.05} smoothness={6} castShadow>
        <meshPhysicalMaterial color="#1a1c40" roughness={0.12} metalness={0.2} clearcoat={1} clearcoatRoughness={0.05} iridescence={0.4} />
      </RoundedBox>
      <mesh position={[0, 0, 0.032]}>
        <planeGeometry args={[1.86, 1.16]} />
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

/* ──────────────── Trust: the scam pin shatters, a steel shield forms ─────── */

export const SHIELD_POS = new THREE.Vector3(-3.2, 2.4, 2.8);

function shieldGeometry() {
  const s = new THREE.Shape();
  s.moveTo(0, 0.78);
  s.quadraticCurveTo(0.38, 0.66, 0.64, 0.64);
  s.lineTo(0.62, 0.05);
  s.quadraticCurveTo(0.56, -0.48, 0, -0.84);
  s.quadraticCurveTo(-0.56, -0.48, -0.62, 0.05);
  s.lineTo(-0.64, 0.64);
  s.quadraticCurveTo(-0.38, 0.66, 0, 0.78);
  const g = new THREE.ExtrudeGeometry(s, { depth: 0.12, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.07, bevelSegments: 8, curveSegments: 48 });
  g.center();
  return g;
}

export function Trust() {
  const pin = useRef<THREE.Group>(null);
  const shards = useRef<THREE.InstancedMesh>(null);
  const shield = useRef<THREE.Group>(null);
  const coins = useRef<THREE.Group>(null);
  const geo = useMemo(() => shieldGeometry(), []);
  const warn = useMemo(() => warnTexture('₹3,000 / day!', 'Pay ₹500 fee first'), []);
  const parts = useMemo(() => {
    const r = rng(5);
    return Array.from({ length: 40 }, () => ({
      v: new THREE.Vector3(r() - 0.5, r() * 0.9 + 0.3, r() - 0.5).normalize().multiplyScalar(1.2 + r() * 2.2),
      s: 0.04 + r() * 0.08,
      spin: new THREE.Vector3(r() * 9, r() * 9, r() * 9),
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
    }
    const sh = shards.current;
    if (sh) {
      sh.visible = crack > 0.001 && crack < 0.999;
      if (sh.visible) {
        parts.forEach((p, i) => {
          pv.set(SHIELD_POS.x + p.v.x * crack, SHIELD_POS.y + 0.9 + p.v.y * crack - crack * crack * 2.6, SHIELD_POS.z - 0.2 + p.v.z * crack);
          e.set(p.spin.x * crack, p.spin.y * crack, p.spin.z * crack);
          q.setFromEuler(e);
          sv.setScalar(Math.max(0.0001, p.s * (1 - crack * 0.8)));
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
        c.position.y = 0.04 + i * 0.075 + (1 - k) * 1.4;
      });
    }
  });

  return (
    <group>
      <group ref={pin}>
        <mesh position={[0, 0.5, 0]}>
          <sphereGeometry args={[0.3, 32, 24]} />
          <meshPhysicalMaterial color="#e5384a" emissive="#ff2a3d" emissiveIntensity={1.4} roughness={0.15} clearcoat={1} toneMapped={false} />
        </mesh>
        <mesh position={[0, 0.06, 0]} rotation-x={Math.PI}>
          <coneGeometry args={[0.22, 0.56, 32]} />
          <meshPhysicalMaterial color="#e5384a" emissive="#ff2a3d" emissiveIntensity={1} roughness={0.15} clearcoat={1} toneMapped={false} />
        </mesh>
        <sprite position={[0, 1.38, 0]} scale={[2.4, 0.83, 1]}>
          <spriteMaterial map={warn} toneMapped={false} depthWrite={false} />
        </sprite>
      </group>
      {/* glass shards */}
      <instancedMesh ref={shards} args={[undefined, undefined, parts.length]} frustumCulled={false}>
        <tetrahedronGeometry args={[1, 0]} />
        <meshPhysicalMaterial color="#ff5a6a" emissive="#ff2a3d" emissiveIntensity={1.2} roughness={0.05} transmission={0.6} thickness={0.2} toneMapped={false} />
      </instancedMesh>
      <group ref={shield}>
        <mesh geometry={geo} castShadow>
          <meshPhysicalMaterial color="#0fb39e" metalness={0.85} roughness={0.22} clearcoat={1} clearcoatRoughness={0.06} envMapIntensity={1.6} />
        </mesh>
        <group position={[0.02, 0, 0.16]}>
          <mesh position={[-0.17, -0.05, 0]} rotation-z={-Math.PI / 4}>
            <capsuleGeometry args={[0.055, 0.22, 8, 16]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1.6} toneMapped={false} />
          </mesh>
          <mesh position={[0.1, 0.08, 0]} rotation-z={Math.PI / 5.2}>
            <capsuleGeometry args={[0.055, 0.46, 8, 16]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1.6} toneMapped={false} />
          </mesh>
        </group>
      </group>
      <group ref={coins} position={[SHIELD_POS.x + 1.15, 0.16, SHIELD_POS.z + 0.15]}>
        {Array.from({ length: 6 }).map((_, i) => (
          <mesh key={i} castShadow>
            <cylinderGeometry args={[0.26, 0.26, 0.07, 48]} />
            <meshStandardMaterial color="#ffc24a" metalness={1} roughness={0.2} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/* ─────────────── Rights: a government office rises like a pop-up ─────────── */

export const GOV_POS = new THREE.Vector3(7.8, 0.16, -2.9);

function Hinge({ at, order, children }: { at: [number, number, number]; order: number; children: React.ReactNode }) {
  const g = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!g.current) return;
    const t = easeOutBack(seg(story.s, 0.66 + order * 0.012, 0.73 + order * 0.012));
    g.current.rotation.x = -(1 - t) * (Math.PI / 2);
    g.current.visible = t > 0.001;
  });
  return (
    <group ref={g} position={at}>
      {children}
    </group>
  );
}

export function GovOffice() {
  const ped = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-1.9, 0);
    s.lineTo(1.9, 0);
    s.lineTo(0, 0.75);
    s.closePath();
    const g = new THREE.ExtrudeGeometry(s, { depth: 1.6, bevelEnabled: false });
    g.translate(0, 0, -0.8);
    return g;
  }, []);
  const stone = useMemo(() => new THREE.MeshStandardMaterial({ color: '#b9b2a6', roughness: 0.8 }), []);
  const flag = useRef<THREE.Mesh>(null);
  const flagGeo = useMemo(() => new THREE.PlaneGeometry(1.2, 0.8, 24, 12).translate(0.6, 0, 0), []);
  const flagBase = useMemo(() => Float32Array.from(flagGeo.attributes.position.array), [flagGeo]);
  const flagTex = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 300;
    c.height = 200;
    const x = c.getContext('2d')!;
    x.fillStyle = '#ff9933';
    x.fillRect(0, 0, 300, 67);
    x.fillStyle = '#ffffff';
    x.fillRect(0, 67, 300, 66);
    x.fillStyle = '#138808';
    x.fillRect(0, 133, 300, 67);
    x.strokeStyle = '#000080';
    x.lineWidth = 3;
    x.beginPath();
    x.arc(150, 100, 26, 0, Math.PI * 2);
    x.stroke();
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * Math.PI * 2;
      x.beginPath();
      x.moveTo(150, 100);
      x.lineTo(150 + Math.cos(a) * 26, 100 + Math.sin(a) * 26);
      x.stroke();
    }
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);

  useFrame(({ clock }) => {
    // flag ripples in the morning breeze
    const pos = flagGeo.attributes.position as THREE.BufferAttribute;
    const t = clock.elapsedTime;
    for (let i = 0; i < pos.count; i++) {
      const x = flagBase[i * 3];
      pos.setZ(i, Math.sin(x * 4 - t * 4) * 0.08 * x);
    }
    pos.needsUpdate = true;
    flagGeo.computeVertexNormals();
    if (flag.current) flag.current.visible = story.s > 0.72;
  });

  return (
    <group position={GOV_POS} rotation-y={-0.45}>
      <Hinge at={[0, 0, 0.9]} order={0}>
        <mesh position={[0, 0.15, -0.9]} material={stone} castShadow receiveShadow>
          <boxGeometry args={[4.2, 0.3, 2.4]} />
        </mesh>
        <mesh position={[0, 0.07, 0.42]} material={stone} castShadow receiveShadow>
          <boxGeometry args={[2.6, 0.14, 0.5]} />
        </mesh>
      </Hinge>
      <Hinge at={[0, 0.3, -0.8]} order={1}>
        <mesh position={[0, 1.15, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.6, 2.3, 0.3]} />
          <meshStandardMaterial color="#d6cdbb" roughness={0.85} />
        </mesh>
        <mesh position={[0, 0.8, 0.16]}>
          <planeGeometry args={[0.9, 1.6]} />
          <meshStandardMaterial color="#ffd7a0" emissive="#ffb35a" emissiveIntensity={2.2} toneMapped={false} />
        </mesh>
        {[-1.1, 1.1].map((x) => (
          <mesh key={x} position={[x, 1.3, 0.16]}>
            <planeGeometry args={[0.6, 0.8]} />
            <meshStandardMaterial color="#ffe0b0" emissive="#ffb35a" emissiveIntensity={1.2} toneMapped={false} />
          </mesh>
        ))}
      </Hinge>
      {[-1.5, -0.5, 0.5, 1.5].map((x, i) => (
        <Hinge key={x} at={[x, 0.3, 0.25]} order={2 + i}>
          <mesh position={[0, 1.15, 0]} material={stone} castShadow>
            <cylinderGeometry args={[0.14, 0.17, 2.3, 32]} />
          </mesh>
        </Hinge>
      ))}
      <Hinge at={[0, 2.6, -0.3]} order={6}>
        <mesh position={[0, 0.12, 0]} material={stone} castShadow>
          <boxGeometry args={[3.9, 0.24, 1.7]} />
        </mesh>
        <mesh geometry={ped} position={[0, 0.24, 0]} material={stone} castShadow />
        <mesh position={[0, 0.85, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 1.8, 10]} />
          <meshStandardMaterial color="#c9c9d0" metalness={1} roughness={0.25} />
        </mesh>
        <mesh ref={flag} geometry={flagGeo} position={[0.02, 1.45, 0]}>
          <meshStandardMaterial map={flagTex} side={THREE.DoubleSide} roughness={0.8} />
        </mesh>
      </Hinge>
      <pointLight position={[0, 1, 1.4]} color="#ffb35a" intensity={3} distance={5} decay={2} />
    </group>
  );
}

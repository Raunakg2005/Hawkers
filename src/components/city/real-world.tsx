'use client';

import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { rng, seg, smooth, story } from './story';

/* ════════════════════════════════════════════════════════════════════════════
 * Photoreal set: a real dawn sky (Poly Haven HDRI, CC0) lights everything, and
 * the street and buildings use scanned PBR materials (Poly Haven, CC0).
 * The story runs from night (sky dimmed, windows lit) to sunrise.
 * ════════════════════════════════════════════════════════════════════════════ */

const TEX = '/3d/tex/';

/** shared light state the other parts read */
export const light = {
  day: 0,
  sunCol: new THREE.Color(),
  fog: new THREE.Color(),
};

const NIGHT_FOG = new THREE.Color('#0d1024');
const DAWN_FOG = new THREE.Color('#5b4a63');
const SUN_FOG = new THREE.Color('#c99a82');

export function Sky() {
  const { scene, gl } = useThree();
  const hdr = useLoader(RGBELoader, '/3d/spruit_sunrise_1k.hdr');
  const sun = useRef<THREE.DirectionalLight>(null);
  const moon = useRef<THREE.DirectionalLight>(null);

  useLayoutEffect(() => {
    hdr.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = hdr;
    scene.background = hdr;
    scene.backgroundBlurriness = 0.02;
    scene.fog = new THREE.FogExp2(NIGHT_FOG.getHex(), 0.018);
    gl.toneMappingExposure = 1;
    return () => {
      scene.environment = null;
      scene.background = null;
      scene.fog = null;
    };
  }, [hdr, scene, gl]);

  useFrame(() => {
    const p = story.s;
    // night → dawn → sunrise
    const day = smooth(seg(p, 0.05, 1));
    light.day = day;
    scene.environmentIntensity = THREE.MathUtils.lerp(0.12, 1.05, day);
    scene.backgroundIntensity = THREE.MathUtils.lerp(0.06, 1, Math.pow(day, 0.8));
    // a cool tint at night through the background rotation of colour via fog
    const f = scene.fog as THREE.FogExp2;
    if (p < 0.6) light.fog.copy(NIGHT_FOG).lerp(DAWN_FOG, smooth(seg(p, 0.1, 0.6)));
    else light.fog.copy(DAWN_FOG).lerp(SUN_FOG, smooth(seg(p, 0.6, 1)));
    f.color.copy(light.fog);
    // open the view up when the city is revealed, keep the street intimate otherwise
    f.density = THREE.MathUtils.lerp(0.02, 0.008, smooth(seg(p, 0.08, 0.22))) * (p > 0.9 ? 0.7 : 1);

    light.sunCol.set('#ffcf9a').lerp(new THREE.Color('#ffe7c4'), day);
    if (sun.current) {
      sun.current.intensity = THREE.MathUtils.lerp(0, 3.2, smooth(seg(p, 0.45, 1)));
      sun.current.color.copy(light.sunCol);
      // the HDRI sun sits low on the horizon; match its direction
      sun.current.position.set(-30, THREE.MathUtils.lerp(4, 14, day), -60);
    }
    if (moon.current) moon.current.intensity = THREE.MathUtils.lerp(0.55, 0, smooth(seg(p, 0.3, 0.8)));
  });

  return (
    <>
      <directionalLight
        ref={sun}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-18}
        shadow-camera-right={18}
        shadow-camera-top={14}
        shadow-camera-bottom={-8}
        shadow-camera-near={1}
        shadow-camera-far={140}
        shadow-bias={-0.0004}
        shadow-normalBias={0.03}
      />
      {/* cool moonlight so the night scene still reads */}
      <directionalLight ref={moon} position={[10, 20, 18]} color="#8fa0ff" />
    </>
  );
}

/* ─────────────────────────────── PBR materials ───────────────────────────── */

function usePbr(name: string, repeat: [number, number]) {
  const [map, normalMap, roughnessMap] = useLoader(THREE.TextureLoader, [`${TEX}${name}_diff.jpg`, `${TEX}${name}_nor.jpg`, `${TEX}${name}_rough.jpg`]);
  const gl = useThree((s) => s.gl);
  return useMemo(() => {
    const aniso = Math.min(8, gl.capabilities.getMaxAnisotropy());
    const set = (t: THREE.Texture, srgb: boolean) => {
      const c = t.clone();
      c.wrapS = c.wrapT = THREE.RepeatWrapping;
      c.repeat.set(repeat[0], repeat[1]);
      c.anisotropy = aniso;
      c.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
      c.needsUpdate = true;
      return c;
    };
    return new THREE.MeshStandardMaterial({
      map: set(map, true),
      normalMap: set(normalMap, false),
      roughnessMap: set(roughnessMap, false),
      roughness: 1,
    });
  }, [map, normalMap, roughnessMap, repeat, gl]);
}

export function Street() {
  const asphalt = usePbr('asphalt_02', [60, 2]);
  const cobble = usePbr('cobblestone_floor_08', [12, 1.3]);
  const ground = usePbr('concrete_wall_008', [40, 30]);
  const kerb = usePbr('concrete_wall_008', [30, 0.3]);
  // a wet sheen on the road after the night
  useLayoutEffect(() => {
    asphalt.roughness = 0.75;
    asphalt.envMapIntensity = 1.4;
    ground.color.set('#7c7a80');
  }, [asphalt, ground]);

  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.01, -30]} material={ground} receiveShadow>
        <planeGeometry args={[240, 200]} />
      </mesh>
      <mesh position={[0, 0.08, 0.9]} material={cobble} receiveShadow>
        <boxGeometry args={[30, 0.16, 3.2]} />
      </mesh>
      <mesh position={[0, 0.12, 2.55]} material={kerb} receiveShadow castShadow>
        <boxGeometry args={[30, 0.24, 0.3]} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.005, 6]} material={asphalt} receiveShadow>
        <planeGeometry args={[200, 6.6]} />
      </mesh>
      {Array.from({ length: 16 }).map((_, i) => (
        <mesh key={i} rotation-x={-Math.PI / 2} position={[-30 + i * 4, 0.012, 6]}>
          <planeGeometry args={[2, 0.14]} />
          <meshStandardMaterial color="#d8d2c2" roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

/* ──────────────────────────────── Buildings ──────────────────────────────── */

export type Building = { x: number; z: number; w: number; d: number; h: number; kind: 0 | 1 };

export function useCity() {
  return useMemo(() => {
    const r = rng(42);
    const out: Building[] = [];
    for (let gx = -14; gx <= 14; gx++) {
      for (let gz = -10; gz <= 0; gz++) {
        const x = gx * 4.2 + (r() - 0.5) * 0.8;
        const z = gz * 4.4 - 3 + (r() - 0.5) * 0.8;
        if (Math.abs(x) < 17 && z > -13) continue;
        if (Math.abs(x) < 26 && z > -9) continue;
        if (r() < 0.1) continue;
        const far = Math.min(1, Math.abs(gz) / 10 + Math.abs(gx) / 28);
        const h = 6 + Math.pow(r(), 2) * 14 + far * 10 * r();
        out.push({ x, z, w: 3 + r() * 1.2, d: 3 + r() * 1.2, h, kind: r() < 0.5 ? 0 : 1 });
      }
    }
    return out;
  }, []);
}

/** window tile: 4×4 windows on a 6 m tile; the corner block stays dark for roofs */
function windowTexture(seed: number) {
  const c = document.createElement('canvas');
  c.width = c.height = 512;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, 512, 512);
  const r = rng(seed);
  for (let y = 0; y < 4; y++)
    for (let x = 0; x < 4; x++) {
      if (x === 0 && y === 3) continue;
      if (r() > 0.42) continue;
      const g = ctx.createLinearGradient(0, 0, 0, 128);
      const warm = r() > 0.3;
      g.addColorStop(0, warm ? '#ffb45e' : '#cfe0ff');
      g.addColorStop(1, warm ? '#ff8a2a' : '#8fa8ff');
      ctx.fillStyle = g;
      ctx.fillRect(x * 128 + 40, y * 128 + 34, 48, 62);
      ctx.fillStyle = "rgba(0,0,0,0.55)";
      ctx.fillRect(x * 128 + 62, y * 128 + 34, 4, 62);
    }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** merge every building of one material into a single mesh, with world-scale UVs */
function buildGeometry(list: Building[], tile: number) {
  const geos = list.map((b) => {
    const g = new THREE.BoxGeometry(b.w, b.h, b.d);
    const uv = g.attributes.uv as THREE.BufferAttribute;
    // face order: +x, -x, +y, -y, +z, -z (4 verts each)
    const dims: [number, number][] = [
      [b.d, b.h],
      [b.d, b.h],
      [0, 0],
      [0, 0],
      [b.w, b.h],
      [b.w, b.h],
    ];
    for (let f = 0; f < 6; f++)
      for (let k = 0; k < 4; k++) {
        const i = f * 4 + k;
        const [sw, sh] = dims[f];
        // roofs map into the dark corner of the window tile
        uv.setXY(i, sw ? uv.getX(i) * (sw / tile) : 0.02, sh ? uv.getY(i) * (sh / tile) : 0.02);
      }
    g.translate(b.x, b.h / 2, b.z);
    return g;
  });
  return mergeGeometries(geos)!;
}

export function City({ buildings }: { buildings: Building[] }) {
  const brick = usePbr('brick_wall_10', [1, 1]);
  const concrete = usePbr('concrete_wall_008', [1, 1]);
  const mats = useMemo(() => {
    const make = (base: THREE.MeshStandardMaterial, seed: number) => {
      const m = base.clone();
      // facade textures tile every 6 m, matching the window grid
      for (const k of ['map', 'normalMap', 'roughnessMap'] as const) {
        const t = m[k]!.clone();
        t.repeat.set(2, 2);
        t.needsUpdate = true;
        m[k] = t;
      }
      m.emissive = new THREE.Color('#ffffff');
      m.emissiveMap = windowTexture(seed);
      m.emissiveIntensity = 2;
      return m;
    };
    return [make(brick, 3), make(concrete, 8)];
  }, [brick, concrete]);
  useLayoutEffect(() => {
    mats[1].color.set('#b9b3ad');
  }, [mats]);

  const geos = useMemo(() => [0, 1].map((k) => buildGeometry(buildings.filter((b) => b.kind === k), 6)), [buildings]);

  useFrame(() => {
    // lights in the windows: on at night, brighter as the city is "seen", fading at sunrise
    const seen = smooth(seg(story.s, 0.08, 0.2));
    const off = smooth(seg(story.s, 0.7, 1));
    const v = (1.4 + seen * 1.2) * (1 - off * 0.85);
    mats[0].emissiveIntensity = v;
    mats[1].emissiveIntensity = v;
  });

  return (
    <>
      <mesh geometry={geos[0]} material={mats[0]} castShadow receiveShadow />
      <mesh geometry={geos[1]} material={mats[1]} castShadow receiveShadow />
    </>
  );
}

/* ───────────────────── Street furniture: lamps, stall, trees ─────────────── */

export function StreetLamp({ x }: { x: number }) {
  const bulb = useRef<THREE.MeshStandardMaterial>(null);
  const lamp = useRef<THREE.SpotLight>(null);
  const target = useMemo(() => new THREE.Object3D(), []);
  useFrame(() => {
    const on = 1 - smooth(seg(story.s, 0.82, 0.98));
    if (lamp.current) lamp.current.intensity = 60 * on;
    if (bulb.current) bulb.current.emissiveIntensity = 0.3 + 6 * on;
  });
  return (
    <group position={[x, 0.16, -0.2]}>
      <mesh position={[0, 2.4, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.08, 4.8, 12]} />
        <meshStandardMaterial color="#2b2d33" metalness={0.8} roughness={0.35} />
      </mesh>
      <mesh position={[0, 4.75, 0.55]} rotation-x={Math.PI / 2}>
        <cylinderGeometry args={[0.04, 0.04, 1.1, 10]} />
        <meshStandardMaterial color="#2b2d33" metalness={0.8} roughness={0.35} />
      </mesh>
      <mesh position={[0, 4.68, 1.1]}>
        <boxGeometry args={[0.5, 0.12, 0.24]} />
        <meshStandardMaterial color="#2b2d33" metalness={0.7} roughness={0.4} />
      </mesh>
      <mesh position={[0, 4.6, 1.1]}>
        <boxGeometry args={[0.42, 0.04, 0.18]} />
        <meshStandardMaterial ref={bulb} color="#fff" emissive="#ffc27a" emissiveIntensity={6} toneMapped={false} />
      </mesh>
      <primitive object={target} position={[0, 0, 1.6]} />
      <spotLight ref={lamp} position={[0, 4.5, 1.1]} target={target} angle={0.75} penumbra={0.7} distance={14} decay={1.6} color="#ffbf73" />
    </group>
  );
}

export function ChaiStall() {
  const steam = useRef<THREE.Group>(null);
  const wood = usePbr('brick_wall_10', [2, 1]);
  useFrame(({ clock }) => {
    const g = steam.current;
    if (!g) return;
    const t = clock.elapsedTime;
    g.children.forEach((c, i) => {
      const k = (t * 0.3 + i / g.children.length) % 1;
      c.position.set(Math.sin(t * 1.3 + i) * 0.1 * k, k * 1.4, Math.cos(t + i) * 0.05);
      c.scale.setScalar(0.12 + k * 0.45);
      ((c as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = Math.sin(k * Math.PI) * 0.22;
    });
  });
  return (
    <group position={[-8.8, 0.16, 0.4]} rotation-y={0.35}>
      <mesh position={[0, 0.5, 0]} material={wood} castShadow receiveShadow>
        <boxGeometry args={[2.2, 1, 0.9]} />
      </mesh>
      <mesh position={[0, 1.03, 0]} castShadow>
        <boxGeometry args={[2.4, 0.06, 1.05]} />
        <meshStandardMaterial color="#8c6a48" roughness={0.6} />
      </mesh>
      {[-1.05, 1.05].map((x) => (
        <mesh key={x} position={[x, 1.6, -0.35]} castShadow>
          <cylinderGeometry args={[0.035, 0.035, 2.2, 8]} />
          <meshStandardMaterial color="#5b4a3a" roughness={0.7} />
        </mesh>
      ))}
      {/* tarp canopy */}
      <mesh position={[0, 2.62, 0.05]} rotation-x={0.32} castShadow>
        <boxGeometry args={[2.6, 0.03, 1.5]} />
        <meshStandardMaterial color="#2f5fa8" roughness={0.8} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0.55, 1.18, 0.05]}>
        <cylinderGeometry args={[0.2, 0.22, 0.24, 20]} />
        <meshStandardMaterial color="#222" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0.55, 1.42, 0.05]} castShadow>
        <sphereGeometry args={[0.19, 24, 18]} />
        <meshStandardMaterial color="#c9c6cf" metalness={1} roughness={0.22} />
      </mesh>
      <pointLight position={[0.55, 1.3, 0.5]} color="#ff7b2e" intensity={4} distance={4} decay={2} />
      {[-0.6, -0.35, -0.1].map((x) => (
        <mesh key={x} position={[x, 1.13, 0.2]}>
          <cylinderGeometry args={[0.045, 0.035, 0.13, 16]} />
          <meshPhysicalMaterial color="#b0631f" transmission={0.4} roughness={0.15} thickness={0.1} />
        </mesh>
      ))}
      <group ref={steam} position={[0.55, 1.6, 0.05]}>
        {Array.from({ length: 10 }).map((_, i) => (
          <mesh key={i}>
            <sphereGeometry args={[1, 10, 8]} />
            <meshBasicMaterial color="#ffffff" transparent depthWrite={false} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export function Scooter({ x, z, color, rot = 0 }: { x: number; z: number; color: string; rot?: number }) {
  return (
    <group position={[x, 0, z]} rotation-y={rot}>
      {[-0.6, 0.6].map((dx) => (
        <mesh key={dx} position={[dx, 0.24, 0]} rotation-x={Math.PI / 2} castShadow>
          <torusGeometry args={[0.18, 0.07, 14, 28]} />
          <meshStandardMaterial color="#141414" roughness={0.85} />
        </mesh>
      ))}
      <mesh position={[0.05, 0.52, 0]} castShadow>
        <capsuleGeometry args={[0.22, 1, 8, 16]} />
        <meshPhysicalMaterial color={color} roughness={0.25} metalness={0.2} clearcoat={1} clearcoatRoughness={0.08} />
      </mesh>
      <mesh position={[0.05, 0.52, 0]} rotation-z={Math.PI / 2} castShadow>
        <capsuleGeometry args={[0.24, 0.8, 8, 16]} />
        <meshPhysicalMaterial color={color} roughness={0.25} metalness={0.2} clearcoat={1} clearcoatRoughness={0.08} />
      </mesh>
      <mesh position={[-0.15, 0.8, 0]} castShadow>
        <boxGeometry args={[0.7, 0.1, 0.32]} />
        <meshStandardMaterial color="#1b1b1f" roughness={0.6} />
      </mesh>
      <mesh position={[0.64, 0.98, 0]} rotation-z={-0.3}>
        <cylinderGeometry args={[0.035, 0.035, 0.65, 10]} />
        <meshStandardMaterial color="#888" metalness={1} roughness={0.25} />
      </mesh>
      <mesh position={[0.74, 1.26, 0]} rotation-x={Math.PI / 2}>
        <cylinderGeometry args={[0.025, 0.025, 0.66, 10]} />
        <meshStandardMaterial color="#222" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0.8, 1.02, 0]}>
        <sphereGeometry args={[0.07, 16, 12]} />
        <meshStandardMaterial color="#fff" emissive="#fff3d6" emissiveIntensity={3} toneMapped={false} />
      </mesh>
    </group>
  );
}

export function Trees() {
  const leaves = useMemo(() => {
    const r = rng(21);
    return Array.from({ length: 22 }, () => ({ p: new THREE.Vector3((r() - 0.5) * 2.2, 3 + r() * 1.6, (r() - 0.5) * 2.2), s: 0.7 + r() * 0.6 }));
  }, []);
  return (
    <>
      {[
        [-12, -1.4],
        [12, -1],
        [-15.5, -5],
        [15.5, -6],
      ].map(([x, z], k) => (
        <group key={k} position={[x, 0, z]} rotation-y={k}>
          <mesh position={[0, 1.6, 0]} castShadow>
            <cylinderGeometry args={[0.16, 0.26, 3.2, 10]} />
            <meshStandardMaterial color="#4a3a2c" roughness={1} />
          </mesh>
          {leaves.map((l, i) => (
            <mesh key={i} position={l.p} scale={l.s} castShadow>
              <icosahedronGeometry args={[0.8, 1]} />
              <meshStandardMaterial color={i % 3 ? '#2f5a2e' : '#3e6b34'} roughness={0.9} flatShading />
            </mesh>
          ))}
        </group>
      ))}
    </>
  );
}

'use client';

import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { rng, seg, smooth, story } from './story';
import { noiseTexture, VoxelModel, type Vox } from './voxel';

/* ────────────────────────────────────────────────────────────────────────────
 * Time of day. The whole story is one morning: night (p=0) → dawn → sunrise.
 * ──────────────────────────────────────────────────────────────────────────── */

type Stop = {
  top: string;
  horizon: string;
  fog: string;
  sun: string;
  sunI: number;
  amb: string;
  ambI: number;
  lit: number;
};

const STOPS: [number, Stop][] = [
  [0, { top: '#05061a', horizon: '#1c1742', fog: '#100e28', sun: '#7b78ff', sunI: 0.55, amb: '#3a3f78', ambI: 0.55, lit: 0.5 }],
  [0.5, { top: '#141a4a', horizon: '#8a3f6a', fog: '#2b1f48', sun: '#ff9d63', sunI: 1.1, amb: '#5a4f86', ambI: 0.7, lit: 0.38 }],
  [1, { top: '#3552a8', horizon: '#ffb070', fog: '#c27a63', sun: '#ffd8a0', sunI: 2.4, amb: '#9a8db0', ambI: 0.95, lit: 0.04 }],
];

const tmpA = new THREE.Color();
const tmpB = new THREE.Color();

function mixStop(p: number, key: 'top' | 'horizon' | 'fog' | 'sun' | 'amb', out: THREE.Color) {
  let i = 0;
  while (i < STOPS.length - 2 && p > STOPS[i + 1][0]) i++;
  const [pa, a] = STOPS[i];
  const [pb, b] = STOPS[i + 1];
  const t = smooth(seg(p, pa, pb));
  return out.copy(tmpA.set(a[key])).lerp(tmpB.set(b[key]), t);
}

function mixNum(p: number, key: 'sunI' | 'ambI' | 'lit') {
  let i = 0;
  while (i < STOPS.length - 2 && p > STOPS[i + 1][0]) i++;
  const [pa, a] = STOPS[i];
  const [pb, b] = STOPS[i + 1];
  return THREE.MathUtils.lerp(a[key], b[key], smooth(seg(p, pa, pb)));
}

/** shared uniforms so the city shader follows the same light as everything else */
export const sky = {
  sunDir: new THREE.Vector3(0, 0.1, -1).normalize(),
  sunCol: new THREE.Color(),
  amb: new THREE.Color(),
  fog: new THREE.Color(),
  lit: 0.5,
};

/* ──────────────────────────────── Atmosphere ─────────────────────────────── */

const skyVert = /* glsl */ `
varying vec3 vDir;
void main() {
  vDir = normalize((modelMatrix * vec4(position, 1.0)).xyz - cameraPosition);
  vec4 p = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
  gl_Position = p.xyww;
}`;

const skyFrag = /* glsl */ `
uniform vec3 uTop;
uniform vec3 uHorizon;
uniform vec3 uSunDir;
uniform vec3 uSunCol;
uniform float uStars;
varying vec3 vDir;
float hash(vec3 p) { return fract(sin(dot(p, vec3(12.9898, 78.233, 37.719))) * 43758.5453); }
void main() {
  vec3 d = normalize(vDir);
  float h = clamp(d.y * 1.6 + 0.08, 0.0, 1.0);
  vec3 col = mix(uHorizon, uTop, pow(h, 0.7));
  float s = max(dot(d, normalize(uSunDir)), 0.0);
  col += uSunCol * (pow(s, 6.0) * 0.45 + pow(s, 60.0) * 0.9);
  // stars, fading out at dawn
  vec3 g = floor(d * 260.0);
  float star = step(0.9975, hash(g)) * smoothstep(0.05, 0.4, d.y);
  col += star * uStars * vec3(0.9, 0.9, 1.0);
  gl_FragColor = vec4(col, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

export function Atmosphere({ shadows }: { shadows: boolean }) {
  const scene = useThree((s) => s.scene);
  const sun = useRef<THREE.DirectionalLight>(null);
  const hemi = useRef<THREE.HemisphereLight>(null);
  const sunBall = useRef<THREE.Mesh>(null);

  const skyMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: skyVert,
        fragmentShader: skyFrag,
        side: THREE.BackSide,
        depthWrite: false,
        uniforms: {
          uTop: { value: new THREE.Color() },
          uHorizon: { value: new THREE.Color() },
          uSunDir: { value: sky.sunDir },
          uSunCol: { value: sky.sunCol },
          uStars: { value: 1 },
        },
      }),
    [],
  );

  const fog = useMemo(() => new THREE.Fog('#100e28', 18, 95), []);
  scene.fog = fog;

  useFrame(() => {
    const p = story.s;
    mixStop(p, 'top', skyMat.uniforms.uTop.value);
    mixStop(p, 'horizon', skyMat.uniforms.uHorizon.value);
    mixStop(p, 'sun', sky.sunCol);
    mixStop(p, 'amb', sky.amb);
    mixStop(p, 'fog', sky.fog);
    sky.lit = mixNum(p, 'lit');
    skyMat.uniforms.uStars.value = 1 - smooth(seg(p, 0.35, 0.8));

    // the sun climbs over the last two acts
    const rise = smooth(seg(p, 0.55, 1));
    sky.sunDir.set(0.15, THREE.MathUtils.lerp(-0.02, 0.32, rise), -1).normalize();

    fog.color.copy(sky.fog);
    fog.far = THREE.MathUtils.lerp(80, 150, smooth(seg(p, 0.1, 0.3)));

    if (sun.current) {
      sun.current.color.copy(sky.sunCol);
      sun.current.intensity = mixNum(p, 'sunI');
      sun.current.position.copy(sky.sunDir).multiplyScalar(40).add(new THREE.Vector3(0, 12, 0));
    }
    if (hemi.current) {
      hemi.current.color.copy(sky.amb);
      hemi.current.groundColor.copy(sky.fog).multiplyScalar(0.5);
      hemi.current.intensity = mixNum(p, 'ambI');
    }
    if (sunBall.current) {
      sunBall.current.position.set(sky.sunDir.x * 160, sky.sunDir.y * 160, sky.sunDir.z * 160);
      sunBall.current.visible = rise > 0.01;
    }
  });

  return (
    <>
      <mesh material={skyMat} frustumCulled={false} renderOrder={-1}>
        <sphereGeometry args={[400, 32, 16]} />
      </mesh>
      <mesh ref={sunBall}>
        <boxGeometry args={[14, 14, 14]} />
        <meshBasicMaterial color={[3.2, 2.2, 1.2]} toneMapped={false} fog={false} />
      </mesh>
      <hemisphereLight ref={hemi} />
      {/* soft fill from the viewer so faces read even at night */}
      <directionalLight position={[2, 5, 14]} intensity={0.55} color="#c9c4ff" />
      <directionalLight
        ref={sun}
        castShadow={shadows}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-16}
        shadow-camera-right={16}
        shadow-camera-top={12}
        shadow-camera-bottom={-6}
        shadow-camera-near={1}
        shadow-camera-far={90}
        shadow-bias={-0.0006}
        shadow-normalBias={0.04}
      />
    </>
  );
}

/* ───────────────────────────────── Street ────────────────────────────────── */

export function Street() {
  const tex = useMemo(
    () => ({
      ground: noiseTexture(['#26243f', '#2b2946', '#23213a', '#302d4d', '#1f1d36'], 16, 3, 90),
      path: noiseTexture(['#59536f', '#4d4863', '#625c79', '#46415b', '#6b6582'], 16, 9, 1),
      road: noiseTexture(['#2a2a3a', '#25253a', '#30303f', '#222233'], 16, 5, 1),
      kerb: noiseTexture(['#d9c99f', '#cbb98d', '#e2d4ad', '#bfae84'], 8, 4, 1),
    }),
    [],
  );
  useLayoutEffect(() => {
    tex.path.repeat.set(60, 6);
    tex.road.repeat.set(200, 7);
    tex.kerb.repeat.set(60, 1);
  }, [tex]);

  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.01, -20]} receiveShadow>
        <planeGeometry args={[260, 200]} />
        <meshStandardMaterial map={tex.ground} roughness={1} />
      </mesh>
      {/* cobbled footpath where the workers wait */}
      <mesh position={[0, 0.08, 0.9]} receiveShadow>
        <boxGeometry args={[30, 0.16, 3.2]} />
        <meshStandardMaterial map={tex.path} roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.12, 2.55]} receiveShadow castShadow>
        <boxGeometry args={[30, 0.24, 0.3]} />
        <meshStandardMaterial map={tex.kerb} roughness={0.9} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.005, 6]} receiveShadow>
        <planeGeometry args={[200, 6.6]} />
        <meshStandardMaterial map={tex.road} roughness={0.85} />
      </mesh>
      {Array.from({ length: 16 }).map((_, i) => (
        <mesh key={i} position={[-30 + i * 4, 0.03, 6]}>
          <boxGeometry args={[1.8, 0.05, 0.2]} />
          <meshStandardMaterial color="#e8dcc0" roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

/* ─────────────────────────────────── City ────────────────────────────────── */

const cityVert = /* glsl */ `
attribute float aSeed;
varying vec3 vWorld;
varying vec3 vN;
varying float vSeed;
void main() {
  vec4 wp = modelMatrix * instanceMatrix * vec4(position, 1.0);
  vWorld = wp.xyz;
  vN = normalize(mat3(modelMatrix) * normal);
  vSeed = aSeed;
  gl_Position = projectionMatrix * viewMatrix * wp;
}`;

// pixel facades: brick noise per 0.25-unit texel, windows on a block grid
const cityFrag = /* glsl */ `
uniform vec3 uBase;
uniform vec3 uSunDir;
uniform vec3 uSunCol;
uniform vec3 uAmb;
uniform vec3 uFog;
uniform float uLit;
uniform float uFogNear;
uniform float uFogFar;
varying vec3 vWorld;
varying vec3 vN;
varying float vSeed;
float h(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
void main() {
  vec3 n = normalize(vN);
  float diff = max(dot(n, normalize(uSunDir)), 0.0);
  vec3 tint = mix(vec3(0.85, 0.8, 1.05), vec3(1.1, 0.92, 0.85), h(vec2(vSeed, 1.7)));
  float u = abs(n.x) > 0.5 ? vWorld.z : vWorld.x;
  vec2 texel = floor(vec2(u, vWorld.y) / 0.25);
  float grain = 0.86 + 0.22 * h(texel + vSeed);
  vec3 base = uBase * tint * grain;
  // flat, face-based shading like a block game
  float face = abs(n.y) > 0.5 ? 1.15 : (abs(n.x) > 0.5 ? 0.78 : 0.95);
  vec3 col = base * face * (uAmb * 0.6 + uSunCol * diff * 0.6);
  if (abs(n.y) < 0.5) {
    vec2 cell = vec2(floor(u / 0.75), floor(vWorld.y / 1.0));
    vec2 f = vec2(fract(u / 0.75), fract(vWorld.y / 1.0));
    float win = step(0.333, f.x) * step(f.x, 0.667) * step(0.25, f.y) * step(f.y, 0.75);
    float r = h(cell + vSeed * 17.0);
    float on = step(r, uLit) * step(0.9, vWorld.y);
    vec3 warm = mix(vec3(1.0, 0.6, 0.2), vec3(1.0, 0.86, 0.5), h(cell.yx + vSeed));
    col = mix(col, vec3(0.05, 0.06, 0.14) + uSunCol * 0.08, win * (1.0 - on));
    col = mix(col, warm * 1.5, win * on);
  }
  float d = length(vWorld - cameraPosition);
  col = mix(col, uFog, smoothstep(uFogNear, uFogFar, d));
  gl_FragColor = vec4(col, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

export type Building = { x: number; z: number; w: number; d: number; h: number };

/** Deterministic block city on a 0.25 grid; the plaza in front stays open. */
export function useCity() {
  return useMemo(() => {
    const r = rng(42);
    const out: Building[] = [];
    const snap = (v: number) => Math.round(v * 4) / 4;
    for (let gx = -16; gx <= 16; gx++) {
      for (let gz = -12; gz <= 0; gz++) {
        const x = snap(gx * 3.1 + (r() - 0.5) * 0.8);
        const z = snap(gz * 3.2 - 2 + (r() - 0.5) * 0.8);
        if (Math.abs(x) < 17 && z > -13) continue;
        if (Math.abs(x) < 26 && z > -9) continue;
        if (r() < 0.12) continue;
        const far = Math.min(1, Math.abs(gz) / 12 + Math.abs(gx) / 30);
        const h = Math.round(1.4 + Math.pow(r(), 2.2) * 9 + far * 5 * r());
        out.push({ x, z, w: snap(1.75 + r() * 1.1), d: snap(1.75 + r() * 1.1), h });
      }
    }
    return out;
  }, []);
}

export function City({ buildings }: { buildings: Building[] }) {
  const ref = useRef<THREE.InstancedMesh>(null);

  const { geo, mat } = useMemo(() => {
    const g = new THREE.BoxGeometry(1, 1, 1);
    g.translate(0, 0.5, 0);
    const seeds = new Float32Array(buildings.length);
    const r = rng(7);
    for (let i = 0; i < seeds.length; i++) seeds[i] = r() * 100;
    g.setAttribute('aSeed', new THREE.InstancedBufferAttribute(seeds, 1));
    const m = new THREE.ShaderMaterial({
      vertexShader: cityVert,
      fragmentShader: cityFrag,
      uniforms: {
        uBase: { value: new THREE.Color('#3a3466') },
        uSunDir: { value: sky.sunDir },
        uSunCol: { value: sky.sunCol },
        uAmb: { value: sky.amb },
        uFog: { value: sky.fog },
        uLit: { value: 0.5 },
        uFogNear: { value: 22 },
        uFogFar: { value: 120 },
      },
    });
    return { geo: g, mat: m };
  }, [buildings]);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const m = new THREE.Matrix4();
    buildings.forEach((b, i) => {
      m.compose(new THREE.Vector3(b.x, 0, b.z), new THREE.Quaternion(), new THREE.Vector3(b.w, b.h, b.d));
      mesh.setMatrixAt(i, m);
    });
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [buildings]);

  useFrame(() => {
    const seen = smooth(seg(story.s, 0.08, 0.22));
    mat.uniforms.uLit.value = sky.lit * (0.55 + 0.45 * seen) + seen * 0.12 * (1 - smooth(seg(story.s, 0.7, 1)));
    mat.uniforms.uFogFar.value = THREE.MathUtils.lerp(70, 160, smooth(seg(story.s, 0.1, 0.3)));
  });

  return <instancedMesh ref={ref} args={[geo, mat, buildings.length]} frustumCulled={false} />;
}

/* ───────────────────────────── Blocky clouds ─────────────────────────────── */

const WHITE = new THREE.Color('#ffffff');

export function Clouds() {
  const g = useRef<THREE.Group>(null);
  const mat = useMemo(() => new THREE.MeshStandardMaterial({ transparent: true, opacity: 0.7, roughness: 1, fog: false }), []);
  const clouds = useMemo(() => {
    const r = rng(11);
    return Array.from({ length: 14 }, () => {
      const parts = Array.from({ length: 3 + Math.floor(r() * 4) }, () => ({
        x: Math.round((r() - 0.5) * 8),
        z: Math.round((r() - 0.5) * 4),
        w: 2 + Math.round(r() * 4),
        d: 2 + Math.round(r() * 3),
      }));
      return { x: (r() - 0.5) * 160, y: 22 + r() * 10, z: -30 - r() * 70, speed: 0.4 + r() * 0.6, parts };
    });
  }, []);
  useFrame(({ clock }) => {
    const grp = g.current;
    if (!grp) return;
    grp.children.forEach((c, i) => {
      const cl = clouds[i];
      c.position.x = ((cl.x + clock.elapsedTime * cl.speed + 90) % 180) - 90;
    });
    {
      mat.color.copy(sky.sunCol).lerp(WHITE, 0.55);
      mat.opacity = 0.35 + smooth(seg(story.s, 0.3, 0.9)) * 0.55;
    }
  });
  return (
    <group ref={g}>
      {clouds.map((cl, i) => (
        <group key={i} position={[cl.x, cl.y, cl.z]}>
          {cl.parts.map((p, j) => (
            <mesh key={j} position={[p.x, 0, p.z]} material={mat}>
              <boxGeometry args={[p.w, 1, p.d]} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

/* ─────────────────────────────── Voxel trees ─────────────────────────────── */

const TREE: Vox[] = (() => {
  const out: Vox[] = [];
  for (let y = 0; y < 4; y++) out.push({ x: 0, y, z: 0, c: '#6b4426' });
  for (let y = 3; y < 7; y++)
    for (let x = -2; x <= 2; x++)
      for (let z = -2; z <= 2; z++) {
        const edge = Math.abs(x) === 2 && Math.abs(z) === 2;
        if (y === 6 && (Math.abs(x) > 1 || Math.abs(z) > 1)) continue;
        if (edge && y !== 4) continue;
        if (x === 0 && z === 0 && y < 5) continue;
        out.push({ x, y, z, c: (x * 7 + y * 3 + z * 5) % 4 ? '#2f8a4a' : '#3fa35b' });
      }
  return out;
})();

export function Trees() {
  return (
    <>
      {[
        [-11.5, -1.2],
        [11.2, -0.6],
        [-14, -4],
        [14.5, -5.5],
      ].map(([x, z]) => (
        <group key={x} position={[x, 0.2, z]}>
          <VoxelModel voxels={TREE} size={0.42} />
        </group>
      ))}
    </>
  );
}

/* ─────────────────────────── Chai stall + steam ──────────────────────────── */

export function ChaiStall() {
  const steam = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const g = steam.current;
    if (!g) return;
    const t = clock.elapsedTime;
    g.children.forEach((c, i) => {
      const k = (t * 0.35 + i / g.children.length) % 1;
      c.position.set(Math.round(Math.sin(t * 1.3 + i) * 2) * 0.04 * k, k * 1.3, 0);
      c.scale.setScalar(Math.max(0.0001, 0.08 + k * 0.12));
      ((c as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = Math.sin(k * Math.PI) * 0.5;
    });
  });

  return (
    <group position={[-8.6, 0.16, 0.4]} rotation-y={0.35}>
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 1, 0.9]} />
        <meshStandardMaterial color="#2e7a5f" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[0, 1.03, 0]} castShadow>
        <boxGeometry args={[2.4, 0.08, 1.05]} />
        <meshStandardMaterial color="#d9c9a3" roughness={0.8} />
      </mesh>
      {[-1.05, 1.05].map((x) => (
        <mesh key={x} position={[x, 1.6, -0.35]} castShadow>
          <boxGeometry args={[0.1, 2.2, 0.1]} />
          <meshStandardMaterial color="#8a6a3d" />
        </mesh>
      ))}
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={i} position={[-1.05 + i * 0.42 + 0.21, 2.66, 0.05]} castShadow>
          <boxGeometry args={[0.42, 0.14, 1.3]} />
          <meshStandardMaterial color={i % 2 ? '#f2e8d0' : '#e5384a'} roughness={0.9} />
        </mesh>
      ))}
      <mesh position={[0.55, 1.18, 0.05]}>
        <boxGeometry args={[0.36, 0.22, 0.36]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[0.55, 1.42, 0.05]} castShadow>
        <boxGeometry args={[0.3, 0.26, 0.3]} />
        <meshStandardMaterial color="#b9b4c4" metalness={0.6} roughness={0.35} />
      </mesh>
      <pointLight position={[0.55, 1.3, 0.5]} color="#ff8a3d" intensity={3} distance={4} decay={2} />
      {[-0.6, -0.35, -0.1].map((x) => (
        <mesh key={x} position={[x, 1.15, 0.2]}>
          <boxGeometry args={[0.1, 0.14, 0.1]} />
          <meshStandardMaterial color="#c97a2b" roughness={0.3} />
        </mesh>
      ))}
      <group ref={steam} position={[0.55, 1.6, 0.05]}>
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh key={i}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color="#ffffff" transparent depthWrite={false} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/* ───────────────────────────── Lamp + scooters ───────────────────────────── */

export function StreetLamp({ x }: { x: number }) {
  const bulb = useRef<THREE.MeshBasicMaterial>(null);
  const light = useRef<THREE.PointLight>(null);
  useFrame(() => {
    const on = 1 - smooth(seg(story.s, 0.82, 0.98));
    if (light.current) light.current.intensity = 14 * on;
    if (bulb.current) bulb.current.color.setRGB(2.4 * on + 0.5, 1.8 * on + 0.45, 0.9 * on + 0.35);
  });
  return (
    <group position={[x, 0.16, -0.3]}>
      <mesh position={[0, 2, 0]} castShadow>
        <boxGeometry args={[0.14, 4, 0.14]} />
        <meshStandardMaterial color="#2c2e45" roughness={0.7} />
      </mesh>
      <mesh position={[0, 4, 0.45]} castShadow>
        <boxGeometry args={[0.12, 0.12, 0.9]} />
        <meshStandardMaterial color="#2c2e45" />
      </mesh>
      {/* glowstone */}
      <mesh position={[0, 3.82, 0.9]}>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshBasicMaterial ref={bulb} toneMapped={false} />
      </mesh>
      <pointLight ref={light} position={[0, 3.5, 1]} color="#ffb768" distance={9} decay={1.6} />
    </group>
  );
}

export function Scooter({ x, z, color, rot = 0 }: { x: number; z: number; color: string; rot?: number }) {
  return (
    <group position={[x, 0, z]} rotation-y={rot}>
      {[-0.55, 0.55].map((dx) => (
        <mesh key={dx} position={[dx, 0.22, 0]} castShadow>
          <boxGeometry args={[0.44, 0.44, 0.16]} />
          <meshStandardMaterial color="#1a1a22" roughness={0.9} />
        </mesh>
      ))}
      <mesh position={[0, 0.52, 0]} castShadow>
        <boxGeometry args={[1.4, 0.36, 0.42]} />
        <meshStandardMaterial color={color} roughness={0.6} flatShading />
      </mesh>
      <mesh position={[-0.15, 0.78, 0]} castShadow>
        <boxGeometry args={[0.7, 0.14, 0.36]} />
        <meshStandardMaterial color="#232338" roughness={0.8} />
      </mesh>
      <mesh position={[0.62, 0.95, 0]} castShadow>
        <boxGeometry args={[0.12, 0.7, 0.12]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      <mesh position={[0.62, 1.3, 0]}>
        <boxGeometry args={[0.1, 0.1, 0.7]} />
        <meshStandardMaterial color="#2a2a33" />
      </mesh>
      <mesh position={[0.72, 0.95, 0]}>
        <boxGeometry args={[0.06, 0.16, 0.2]} />
        <meshBasicMaterial color={[2.5, 2.3, 1.6]} toneMapped={false} />
      </mesh>
    </group>
  );
}

/*
 * Hero 3D scene — "Beyond the waiting line".
 *
 * A stylised Mumbai crossroads at dawn/night. Seven workers wait at the naka
 * under a streetlight. As the visitor scrolls, job pins rise across the city
 * with their pay, glowing arcs connect each worker to a job, and the camera
 * pulls up into an aerial view of a city that is now "connected".
 *
 * Performance budget
 *   - the whole city is ONE merged BufferGeometry + ONE shader (windows are
 *     procedural, no textures), ground is one quad, arcs are 7 small tubes
 *   - no shadow maps; contact shadows are cheap blobs
 *   - DPR capped (1.6 desktop / 1.3 mobile) and lowered automatically if
 *     frames get slow; render loop pauses when the hero is off-screen or the
 *     tab is hidden
 *   - colours come from CSS tokens (--scene-*) and cross-fade on theme change
 */

import * as THREE from 'three';

export interface HeroScene {
  setPointer(x: number, y: number): void;
  setProgress(p: number): void;
  setActive(active: boolean): void;
  refreshTheme(): void;
  destroy(): void;
}

interface Options {
  mobile: boolean;
  reduce: boolean;
}

const TRADE_COLORS = ['#2b7fd8', '#e0611b', '#d9a400', '#d6407c', '#b5651d', '#0e9f8e', '#5a4fd6'];
const PAY_LABELS = ['₹1,100/day', '₹750/day', '₹4,200 job', '₹950/day', '₹1,300/day', '₹16,500/mo', '₹1,150/day'];
const SKIN = ['#8d5524', '#a8693a', '#c68642', '#7a4a26', '#b0794a', '#9a5b30', '#c08050'];

const clamp = (v: number, a = 0, b = 1) => Math.min(Math.max(v, a), b);
const smooth = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/** deterministic PRNG so the city is the same on every visit */
function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function readPalette() {
  const cs = getComputedStyle(document.documentElement);
  const c = (name: string, fallback: string) => new THREE.Color((cs.getPropertyValue(name) || fallback).trim());
  return {
    sky: c('--scene-sky', '#fdf3e3'),
    fog: c('--scene-fog', '#f8ecd9'),
    ground: c('--scene-ground', '#efe4d2'),
    road: c('--scene-road', '#d9ccb6'),
    building: c('--scene-building', '#f6efe4'),
    building2: c('--scene-building-2', '#e9dcc8'),
    window: c('--scene-window', '#ffd58a'),
    night: parseFloat(cs.getPropertyValue('--scene-glow')) || 0,
  };
}

type Palette = ReturnType<typeof readPalette>;

// ─────────────────────────────────────────────────────────── shaders

const FOG_GLSL = /* glsl */ `
uniform vec3 uFog; uniform float uFogNear; uniform float uFogFar;
vec3 applyFog(vec3 col, float d){ return mix(col, uFog, smoothstep(uFogNear, uFogFar, d)); }
`;

const CITY_VERT = /* glsl */ `
attribute vec3 aShade; attribute vec2 aFace;
uniform vec3 uBase; uniform vec3 uBase2; attribute float aSeed; attribute float aSide;
varying vec3 vColor; varying vec2 vFace; varying float vSeed; varying float vSide; varying vec3 vNormal; varying vec3 vWorld;
void main(){
  // two token colours mixed per building, with a little random shade
  vColor = mix(uBase, uBase2, aSeed) * aShade; vFace = aFace; vSeed = aSeed; vSide = aSide; vNormal = normal;
  vec4 w = modelMatrix * vec4(position, 1.0); vWorld = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}`;

const CITY_FRAG = /* glsl */ `
uniform vec3 uSunDir; uniform vec3 uSunCol; uniform vec3 uSky; uniform vec3 uGround; uniform vec3 uWin;
uniform float uNight; uniform float uLit; uniform float uTime;
${FOG_GLSL}
varying vec3 vColor; varying vec2 vFace; varying float vSeed; varying float vSide; varying vec3 vNormal; varying vec3 vWorld;
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
void main(){
  vec3 n = normalize(vNormal);
  float hemi = 0.5 + 0.5 * n.y;
  vec3 amb = mix(uGround, uSky, hemi) * 0.55;
  float diff = max(dot(n, normalize(uSunDir)), 0.0);
  vec3 col = vColor * (amb + uSunCol * diff * 0.75);
  // fake ambient occlusion near the ground
  col *= mix(0.72, 1.0, smoothstep(0.0, 1.2, vWorld.y));

  if (vSide > 0.5) {
    vec2 cell = vec2(0.42, 0.52);
    vec2 id = floor(vFace / cell);
    vec2 f = fract(vFace / cell);
    float inWin = step(0.22, f.x) * step(f.x, 0.78) * step(0.26, f.y) * step(f.y, 0.82) * step(0.5, vFace.y);
    float h = hash(id + vSeed * 17.0);
    float lit = step(h, mix(0.18, 0.62, uLit));
    float flicker = 0.85 + 0.15 * sin(uTime * 2.0 + h * 40.0);
    vec3 dayGlass = mix(vColor * 0.55, vec3(0.55, 0.68, 0.85), 0.35 + 0.25 * h);
    vec3 nightGlass = mix(vColor * 0.35, uWin * (1.4 * flicker), lit);
    col = mix(col, mix(dayGlass, nightGlass, uNight), inWin);
    // a few windows glow even in daytime once the city is "connected"
    col += inWin * lit * uWin * 0.25 * uLit * (1.0 - uNight);
  } else {
    col *= 1.05;
  }
  gl_FragColor = vec4(applyFog(col, length(cameraPosition - vWorld)), 1.0);
  #include <colorspace_fragment>
}`;

const GROUND_FRAG = /* glsl */ `
uniform vec3 uGroundCol; uniform vec3 uRoad; uniform vec3 uLine; uniform float uNight; uniform vec3 uGlowCol; uniform float uConnect;
${FOG_GLSL}
varying vec3 vWorld;
void main(){
  vec2 p = vWorld.xz;
  float roadX = 1.0 - step(1.35, abs(p.y));
  float roadZ = 1.0 - step(1.35, abs(p.x));
  float road = max(roadX, roadZ);
  vec3 col = mix(uGroundCol, uRoad, road);
  // kerb
  float kerb = (smoothstep(1.32, 1.35, abs(p.y)) - smoothstep(1.48, 1.52, abs(p.y))) * (1.0 - roadZ)
             + (smoothstep(1.32, 1.35, abs(p.x)) - smoothstep(1.48, 1.52, abs(p.x))) * (1.0 - roadX);
  col = mix(col, uLine, clamp(kerb, 0.0, 1.0) * 0.5);
  // dashed centre lines
  float dashX = roadX * (1.0 - roadZ) * step(abs(p.y), 0.04) * step(0.5, fract(p.x * 0.6));
  float dashZ = roadZ * (1.0 - roadX) * step(abs(p.x), 0.04) * step(0.5, fract(p.y * 0.6));
  col = mix(col, uLine, max(dashX, dashZ) * 0.8);
  // quiet dot grid on blocks — the "digital" layer, brighter once connected
  vec2 g = fract(p * 0.5) - 0.5;
  float dotM = smoothstep(0.06, 0.0, length(g)) * (1.0 - road);
  col = mix(col, uGlowCol, dotM * (0.12 + 0.35 * uConnect) * mix(0.6, 1.0, uNight));
  // streetlight pool at the naka
  float pool = smoothstep(4.2, 0.0, length(p - vec2(5.6, 2.4)));
  // the chowk: a slightly lighter paved plaza
  float plaza = step(1.5, p.x) * step(p.x, 7.9) * step(1.5, p.y) * step(p.y, 6.2);
  col = mix(col, mix(uGroundCol, uLine, 0.12), plaza * 0.6);
  col += uGlowCol * pool * pool * 0.45 * uNight;
  gl_FragColor = vec4(applyFog(col, length(cameraPosition - vWorld)), 1.0);
  #include <colorspace_fragment>
}`;

const ARC_VERT = /* glsl */ `
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;

const ARC_FRAG = /* glsl */ `
uniform vec3 uColor; uniform float uProgress; uniform float uTime; uniform float uNight;
varying vec2 vUv;
void main(){
  if (vUv.x > uProgress) discard;
  float head = smoothstep(uProgress - 0.12, uProgress, vUv.x);
  float pulse = smoothstep(0.0, 0.08, fract(vUv.x * 2.0 - uTime * 0.6)) * (1.0 - smoothstep(0.08, 0.22, fract(vUv.x * 2.0 - uTime * 0.6)));
  float a = 0.55 + 0.45 * pulse + head * 0.8;
  vec3 c = uColor * (1.0 + pulse * 0.8 + head);
  gl_FragColor = vec4(c, a * mix(0.85, 1.0, uNight));
  #include <colorspace_fragment>
}`;

const SKY_FRAG = /* glsl */ `
uniform vec3 uTop; uniform vec3 uHorizon; uniform vec3 uSunCol; uniform vec3 uSunDir; uniform float uNight;
varying vec3 vDir;
float hash(vec3 p){ return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453); }
void main(){
  vec3 d = normalize(vDir);
  float h = clamp(d.y, 0.0, 1.0);
  vec3 col = mix(uHorizon, uTop, pow(h, 0.55));
  float s = max(dot(d, normalize(uSunDir)), 0.0);
  col += uSunCol * (pow(s, 600.0) * 2.5 + pow(s, 12.0) * 0.25) ;
  vec3 q = floor(d * 300.0);
  col += step(0.9978, hash(q)) * smoothstep(0.08, 0.5, d.y) * uNight * 0.9;
  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}`;

// ─────────────────────────────────────────────────────────── builders

/** Merge every building into one geometry with per-face window coordinates. */
function buildCity(rand: () => number) {
  const pos: number[] = [];
  const nor: number[] = [];
  const col: number[] = [];
  const face: number[] = [];
  const seed: number[] = [];
  const side: number[] = [];
  const idx: number[] = [];
  const tops: THREE.Vector3[] = [];

  const addQuad = (
    a: THREE.Vector3,
    b: THREE.Vector3,
    c: THREE.Vector3,
    d: THREE.Vector3,
    n: THREE.Vector3,
    w: number,
    h: number,
    colr: THREE.Color,
    s: number,
    isSide: number,
  ) => {
    const base = pos.length / 3;
    const uv = [
      [0, 0],
      [w, 0],
      [w, h],
      [0, h],
    ];
    [a, b, c, d].forEach((v, i) => {
      pos.push(v.x, v.y, v.z);
      nor.push(n.x, n.y, n.z);
      col.push(colr.r, colr.g, colr.b);
      face.push(uv[i][0], uv[i][1]);
      seed.push(s);
      side.push(isSide);
    });
    idx.push(base, base + 1, base + 2, base, base + 2, base + 3);
  };

  const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

  const STEP = 2.3;
  for (let gx = -7; gx <= 7; gx++) {
    for (let gz = -7; gz <= 7; gz++) {
      const cx = gx * STEP + (gx > 0 ? 0.6 : gx < 0 ? -0.6 : 0);
      const cz = gz * STEP + (gz > 0 ? 0.6 : gz < 0 ? -0.6 : 0);
      if (Math.abs(cx) < 2.2 || Math.abs(cz) < 2.2) continue; // roads
      if (cx > 0 && cx < 8.5 && cz > 0 && cz < 6.8) continue; // open chowk (plaza) where the naka is
      if (Math.abs(cx) < 4 && cz > 6.8) continue; // keep the camera's flight corridor open
      const r = Math.hypot(cx, cz);
      if (r > 17.5) continue;
      if (rand() < 0.12) continue; // a few open plots
      const w = 1.1 + rand() * 0.7;
      const d = 1.1 + rand() * 0.7;
      // taller towards the back, low near the naka — reads like a real street
      const hgt = 0.8 + rand() * (1.2 + Math.min(r, 14) * 0.32) + (rand() < 0.08 ? 3 : 0);
      const x0 = cx - w / 2;
      const x1 = cx + w / 2;
      const z0 = cz - d / 2;
      const z1 = cz + d / 2;
      const s = rand();
      const shade = new THREE.Color(0.86 + rand() * 0.14, 0.86 + rand() * 0.14, 0.86 + rand() * 0.14);
      // front (+z), back (-z), right (+x), left (-x), roof
      addQuad(V(x0, 0, z1), V(x1, 0, z1), V(x1, hgt, z1), V(x0, hgt, z1), V(0, 0, 1), w, hgt, shade, s, 1);
      addQuad(V(x1, 0, z0), V(x0, 0, z0), V(x0, hgt, z0), V(x1, hgt, z0), V(0, 0, -1), w, hgt, shade, s, 1);
      addQuad(V(x1, 0, z1), V(x1, 0, z0), V(x1, hgt, z0), V(x1, hgt, z1), V(1, 0, 0), d, hgt, shade, s, 1);
      addQuad(V(x0, 0, z0), V(x0, 0, z1), V(x0, hgt, z1), V(x0, hgt, z0), V(-1, 0, 0), d, hgt, shade, s, 1);
      addQuad(V(x0, hgt, z1), V(x1, hgt, z1), V(x1, hgt, z0), V(x0, hgt, z0), V(0, 1, 0), w, d, shade, s, 0);
      tops.push(V(cx, hgt, cz));
    }
  }

  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  g.setAttribute('aShade', new THREE.Float32BufferAttribute(col, 3));
  g.setAttribute('aFace', new THREE.Float32BufferAttribute(face, 2));
  g.setAttribute('aSeed', new THREE.Float32BufferAttribute(seed, 1));
  g.setAttribute('aSide', new THREE.Float32BufferAttribute(side, 1));
  g.setIndex(idx);
  return { geometry: g, tops };
}

function labelTexture(text: string, accent: string) {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 96;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(4, 8, 248, 72, 36);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.arc(42, 44, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#141624';
  ctx.font = '800 34px system-ui, sans-serif';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 72, 46);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 2;
  return t;
}

function blobTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(0,0,0,0.55)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

function buildWorker(shirt: string, skin: string, rand: () => number) {
  const g = new THREE.Group();
  const pants = new THREE.MeshStandardMaterial({ color: rand() < 0.5 ? '#2b2f45' : '#4a3f35', roughness: 0.9 });
  const shirtM = new THREE.MeshStandardMaterial({ color: shirt, roughness: 0.75 });
  const skinM = new THREE.MeshStandardMaterial({ color: skin, roughness: 0.7 });
  const hatM = new THREE.MeshStandardMaterial({ color: rand() < 0.6 ? '#ffc21a' : '#f5f5f5', roughness: 0.4 });

  const legs = new THREE.Mesh(new THREE.CapsuleGeometry(0.11, 0.5, 4, 10), pants);
  legs.position.y = 0.38;
  legs.scale.x = 1.35;
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.17, 0.36, 4, 12), shirtM);
  body.position.y = 0.92;
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.135, 20, 14), skinM);
  head.position.y = 1.38;
  const hat = new THREE.Mesh(new THREE.SphereGeometry(0.15, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), hatM);
  hat.position.y = 1.42;
  const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.025, 20), hatM);
  brim.position.y = 1.43;
  g.add(legs, body, head, hat, brim);

  // toolbox / bag at the feet — the visible "skill"
  const box = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.16, 0.14), new THREE.MeshStandardMaterial({ color: shirt, roughness: 0.5, metalness: 0.2 }));
  box.position.set(0.28, 0.08, 0.05);
  box.rotation.y = rand() * 0.6 - 0.3;
  g.add(box);
  return g;
}

/** Floating tools that orbit the naka — the trades in 3D. */
function buildTools() {
  const tools: THREE.Group[] = [];
  const metal = new THREE.MeshStandardMaterial({ color: '#c9ced8', roughness: 0.32, metalness: 0.6 });
  const wood = new THREE.MeshStandardMaterial({ color: '#c58a4a', roughness: 0.7 });
  const orange = new THREE.MeshStandardMaterial({ color: '#f58a07', roughness: 0.45 });
  const blue = new THREE.MeshStandardMaterial({ color: '#2b7fd8', roughness: 0.45 });
  const pink = new THREE.MeshStandardMaterial({ color: '#d6407c', roughness: 0.5 });

  // hammer
  const hammer = new THREE.Group();
  const hh = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.2, 0.2), metal);
  hh.position.y = 0.55;
  const hs = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 1.1, 12), wood);
  hammer.add(hh, hs);
  tools.push(hammer);

  // wrench
  const wrench = new THREE.Group();
  const wh = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.075, 10, 24, Math.PI * 1.45), metal);
  wh.rotation.z = Math.PI * 0.27;
  wh.position.y = 0.6;
  const ws = new THREE.Mesh(new THREE.BoxGeometry(0.13, 1.0, 0.07), metal);
  wrench.add(wh, ws);
  tools.push(wrench);

  // paint roller
  const roller = new THREE.Group();
  const rr = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.62, 20), pink);
  rr.rotation.z = Math.PI / 2;
  rr.position.y = 0.62;
  const rf = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.025, 8, 20, Math.PI), metal);
  rf.position.set(0.31, 0.62, 0);
  rf.rotation.y = Math.PI / 2;
  const rh = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.6, 12), orange);
  rh.position.set(0.31, 0.12, 0);
  roller.add(rr, rf, rh);
  tools.push(roller);

  // bulb (electrician)
  const bulb = new THREE.Group();
  const glass = new THREE.Mesh(
    new THREE.SphereGeometry(0.3, 24, 18),
    new THREE.MeshStandardMaterial({ color: '#fff4c2', emissive: '#ffcf4a', emissiveIntensity: 0.6, roughness: 0.15, transparent: true, opacity: 0.92 }),
  );
  glass.position.y = 0.42;
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.22, 16), metal);
  cap.position.y = 0.06;
  bulb.add(glass, cap);
  tools.push(bulb);

  // spirit level (mason)
  const level = new THREE.Group();
  const lb = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.16, 0.1), blue);
  const lv = new THREE.Mesh(
    new THREE.CylinderGeometry(0.045, 0.045, 0.24, 12),
    new THREE.MeshStandardMaterial({ color: '#7cf06b', emissive: '#3bd14a', emissiveIntensity: 0.4 }),
  );
  lv.rotation.z = Math.PI / 2;
  lv.position.z = 0.06;
  level.add(lb, lv);
  tools.push(level);

  return tools;
}

// ─────────────────────────────────────────────────────────── scene

export function createHeroScene(canvas: HTMLCanvasElement, opts: Options): HeroScene | null {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !opts.mobile,
      alpha: false,
      powerPreference: 'high-performance',
    });
  } catch {
    return null; // no WebGL — the CSS/SVG poster stays visible
  }

  let maxDpr = opts.mobile ? 1.3 : 1.6;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const rand = rng(20251015);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 200);

  let pal: Palette = readPalette();
  const target: Palette = { ...pal, sky: pal.sky.clone() } as Palette;

  // shared uniforms
  const fogU = {
    uFog: { value: pal.fog.clone() },
    uFogNear: { value: 14 },
    uFogFar: { value: 46 },
  };
  const sunDir = new THREE.Vector3(-0.6, 0.55, 0.5).normalize();
  const sunCol = new THREE.Color('#ffe2b8');

  // sky dome
  const skyU = {
    uTop: { value: pal.sky.clone() },
    uHorizon: { value: pal.fog.clone() },
    uSunCol: { value: new THREE.Color('#ffb768') },
    uSunDir: { value: new THREE.Vector3(-0.5, 0.12, -0.85).normalize() },
    uNight: { value: pal.night },
  };
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(90, 32, 16),
    new THREE.ShaderMaterial({
      uniforms: skyU,
      side: THREE.BackSide,
      depthWrite: false,
      vertexShader: 'varying vec3 vDir; void main(){ vDir = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader: SKY_FRAG,
    }),
  );
  scene.add(sky);

  // ground
  const groundU = {
    ...fogU,
    uGroundCol: { value: pal.ground.clone() },
    uRoad: { value: pal.road.clone() },
    uLine: { value: new THREE.Color('#ffffff') },
    uNight: { value: pal.night },
    uGlowCol: { value: new THREE.Color('#ffa41f') },
    uConnect: { value: 0 },
  };
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(120, 120).rotateX(-Math.PI / 2),
    new THREE.ShaderMaterial({
      uniforms: groundU,
      vertexShader: 'varying vec3 vWorld; void main(){ vec4 w = modelMatrix * vec4(position,1.0); vWorld = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }',
      fragmentShader: GROUND_FRAG,
    }),
  );
  scene.add(ground);

  // city
  const city = buildCity(rand);
  const cityU = {
    ...fogU,
    uSunDir: { value: sunDir },
    uSunCol: { value: sunCol.clone() },
    uSky: { value: pal.sky.clone() },
    uGround: { value: pal.ground.clone() },
    uWin: { value: pal.window.clone() },
    uNight: { value: pal.night },
    uLit: { value: 0 },
    uTime: { value: 0 },
    uBase: { value: pal.building.clone() },
    uBase2: { value: pal.building2.clone() },
  };
  const cityMat = new THREE.ShaderMaterial({
    uniforms: cityU,
    vertexShader: CITY_VERT,
    fragmentShader: CITY_FRAG,
  });
  const cityMesh = new THREE.Mesh(city.geometry, cityMat);
  scene.add(cityMesh);

  // lights for standard materials (workers, tools, pins)
  const hemi = new THREE.HemisphereLight(pal.sky, pal.ground, 1.6);
  const sun = new THREE.DirectionalLight('#ffe2b8', 1.8);
  sun.position.copy(sunDir).multiplyScalar(20);
  scene.add(hemi, sun);

  // streetlight at the naka
  const lamp = new THREE.Group();
  const poleM = new THREE.MeshStandardMaterial({ color: '#3a3f55', roughness: 0.6, metalness: 0.3 });
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 3.2, 10), poleM);
  pole.position.y = 1.6;
  const arm = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.06, 0.06), poleM);
  arm.position.set(0.42, 3.15, 0);
  const bulbM = new THREE.MeshBasicMaterial({ color: '#ffd58a' });
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.11, 14, 10), bulbM);
  bulb.position.set(0.82, 3.05, 0);
  const coneM = new THREE.MeshBasicMaterial({ color: '#ffb84a', transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
  const cone = new THREE.Mesh(new THREE.ConeGeometry(1.6, 3.0, 32, 1, true), coneM);
  cone.position.set(0.82, 1.55, 0);
  lamp.add(pole, arm, bulb, cone);
  lamp.position.set(6.9, 0, 2.5);
  lamp.rotation.y = Math.PI;
  scene.add(lamp);
  const lampLight = new THREE.PointLight('#ffb84a', 0, 7, 1.6);
  lampLight.position.set(6.1, 2.9, 2.5);
  scene.add(lampLight);

  // workers — the waiting line along the kerb
  const shadowTex = blobTexture();
  const shadowM = new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false });
  const workers: { g: THREE.Group; phase: number; base: THREE.Vector3 }[] = [];
  for (let i = 0; i < 7; i++) {
    const g = buildWorker(TRADE_COLORS[i], SKIN[i], rand);
    const base = new THREE.Vector3(1.0 + i * 0.8 + (rand() - 0.5) * 0.15, 0, 2.1 + (rand() - 0.5) * 0.4);
    g.position.copy(base);
    g.rotation.y = -0.35 + (rand() - 0.5) * 0.8;
    g.scale.setScalar(0.92 + rand() * 0.14);
    const blob = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.9).rotateX(-Math.PI / 2), shadowM);
    blob.position.y = 0.01;
    g.add(blob);
    scene.add(g);
    workers.push({ g, phase: rand() * Math.PI * 2, base });
  }

  // job pins on rooftops, with pay labels
  const tops = city.tops
    // rooftops behind the waiting line (in view from the street-level camera)
    .filter((t) => t.z < -1 && t.x > -6 && t.x < 12 && t.y < 6.5 && t.distanceTo(new THREE.Vector3(3.5, 0, 2)) > 5)
    .sort(() => rand() - 0.5)
    .slice(0, 7);
  const pinGeo = new THREE.SphereGeometry(0.28, 20, 14);
  const pinCone = new THREE.ConeGeometry(0.2, 0.42, 16).rotateX(Math.PI);
  const ringGeo = new THREE.RingGeometry(0.35, 0.48, 32).rotateX(-Math.PI / 2);
  const pins: { g: THREE.Group; ring: THREE.Mesh; label: THREE.Sprite; at: number }[] = [];
  const arcs: { mesh: THREE.Mesh; u: { uProgress: { value: number }; uTime: { value: number }; uNight: { value: number }; uColor: { value: THREE.Color } }; at: number }[] = [];

  tops.forEach((top, i) => {
    const color = new THREE.Color(TRADE_COLORS[i]);
    const g = new THREE.Group();
    const m = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.45, roughness: 0.35 });
    const head = new THREE.Mesh(pinGeo, m);
    head.position.y = 0.72;
    const tip = new THREE.Mesh(pinCone, m);
    tip.position.y = 0.36;
    const ring = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.8, depthWrite: false }));
    ring.position.y = 0.04;
    const label = new THREE.Sprite(new THREE.SpriteMaterial({ map: labelTexture(PAY_LABELS[i], TRADE_COLORS[i]), transparent: true, depthWrite: false }));
    label.scale.set(1.9, 0.71, 1);
    label.position.y = 1.55;
    g.add(head, tip, ring, label);
    g.position.copy(top);
    g.scale.setScalar(0.0001);
    scene.add(g);
    const at = 0.18 + i * 0.045;
    pins.push({ g, ring, label, at });

    // arc from worker i to this pin
    const from = workers[i].base.clone().add(new THREE.Vector3(0, 1.5, 0));
    const to = top.clone().add(new THREE.Vector3(0, 0.72, 0));
    const mid = from.clone().lerp(to, 0.5);
    mid.y = Math.max(from.y, to.y) + 2.2 + from.distanceTo(to) * 0.22;
    const curve = new THREE.QuadraticBezierCurve3(from, mid, to);
    const u = {
      uColor: { value: color },
      uProgress: { value: 0 },
      uTime: { value: 0 },
      uNight: { value: pal.night },
    };
    const mesh = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 64, 0.035, 6, false),
      new THREE.ShaderMaterial({ uniforms: u, vertexShader: ARC_VERT, fragmentShader: ARC_FRAG, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }),
    );
    scene.add(mesh);
    arcs.push({ mesh, u, at: 0.42 + i * 0.05 });
  });

  // floating tools
  const tools = buildTools();
  const toolSpots = [
    new THREE.Vector3(2.4, 2.75, 0.4),
    new THREE.Vector3(4.6, 3.05, -0.6),
    new THREE.Vector3(6.8, 2.35, 0.9),
    new THREE.Vector3(3.4, 3.7, -2.2),
    new THREE.Vector3(5.9, 3.9, -2.6),
  ];
  tools.forEach((t, i) => {
    t.position.copy(toolSpots[i]);
    t.rotation.set(rand() * 0.8, rand() * Math.PI, rand() * 0.8 - 0.4);
    t.scale.setScalar(0.85);
    scene.add(t);
  });

  // dust / fireflies
  const P = opts.mobile ? 160 : 360;
  const pPos = new Float32Array(P * 3);
  for (let i = 0; i < P; i++) {
    pPos[i * 3] = (rand() - 0.5) * 30;
    pPos[i * 3 + 1] = rand() * 9;
    pPos[i * 3 + 2] = (rand() - 0.5) * 30;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const pMat = new THREE.PointsMaterial({ color: '#ffb84a', size: 0.06, transparent: true, opacity: 0.6, depthWrite: false, blending: THREE.AdditiveBlending });
  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  // ── camera path (street level → aerial)
  const camPath = new THREE.CatmullRomCurve3([
    // stays above the north–south road so it never passes through a building
    new THREE.Vector3(-1.2, 1.55, 9.2),
    new THREE.Vector3(-0.5, 4.4, 13.2),
    new THREE.Vector3(0.2, 10.8, 16.2),
    new THREE.Vector3(-2.5, 17.5, 15.5),
  ]);
  const lookPath = new THREE.CatmullRomCurve3([
    new THREE.Vector3(1.8, 1.3, 2.0),
    new THREE.Vector3(1.8, 1.4, 0.4),
    new THREE.Vector3(1.2, 0.6, -1.2),
    new THREE.Vector3(0.6, 0, -2.4),
  ]);

  // ── state
  let progress = 0;
  let shown = 0; // eased progress
  const pointer = new THREE.Vector2();
  const pointerEased = new THREE.Vector2();
  let active = true;
  let raf = 0;
  let last = performance.now();
  let t = 0;
  let slowFrames = 0;
  let themeT = 1;
  let palFrom: Palette = pal;
  const camPos = new THREE.Vector3();
  const look = new THREE.Vector3();
  const portraitShift = new THREE.Vector3();

  const resize = () => {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // portrait phones: widen the view so the line of workers fits
    camera.fov = camera.aspect < 0.8 ? 58 : camera.aspect < 1.2 ? 50 : 42;
    // portrait: step back and up so the line of workers sits in the lower half under the copy
    portraitShift.set(camera.aspect < 0.8 ? 1.8 : 0, camera.aspect < 0.8 ? 1.6 : 0, camera.aspect < 0.8 ? 4.5 : 0);
    camera.updateProjectionMatrix();
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  const lerpColor = (out: THREE.Color, a: THREE.Color, b: THREE.Color, k: number) => out.copy(a).lerp(b, k);

  const applyTheme = (k: number) => {
    const n = palFrom.night + (target.night - palFrom.night) * k;
    lerpColor(skyU.uTop.value, palFrom.sky, target.sky, k);
    lerpColor(skyU.uHorizon.value, palFrom.fog, target.fog, k);
    lerpColor(fogU.uFog.value, palFrom.fog, target.fog, k);
    lerpColor(groundU.uGroundCol.value, palFrom.ground, target.ground, k);
    lerpColor(groundU.uRoad.value, palFrom.road, target.road, k);
    lerpColor(cityU.uBase.value, palFrom.building, target.building, k);
    lerpColor(cityU.uBase2.value, palFrom.building2, target.building2, k);
    lerpColor(cityU.uSky.value, palFrom.sky, target.sky, k);
    lerpColor(cityU.uGround.value, palFrom.ground, target.ground, k);
    lerpColor(cityU.uWin.value, palFrom.window, target.window, k);
    skyU.uNight.value = n;
    groundU.uNight.value = n;
    cityU.uNight.value = n;
    arcs.forEach((a) => (a.u.uNight.value = n));
    // lights: warm dawn sun ↔ cool moon
    sun.color.set('#ffe2b8').lerp(new THREE.Color('#9fb3ff'), n);
    sun.intensity = 1.8 - n * 1.25;
    hemi.intensity = 1.6 - n * 0.95;
    hemi.color.copy(skyU.uTop.value).lerp(new THREE.Color('#ffffff'), 0.5 - n * 0.3);
    hemi.groundColor.copy(groundU.uGroundCol.value);
    cityU.uSunCol.value.copy(sun.color).multiplyScalar(1 - n * 0.55);
    skyU.uSunCol.value.set('#ffb768').lerp(new THREE.Color('#c9d4ff'), n);
    lampLight.intensity = 6 * n;
    coneM.opacity = 0.09 * n;
    bulbM.color.set('#fff2d6').lerp(new THREE.Color('#ffc861'), n);
    groundU.uLine.value.set('#ffffff').multiplyScalar(0.55 + (1 - n) * 0.4);
    pMat.opacity = 0.18 + n * 0.55;
    pMat.color.set(n > 0.5 ? '#ffb84a' : '#b08a5a');
    renderer.setClearColor(skyU.uHorizon.value);
  };
  applyTheme(1);

  const frame = (now: number) => {
    raf = 0;
    if (!active) return;
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    if (!opts.reduce) t += dt;

    // adaptive resolution: if we keep missing ~40fps, drop DPR once
    if (dt > 0.026) slowFrames++;
    else slowFrames = Math.max(0, slowFrames - 1);
    if (slowFrames > 45 && maxDpr > 1) {
      maxDpr = 1;
      renderer.setPixelRatio(1);
      resize();
      slowFrames = 0;
    }

    // theme cross-fade
    if (themeT < 1) {
      themeT = Math.min(1, themeT + dt / 0.7);
      applyTheme(themeT * themeT * (3 - 2 * themeT));
    }

    // ease progress & pointer
    const k = opts.reduce ? 1 : 1 - Math.pow(0.0015, dt);
    shown += (progress - shown) * k;
    pointerEased.lerp(pointer, opts.reduce ? 1 : 1 - Math.pow(0.02, dt));
    const p = shown;

    // camera
    const cp = smooth(0.0, 1.0, p);
    camPath.getPoint(cp, camPos);
    lookPath.getPoint(cp, look);
    camPos.add(portraitShift);
    camPos.x += pointerEased.x * 0.55 * (1 - cp * 0.5);
    camPos.y += -pointerEased.y * 0.3;
    if (!opts.reduce) camPos.y += Math.sin(t * 0.5) * 0.04;
    camera.position.copy(camPos);
    camera.lookAt(look);

    // workers idle (breathing, shifting weight, looking up when connected)
    const connect = smooth(0.42, 0.8, p);
    workers.forEach((w, i) => {
      const bob = Math.sin(t * 1.6 + w.phase) * 0.012;
      w.g.position.y = w.base.y + bob + connect * Math.max(0, Math.sin(t * 5 + i)) * 0.04;
      w.g.rotation.z = Math.sin(t * 0.9 + w.phase) * 0.025;
      const lookAtPin = pins[i] ? Math.atan2(pins[i].g.position.x - w.base.x, pins[i].g.position.z - w.base.z) : 0;
      const idleYaw = -0.4 + Math.sin(t * 0.3 + w.phase) * 0.25;
      w.g.rotation.y = idleYaw + (lookAtPin - idleYaw) * connect;
    });

    // pins rise in, rings pulse
    pins.forEach((pin, i) => {
      const s = smooth(pin.at, pin.at + 0.12, p);
      const pop = s < 1 ? s * (1 + Math.sin(s * Math.PI) * 0.25) : 1;
      pin.g.scale.setScalar(Math.max(pop, 0.0001));
      pin.g.position.y = tops[i].y + Math.sin(t * 2 + i) * 0.06 * s;
      const r = (t * 0.8 + i * 0.3) % 1;
      pin.ring.scale.setScalar(1 + r * 1.6);
      (pin.ring.material as THREE.MeshBasicMaterial).opacity = (1 - r) * 0.8 * s;
      pin.label.material.opacity = smooth(pin.at + 0.08, pin.at + 0.16, p);
    });

    // arcs draw on
    arcs.forEach((a) => {
      a.u.uProgress.value = smooth(a.at, a.at + 0.22, p) * 1.02;
      a.u.uTime.value = t;
    });

    cityU.uLit.value = smooth(0.35, 0.95, p);
    cityU.uTime.value = t;
    groundU.uConnect.value = connect;

    // tools float and drift away as we rise
    tools.forEach((tool, i) => {
      tool.rotation.y += dt * (0.25 + i * 0.05);
      tool.rotation.x = Math.sin(t * 0.6 + i) * 0.35;
      tool.position.y = toolSpots[i].y + Math.sin(t * 0.9 + i * 1.3) * 0.18 + p * 1.5;
      const fade = 1 - smooth(0.55, 0.85, p);
      tool.scale.setScalar(0.85 * Math.max(fade, 0.0001));
    });

    particles.rotation.y = t * 0.015;
    particles.position.y = Math.sin(t * 0.25) * 0.2;

    renderer.render(scene, camera);
    if (!opts.reduce || themeT < 1 || Math.abs(progress - shown) > 0.0005) schedule();
  };

  const schedule = () => {
    if (!raf && active) raf = requestAnimationFrame(frame);
  };

  const onVisibility = () => {
    if (document.hidden) {
      cancelAnimationFrame(raf);
      raf = 0;
    } else {
      last = performance.now();
      schedule();
    }
  };
  document.addEventListener('visibilitychange', onVisibility);

  schedule();

  return {
    setPointer(x, y) {
      pointer.set(x, y);
      if (opts.reduce) return;
      schedule();
    },
    setProgress(p) {
      progress = clamp(p);
      schedule();
    },
    setActive(a) {
      active = a;
      if (a) {
        last = performance.now();
        schedule();
      } else if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    },
    refreshTheme() {
      palFrom = {
        sky: skyU.uTop.value.clone(),
        fog: fogU.uFog.value.clone(),
        ground: groundU.uGroundCol.value.clone(),
        road: groundU.uRoad.value.clone(),
        building: cityU.uBase.value.clone(),
        building2: cityU.uBase2.value.clone(),
        window: cityU.uWin.value.clone(),
        night: cityU.uNight.value,
      };
      pal = readPalette();
      Object.assign(target, pal);
      themeT = 0;
      schedule();
    },
    destroy() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose();
        const mat = m.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
        else if (mat) {
          (mat as THREE.MeshBasicMaterial).map?.dispose();
          mat.dispose();
        }
      });
      shadowTex.dispose();
      renderer.dispose();
    },
  };
}

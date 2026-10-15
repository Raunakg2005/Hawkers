import * as THREE from 'three';

/**
 * Canvas-drawn textures: labels, the skill card faces and soft particles.
 * Drawn once at load with system fonts, so the scene needs no font files.
 */

// the pixel face next/font registered on <html>, read at draw time
const FONT_FALLBACK = 'system-ui, sans-serif';
let FONT = FONT_FALLBACK;
if (typeof document !== 'undefined') {
  const v = getComputedStyle(document.documentElement).getPropertyValue('--font-pixel').trim();
  if (v) FONT = `${v}, ${FONT_FALLBACK}`;
}

function canvasTexture(w: number, h: number, draw: (ctx: CanvasRenderingContext2D) => void) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d')!;
  draw(ctx);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** pill label for job pins: "₹900 / day" */
export function pillTexture(text: string, bg: string, fg: string) {
  return canvasTexture(512, 160, (ctx) => {
    roundRect(ctx, 8, 8, 496, 144, 72);
    ctx.fillStyle = bg;
    ctx.fill();
    ctx.fillStyle = fg;
    ctx.font = `800 76px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 256, 84);
  });
}

/** two-line warning label for the scam pin */
export function warnTexture(line1: string, line2: string) {
  return canvasTexture(640, 220, (ctx) => {
    roundRect(ctx, 8, 8, 624, 204, 40);
    ctx.fillStyle = '#e5384a';
    ctx.fill();
    ctx.fillStyle = '#fff4f4';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `800 72px ${FONT}`;
    ctx.fillText(line1, 320, 78);
    ctx.font = `600 50px ${FONT}`;
    ctx.fillText(line2, 320, 156);
  });
}

/** card back panel */
export function cardBaseTexture() {
  return canvasTexture(1024, 640, (ctx) => {
    const g = ctx.createLinearGradient(0, 0, 1024, 640);
    g.addColorStop(0, '#1d2050');
    g.addColorStop(1, '#0d0f26');
    roundRect(ctx, 0, 0, 1024, 640, 56);
    ctx.fillStyle = g;
    ctx.fill();
    ctx.lineWidth = 10;
    ctx.strokeStyle = '#ffa41f';
    roundRect(ctx, 5, 5, 1014, 630, 52);
    ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.font = `700 36px ${FONT}`;
    ctx.fillText('NAKA SKILL CARD', 60, 580);
    // trade glyph: a saw tooth line
    ctx.strokeStyle = 'rgba(255,164,31,0.25)';
    ctx.lineWidth = 14;
    ctx.beginPath();
    for (let i = 0; i < 9; i++) ctx.lineTo(560 + i * 50, 520 + (i % 2 ? -40 : 0));
    ctx.stroke();
  });
}

/** identity strip: avatar, name, trade */
export function cardIdTexture() {
  return canvasTexture(1024, 400, (ctx) => {
    ctx.fillStyle = '#ffa41f';
    ctx.beginPath();
    ctx.arc(150, 200, 120, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1d2050';
    ctx.font = `800 110px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SJ', 150, 206);
    ctx.textAlign = 'left';
    ctx.fillStyle = '#ffffff';
    ctx.font = `800 92px ${FONT}`;
    ctx.fillText('Suresh Jadhav', 310, 140);
    ctx.fillStyle = '#ffd58a';
    ctx.font = `600 64px ${FONT}`;
    ctx.fillText('Carpenter, 14 years', 310, 240);
    ctx.fillStyle = '#5eead4';
    ctx.font = `700 54px ${FONT}`;
    ctx.fillText('★★★★★  4.8', 310, 326);
  });
}

/** fake-but-plausible QR block */
export function qrTexture() {
  return canvasTexture(400, 400, (ctx) => {
    ctx.fillStyle = '#ffffff';
    roundRect(ctx, 0, 0, 400, 400, 36);
    ctx.fill();
    ctx.fillStyle = '#10122a';
    const n = 21;
    const s = 340 / n;
    let seed = 7;
    const r = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
    for (let y = 0; y < n; y++)
      for (let x = 0; x < n; x++) {
        const finder = (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13);
        if (finder) continue;
        if (r() > 0.52) ctx.fillRect(30 + x * s, 30 + y * s, s + 0.5, s + 0.5);
      }
    for (const [fx, fy] of [
      [0, 0],
      [14, 0],
      [0, 14],
    ]) {
      ctx.fillRect(30 + fx * s, 30 + fy * s, s * 7, s * 7);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(30 + (fx + 1) * s, 30 + (fy + 1) * s, s * 5, s * 5);
      ctx.fillStyle = '#10122a';
      ctx.fillRect(30 + (fx + 2) * s, 30 + (fy + 2) * s, s * 3, s * 3);
    }
  });
}

/** "Available today" badge */
export function badgeTexture() {
  return canvasTexture(560, 140, (ctx) => {
    roundRect(ctx, 4, 4, 552, 132, 66);
    ctx.fillStyle = '#14b8a6';
    ctx.fill();
    ctx.fillStyle = '#04201c';
    ctx.font = `800 64px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Available today', 280, 74);
  });
}

/** soft round sprite for steam and dust */
export function softDotTexture() {
  return canvasTexture(128, 128, (ctx) => {
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, 'rgba(255,255,255,0.9)');
    g.addColorStop(0.4, 'rgba(255,255,255,0.35)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
  });
}

/** paper document with ruled lines and a stamp */
export function docTexture() {
  return canvasTexture(400, 520, (ctx) => {
    ctx.fillStyle = '#fbf7ee';
    roundRect(ctx, 0, 0, 400, 520, 24);
    ctx.fill();
    ctx.fillStyle = '#5240e3';
    ctx.fillRect(40, 50, 200, 26);
    ctx.fillStyle = '#c9c2b3';
    for (let i = 0; i < 9; i++) ctx.fillRect(40, 120 + i * 34, i % 3 === 2 ? 200 : 320, 12);
    ctx.strokeStyle = '#e5384a';
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.arc(300, 430, 52, 0, Math.PI * 2);
    ctx.stroke();
  });
}

/** phone screen: helpline call */
export function phoneTexture() {
  return canvasTexture(300, 560, (ctx) => {
    ctx.fillStyle = '#0f1630';
    roundRect(ctx, 0, 0, 300, 560, 40);
    ctx.fill();
    ctx.fillStyle = '#14b8a6';
    ctx.beginPath();
    ctx.arc(150, 400, 62, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = `800 64px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.fillText('14434', 150, 200);
    ctx.font = `600 34px ${FONT}`;
    ctx.fillStyle = '#a0a6fd';
    ctx.fillText('Free helpline', 150, 260);
    ctx.fillStyle = '#04201c';
    ctx.font = `800 60px ${FONT}`;
    ctx.fillText('☎', 150, 422);
  });
}

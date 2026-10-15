'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { range, useScrollFx } from './engine';

/**
 * Effect 1 · Pixel curtain. The section arrives hidden under a wall of blocks
 * that break away in a noisy order as you scroll it into view; the blocks at
 * the breaking edge flash marigold, like a pickaxe working through stone.
 */
export default function PixelCurtain({ children, block = 30 }: { children: ReactNode; block?: number }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const grid = useRef<{ cols: number; rows: number; order: Float32Array; shade: Float32Array; w: number; h: number }>(null);

  // sizing + per-block random order, rebuilt when the section resizes
  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const build = () => {
      const host = c.parentElement!;
      const w = host.clientWidth;
      const h = host.clientHeight;
      const cols = Math.ceil(w / block);
      const rows = Math.ceil(h / block);
      const order = new Float32Array(cols * rows);
      const shade = new Float32Array(cols * rows);
      for (let y = 0; y < rows; y++)
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x;
          // breaks from the top-left corner outward, with plenty of noise
          const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
          order[i] = ((x / cols) * 0.35 + (y / rows) * 0.45 + (n - Math.floor(n)) * 0.45) / 1.25;
          const m = Math.sin(x * 3.1 + y * 7.7) * 9187.31;
          shade[i] = m - Math.floor(m);
        }
      c.width = cols * block;
      c.height = rows * block;
      c.style.width = `${cols * block}px`;
      c.style.height = `${rows * block}px`;
      grid.current = { cols, rows, order, shade, w, h };
    };
    build();
    const ro = new ResizeObserver(build);
    ro.observe(c.parentElement!);
    return () => ro.disconnect();
  }, [block]);

  const ref = useScrollFx<HTMLDivElement>((p, el) => {
    const c = canvas.current;
    const g = grid.current;
    if (!c || !g) return;
    const ctx = c.getContext('2d')!;
    const q = range(p, 0.04, 0.42);
    ctx.clearRect(0, 0, c.width, c.height);
    if (q >= 1) {
      el.dataset.open = 'true';
      return;
    }
    el.dataset.open = 'false';
    const bg = getComputedStyle(el).getPropertyValue('--curtain').trim() || '#0b0c1d';
    for (let y = 0; y < g.rows; y++)
      for (let x = 0; x < g.cols; x++) {
        const i = y * g.cols + x;
        const d = g.order[i] - q;
        if (d < 0) continue;
        const s = g.shade[i];
        if (d < 0.05) {
          // breaking edge
          ctx.fillStyle = s > 0.5 ? '#ffa41f' : '#ffd58a';
          const k = (d / 0.05) * block;
          ctx.fillRect(x * block + (block - k) / 2, y * block + (block - k) / 2, k, k);
        } else {
          ctx.fillStyle = bg;
          ctx.globalAlpha = 1;
          ctx.fillRect(x * block, y * block, block, block);
          ctx.fillStyle = s > 0.66 ? 'rgba(255,255,255,0.05)' : s < 0.2 ? 'rgba(0,0,0,0.18)' : 'rgba(0,0,0,0)';
          ctx.fillRect(x * block, y * block, block, block);
        }
      }
  });

  return (
    <div ref={ref} className="fx-curtain">
      {children}
      <canvas ref={canvas} className="fx-curtain-canvas" aria-hidden="true" />
    </div>
  );
}

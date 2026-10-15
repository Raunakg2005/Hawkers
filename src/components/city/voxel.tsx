'use client';

import { forwardRef, useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

/**
 * Voxel helpers: everything in the scene is built from cubes.
 *
 * A "sprite" is a list of strings, one per row (top row first), where every
 * character is a palette key and '.' is empty. It's extruded into cubes, like
 * a Minecraft item held in the hand.
 */

export type Palette = Record<string, string>;

export type Vox = { x: number; y: number; z: number; c: string };

export function spriteVoxels(rows: string[], palette: Palette, depth = 1): Vox[] {
  const out: Vox[] = [];
  const h = rows.length;
  const w = Math.max(...rows.map((r) => r.length));
  rows.forEach((row, ry) => {
    [...row].forEach((ch, rx) => {
      const c = palette[ch];
      if (!c) return;
      for (let z = 0; z < depth; z++) out.push({ x: rx - (w - 1) / 2, y: h - 1 - ry - (h - 1) / 2, z: z - (depth - 1) / 2, c });
    });
  });
  return out;
}

const _m = new THREE.Matrix4();
const _c = new THREE.Color();

/** Static voxel model as one instanced mesh (one draw call). */
export const VoxelModel = forwardRef<THREE.InstancedMesh, { voxels: Vox[]; size?: number; emissive?: number; shadows?: boolean }>(
  function VoxelModel({ voxels, size = 0.1, emissive = 0, shadows = true }, ref) {
    const local = useRef<THREE.InstancedMesh>(null);
    const geo = useMemo(() => new THREE.BoxGeometry(size, size, size), [size]);
    // glowing models skip lighting and push colour past 1.0 so bloom catches them
    const mat = useMemo(
      () =>
        emissive
          ? new THREE.MeshBasicMaterial({ toneMapped: false })
          : new THREE.MeshStandardMaterial({ roughness: 0.92, metalness: 0, flatShading: true }),
      [emissive],
    );
    useLayoutEffect(() => {
      const mesh = local.current;
      if (!mesh) return;
      voxels.forEach((v, i) => {
        _m.makeTranslation(v.x * size, v.y * size, v.z * size);
        mesh.setMatrixAt(i, _m);
        _c.set(v.c);
        if (emissive) _c.multiplyScalar(emissive);
        mesh.setColorAt(i, _c);
      });
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
      mesh.computeBoundingSphere();
    }, [voxels, size, emissive]);

    return (
      <instancedMesh
        ref={(m) => {
          local.current = m;
          if (typeof ref === 'function') ref(m);
          else if (ref) ref.current = m;
        }}
        args={[geo, mat, voxels.length]}
        castShadow={shadows}
        receiveShadow={shadows}
      />
    );
  },
);

/** Crisp pixel-art texture drawn from rows of palette keys. */
export function pixelTexture(rows: string[], palette: Palette) {
  const h = rows.length;
  const w = Math.max(...rows.map((r) => r.length));
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d')!;
  rows.forEach((row, y) =>
    [...row].forEach((ch, x) => {
      const col = palette[ch];
      if (!col) return;
      ctx.fillStyle = col;
      ctx.fillRect(x, y, 1, 1);
    }),
  );
  const tex = new THREE.CanvasTexture(c);
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.generateMipmaps = false;
  return tex;
}

/** Seeded noise tile (grass, stone, asphalt) for the ground. */
export function noiseTexture(base: string[], size = 16, seed = 1, repeat = 1) {
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d')!;
  let s = seed;
  const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++) {
      ctx.fillStyle = base[Math.floor(r() * base.length)];
      ctx.fillRect(x, y, 1, 1);
    }
  const tex = new THREE.CanvasTexture(c);
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeat, repeat);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.generateMipmaps = false;
  return tex;
}

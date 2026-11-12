"use client";

import { useEffect, useRef } from "react";

/**
 * Latar animasi hero: "langit" piksel ber-dither (terinspirasi andreas.vision), digambar di Canvas 2D.
 * - Awan noise bergeser pelan → dikuantisasi ke 7 tingkat warna palet (biru es → biru langit → biru → navy).
 * - Tengah dibiarkan kosong agar teks terbaca; awan tersibak di sekitar kursor.
 * - Muncul bertahap saat dimuat, 24 fps, berhenti saat tidak terlihat, statis bila reduced-motion.
 */

const C = { ice: "#A0E0EF", sky: "#60C1E5", blue: "#005A9C", navy: "#1B365D" };

/* ── value noise 3D kecil (tanpa dependensi) ── */
const hash3 = (x: number, y: number, z: number) => {
  let h = Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ Math.imul(z, 1440662683);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
};
const fade = (t: number) => t * t * (3 - 2 * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const noise3 = (x: number, y: number, z: number) => {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const zi = Math.floor(z);
  const u = fade(x - xi);
  const v = fade(y - yi);
  const w = fade(z - zi);
  const c = (dx: number, dy: number, dz: number) => hash3(xi + dx, yi + dy, zi + dz);
  return lerp(
    lerp(lerp(c(0, 0, 0), c(1, 0, 0), u), lerp(c(0, 1, 0), c(1, 1, 0), u), v),
    lerp(lerp(c(0, 0, 1), c(1, 0, 1), u), lerp(c(0, 1, 1), c(1, 1, 1), u), v),
    w,
  );
};
const fbm = (x: number, y: number, z: number) =>
  0.55 * noise3(x, y, z) + 0.3 * noise3(x * 2.03 + 11.5, y * 2.03 - 7.1, z * 1.7) + 0.15 * noise3(x * 4.1 - 3.3, y * 4.1 + 5.7, z * 2.3);
const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

// ambang tiap tingkat (v ≥ ambang[k] → tingkat k+1)
const LEVELS = [0.5, 0.56, 0.62, 0.68, 0.74, 0.8, 0.87];
const FRAME_MS = 1000 / 24;
const INTRO_MS = 1100;

type Clear = { cx: number; cy: number; rx: number; ry: number };

export default function PixelSky({
  className = "",
  clear = { cx: 0.5, cy: 0.47, rx: 0.4, ry: 0.27 },
  clearNarrow = { cx: 0.5, cy: 0.5, rx: 0.62, ry: 0.34 },
}: {
  className?: string;
  /** Elips kosong (pecahan lebar/tinggi) tempat konten berada — desktop */
  clear?: Clear;
  /** Elips kosong untuk layar sempit (<768px) */
  clearNarrow?: Clear;
}) {
  const clearRef = useRef({ clear, clearNarrow });
  clearRef.current = { clear, clearNarrow };
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let cell = 24;
    let cellD = 24;
    let cols = 0;
    let rows = 0;
    let checker: Record<"ice" | "sky" | "blue", CanvasPattern | null> = { ice: null, sky: null, blue: null };
    const pointer = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
    let raf = 0;
    let last = 0;
    let start = 0;
    let visible = true;

    const makeChecker = (color: string) => {
      const dot = Math.max(1, Math.round(dpr * 1.5));
      const tile = document.createElement("canvas");
      tile.width = tile.height = dot * 2;
      const t = tile.getContext("2d");
      if (!t) return null;
      t.fillStyle = color;
      t.fillRect(0, 0, dot, dot);
      t.fillRect(dot, dot, dot, dot);
      return ctx.createPattern(tile, "repeat");
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      cell = Math.min(26, Math.max(14, Math.round(w / 56)));
      cellD = Math.round(cell * dpr);
      cols = Math.ceil(canvas.width / cellD);
      rows = Math.ceil(canvas.height / cellD);
      checker = { ice: makeChecker(C.ice), sky: makeChecker(C.sky), blue: makeChecker(C.blue) };
    };

    const draw = (time: number) => {
      const t = time / 1000;
      const intro = reduce ? 1 : Math.floor(Math.min(1, (time - start) / INTRO_MS) * 6) / 6; // muncul dalam 6 langkah
      // elips kosong di tengah (lebih lebar di layar sempit karena teks lebih banyak baris)
      const zone = w < 768 ? clearRef.current.clearNarrow : clearRef.current.clear;
      const cx = w * zone.cx;
      const cy = h * zone.cy;
      const rx = w * zone.rx;
      const ry = h * zone.ry;
      // kursor menyibak awan (dihaluskan)
      pointer.x += (pointer.tx - pointer.x) * 0.25;
      pointer.y += (pointer.ty - pointer.y) * 0.25;
      const R = 130;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const px = (i + 0.5) * cell;
          const py = (j + 0.5) * cell;
          const dx = (px - cx) / rx;
          const dy = (py - cy) / ry;
          const edge = smoothstep(0.78, 1.5, Math.sqrt(dx * dx + dy * dy));
          let v = fbm(i * 0.075 + t * 0.06, j * 0.14, t * 0.05) + edge * 0.35 - 0.25;
          const mx = px - pointer.x;
          const my = py - pointer.y;
          v -= 0.35 * Math.exp(-(mx * mx + my * my) / (R * R));
          v -= (1 - intro) * 0.6;
          if (v < LEVELS[0]) continue;
          let level = 0;
          while (level < LEVELS.length && v >= LEVELS[level]) level++;

          const x = i * cellD;
          const y = j * cellD;
          switch (level) {
            case 1:
              ctx.fillStyle = checker.ice ?? C.ice;
              break;
            case 2:
              ctx.fillStyle = C.ice;
              break;
            case 3:
              ctx.fillStyle = C.ice;
              ctx.fillRect(x, y, cellD, cellD);
              ctx.fillStyle = checker.sky ?? C.sky;
              break;
            case 4:
              ctx.fillStyle = C.sky;
              break;
            case 5:
              ctx.fillStyle = C.sky;
              ctx.fillRect(x, y, cellD, cellD);
              ctx.fillStyle = checker.blue ?? C.blue;
              break;
            case 6:
              ctx.fillStyle = C.blue;
              break;
            default:
              ctx.fillStyle = C.navy;
          }
          ctx.fillRect(x, y, cellD, cellD);
        }
      }
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible || document.hidden) return;
      if (now - last < FRAME_MS) return;
      last = now;
      draw(now);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const rect = canvas.getBoundingClientRect();
      pointer.tx = e.clientX - rect.left;
      pointer.ty = e.clientY - rect.top;
      if (pointer.x < -9000) {
        pointer.x = pointer.tx;
        pointer.y = pointer.ty;
      }
    };
    const onLeave = () => {
      pointer.tx = -9999;
      pointer.ty = -9999;
    };

    resize();
    const ro = new ResizeObserver(() => {
      resize();
      if (reduce) draw(0);
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(canvas);

    if (reduce) {
      draw(0);
    } else {
      start = performance.now();
      window.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={`pointer-events-none block h-full w-full ${className}`} />;
}

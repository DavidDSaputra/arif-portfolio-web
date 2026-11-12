"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Layar TV tabung (CRT) ala yeahright.co:
 * bingkai tipis + layar cembung bersudut membulat, garis scan, vignette, kedip halus, label "CH 0x",
 * dan "semut" (static noise) yang muncul sebentar setiap `staticKey` berubah (ganti channel)
 * atau terus-menerus bila `idle` true (belum ada siaran).
 */
export default function TvScreen({
  channel,
  staticKey,
  idle = false,
  burstMs = 520,
  className = "",
  children,
}: {
  channel: string;
  staticKey?: string | number;
  idle?: boolean;
  burstMs?: number;
  className?: string;
  children?: React.ReactNode;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [burst, setBurst] = useState(false);
  const first = useRef(true);
  const showStatic = idle || burst;

  // semburan statis saat ganti channel (tidak saat pertama tampil)
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setBurst(true);
    const id = window.setTimeout(() => setBurst(false), burstMs);
    return () => window.clearTimeout(id);
  }, [staticKey, burstMs]);

  // gambar noise (resolusi rendah, diperbesar tanpa dihaluskan)
  useEffect(() => {
    if (!showStatic) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const W = 200;
    const H = 125;
    canvas.width = W;
    canvas.height = H;
    const img = ctx.createImageData(W, H);
    const tint = getComputedStyle(document.documentElement).getPropertyValue("--color-blue").trim() || "#a9b8ff";
    const m = /^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(tint);
    const [tr, tg, tb] = m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : [169, 184, 255];
    let raf = 0;
    let last = 0;
    let roll = 0;
    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      if (now - last < 1000 / 30) return;
      last = now;
      roll = (roll + 3) % H;
      const d = img.data;
      for (let y = 0; y < H; y++) {
        // pita terang yang bergulir pelan (seperti sinyal hilang)
        const band = Math.max(0, 1 - Math.abs(((y - roll + H) % H) - H / 2) / (H / 2)) * 0.35;
        for (let x = 0; x < W; x++) {
          const v = Math.random() * 0.85 + band * Math.random();
          const i = (y * W + x) * 4;
          d[i] = tr * v;
          d[i + 1] = tg * v;
          d[i + 2] = tb * v;
          d[i + 3] = 255;
        }
      }
      ctx.putImageData(img, 0, 0);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [showStatic]);

  return (
    <div className={`relative rounded-xl border border-blue/70 bg-black p-[1.6%] ${className}`}>
      <div className="tv-screen relative aspect-[16/10] overflow-hidden">
        <div className="tv-picture absolute inset-0">{children}</div>
        <canvas
          ref={canvasRef}
          aria-hidden
          className={`pointer-events-none absolute inset-0 h-full w-full transition-opacity duration-150 [image-rendering:pixelated] ${showStatic ? "opacity-100" : "opacity-0"}`}
        />
        <span aria-hidden className="tv-fx pointer-events-none absolute inset-0" />
        <span className="pointer-events-none absolute right-[4%] top-[5%] font-mono text-[clamp(1.25rem,3.2vw,2.5rem)] uppercase leading-none text-blue [text-shadow:2px_0_rgba(255,60,60,0.45),-2px_0_rgba(60,200,255,0.45)]">
          {channel}
        </span>
      </div>
    </div>
  );
}

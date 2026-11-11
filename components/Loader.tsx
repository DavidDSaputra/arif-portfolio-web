"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { LOGO_ACCENTS, LOGO_CELLS, LOGO_COLORS } from "@/lib/logo";
import { profile } from "@/lib/content";

/**
 * Layar loading: piksel logo "S" muncul acak satu per satu, lalu layar tersingkap ke atas.
 * Kunjungan pertama ±1,4 dtk; kunjungan berikutnya di sesi yang sama lebih singkat.
 * Setelah selesai menandai <html data-loaded> → animasi kata di hero baru mulai.
 */

// urutan acak tapi tetap (sama di server & browser, jadi tidak ada beda hidrasi)
const ORDER = LOGO_CELLS.map((c, i) => ({ ...c, d: ((i * 7) % LOGO_CELLS.length) * 38 }));
const ACCENT_DELAY = LOGO_CELLS.length * 38 + 60;

export default function Loader() {
  const [phase, setPhase] = useState<"show" | "exit" | "done">("show");

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try {
      seen = sessionStorage.getItem("loader-seen") === "1";
      sessionStorage.setItem("loader-seen", "1");
    } catch {}
    const hold = reduce ? 300 : seen ? 550 : 1400;
    const exit = reduce ? 200 : 750;

    const t1 = window.setTimeout(() => {
      setPhase("exit");
      document.documentElement.setAttribute("data-loaded", "");
    }, hold);
    const t2 = window.setTimeout(() => setPhase("done"), hold + exit);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      id="site-loader"
      role="status"
      aria-label="Memuat portofolio"
      className={`site-loader fixed inset-0 z-[200] grid place-items-center bg-white ${phase === "exit" ? "is-exit" : ""}`}
    >
      <div className="flex flex-col items-center gap-6">
        <svg viewBox="0 0 32 32" width={112} height={112} shapeRendering="crispEdges" aria-hidden>
          <rect width="32" height="32" rx="7" fill={LOGO_COLORS.bg} className="loader-bg" />
          {ORDER.map(({ x, y, d }) => (
            <rect
              key={`${x}-${y}`}
              x={5 + x * 3}
              y={5 + y * 3}
              width={3}
              height={3}
              fill={LOGO_COLORS.fg}
              className="loader-px"
              style={{ "--d": `${d}ms` } as CSSProperties}
            />
          ))}
          {LOGO_ACCENTS.map(({ x, y, color }) => (
            <rect
              key={`a${x}-${y}`}
              x={5 + x * 3}
              y={5 + y * 3}
              width={3}
              height={3}
              fill={color}
              className="loader-px"
              style={{ "--d": `${ACCENT_DELAY}ms` } as CSSProperties}
            />
          ))}
        </svg>
        <div className="loader-text text-center font-mono uppercase">
          <p className="text-sm font-semibold tracking-[0.3em] text-navy">{profile.fullName}</p>
          <p className="mt-2 text-[11px] tracking-[0.24em] text-mute">[ {profile.label} ]</p>
        </div>
      </div>
    </div>
  );
}

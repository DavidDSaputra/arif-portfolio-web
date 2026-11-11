"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { LOGO_ACCENTS, LOGO_CELLS, LOGO_COLORS } from "@/lib/logo";
import { profile, site } from "@/lib/content";

/**
 * Layar loading (konsep terinspirasi intro webdrift.be, desain & palet Samsul):
 * layar navy + label teknis di sudut → logo "S" berpiksel muncul → nama naik per huruf dari tipis
 * biru langit ke tebal putih → garis biru bercahaya membentang di tengah (TV CRT menyala) →
 * layar terbelah dari garis itu dan halaman terlihat.
 * Kunjungan berikutnya di sesi yang sama: versi singkat. Selesai → <html data-loaded>.
 */

type Phase = "intro" | "slit" | "open" | "done";

// urutan acak tapi tetap (sama di server & browser)
const ORDER = LOGO_CELLS.map((c, i) => ({ ...c, d: ((i * 7) % LOGO_CELLS.length) * 30 }));
const ACCENT_DELAY = LOGO_CELLS.length * 30 + 40;
const NAME = profile.fullName.toUpperCase();

const clockFmt = new Intl.DateTimeFormat(site.locale, { timeZone: site.timeZone, hour: "2-digit", minute: "2-digit", hour12: false });

export default function Loader() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [short, setShort] = useState(false);
  const [clock, setClock] = useState("");
  const countRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try {
      seen = sessionStorage.getItem("loader-seen") === "1";
      sessionStorage.setItem("loader-seen", "1");
    } catch {}
    setShort(seen);
    setClock(`${clockFmt.format(new Date())} WIB`);

    // urutan waktu (ms)
    const t = reduce
      ? { slit: 250, open: 260, done: 560 }
      : seen
        ? { slit: 380, open: 700, done: 1400 }
        : { slit: 1550, open: 1900, done: 2650 };

    // penghitung 000 → 100
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / (t.slit - 60));
      const eased = 1 - Math.pow(1 - p, 2.2);
      if (countRef.current) countRef.current.textContent = String(Math.round(eased * 100)).padStart(3, "0");
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const timers = [
      window.setTimeout(() => setPhase("slit"), t.slit),
      window.setTimeout(() => {
        setPhase("open");
        document.documentElement.setAttribute("data-loaded", "");
      }, t.open),
      window.setTimeout(() => setPhase("done"), t.done),
    ];
    return () => {
      cancelAnimationFrame(raf);
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div id="site-loader" role="status" aria-label="Memuat portofolio" data-phase={phase} data-short={short ? "" : undefined} className="ld">
      <div className="ld-cover">
        {/* label teknis di sudut */}
        <div className="ld-meta ld-meta-tl">
          <span className="ld-dot" /> {profile.handle.toUpperCase()}
        </div>
        <div className="ld-meta ld-meta-tr" suppressHydrationWarning>
          {clock || " "}
        </div>
        <div className="ld-meta ld-meta-bl">
          <span ref={countRef}>000</span> / 100
        </div>
        <div className="ld-meta ld-meta-br">Fig. 01 · Portfolio</div>

        <div className="ld-center">
          <svg viewBox="0 0 32 32" className="ld-logo" shapeRendering="crispEdges" aria-hidden>
            <rect width="32" height="32" rx="7" fill={LOGO_COLORS.bg} className="loader-bg" />
            {ORDER.map(({ x, y, d }) => (
              <rect key={`${x}-${y}`} x={5 + x * 3} y={5 + y * 3} width={3} height={3} fill={LOGO_COLORS.fg} className="loader-px" style={{ "--d": `${d}ms` } as CSSProperties} />
            ))}
            {LOGO_ACCENTS.map(({ x, y, color }) => (
              <rect key={`a${x}-${y}`} x={5 + x * 3} y={5 + y * 3} width={3} height={3} fill={color} className="loader-px" style={{ "--d": `${ACCENT_DELAY}ms` } as CSSProperties} />
            ))}
          </svg>

          {/* nama: tiap huruf naik & menebal (tipis biru langit → tebal putih) */}
          <p className="ld-name" aria-hidden>
            {[...NAME].map((ch, i) => (
              <span key={i} className="ld-ch" style={{ "--i": i } as CSSProperties}>
                {ch === " " ? " " : ch}
              </span>
            ))}
          </p>
          <p className="ld-sub">
            [ {profile.role} — {profile.label} ]
          </p>
        </div>
      </div>

      {/* garis bercahaya di tengah */}
      <span className="ld-slit" aria-hidden />
    </div>
  );
}

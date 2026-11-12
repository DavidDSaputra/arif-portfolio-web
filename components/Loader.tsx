"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { profile } from "@/lib/content";

/**
 * Layar loading interaktif (konsep "lift" ala yeahright.co):
 * angka 000 → 100 berisi warna yang naik dari bawah, label tahap di sampingnya, timer T+ di atasnya.
 * Interaksi: tahan klik / spasi untuk mempercepat, gerakkan mouse untuk memiringkan angka,
 * nyalakan suara (bunyi "tik" tiap 10 + "ding" saat masuk), lalu klik / Enter untuk masuk → "HALO!" → tirai terbelah dari tengah.
 * Kunjungan berikutnya di sesi yang sama: versi singkat tanpa klik. Selesai → <html data-loaded>.
 */

type Phase = "count" | "ready" | "hello" | "exit" | "done";

const STEPS = ["Brief", "Konsep", "Produksi", "Editing", "Siap tayang"];
const BASE_MS = 3200; // durasi 0 → 100 tanpa dipercepat
const BOOST = 3.5; // kelipatan kecepatan saat ditahan
const HELLO = "HALO!";

/* ── suara kecil tanpa file (WebAudio) ── */
function useBeeper() {
  const ctxRef = useRef<AudioContext | null>(null);
  const ensure = () => {
    if (!ctxRef.current) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      ctxRef.current = new AC();
    }
    if (ctxRef.current.state === "suspended") void ctxRef.current.resume();
    return ctxRef.current;
  };
  const tone = (freq: number, dur = 0.06, type: OscillatorType = "square", gain = 0.035, at = 0) => {
    const ctx = ensure();
    if (!ctx) return;
    const t0 = ctx.currentTime + at;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.setValueAtTime(gain, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g).connect(ctx.destination);
    o.start(t0);
    o.stop(t0 + dur + 0.02);
  };
  return { ensure, tone };
}

export default function Loader() {
  const [phase, setPhase] = useState<Phase>("count");
  const [short, setShort] = useState(false);
  const [sound, setSound] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const timerRef = useRef<HTMLSpanElement>(null);
  const stepRef = useRef<HTMLSpanElement>(null);
  const stepNoRef = useRef<HTMLSpanElement>(null);
  const boostRef = useRef(false);
  const soundRef = useRef(false);
  const phaseRef = useRef<Phase>("count");
  const beeper = useBeeper();

  phaseRef.current = phase;
  soundRef.current = sound;

  // kunci scroll selama loader tampil
  useEffect(() => {
    if (phase === "done") return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = prev;
    };
  }, [phase]);

  // penghitung
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try {
      seen = sessionStorage.getItem("loader-seen") === "1";
      sessionStorage.setItem("loader-seen", "1");
      setSound(localStorage.getItem("loader-sound") === "1");
    } catch {}
    setShort(seen);

    const total = reduce ? 1 : seen ? 650 : BASE_MS;
    let value = 0; // 0..1
    let last = performance.now();
    const t0 = last;
    let lastTen = 0;
    let raf = 0;

    const render = (p: number, now: number) => {
      const n = Math.round(p * 100);
      if (countRef.current) {
        countRef.current.textContent = String(n).padStart(3, "0");
        countRef.current.style.setProperty("--p", `${Math.round(p * 100)}%`);
      }
      if (timerRef.current) timerRef.current.textContent = `T+${((now - t0) / 1000).toFixed(2).padStart(5, "0")}`;
      const s = Math.min(STEPS.length - 1, Math.floor(p * STEPS.length));
      if (stepRef.current) stepRef.current.textContent = STEPS[s];
      if (stepNoRef.current) stepNoRef.current.textContent = `${String(s + 1).padStart(2, "0")}/${String(STEPS.length).padStart(2, "0")}`;
      const ten = Math.floor(n / 10);
      if (ten > lastTen) {
        lastTen = ten;
        if (soundRef.current) beeper.tone(320 + ten * 60, 0.05);
      }
    };

    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      value = Math.min(1, value + (dt / total) * (boostRef.current ? BOOST : 1));
      // sedikit "tersendat" seperti lift: melambat menjelang 100
      const eased = value < 1 ? 1 - Math.pow(1 - value, 1.6) : 1;
      render(eased, now);
      if (value < 1) raf = requestAnimationFrame(tick);
      else if (seen) {
        // kunjungan berikutnya: langsung buka tanpa klik
        setPhase("exit");
        document.documentElement.setAttribute("data-loaded", "");
      } else setPhase("ready");
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // urutan keluar
  useEffect(() => {
    if (phase === "hello") {
      const id = window.setTimeout(() => {
        document.documentElement.setAttribute("data-loaded", "");
        setPhase("exit");
      }, 1100);
      return () => window.clearTimeout(id);
    }
    if (phase === "exit") {
      const id = window.setTimeout(() => setPhase("done"), 1150);
      return () => window.clearTimeout(id);
    }
  }, [phase]);

  const enter = useCallback(() => {
    if (phaseRef.current !== "ready") return;
    if (soundRef.current) {
      // "ding" lift
      beeper.tone(880, 0.5, "sine", 0.06);
      beeper.tone(1320, 0.7, "sine", 0.04, 0.12);
    }
    setPhase("hello");
  }, [beeper]);

  // keyboard: tahan spasi = percepat, Enter/spasi saat siap = masuk
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") {
        if (phaseRef.current === "ready") {
          e.preventDefault();
          enter();
        } else if (e.key === " ") {
          e.preventDefault();
          boostRef.current = true;
        }
      }
    };
    const up = (e: KeyboardEvent) => {
      if (e.key === " ") boostRef.current = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [enter]);

  const onMove = (e: React.PointerEvent) => {
    const el = rootRef.current;
    if (!el || e.pointerType !== "mouse") return;
    const nx = e.clientX / window.innerWidth - 0.5;
    const ny = e.clientY / window.innerHeight - 0.5;
    el.style.setProperty("--rx", `${(nx * 18).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${(-ny * 14).toFixed(2)}deg`);
  };

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !sound;
    setSound(next);
    try {
      localStorage.setItem("loader-sound", next ? "1" : "0");
    } catch {}
    if (next) {
      beeper.ensure();
      beeper.tone(660, 0.08);
    }
  };

  if (phase === "done") return null;

  return (
    <div
      id="site-loader"
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label="Layar pembuka portofolio"
      data-phase={phase}
      data-short={short ? "" : undefined}
      data-lenis-prevent
      className="ld"
      onPointerMove={onMove}
      onPointerDown={() => {
        if (phaseRef.current === "count") boostRef.current = true;
      }}
      onPointerUp={() => (boostRef.current = false)}
      onPointerCancel={() => (boostRef.current = false)}
      onClick={enter}
    >
      {/* tirai dua daun; "HALO!" muncul di atasnya lalu ikut terbelah saat tirai terbuka */}
      {(["l", "r"] as const).map((side) => (
        <div key={side} className={`ld-door ld-door-${side}`} aria-hidden>
          <p className="ld-hello">
            {[...HELLO].map((ch, i) => (
              <span key={i} className="wv-c">
                <span className="wv-i" style={{ "--i": i } as CSSProperties}>
                  {ch}
                </span>
              </span>
            ))}
          </p>
        </div>
      ))}

      <p className="ld-meta ld-meta-tl">[{profile.handle.toUpperCase()}]</p>
      <p className="ld-meta ld-meta-tr">Portofolio — {profile.role}</p>

      <div className="ld-stage">
        <div className="ld-count-wrap">
          <span ref={timerRef} className="ld-timer">
            T+00.00
          </span>
          <span ref={countRef} className="ld-count" aria-hidden style={{ "--p": "0%" } as CSSProperties}>
            000
          </span>
          <span className="ld-step">
            <span ref={stepRef}>{STEPS[0]}</span>
          </span>
          <span className="ld-hint">[Tahan untuk mempercepat]</span>
        </div>
      </div>

      <button type="button" className="ld-meta ld-meta-bl ld-sound" aria-pressed={sound} onClick={toggleSound}>
        <span className="ld-sound-bars" aria-hidden>
          <i />
          <i />
          <i />
        </span>
        Suara {sound ? "on" : "off"}
      </button>

      <p className="ld-meta ld-meta-bc" aria-live="polite">
        {phase === "ready" ? <span className="ld-enter">[Klik untuk masuk]</span> : phase === "count" ? "[Memuat…]" : "[Selamat datang]"}
      </p>

      <span ref={stepNoRef} className="ld-meta ld-meta-br">
        01/05
      </span>
    </div>
  );
}

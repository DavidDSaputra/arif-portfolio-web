"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { profile } from "@/lib/content";

/**
 * Layar loading interaktif (konsep "lift" ala yeahright.co):
 * angka 000 → 100 berisi warna yang naik dari bawah, label tahap di sampingnya, timer T+ di atasnya.
 * Interaksi: tahan klik / spasi untuk mempercepat, gerakkan mouse untuk memiringkan angka,
 * nyalakan suara (bunyi "tik" tiap 10 + "ding" saat masuk). Di 100% muncul tombol "Klik untuk membuka" →
 * "YO, WHAT'S UP!" → tirai terbelah dari tengah, pelan & halus. Selalu menunggu klik (juga di kunjungan berikutnya).
 * Kunjungan berikutnya di sesi yang sama: lift lebih cepat, tetap menunggu klik. Selesai → <html data-loaded>.
 */

type Phase = "count" | "ready" | "hello" | "exit" | "done";

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0]; // 0 di akhir agar 9 → 0 berputar mulus

const STEPS = ["Brief", "Konsep", "Produksi", "Editing", "Siap tayang"];
const BASE_MS = 6000; // durasi 0 → 100 tanpa dipercepat (halus, tidak terburu-buru)
const BOOST = 3.5; // kelipatan kecepatan saat ditahan
const HELLO_MS = 2000; // lama "YO, WHAT'S UP!" tampil sebelum tirai terbuka
const CURTAIN_MS = 1700; // durasi tirai terbuka (samakan dengan .ld-door di globals.css)
const HELLO = ["YO,", "WHAT'S UP!"];

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
  const [sound, setSound] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const timerRef = useRef<HTMLSpanElement>(null);
  const stepRef = useRef<HTMLSpanElement>(null);
  const stepNoRef = useRef<HTMLSpanElement>(null);
  const boostRef = useRef(false);
  const soundRef = useRef(false);
  const phaseRef = useRef<Phase>("count");
  // klik hanya dihitung bila tombol ditekan SETELAH angka mencapai 100 (tahan-untuk-mempercepat tidak langsung membuka)
  const readyAtRef = useRef(Infinity);
  const downAtRef = useRef(0);
  const ctaRef = useRef<HTMLButtonElement>(null);
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

    // kunjungan berikutnya: lift lebih cepat, tapi tetap menunggu klik
    const total = reduce ? 1 : seen ? BASE_MS * 0.5 : BASE_MS;
    let value = 0; // 0..1
    let last = performance.now();
    const t0 = last;
    let lastTen = 0;
    let raf = 0;

    const render = (p: number, now: number) => {
      const x = p * 100;
      const n = Math.floor(x + 1e-6);
      if (countRef.current) {
        // odometer: satuan berputar terus, puluhan & ratusan ikut berputar hanya saat "membawa" (9 → 10)
        const ones = x % 10;
        const tens = (Math.floor(x / 10) % 10) + Math.max(0, ones - 9);
        const hundreds = Math.floor(x / 100) + Math.max(0, (x % 100) - 99);
        const pos = [hundreds, tens, ones];
        countRef.current.querySelectorAll<HTMLElement>("[data-col]").forEach((el) => {
          el.style.transform = `translateY(calc(${(-pos[Number(el.dataset.col)]).toFixed(4)} * var(--cell)))`;
        });
        countRef.current.style.setProperty("--p", `${p * 100}%`);
        countRef.current.setAttribute("aria-label", `${n} persen`);
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
      // gerak lift halus: pelan saat berangkat, lancar di tengah, pelan lagi saat tiba (ease-in-out)
      const eased = value < 1 ? (value < 0.5 ? 4 * value ** 3 : 1 - (-2 * value + 2) ** 3 / 2) : 1;
      render(eased, now);
      if (value < 1) raf = requestAnimationFrame(tick);
      else {
        readyAtRef.current = performance.now();
        if (soundRef.current) beeper.tone(1040, 0.12, "triangle", 0.05);
        setPhase("ready");
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // fokus keyboard ke tombol "Klik untuk membuka" saat siap
  useEffect(() => {
    if (phase === "ready") ctaRef.current?.focus({ preventScroll: true });
  }, [phase]);

  // urutan keluar
  useEffect(() => {
    if (phase === "hello") {
      const id = window.setTimeout(() => {
        document.documentElement.setAttribute("data-loaded", "");
        setPhase("exit");
      }, HELLO_MS);
      return () => window.clearTimeout(id);
    }
    if (phase === "exit") {
      const id = window.setTimeout(() => setPhase("done"), CURTAIN_MS + 150);
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
      data-lenis-prevent
      className="ld"
      onPointerMove={onMove}
      onPointerDown={() => {
        downAtRef.current = performance.now();
        if (phaseRef.current === "count") boostRef.current = true;
      }}
      onPointerUp={() => (boostRef.current = false)}
      onPointerCancel={() => (boostRef.current = false)}
      onClick={() => {
        if (downAtRef.current >= readyAtRef.current) enter();
      }}
      data-cursor={phase === "ready" ? "Klik untuk membuka" : undefined}
    >
      {/* tirai dua daun; "YO, WHAT'S UP!" muncul di atasnya lalu ikut terbelah saat tirai terbuka */}
      {(["l", "r"] as const).map((side) => {
        let i = 0;
        return (
          <div key={side} className={`ld-door ld-door-${side}`} aria-hidden>
            <p className="ld-hello">
              {HELLO.map((line) => (
                <span key={line} className="block whitespace-nowrap">
                  {[...line].map((ch, ci) =>
                    ch === " " ? (
                      <span key={ci}> </span>
                    ) : (
                      <span key={ci} className="wv-c">
                        <span className="wv-i" style={{ "--i": i++ } as CSSProperties}>
                          {ch}
                        </span>
                      </span>
                    ),
                  )}
                </span>
              ))}
            </p>
          </div>
        );
      })}

      <p className="ld-meta ld-meta-tl">[{profile.handle.toUpperCase()}]</p>
      <p className="ld-meta ld-meta-tr">Portofolio — {profile.role}</p>

      <div className="ld-stage">
        <div className="ld-count-wrap">
          <span ref={timerRef} className="ld-timer">
            T+00.00
          </span>
          <span ref={countRef} className="ld-count" role="img" aria-label="0 persen" style={{ "--p": "0%" } as CSSProperties}>
            {/* dua lapis odometer yang sama: garis luar (redup) + isian yang naik dari bawah */}
            {(["ld-odo-line", "ld-odo-fill"] as const).map((layer) => (
              <span key={layer} className={`ld-odo ${layer}`} aria-hidden>
                {[0, 1, 2].map((col) => (
                  <span key={col} className="ld-digit">
                    <span className="ld-strip" data-col={col}>
                      {DIGITS.map((d, k) => (
                        <span key={k}>{d}</span>
                      ))}
                    </span>
                  </span>
                ))}
              </span>
            ))}
          </span>
          <span className="ld-step">
            <span ref={stepRef}>{STEPS[0]}</span>
          </span>
          <span className="ld-hint">[Tahan untuk mempercepat]</span>
          {/* indikator: muncul saat 100% */}
          <button ref={ctaRef} type="button" className="ld-cta" tabIndex={phase === "ready" ? 0 : -1} aria-hidden={phase !== "ready"}>
            <svg viewBox="0 0 24 24" className="ld-cta-hand" aria-hidden>
              <path
                d="M9 11V5.5a1.5 1.5 0 0 1 3 0V10m0-.5V8a1.5 1.5 0 0 1 3 0v2m0-.5a1.5 1.5 0 0 1 3 0V14a6 6 0 0 1-6 6h-.6a6 6 0 0 1-4.6-2.2L4.6 15a1.5 1.5 0 0 1 2.2-2L9 15"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Klik untuk membuka
          </button>
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
        {phase === "ready" ? <span className="ld-enter">[Klik di mana saja / Enter]</span> : phase === "count" ? "[Memuat…]" : "[Selamat datang]"}
      </p>

      <span ref={stepNoRef} className="ld-meta ld-meta-br">
        01/05
      </span>
    </div>
  );
}

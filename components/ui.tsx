"use client";

import Link from "next/link";
import { Fragment, useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { motion, useInView, useReducedMotion, type HTMLMotionProps } from "motion/react";
import { ArrowUpRight, Spark } from "./icons";

/* ── Animasi teks ala yeahright.co ── */

/** Hook kecil: true sekali saat elemen masuk layar. */
function useOnce<T extends Element>(margin = "0px 0px -10% 0px") {
  const ref = useRef<T>(null);
  const inView = useInView(ref, { once: true, margin: margin as never });
  return [ref, inView] as const;
}

/**
 * Teks gelombang: tiap huruf naik dari bawah (terpotong) bergiliran saat terlihat;
 * di-hover hurufnya melompat bergelombang. `lines` = tiap string satu baris.
 */
export function WaveText({
  lines,
  as: Tag = "span",
  className = "",
  lineClassName = "",
  delay = 0,
  id,
}: {
  lines: string[];
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  lineClassName?: string;
  delay?: number;
  id?: string;
}) {
  const [ref, on] = useOnce<HTMLElement>();
  let i = 0;
  return (
    <Tag
      ref={ref as never}
      id={id}
      data-on={on ? "" : undefined}
      className={`wv ${className}`}
      style={{ "--wv-delay": `${delay}ms` } as CSSProperties}
    >
      <span className="sr-only">{lines.join(" ")}</span>
      {lines.map((line, li) => (
        <span key={li} aria-hidden className={`block whitespace-nowrap ${lineClassName}`}>
          {line.split(" ").map((word, wi, arr) => (
            <Fragment key={wi}>
              {/* huruf dikelompokkan per kata → pindah baris hanya di spasi */}
              <span className="inline-block whitespace-nowrap">
                {[...word].map((ch, ci) => (
                  <span key={ci} className="wv-c">
                    <span className="wv-i" style={{ "--i": i++ } as CSSProperties}>
                      {ch}
                    </span>
                  </span>
                ))}
              </span>
              {wi < arr.length - 1 ? " " : null}
            </Fragment>
          ))}
        </span>
      ))}
    </Tag>
  );
}

/** Teks outline yang menyala berkedip seperti neon rusak saat terlihat. */
export function FlickerText({
  lines,
  as: Tag = "p",
  className = "",
  delay = 0,
}: {
  lines: string[];
  as?: "h2" | "h3" | "p" | "span";
  className?: string;
  delay?: number;
}) {
  const [ref, on] = useOnce<HTMLElement>();
  let i = 0;
  return (
    <Tag
      ref={ref as never}
      data-on={on ? "" : undefined}
      className={`flicker text-outline ${className}`}
      style={{ "--wv-delay": `${delay}ms` } as CSSProperties}
    >
      <span className="sr-only">{lines.join(" ")}</span>
      {lines.map((line, li) => (
        <span key={li} aria-hidden className="block whitespace-nowrap">
          {[...line].map((ch, ci) => (
            <span key={ci} className="flicker-c" style={{ "--i": i++ } as CSSProperties}>
              {ch === " " ? " " : ch}
            </span>
          ))}
        </span>
      ))}
    </Tag>
  );
}

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+/<>_";

/**
 * Teks mono yang "teracak" lalu tersusun dari kiri ke kanan saat terlihat (dan lagi saat di-hover).
 * Panjang teks tetap sama, jadi tata letak tidak bergeser.
 */
export function Scramble({ text, className = "", delay = 0 }: { text: string; className?: string; delay?: number }) {
  const [ref, on] = useOnce<HTMLSpanElement>();
  const [out, setOut] = useState(text);
  const raf = useRef(0);
  const reduce = useReducedMotion();

  const run = useCallback(
    (wait: number) => {
      if (reduce) return;
      cancelAnimationFrame(raf.current);
      const start = performance.now() + wait;
      const dur = Math.min(900, 280 + text.length * 22);
      const step = (now: number) => {
        const p = Math.max(0, (now - start) / dur);
        const fixed = Math.floor(p * text.length);
        let s = "";
        for (let k = 0; k < text.length; k++) {
          const c = text[k];
          s += k < fixed || c === " " || c === "[" || c === "]" ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0];
        }
        setOut(s);
        if (p < 1) raf.current = requestAnimationFrame(step);
        else setOut(text);
      };
      raf.current = requestAnimationFrame(step);
    },
    [text, reduce],
  );

  useEffect(() => {
    if (!on) return;
    // tunggu layar loading selesai
    const go = () => run(delay);
    if (document.documentElement.hasAttribute("data-loaded")) go();
    else {
      const mo = new MutationObserver(() => {
        if (document.documentElement.hasAttribute("data-loaded")) {
          mo.disconnect();
          go();
        }
      });
      mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-loaded"] });
      return () => mo.disconnect();
    }
    return () => cancelAnimationFrame(raf.current);
  }, [on, run, delay]);

  return (
    <span ref={ref} className={className} onMouseEnter={() => run(0)} aria-label={text}>
      <span aria-hidden>{out}</span>
    </span>
  );
}

/** Kicker: "JUDUL [TAG]" dengan efek acak huruf. */
export function Kicker({ title, tag, className = "" }: { title: string; tag?: string; className?: string }) {
  return (
    <p className={`font-mono text-xs uppercase sm:text-sm ${className}`}>
      <Scramble text={title} className="text-blue" />
      {tag && <span className="mt-1 block text-mute sm:ml-3 sm:mt-0 sm:inline">{tag}</span>}
    </p>
  );
}

/** Judul display besar dengan animasi gelombang. */
export function ScriptTitle({
  words,
  as: Tag = "h2",
  id,
  className = "",
}: {
  words: string[];
  as?: "h1" | "h2" | "h3";
  id?: string;
  className?: string;
}) {
  return <WaveText as={Tag} id={id} lines={[words.join(" ")]} className={`display text-fg ${className}`} />;
}

/* ── Bagian bersama untuk section "slide" ── */

/** Header slide: judul gelombang + subjudul outline berkedip + tag. */
export function SlideHeader({
  id,
  words,
  subtitle,
  tag,
  titleClassName = "text-[clamp(3.5rem,11vw,9rem)]",
}: {
  id: string;
  words: string[];
  subtitle: string | string[];
  tag?: string;
  titleClassName?: string;
}) {
  const lines = Array.isArray(subtitle) ? subtitle : [subtitle];
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <ScriptTitle id={id} words={words} className={titleClassName} />
      <div className="lg:max-w-[46%] lg:shrink-0 lg:pb-2 lg:text-right">
        <FlickerText lines={lines} className="display text-[clamp(1.75rem,4vw,3.5rem)] text-blue" delay={200} />
        {tag && (
          <p className="mt-3 font-mono text-xs uppercase text-mute sm:text-sm">
            <Scramble text={tag} />
          </p>
        )}
      </div>
    </div>
  );
}

/** Label kecil bernomor: "[01] BANNER" */
export function NumLabel({ no, children }: { no: string; children: React.ReactNode }) {
  return (
    <p className="mb-4 flex items-baseline gap-2 font-mono text-xs uppercase sm:text-sm">
      <span className="text-blue">[{no}]</span>
      <span>{children}</span>
    </p>
  );
}

/** Tombol oranye ke halaman detail karya. */
export function DetailLink({ href, label = "Lihat detail project" }: { href: string; label?: string }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-2 border border-blue bg-blue px-6 py-3 font-mono text-xs uppercase text-cream transition-colors duration-300 hover:bg-transparent hover:text-blue sm:text-sm"
    >
      {label}
      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
    </Link>
  );
}

/** Bingkai HP (gaya mockup di PDF). */
export function PhoneFrame({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-[2.2rem] border-[3px] border-fg/20 bg-black p-[7px] shadow-[0_30px_80px_-24px_rgba(0,0,0,0.6)] ${className}`}>
      <div className="relative overflow-hidden rounded-[1.75rem]">
        <span aria-hidden className="absolute left-1/2 top-1.5 z-10 h-3.5 w-[32%] -translate-x-1/2 rounded-full bg-black" />
        {children}
      </div>
    </div>
  );
}

/** Easing "outExpo" — sama dengan animasi Webflow di template Fearless. */
export const outExpo = [0.19, 1, 0.22, 1] as const;

/** Posisi 4 kotak sudut (sengaja sedikit tidak rata, persis referensi). */
const boxCorners = [
  "-left-[5px] -top-[7px]",
  "-right-[7px] -top-[8px]",
  "-bottom-[4px] -left-[5px]",
  "-bottom-[5px] -right-[7px]",
];

/**
 * Kotak "ngebuka" ala Fearless (timing dari animasi asli "Anime On Load Summery"):
 * titik 20px → 4 sudut muncul & melebar jadi garis (0,8s) → membuka ke bawah (1,3s) → teks naik.
 * Konten sudah menempati posisi akhirnya sejak awal, jadi layout di sekitarnya tidak melompat.
 */
export function OpenBox({
  children,
  delay = 1,
  trigger = "load",
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  /** "load" = mulai saat halaman dimuat; "view" = mulai saat kotak terlihat di layar */
  trigger?: "load" | "view";
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });
  const on = reduce || trigger === "load" || inView;
  const lineDone = delay + 0.8;

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* Bingkai + sudut. Ukuran pakai % (0% → 100%) agar tetap responsif setelah animasi selesai. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-[10px]"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: on ? 1 : 0 }}
        transition={{ delay, duration: 0.4, ease: outExpo }}
      >
        <motion.div
          className="absolute left-0 top-0 border border-blue/50 bg-deep/80"
          initial={reduce ? false : { width: "0%", height: "0%" }}
          animate={on ? { width: "100%", height: "100%" } : { width: "0%", height: "0%" }}
          transition={{
            width: { delay, duration: 0.8, ease: outExpo },
            height: { delay: lineDone, duration: 1.3, ease: outExpo },
          }}
        >
          {boxCorners.map((pos) => (
            <motion.span
              key={pos}
              className={`absolute size-3 border border-blue bg-paper ${pos}`}
              initial={reduce ? false : { scale: 0 }}
              animate={{ scale: on ? 1 : 0 }}
              transition={{ delay, duration: 0.4, ease: outExpo }}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* Isi: padding = 10px holder + 1,6px garis + 20px paragraf */}
      <motion.div
        className="relative p-[31.6px]"
        initial={reduce ? false : { opacity: 0, y: 10 }}
        animate={on ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ delay: lineDone + 0.2, duration: 0.8, ease: outExpo }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/** Scroll-reveal sederhana */
export function Reveal({
  children,
  delay = 0,
  y = 40,
  className,
  ...rest
}: { children: React.ReactNode; delay?: number; y?: number } & HTMLMotionProps<"div">) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Marquee teks berjalan — berhenti bila prefers-reduced-motion */
export function Marquee({
  items,
  duration = 30,
  reverse = false,
  className = "",
}: {
  items: string[];
  duration?: number;
  reverse?: boolean;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {items.map((t) => (
        <li key={t} className="flex items-center">
          <span className="px-6 sm:px-10">{t}</span>
          <Spark className="h-[0.5em] w-[0.5em] shrink-0 text-cream" />
        </li>
      ))}
    </ul>
  );

  return (
    <div className={`relative flex overflow-hidden whitespace-nowrap ${className}`} role="marquee" aria-label={items.join(", ")}>
      <div
        className={`flex w-max ${reduce ? "" : "animate-marquee"}`}
        style={{ ["--marquee-duration" as string]: `${duration}s`, animationDirection: reverse ? "reverse" : undefined }}
      >
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}

/** Tombol pill */
export function Pill({
  href,
  children,
  variant = "solid",
  className = "",
  external,
  download,
  ariaLabel,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "ghost";
  className?: string;
  external?: boolean;
  download?: boolean;
  ariaLabel?: string;
}) {
  const styles =
    variant === "solid"
      ? "border border-blue bg-blue text-cream hover:bg-transparent hover:text-blue"
      : "border border-fg/30 text-fg hover:border-blue hover:text-blue";
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      download={download || undefined}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`group inline-flex items-center gap-2 px-5 py-3 font-mono text-xs uppercase transition-colors duration-300 sm:text-sm ${styles} ${className}`}
    >
      {children}
    </a>
  );
}

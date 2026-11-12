"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useInView, useReducedMotion, type HTMLMotionProps } from "motion/react";
import { ArrowUpRight, Spark } from "./icons";

/** Kicker ala Fearless: "SELECTED WORK [WITH THE FINEST TOUCH]" */
export function Kicker({ title, tag, className = "" }: { title: string; tag?: string; className?: string }) {
  return (
    <p className={`font-mono text-xs font-semibold uppercase tracking-[0.18em] sm:text-sm ${className}`}>
      <span className="text-sky">{title}</span>
      {tag && <span className="mt-1 block text-mute sm:ml-3 sm:mt-0 sm:inline">{tag}</span>}
    </p>
  );
}

/** Judul display dengan huruf awal script bercahaya (gaya PDF) */
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
  return (
    <Tag id={id} className={`display text-sky ${className}`}>
      {words.map((w, i) => (
        <span key={i} className="mr-[0.25em] inline-block whitespace-nowrap last:mr-0">
          <span aria-hidden className="script-glow -mr-[0.08em] inline-block translate-y-[0.08em] text-[1.15em] normal-case">
            {w[0]}
          </span>
          <span aria-hidden>{w.slice(1)}</span>
        </span>
      ))}
      <span className="sr-only">{words.join(" ")}</span>
    </Tag>
  );
}

/* ── Bagian bersama untuk section "slide" (gaya slide PDF) ── */

/** Header slide: judul ber-huruf script + subjudul putih bercahaya + tag. */
export function SlideHeader({
  id,
  words,
  subtitle,
  tag,
  titleClassName = "text-[clamp(3rem,9vw,7.5rem)]",
}: {
  id: string;
  words: string[];
  subtitle: string | string[];
  tag?: string;
  titleClassName?: string;
}) {
  const lines = Array.isArray(subtitle) ? subtitle : [subtitle];
  return (
    <Reveal className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <ScriptTitle id={id} words={words} className={titleClassName} />
      <div className="lg:max-w-[46%] lg:shrink-0 lg:pb-3 lg:text-right">
        <p className="display text-[clamp(1.5rem,3.6vw,3rem)] text-fg [text-shadow:0_0_28px_rgba(96,193,229,0.55)]">
          {lines.map((l) => (
            <span key={l} className="block">
              {l}
            </span>
          ))}
        </p>
        {tag && <p className="mt-2 font-mono text-xs uppercase tracking-[0.16em] text-mute sm:text-sm">{tag}</p>}
      </div>
    </Reveal>
  );
}

/** Label kecil bernomor: "[01] BANNER" */
export function NumLabel({ no, children }: { no: string; children: React.ReactNode }) {
  return (
    <p className="mb-4 flex items-baseline gap-2 font-mono text-xs font-semibold uppercase tracking-[0.2em] sm:text-sm">
      <span className="text-sky">[{no}]</span>
      <span>{children}</span>
    </p>
  );
}

/** Tombol oranye ke halaman detail karya. */
export function DetailLink({ href, label = "Lihat detail project" }: { href: string; label?: string }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-2 rounded-full bg-sky px-6 py-3 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-navy transition-colors duration-300 hover:bg-ice sm:text-sm"
    >
      {label}
      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
    </Link>
  );
}

/** Bingkai HP (gaya mockup di PDF). */
export function PhoneFrame({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-[2.2rem] border-[3px] border-fg/25 bg-black p-[7px] shadow-[0_30px_80px_-24px_rgba(0,90,156,0.5)] ${className}`}>
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
          className="absolute left-0 top-0 border-[1.6px] border-sky/50 bg-deep/70"
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
              className={`absolute size-3 border-[1.6px] border-sky bg-navy ${pos}`}
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
          <Spark className="h-[0.5em] w-[0.5em] shrink-0 text-white" />
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
      ? "bg-sky text-navy hover:bg-ice"
      : "border border-fg/25 text-fg hover:border-sky hover:text-ice";
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      download={download || undefined}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`group inline-flex items-center gap-2 rounded-full px-5 py-3 font-mono text-xs font-semibold uppercase tracking-[0.14em] transition-colors duration-300 sm:text-sm ${styles} ${className}`}
    >
      {children}
    </a>
  );
}

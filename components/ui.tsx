"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";
import { Spark } from "./icons";

/** Kicker ala Fearless: "SELECTED WORK [WITH THE FINEST TOUCH]" */
export function Kicker({ title, tag, className = "" }: { title: string; tag?: string; className?: string }) {
  return (
    <p className={`font-mono text-xs font-semibold uppercase tracking-[0.18em] sm:text-sm ${className}`}>
      <span className="text-orange">{title}</span>
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
    <Tag id={id} className={`display text-orange ${className}`}>
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
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const lineDone = delay + 0.8;

  return (
    <div className={`relative ${className}`}>
      {/* Bingkai + sudut. Ukuran pakai % (0% → 100%) agar tetap responsif setelah animasi selesai. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-[10px]"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay, duration: 0.4, ease: outExpo }}
      >
        <motion.div
          className="absolute left-0 top-0 border-[1.6px] border-[#d9d9d9] bg-black/30"
          initial={reduce ? false : { width: "0%", height: "0%" }}
          animate={{ width: "100%", height: "100%" }}
          transition={{
            width: { delay, duration: 0.8, ease: outExpo },
            height: { delay: lineDone, duration: 1.3, ease: outExpo },
          }}
        >
          {boxCorners.map((pos) => (
            <motion.span
              key={pos}
              className={`absolute size-3 border-[1.6px] border-orange bg-white ${pos}`}
              initial={reduce ? false : { scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay, duration: 0.4, ease: outExpo }}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* Isi: padding = 10px holder + 1,6px garis + 20px paragraf */}
      <motion.div
        className="relative p-[31.6px]"
        initial={reduce ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
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
          <Spark className="h-[0.5em] w-[0.5em] shrink-0 text-ink" />
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
      ? "bg-orange text-ink hover:bg-paper"
      : "border border-white/25 text-white hover:border-orange hover:text-orange";
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

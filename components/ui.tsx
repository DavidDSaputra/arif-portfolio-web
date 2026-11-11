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

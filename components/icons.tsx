import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;
const base = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export const ArrowUpRight = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden {...base} {...p}>
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);

export const ArrowRight = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden {...base} {...p}>
    <path d="M4 12h16M14 6l6 6-6 6" />
  </svg>
);

export const Home = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden {...base} {...p}>
    <path d="M4 11.5 12 5l8 6.5" />
    <path d="M6.5 10v9h11v-9M10 19v-5h4v5" />
  </svg>
);

export const User = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden {...base} {...p}>
    <circle cx="12" cy="8.5" r="3.5" />
    <path d="M5 19.5c1.2-3.4 3.8-5 7-5s5.8 1.6 7 5" />
  </svg>
);

export const Briefcase = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden {...base} {...p}>
    <rect x="3.5" y="7.5" width="17" height="12" rx="2" />
    <path d="M9 7.5V5.8c0-.7.6-1.3 1.3-1.3h3.4c.7 0 1.3.6 1.3 1.3v1.7M3.5 12.5h17" />
  </svg>
);

export const Chart = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden {...base} {...p}>
    <path d="M4 19.5h16" />
    <path d="M7 16v-4M11.5 16V8M16 16v-6" />
    <path d="M6 9.5 10.5 6l3 2.5L18 4.5" />
  </svg>
);

export const Layers = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden {...base} {...p}>
    <path d="m12 4 8 4.2-8 4.3-8-4.3z" />
    <path d="m4 12.3 8 4.2 8-4.2M4 16.3l8 4.2 8-4.2" />
  </svg>
);

export const ArrowUp = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden {...base} {...p}>
    <path d="M12 20V4M6 10l6-6 6 6" />
  </svg>
);

export const ArrowLeft = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden {...base} {...p}>
    <path d="M20 12H4M10 6l-6 6 6 6" />
  </svg>
);

export const Download = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden {...base} {...p}>
    <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />
  </svg>
);

export const Instagram = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden {...base} {...p}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" />
  </svg>
);

export const WhatsApp = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden {...base} {...p}>
    <path d="M4 20.5 5.3 16.6A8.5 8.5 0 1 1 8.4 19.5Z" />
    <path d="M9.2 8.6c.2-.4.6-.5.9-.4l.7 1.6c.1.2 0 .5-.2.7l-.5.5c.6 1.2 1.6 2.2 2.8 2.8l.5-.5c.2-.2.5-.3.7-.2l1.6.7c.2.3.1.7-.3.9-.9.6-2 .7-3 .2a8.6 8.6 0 0 1-3.6-3.6c-.4-.9-.3-2 .4-2.7Z" />
  </svg>
);

export const Mail = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden {...base} {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m4 7 8 6 8-6" />
  </svg>
);

export const Play = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden {...p}>
    <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
  </svg>
);

/** Ikon menu "grid titik" ala Fearless */
export const MenuDots = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden {...p}>
    {[5, 12, 19].flatMap((y) => [5, 12, 19].map((x) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.8" fill="currentColor" />))}
  </svg>
);

export const Close = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden {...base} {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

/* ── Dekorasi SVG ── */

/** Paperclip / "clip" */
export const Clip = (p: P) => (
  <svg viewBox="0 0 60 140" aria-hidden {...base} strokeWidth={4} {...p}>
    <path d="M42 30v74a14 14 0 0 1-28 0V22a10 10 0 0 1 20 0v76a4 4 0 0 1-8 0V36" />
  </svg>
);

/** Panah panjang bergaya tangan */
export const LongArrow = (p: P) => (
  <svg viewBox="0 0 220 60" aria-hidden {...base} strokeWidth={2.4} {...p}>
    <path d="M4 44C50 10 120 6 196 26" />
    <path d="M182 12l16 14-20 8" />
  </svg>
);

/** Bintang 4 sudut */
export const Spark = (p: P) => (
  <svg viewBox="0 0 40 40" aria-hidden {...p}>
    <path d="M20 0c1.6 10.6 8.4 17.4 20 20-11.6 2.6-18.4 9.4-20 20-1.6-10.6-8.4-17.4-20-20C11.6 17.4 18.4 10.6 20 0Z" fill="currentColor" />
  </svg>
);

/** Coretan zig-zag */
export const Squiggle = (p: P) => (
  <svg viewBox="0 0 160 30" aria-hidden {...base} strokeWidth={3} {...p}>
    <path d="M2 18 18 6l16 18 16-18 16 18 16-18 16 18 16-18 16 18 16-12" />
  </svg>
);

/** Lingkaran teks berputar */
export const CircleBadge = ({ text, ...p }: P & { text: string }) => (
  <svg viewBox="0 0 200 200" aria-hidden {...p}>
    <defs>
      <path id="circ" d="M100 100m-78 0a78 78 0 1 1 156 0a78 78 0 1 1-156 0" />
    </defs>
    <text fontSize="17" letterSpacing="4" fill="currentColor" style={{ fontFamily: "var(--font-mono)", fontWeight: 600 }}>
      <textPath href="#circ">{text}</textPath>
    </text>
  </svg>
);

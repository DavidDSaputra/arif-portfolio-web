"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { nav, profile, socials } from "@/lib/content";
import { Close } from "./icons";
import { Scramble } from "./ui";
import Logo from "./Logo";

const PALETTES = ["Malam", "Hijau", "Biru", "Mawar"];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [palette, setPalette] = useState(0);
  const [doors, setDoors] = useState(false);
  const reduce = useReducedMotion();

  // palet tersimpan per pengunjung
  useEffect(() => {
    try {
      const saved = Number(localStorage.getItem("palette") ?? 0);
      if (saved > 0 && saved < PALETTES.length) {
        setPalette(saved);
        document.documentElement.setAttribute("data-palette", String(saved));
      }
    } catch {}
  }, []);

  /** "BOSAN?" → pintu menutup, palet berganti, pintu membuka. */
  const nextPalette = () => {
    const next = (palette + 1) % PALETTES.length;
    const apply = () => {
      if (next === 0) document.documentElement.removeAttribute("data-palette");
      else document.documentElement.setAttribute("data-palette", String(next));
      setPalette(next);
      try {
        localStorage.setItem("palette", String(next));
      } catch {}
    };
    if (reduce) return apply();
    setDoors(true);
    window.setTimeout(() => {
      apply();
      window.setTimeout(() => setDoors(false), 120);
    }, 480);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-[var(--frame)] top-[var(--frame)] z-50">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-3 px-4 py-4 font-mono text-xs uppercase sm:px-8 sm:text-sm">
        <Link href="/" className="flex items-center gap-2 mix-blend-difference" data-cursor="Beranda">
          <Logo size={22} className="rounded-[5px]" />
          <span>
            {profile.handle.toUpperCase()}
            <span className="blink text-blue">_</span>
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={nextPalette}
            data-cursor="Ganti warna"
            className="group flex items-center gap-2 border border-fg/25 bg-paper/70 px-3 py-2 backdrop-blur-md transition-colors hover:border-blue hover:text-blue"
            aria-label={`Ganti palet warna (sekarang ${PALETTES[palette]})`}
          >
            <span className="grid grid-cols-2 gap-[2px]" aria-hidden>
              <i className="h-1.5 w-1.5 bg-fg" />
              <i className="h-1.5 w-1.5 bg-blue" />
              <i className="h-1.5 w-1.5 bg-blue" />
              <i className="h-1.5 w-1.5 bg-mute" />
            </span>
            <Scramble text="Bosan?" />
          </button>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label="Buka menu"
            className="flex items-center gap-2 border border-blue bg-blue px-3 py-2 text-cream transition-colors hover:bg-transparent hover:text-blue"
          >
            [<span>Menu</span>]
          </button>
        </div>
      </div>

      {/* pintu ganti palet */}
      <div className="pal-doors" aria-hidden data-closed={doors ? "" : undefined}>
        <i />
        <i />
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="site-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu navigasi"
            data-lenis-prevent
            className="fixed inset-0 z-50 flex flex-col overflow-y-auto overscroll-contain bg-blue text-cream"
            initial={reduce ? { opacity: 0 } : { clipPath: "circle(0% at 95% 4%)" }}
            animate={reduce ? { opacity: 1 } : { clipPath: "circle(150% at 95% 4%)" }}
            exit={reduce ? { opacity: 0 } : { clipPath: "circle(0% at 95% 4%)" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-4 py-4 sm:px-8">
              <span className="font-mono text-xs uppercase">[ MENU ]</span>
              <button
                type="button"
                autoFocus
                onClick={() => setOpen(false)}
                aria-label="Tutup menu"
                className="grid h-11 w-11 place-items-center border border-cream text-cream transition-colors hover:bg-cream hover:text-blue"
              >
                <Close className="h-5 w-5" />
              </button>
            </div>

            <nav className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-4 sm:px-8" aria-label="Utama">
              {/* my-auto = tengah vertikal, tapi tidak memotong bagian atas bila layar terlalu pendek */}
              <ul className="my-auto py-4">
                {nav.map((n, i) => (
                  <motion.li
                    key={n.href}
                    initial={reduce ? false : { y: 60, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.15 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      href={n.href}
                      onClick={() => setOpen(false)}
                      className="group flex items-baseline gap-4 border-b border-cream/30 py-2 sm:py-3"
                    >
                      <span className="font-mono text-xs">0{i + 1}</span>
                      {/* ukuran ikut lebar DAN tinggi layar → muat di laptop lebar-pendek (zoom 100%) */}
                      <span className="display text-[clamp(2.25rem,min(12vw,11vh),7.5rem)] transition-transform duration-300 group-hover:translate-x-4">
                        {n.label}
                      </span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>

            <div className="mx-auto flex w-full max-w-[1440px] flex-wrap gap-x-6 gap-y-2 px-4 pb-8 font-mono text-xs uppercase sm:px-8">
              {socials.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">
                  {s.label} — {s.handle}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

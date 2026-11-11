"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { nav, profile, socials } from "@/lib/content";
import { Close, MenuDots } from "./icons";

export default function Header() {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

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
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-3 px-4 py-4 sm:px-8">
        <Link
          href="/"
          className="rounded-full border border-white/15 bg-ink/70 px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] backdrop-blur-md transition-colors hover:border-orange hover:text-orange sm:text-xs"
        >
          My Portfolio
        </Link>

        <div className="flex items-center gap-3">
          <span className="hidden rounded-full border border-white/15 bg-ink/70 px-4 py-2 font-mono text-xs font-semibold uppercase tracking-[0.2em] backdrop-blur-md md:inline">
            {profile.label}
          </span>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label="Buka menu"
            className="grid h-11 w-11 place-items-center rounded-full bg-orange text-ink ring-2 ring-ink transition-transform hover:rotate-90"
          >
            <MenuDots className="h-5 w-5" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="site-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu navigasi"
            className="fixed inset-0 z-50 flex flex-col bg-orange text-ink"
            initial={reduce ? { opacity: 0 } : { clipPath: "circle(0% at 95% 4%)" }}
            animate={reduce ? { opacity: 1 } : { clipPath: "circle(150% at 95% 4%)" }}
            exit={reduce ? { opacity: 0 } : { clipPath: "circle(0% at 95% 4%)" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-4 py-4 sm:px-8">
              <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em]">[ MENU ]</span>
              <button
                type="button"
                autoFocus
                onClick={() => setOpen(false)}
                aria-label="Tutup menu"
                className="grid h-11 w-11 place-items-center rounded-full bg-ink text-orange"
              >
                <Close className="h-5 w-5" />
              </button>
            </div>

            <nav className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-center px-4 sm:px-8" aria-label="Utama">
              <ul>
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
                      className="group flex items-baseline gap-4 border-b border-ink/20 py-2 sm:py-3"
                    >
                      <span className="font-mono text-xs font-semibold">0{i + 1}</span>
                      <span className="display text-[clamp(2.75rem,10vw,7.5rem)] transition-transform duration-300 group-hover:translate-x-4">
                        {n.label}
                      </span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>

            <div className="mx-auto flex w-full max-w-[1440px] flex-wrap gap-x-6 gap-y-2 px-4 pb-8 font-mono text-xs font-semibold uppercase tracking-[0.14em] sm:px-8">
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

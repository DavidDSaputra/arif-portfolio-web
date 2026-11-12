"use client";

import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { useLenis } from "./SmoothScroll";
import { ArrowUp } from "./icons";
import { outExpo } from "./ui";

/** Tombol "kembali ke atas" di kanan bawah, dengan cincin progres scroll. */
export default function ScrollToTop() {
  const { scrollY, scrollYProgress } = useScroll();
  const [show, setShow] = useState(false);
  const reduce = useReducedMotion();
  const lenis = useLenis();

  useMotionValueEvent(scrollY, "change", (v) => setShow(v > 600));

  const toTop = () => {
    if (lenis) lenis.scrollTo(0, { duration: 1.6 });
    else window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          key="to-top"
          type="button"
          onClick={toTop}
          aria-label="Kembali ke atas"
          title="Kembali ke atas"
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.5, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.5, y: 24 }}
          transition={{ duration: 0.5, ease: outExpo }}
          className="group fixed bottom-28 right-4 z-40 grid h-14 w-14 place-items-center rounded-full bg-navy/85 text-sky shadow-[0_10px_30px_-8px_rgba(0,0,0,0.45)] backdrop-blur-md transition-colors hover:bg-blue hover:text-white md:bottom-8 md:right-8 md:h-16 md:w-16"
        >
          <svg viewBox="0 0 64 64" aria-hidden className="absolute inset-0 h-full w-full -rotate-90">
            <circle cx="32" cy="32" r="30" fill="none" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2.5" />
            <motion.circle
              cx="32"
              cy="32"
              r="30"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              style={{ pathLength: scrollYProgress }}
            />
          </svg>
          <ArrowUp className="relative h-5 w-5 transition-transform duration-300 group-hover:-translate-y-1 sm:h-6 sm:w-6" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

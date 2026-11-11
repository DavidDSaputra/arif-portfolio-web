"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Lenis from "lenis";
import { useReducedMotion } from "motion/react";

const LenisContext = createContext<Lenis | null>(null);

/** Instance Lenis aktif (null bila reduced-motion / belum siap). */
export const useLenis = () => useContext(LenisContext);

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (reduce) return;

    const instance = new Lenis({ duration: 1.15, smoothWheel: true, anchors: { offset: -72 } });
    setLenis(instance);
    let raf = 0;
    const loop = (t: number) => {
      instance.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      instance.destroy();
      setLenis(null);
    };
  }, [reduce]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}

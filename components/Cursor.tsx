"use client";

import { useEffect, useRef } from "react";

/**
 * Kursor kustom ala yeahright.co: kotak kecil (mix-blend difference) yang mengikuti mouse dengan sedikit lambat,
 * membesar di atas link/tombol, dan menampilkan label dari atribut data-cursor="..." bila ada.
 * Hanya untuk perangkat dengan mouse; kursor asli tetap ada (aksesibilitas).
 */
export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let x = -100;
    let y = -100;
    let tx = -100;
    let ty = -100;
    let raf = 0;

    const loop = () => {
      x += (tx - x) * (reduce ? 1 : 0.22);
      y += (ty - y) * (reduce ? 1 : 0.22);
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      tx = e.clientX;
      ty = e.clientY;
      if (x < -50) {
        x = tx;
        y = ty;
      }
      const target = (e.target as Element | null)?.closest?.("a, button, [role=button], input, textarea, select, [data-cursor]");
      el.toggleAttribute("data-hover", !!target);
      const label = target?.getAttribute("data-cursor") ?? "";
      el.toggleAttribute("data-label", !!label);
      if (labelRef.current && labelRef.current.textContent !== label) labelRef.current.textContent = label;
    };
    const onLeave = () => {
      tx = ty = -100;
      x = y = -100;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={ref} aria-hidden className="cur">
      <span className="cur-dot" />
      <span ref={labelRef} className="cur-label" />
    </div>
  );
}

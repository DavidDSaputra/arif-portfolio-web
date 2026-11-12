"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { sectionCopy, works } from "@/lib/content";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "./icons";
import { Scramble, WaveText } from "./ui";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Karya pilihan sebagai "channel" ala yeahright.co:
 * judul raksasa karya aktif + [kategori], layar dengan garis scan, "CH 01", panah ← → dan nomor,
 * deskripsi singkat + "LIHAT DETAIL ↗". Bisa pakai tombol panah keyboard & geser di HP.
 */
export default function SelectedWork() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const sectionRef = useRef<HTMLElement>(null);
  const touchX = useRef<number | null>(null);
  const work = works[index];

  const go = useCallback((next: number) => {
    setIndex((cur) => {
      const n = (next + works.length) % works.length;
      setDir(n > cur || (cur === works.length - 1 && n === 0) ? 1 : -1);
      return n;
    });
  }, []);

  // panah kiri/kanan saat section terlihat
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    let visible = false;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0.4 });
    io.observe(el);
    const onKey = (e: KeyboardEvent) => {
      if (!visible || (e.target as HTMLElement)?.closest?.("input, textarea")) return;
      if (e.key === "ArrowRight") go(index + 1);
      if (e.key === "ArrowLeft") go(index - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      io.disconnect();
      window.removeEventListener("keydown", onKey);
    };
  }, [go, index]);

  return (
    <section
      ref={sectionRef}
      id="work"
      aria-labelledby="work-title"
      aria-roledescription="carousel"
      className="relative scroll-mt-20 border-y border-line"
    >
      <div className="mx-auto max-w-[1600px] px-4 py-24 sm:px-8 md:py-32">
        <div className="flex flex-col gap-3 font-mono text-xs uppercase sm:flex-row sm:items-center sm:justify-between sm:text-sm">
          <h2 id="work-title" className="text-blue">
            <Scramble text={`[${sectionCopy.work.kicker}]`} />
          </h2>
          <p className="text-mute">
            {sectionCopy.work.range} — {sectionCopy.work.tag}
          </p>
        </div>

        {/* judul karya aktif */}
        <div className="mt-8 min-h-[2.2em] text-[clamp(3.5rem,11vw,10.5rem)]" aria-live="polite">
          <WaveText key={work.slug} as="p" lines={[work.title]} className="display text-fg [&>span]:whitespace-normal" lineClassName="!whitespace-normal" />
          <p className="mt-3 font-mono text-sm uppercase text-blue sm:text-base">
            <Scramble key={work.slug} text={`[${work.category}${work.year ? ` — ${work.year}` : ""}]`} />
          </p>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-12">
          {/* layar */}
          <div
            className="relative lg:col-span-8"
            onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
            onTouchEnd={(e) => {
              if (touchX.current === null) return;
              const dx = e.changedTouches[0].clientX - touchX.current;
              if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
              touchX.current = null;
            }}
          >
            <Link
              href={`/work/${work.slug}`}
              data-cursor="Lihat"
              className="scanlines relative block aspect-[16/10] overflow-hidden border border-fg/20 bg-deep"
              aria-label={`Lihat detail: ${work.title}`}
            >
              <AnimatePresence initial={false} custom={dir} mode="popLayout">
                <motion.div
                  key={work.slug}
                  custom={dir}
                  className="absolute inset-0"
                  initial={reduce ? { opacity: 0 } : { clipPath: dir > 0 ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)" }}
                  animate={reduce ? { opacity: 1 } : { clipPath: "inset(0 0 0 0%)" }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0.4 }}
                  transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                >
                  {/* latar buram dari gambar yang sama + gambar utuh di tengah (poster tegak tidak terpotong) */}
                  <Image src={work.cover.src} alt="" fill sizes="10vw" className="scale-110 object-cover opacity-40 blur-2xl" />
                  <Image
                    src={work.cover.src}
                    alt={work.cover.alt}
                    fill
                    sizes="(min-width: 1024px) 60vw, 100vw"
                    className="object-contain p-4 sm:p-8"
                  />
                </motion.div>
              </AnimatePresence>
              <span className="absolute left-3 top-3 z-10 bg-paper/80 px-2 py-1 font-pixel text-[10px] uppercase text-fg">
                CH {pad(index + 1)}
              </span>
              <span className="absolute right-3 top-3 z-10 flex items-center gap-1.5 bg-paper/80 px-2 py-1 font-pixel text-[10px] uppercase text-fg">
                <i className="h-1.5 w-1.5 animate-pulse bg-blue" /> Live
              </span>
            </Link>
          </div>

          {/* kontrol + deskripsi */}
          <div className="flex flex-col justify-between gap-8 font-mono uppercase lg:col-span-4">
            <div>
              <div className="flex items-center gap-2 text-sm" role="group" aria-label="Pilih karya">
                <button
                  type="button"
                  onClick={() => go(index - 1)}
                  aria-label="Karya sebelumnya"
                  className="grid h-10 w-10 place-items-center border border-fg/25 transition-colors hover:border-blue hover:text-blue"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                {works.map((w, i) => (
                  <button
                    key={w.slug}
                    type="button"
                    onClick={() => go(i)}
                    aria-label={`Karya ${i + 1}: ${w.title}`}
                    aria-current={i === index ? "true" : undefined}
                    className={`grid h-10 w-10 place-items-center border transition-colors ${
                      i === index ? "border-blue bg-blue text-cream" : "border-fg/25 text-fg/70 hover:border-blue hover:text-blue"
                    }`}
                  >
                    {pad(i + 1)}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => go(index + 1)}
                  aria-label="Karya berikutnya"
                  className="grid h-10 w-10 place-items-center border border-fg/25 transition-colors hover:border-blue hover:text-blue"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-3 text-[11px] text-mute">[← → untuk ganti channel]</p>
            </div>

            <div className="space-y-6">
              <p className="normal-case leading-relaxed text-fg/85">{work.summary}</p>
              <Link
                href={`/work/${work.slug}`}
                data-cursor="Buka"
                className="group inline-flex items-center gap-2 border-b border-blue pb-1 text-base text-blue sm:text-lg"
              >
                <Scramble key={work.slug} text="Lihat detail" />
                <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:rotate-45" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

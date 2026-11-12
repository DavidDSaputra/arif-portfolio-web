"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { sectionCopy, works } from "@/lib/content";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "./icons";
import { Scramble, WaveText } from "./ui";
import TvScreen from "./TvScreen";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Karya pilihan sebagai "channel" ala yeahright.co:
 * judul raksasa karya aktif + [kategori], layar dengan garis scan, "CH 01", panah ← → dan nomor,
 * deskripsi singkat + "LIHAT DETAIL ↗". Bisa pakai tombol panah keyboard & geser di HP.
 */
export default function SelectedWork() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const touchX = useRef<number | null>(null);
  const work = works[index];

  const go = useCallback((next: number) => {
    setIndex((next + works.length) % works.length);
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
      className="relative scroll-mt-20 overflow-hidden border-y border-line"
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

        {/* panggung: judul raksasa samar di belakang + TV di tengah */}
        <div className="relative mt-12">
          <p
            aria-hidden
            className="display pointer-events-none absolute inset-x-0 top-1/2 -z-0 -translate-y-1/2 select-none text-center text-[clamp(5rem,19vw,19rem)] leading-[0.85] text-fg/10 blur-[2px]"
          >
            {work.title}
          </p>

          <div
            className="relative mx-auto max-w-[920px]"
            onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
            onTouchEnd={(e) => {
              if (touchX.current === null) return;
              const dx = e.changedTouches[0].clientX - touchX.current;
              if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
              touchX.current = null;
            }}
          >
            {/* judul karya aktif, menimpa sudut kiri atas TV */}
            <div className="pointer-events-none relative z-10 -mb-[0.35em] text-[clamp(2.75rem,8vw,6.5rem)] sm:-mb-[0.55em] xl:-ml-[6%]" aria-live="polite">
              <WaveText key={work.slug} as="p" lines={[work.title]} className="display text-fg [text-shadow:0_6px_30px_rgba(0,0,0,0.6)]" lineClassName="!whitespace-normal" />
            </div>

            <Link href={`/work/${work.slug}`} data-cursor="Lihat" aria-label={`Lihat detail: ${work.title}`} className="block">
              <TvScreen channel={`CH ${pad(index + 1)}`} staticKey={work.slug}>
                <AnimatePresence initial={false} mode="popLayout">
                  <motion.div
                    key={work.slug}
                    className="absolute inset-0"
                    initial={reduce ? { opacity: 0 } : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15, delay: reduce ? 0 : 0.35 }}
                  >
                    {/* latar buram dari gambar yang sama + gambar utuh di tengah (poster tegak tidak terpotong) */}
                    <Image src={work.cover.src} alt="" fill sizes="10vw" className="scale-110 object-cover opacity-50 blur-2xl" />
                    <Image src={work.cover.src} alt={work.cover.alt} fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-contain p-[5%]" />
                  </motion.div>
                </AnimatePresence>
              </TvScreen>
            </Link>

            {/* kontrol + deskripsi */}
            <div className="mt-6 flex flex-col gap-6 font-mono uppercase md:flex-row md:items-start md:justify-between">
              <div>
                <div className="flex items-center gap-2 text-sm" role="group" aria-label="Pilih karya">
                  <button
                    type="button"
                    onClick={() => go(index - 1)}
                    aria-label="Karya sebelumnya"
                    className="grid h-12 w-12 place-items-center border border-fg/25 transition-colors hover:border-blue hover:text-blue"
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
                      className={`grid h-12 w-12 place-items-center border transition-colors ${
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
                    className="grid h-12 w-12 place-items-center border border-fg/25 transition-colors hover:border-blue hover:text-blue"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-3 text-[11px] text-mute">
                  <Scramble key={work.slug} text={`[${work.category}${work.year ? ` — ${work.year}` : ""}]`} />
                </p>
              </div>

              <div className="max-w-md space-y-4 md:text-right">
                <p className="normal-case leading-relaxed text-fg/85">{work.summary}</p>
                <Link href={`/work/${work.slug}`} data-cursor="Buka" className="group inline-flex items-center gap-2 text-base text-blue sm:text-lg">
                  <Scramble key={work.slug} text="Lihat detail" />
                  <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:rotate-45" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import { useReducedMotion, motion } from "motion/react";
import type { Media } from "@/lib/content";
import { Play } from "./icons";

/** Satu item media di halaman detail: gambar, video, atau slot video yang belum diisi. */
export default function MediaItem({ m, index }: { m: Media; index: number }) {
  const reduce = useReducedMotion();
  const ratio = m.kind === "image" ? m.w / m.h : m.poster.w / m.poster.h;
  const wide = ratio > 1.6;

  return (
    <motion.figure
      initial={reduce ? false : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.8, delay: (index % 3) * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className={wide ? "sm:col-span-2 lg:col-span-3" : ""}
    >
      <div className="relative overflow-hidden rounded-xl bg-deep" style={{ aspectRatio: `${ratio}` }}>
        {m.kind === "image" ? (
          <Image src={m.src} alt={m.alt} fill sizes={wide ? "100vw" : "(min-width: 768px) 33vw, 100vw"} className="object-contain" />
        ) : m.src ? (
          <video
            src={m.src}
            poster={m.poster.src}
            controls
            playsInline
            preload="none"
            className="absolute inset-0 h-full w-full object-cover"
            aria-label={m.poster.alt}
          />
        ) : (
          <>
            <Image src={m.poster.src} alt={m.poster.alt} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover opacity-70" />
            <div className="absolute inset-0 grid place-items-center bg-gradient-to-t from-black/60 via-transparent to-transparent">
              <span className="grid h-16 w-16 place-items-center rounded-full bg-blue text-white">
                <Play className="ml-1 h-7 w-7" />
              </span>
            </div>
            <span className="absolute bottom-3 left-3 rounded-full bg-paper/85 px-3 py-1 font-mono text-[11px] uppercase text-fg">
              Video menyusul
            </span>
          </>
        )}
      </div>
      {m.caption && (
        <figcaption className="mt-3 font-mono text-xs uppercase text-mute">
          <span className="text-blue">{String(index + 1).padStart(2, "0")}</span> — {m.caption}
        </figcaption>
      )}
    </motion.figure>
  );
}

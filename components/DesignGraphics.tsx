"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { getWork, showcases, type Media } from "@/lib/content";
import { DetailLink, SlideHeader, outExpo } from "./ui";

type ImageMedia = Extract<Media, { kind: "image" }>;

/** Slide "Digital Design Graphics — Poster / Pamflet / Brosur" dari PDF. */
export default function DesignGraphics() {
  const s = showcases.designGraphics;
  const work = getWork(s.slug);
  const reduce = useReducedMotion();
  if (!work) return null;
  const posters = work.media.filter((m): m is ImageMedia => m.kind === "image");

  return (
    <section id="design-graphics" aria-labelledby="design-graphics-title" className="relative scroll-mt-20 overflow-hidden border-b border-line py-24 md:py-32">
      <div aria-hidden className="pointer-events-none absolute -left-40 bottom-0 h-[26rem] w-[26rem] rounded-full bg-sky/20 blur-[130px]" />
      <div aria-hidden className="pointer-events-none absolute -right-40 top-16 h-80 w-80 rounded-full bg-sky/20 blur-[120px]" />

      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-8">
        <SlideHeader
          id="design-graphics-title"
          words={s.words}
          subtitle={s.subtitle}
          tag={s.tag}
          titleClassName="text-[clamp(2.75rem,7.5vw,6.5rem)]"
        />

        {/* Mobile: strip geser. Desktop: 1 baris, tinggi sama, lebar sesuai rasio poster. */}
        <ul
          tabIndex={0}
          aria-label="Poster, pamflet & brosur"
          className="-mx-4 mt-14 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-6 [scrollbar-width:thin] sm:-mx-8 sm:px-8 lg:mx-0 lg:mt-20 lg:gap-5 lg:overflow-visible lg:px-0 lg:pb-0"
        >
          {posters.map((p, i) => (
            <motion.li
              key={p.src}
              className="group w-min shrink-0 snap-start lg:w-auto lg:shrink lg:[flex:var(--ar)_1_0%]"
              style={{ ["--ar" as string]: p.w / p.h }}
              initial={reduce ? false : { opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.9, delay: i * 0.07, ease: outExpo }}
            >
              <div
                className="relative h-[380px] overflow-hidden shadow-[0_24px_60px_-24px_rgba(0,0,0,0.45)] transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:-translate-y-2 lg:h-auto lg:w-full"
                style={{ aspectRatio: `${p.w} / ${p.h}` }}
              >
                <Image src={p.src} alt={p.alt} fill sizes="(min-width: 1024px) 22vw, 300px" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
              </div>
              {p.caption && (
                <p className="mt-3 font-mono text-[11px] uppercase leading-snug tracking-[0.12em] text-mute transition-colors group-hover:text-navy">
                  {p.caption}
                </p>
              )}
            </motion.li>
          ))}
        </ul>

        <div className="mt-14 flex justify-center lg:justify-end">
          <DetailLink href={`/work/${s.slug}`} />
        </div>
      </div>
    </section>
  );
}

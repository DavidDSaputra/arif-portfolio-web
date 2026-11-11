"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { eventProject as ep } from "@/lib/content";
import { ArrowUpRight } from "./icons";
import { Reveal, ScriptTitle, outExpo } from "./ui";

function Label({ no, children }: { no: string; children: React.ReactNode }) {
  return (
    <p className="mb-4 flex items-baseline gap-2 font-mono text-xs font-semibold uppercase tracking-[0.2em] sm:text-sm">
      <span className="text-orange">[{no}]</span>
      <span>{children}</span>
    </p>
  );
}

/** Slide "Event Project — Keranggan Festival" dari PDF: banner, tiket, merchandise, social media. */
export default function EventProject() {
  const reduce = useReducedMotion();
  const hover = reduce ? undefined : { y: -8, rotate: -1.5, transition: { duration: 0.5, ease: outExpo } };

  return (
    <section id="event" aria-labelledby="event-title" className="relative scroll-mt-20 overflow-hidden border-b border-line py-24 md:py-32">
      {/* glow oranye seperti slide PDF */}
      <div aria-hidden className="pointer-events-none absolute -left-40 bottom-0 h-[26rem] w-[26rem] rounded-full bg-orange/25 blur-[130px]" />
      <div aria-hidden className="pointer-events-none absolute -right-40 top-28 h-80 w-80 rounded-full bg-orange/20 blur-[120px]" />

      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-8">
        <Reveal className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <ScriptTitle id="event-title" words={["Event", "Project"]} className="text-[clamp(3rem,9vw,7.5rem)]" />
          <div className="lg:pb-3 lg:text-right">
            <p className="display text-[clamp(1.75rem,4vw,3.25rem)] text-white [text-shadow:0_0_28px_rgba(255,255,255,0.35)]">
              {ep.title}
            </p>
            <p className="mt-2 font-mono text-xs uppercase tracking-[0.16em] text-mute sm:text-sm">{ep.tag}</p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-14 lg:mt-20 lg:grid-cols-12 lg:gap-10">
          {/* Banner + Ticket */}
          <div className="space-y-12 lg:col-span-5">
            <Reveal>
              <Label no="01">Banner</Label>
              <div className="group">
                <Image
                  src={ep.banner[0].src}
                  alt={ep.banner[0].alt}
                  width={ep.banner[0].w}
                  height={ep.banner[0].h}
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="h-auto w-full"
                />
                <div className="mt-1.5 overflow-hidden">
                  <Image
                    src={ep.banner[1].src}
                    alt={ep.banner[1].alt}
                    width={ep.banner[1].w}
                    height={ep.banner[1].h}
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="h-auto w-full transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <Label no="02">Ticket</Label>
              <div className="overflow-hidden">
                <Image
                  src={ep.ticket.src}
                  alt={ep.ticket.alt}
                  width={ep.ticket.w}
                  height={ep.ticket.h}
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="h-auto w-full transition-transform duration-700 hover:scale-[1.03]"
                />
              </div>
            </Reveal>
          </div>

          {/* Merchandise */}
          <Reveal delay={0.15} className="lg:col-span-4">
            <Label no="03">Merchandise</Label>
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              {ep.merchandise.map((m, i) => (
                <motion.div key={m.src} whileHover={hover} className={i === 1 ? "mt-16 sm:mt-24" : ""}>
                  <Image
                    src={m.src}
                    alt={m.alt}
                    width={m.w}
                    height={m.h}
                    sizes="(min-width: 1024px) 16vw, 45vw"
                    className="h-auto w-full shadow-[0_24px_60px_-20px_rgba(0,0,0,0.9)]"
                  />
                </motion.div>
              ))}
            </div>
          </Reveal>

          {/* Social Media */}
          <Reveal delay={0.2} className="lg:col-span-3">
            <Label no="04">Social Media</Label>
            <motion.div
              whileHover={hover}
              className="mx-auto w-[min(250px,70vw)] rounded-[2.4rem] border-[3px] border-white/85 bg-black p-2 shadow-[0_30px_80px_-20px_rgba(247,116,74,0.5)]"
            >
              <div className="relative overflow-hidden rounded-[1.9rem]">
                <span aria-hidden className="absolute left-1/2 top-1.5 z-10 h-4 w-16 -translate-x-1/2 rounded-full bg-black" />
                <Image
                  src={ep.socialMedia.src}
                  alt={ep.socialMedia.alt}
                  width={ep.socialMedia.w}
                  height={ep.socialMedia.h}
                  sizes="250px"
                  className="h-auto w-full"
                />
              </div>
            </motion.div>
          </Reveal>
        </div>

        <Reveal className="mt-16 flex justify-center lg:justify-end">
          <Link
            href={`/work/${ep.slug}`}
            className="group inline-flex items-center gap-2 rounded-full bg-orange px-6 py-3 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-ink transition-colors duration-300 hover:bg-paper sm:text-sm"
          >
            Lihat detail project
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

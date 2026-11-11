"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { eventProject as ep } from "@/lib/content";
import { DetailLink, NumLabel, PhoneFrame, Reveal, SlideHeader, outExpo } from "./ui";

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
        <SlideHeader id="event-title" words={ep.words} subtitle={ep.title} tag={ep.tag} />

        <div className="mt-14 grid gap-14 lg:mt-20 lg:grid-cols-12 lg:gap-10">
          {/* Banner + Ticket */}
          <div className="space-y-12 lg:col-span-5">
            <Reveal>
              <NumLabel no="01">Banner</NumLabel>
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
              <NumLabel no="02">Ticket</NumLabel>
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
            <NumLabel no="03">Merchandise</NumLabel>
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
            <NumLabel no="04">Social Media</NumLabel>
            <motion.div whileHover={hover} className="mx-auto w-[min(250px,70vw)]">
              <PhoneFrame>
                <Image
                  src={ep.socialMedia.src}
                  alt={ep.socialMedia.alt}
                  width={ep.socialMedia.w}
                  height={ep.socialMedia.h}
                  sizes="250px"
                  className="h-auto w-full"
                />
              </PhoneFrame>
            </motion.div>
          </Reveal>
        </div>

        <Reveal className="mt-16 flex justify-center lg:justify-end">
          <DetailLink href={`/work/${ep.slug}`} />
        </Reveal>
      </div>
    </section>
  );
}

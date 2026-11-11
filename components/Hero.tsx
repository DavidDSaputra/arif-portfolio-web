"use client";

import { useRef } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { contact, marquee, profile, socials } from "@/lib/content";
import { ArrowRight, Instagram, Mail, Spark, WhatsApp } from "./icons";
import { Marquee, OpenBox, Pill, Reveal, outExpo } from "./ui";
import PixelSky from "./PixelSky";
import PixelHeadline from "./PixelHeadline";

const socialIcons = { Instagram, WhatsApp, Email: Mail } as const;

const TITLE_DELAY = 0.25; // detik sebelum kata pertama
const TITLE_STAGGER = 0.08; // jeda antar kata

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const reduce = useReducedMotion();

  // Saat hero di-scroll keluar, kata-kata judul memudar naik bergiliran (--out: 0 → 1)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    titleRef.current?.style.setProperty("--out", reduce ? "0" : v.toFixed(3));
  });

  const words = profile.headline.split(" ").length;
  const afterTitle = TITLE_DELAY + words * TITLE_STAGGER + 0.45;

  return (
    <section id="top" aria-label="Perkenalan" className="relative overflow-hidden">
      {/* Hero ala andreas.vision: langit piksel + judul serif italic yang muncul per kata */}
      <div ref={heroRef} className="relative flex min-h-[100svh] items-center justify-center">
        <PixelSky className="absolute inset-0" />

        <div className="relative z-10 mx-auto flex max-w-[1180px] flex-col items-center px-4 pb-24 pt-28 text-center sm:px-8">
          <PixelHeadline
            ref={titleRef}
            text={profile.headline}
            delay={TITLE_DELAY * 1000}
            stagger={TITLE_STAGGER * 1000}
            className="max-w-[12em] text-balance font-serif text-[clamp(3.1rem,9.5vw,7.5rem)] italic leading-[1.04] tracking-[-0.03em] text-navy"
          />

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: afterTitle, duration: 0.9, ease: outExpo }}
            className="mt-6 max-w-[38rem] text-pretty font-sans text-base leading-relaxed text-navy/85 sm:mt-8 sm:text-lg"
          >
            {profile.heroIntro}
          </motion.p>

          <motion.ul
            className="mt-8 flex flex-wrap justify-center gap-3"
            aria-label="Kontak & sosial media"
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: afterTitle + 0.3, duration: 0.8, ease: outExpo }}
          >
            {socials.map((s) => {
              const Icon = socialIcons[s.label];
              return (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${s.label}: ${s.handle}`}
                    className="flex items-center gap-2 border-[0.8px] border-navy/25 bg-white/80 px-2.5 py-2 font-mono text-[13px] text-navy/80 backdrop-blur-sm transition-colors hover:border-blue hover:text-blue sm:text-sm"
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{s.handle}</span>
                  </a>
                </li>
              );
            })}
          </motion.ul>
        </div>
      </div>

      {/* Statement — kotak ngebuka (Fearless) kini terbuka saat blok ini terlihat */}
      <div className="relative mx-auto grid max-w-[1440px] gap-8 px-4 py-16 sm:px-8 md:py-24 lg:grid-cols-12">
        <Reveal className="lg:col-span-7">
          <h2 className="display text-[clamp(3rem,10vw,8.5rem)]">
            {profile.statement.map((l, i) => (
              <span key={l} className={`block ${i === 1 ? "text-outline" : "text-blue"}`}>
                {l}
              </span>
            ))}
          </h2>
        </Reveal>
        <div className="flex flex-col justify-end gap-6 lg:col-span-5">
          <OpenBox trigger="view" delay={0.2} className="-mx-[10px]">
            <p className="font-mono text-sm uppercase leading-relaxed text-navy sm:text-base">{profile.statementBody}</p>
          </OpenBox>
          <Reveal delay={0.3} className="flex flex-wrap gap-3">
            <Pill href="#contact">
              {contact.ctas.primary}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Pill>
            <Pill href="#work" variant="ghost">
              {contact.ctas.secondary}
            </Pill>
          </Reveal>
        </div>
        <Spark aria-hidden className="pointer-events-none absolute right-6 top-6 hidden h-12 w-12 text-blue motion-safe:animate-spin-slow md:block" />
      </div>

      <div className="-rotate-2 scale-105 bg-blue py-4 text-white sm:py-5">
        <Marquee items={marquee} className="display text-[clamp(1.75rem,5vw,3.5rem)]" duration={28} />
      </div>
    </section>
  );
}

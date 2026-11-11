"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { contact, marquee, profile, socials } from "@/lib/content";
import { ArrowRight, Instagram, LongArrow, Mail, Spark, WhatsApp } from "./icons";
import { Marquee, OpenBox, Pill, Reveal, outExpo } from "./ui";

const ease = [0.22, 1, 0.36, 1] as const;

const socialIcons = { Instagram, WhatsApp, Email: Mail } as const;

function SplitLine({ text, delay }: { text: string; delay: number }) {
  const reduce = useReducedMotion();
  return (
    <span className="block overflow-hidden whitespace-nowrap pb-[0.04em]">
      <motion.span
        className="block"
        initial={reduce ? false : { y: "105%" }}
        animate={{ y: 0 }}
        transition={{ duration: 1, delay, ease }}
      >
        {text}
      </motion.span>
    </span>
  );
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const photoY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "18%"]);
  const nameX = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-8%"]);

  return (
    <section ref={ref} id="top" aria-label="Perkenalan" className="relative overflow-hidden">
      <div className="relative mx-auto grid min-h-[100svh] max-w-[1440px] grid-cols-1 px-4 pb-10 pt-24 sm:px-8 lg:grid-cols-12 lg:gap-8 lg:pt-28">
        {/* Foto (arch, gaya PDF) */}
        <div className="relative order-1 mx-auto mb-8 w-[72%] max-w-[420px] lg:order-2 lg:col-span-5 lg:mb-0 lg:w-full lg:max-w-none lg:self-stretch">
          <motion.div
            initial={reduce ? false : { clipPath: "inset(100% 0 0 0 round 999px 999px 0 0)" }}
            animate={{ clipPath: "inset(0% 0 0 0 round 999px 999px 0 0)" }}
            transition={{ duration: 1.3, ease, delay: 0.1 }}
            className="relative aspect-[3/4.4] overflow-hidden rounded-t-full bg-surface-2 lg:absolute lg:inset-0 lg:aspect-auto"
          >
            <motion.div style={{ y: photoY }} className="absolute inset-[-6%]">
              <Image
                src={profile.photos.hero.src}
                alt={profile.photos.hero.alt}
                fill
                priority
                sizes="(min-width: 1024px) 40vw, 72vw"
                className="object-cover object-[50%_35%] grayscale"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-blue/60 via-sky/10 to-transparent mix-blend-multiply" />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-white to-transparent" />
          </motion.div>
          {/* glow biru langit di belakang foto */}
          <div aria-hidden className="pointer-events-none absolute -left-16 top-1/3 -z-10 h-64 w-64 rounded-full bg-sky/40 blur-[90px]" />
        </div>

        {/* Teks */}
        <div className="relative z-10 order-2 flex flex-col justify-end lg:order-1 lg:col-span-7">
          <div className="mb-6 flex items-center gap-4 text-blue">
            <span className="flex gap-1.5" aria-hidden>
              <span className="h-2 w-2 bg-blue" />
              <span className="h-2 w-2 bg-blue" />
            </span>
            <LongArrow className="h-8 w-40 sm:w-52" />
          </div>

          <motion.h1 style={{ x: nameX }} className="display text-blue text-[clamp(3rem,15vw,9rem)] lg:-mr-[30%] lg:text-[clamp(4rem,10.5vw,11rem)]">
            <SplitLine text={`${profile.firstName} -`} delay={0.25} />
            <SplitLine text={profile.lastName} delay={0.38} />
            <span className="sr-only">, {profile.role}</span>
          </motion.h1>

          <OpenBox delay={1} className="mt-4 max-w-2xl">
            <p className="font-mono text-[13px] uppercase leading-[1.4] text-navy sm:text-base sm:leading-[1.3]">{profile.summary}</p>
          </OpenBox>

          <motion.ul
            className="mt-3 flex flex-wrap gap-3 px-[10px] sm:gap-[18px]"
            aria-label="Kontak & sosial media"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.4, duration: 0.8, ease: outExpo }}
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
                    className="flex items-center gap-2 border-[0.8px] border-navy/25 px-2 py-2 font-mono text-[13px] text-navy/80 transition-colors hover:border-blue hover:text-blue sm:text-sm"
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

      {/* Statement */}
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
        <Reveal delay={0.15} className="flex flex-col justify-end gap-8 lg:col-span-5">
          <p className="font-mono text-sm uppercase leading-relaxed text-navy/85 sm:text-base">{profile.statementBody}</p>
          <div className="flex flex-wrap gap-3">
            <Pill href="#contact">
              {contact.ctas.primary}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Pill>
            <Pill href="#work" variant="ghost">
              {contact.ctas.secondary}
            </Pill>
          </div>
        </Reveal>
        <Spark aria-hidden className="pointer-events-none absolute right-6 top-6 hidden h-12 w-12 text-blue motion-safe:animate-spin-slow md:block" />
      </div>

      <div className="-rotate-2 scale-105 bg-blue py-4 text-white sm:py-5">
        <Marquee items={marquee} className="display text-[clamp(1.75rem,5vw,3.5rem)]" duration={28} />
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { contact, marquee, profile, socials } from "@/lib/content";
import { Dumbbell, LongArrow, Spark, ArrowRight } from "./icons";
import { Marquee, Pill, Reveal } from "./ui";

const ease = [0.22, 1, 0.36, 1] as const;

function SplitLine({ text, delay }: { text: string; delay: number }) {
  const reduce = useReducedMotion();
  return (
    <span className="block overflow-hidden pb-[0.04em]">
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
            className="relative aspect-[3/4.4] overflow-hidden rounded-t-full bg-ink-3 lg:absolute lg:inset-0 lg:aspect-auto"
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
            <div className="absolute inset-0 bg-gradient-to-t from-orange/70 via-orange/10 to-transparent mix-blend-multiply" />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink to-transparent" />
          </motion.div>
          {/* glow oranye dari PDF */}
          <div aria-hidden className="pointer-events-none absolute -left-16 top-1/3 -z-10 h-64 w-64 rounded-full bg-orange/40 blur-[90px]" />
        </div>

        {/* Teks */}
        <div className="relative z-10 order-2 flex flex-col justify-end lg:order-1 lg:col-span-7">
          <div className="mb-6 flex items-center gap-4 text-orange">
            <span className="flex gap-1.5" aria-hidden>
              <span className="h-2 w-2 bg-orange" />
              <span className="h-2 w-2 bg-orange" />
            </span>
            <LongArrow className="h-8 w-40 sm:w-52" />
          </div>

          <motion.h1 style={{ x: nameX }} className="display text-orange text-[clamp(4rem,17vw,13.5rem)] lg:-mr-[30%]">
            <SplitLine text={`${profile.firstName} -`} delay={0.25} />
            <SplitLine text={profile.lastName} delay={0.38} />
            <span className="sr-only">, {profile.role}</span>
          </motion.h1>

          <Dumbbell className="my-6 w-36 text-white sm:w-44" />

          <Reveal delay={0.6} y={20}>
            <p className="max-w-xl font-mono text-sm font-medium uppercase leading-relaxed sm:text-base">
              <span className="text-orange">{profile.role}</span>
              {profile.intro.slice(profile.role.length)}
            </p>
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 font-mono text-sm" aria-label="Kontak & sosial media">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-mute transition-colors hover:text-orange"
                    aria-label={`${s.label}: ${s.handle}`}
                  >
                    {s.handle}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>

      {/* Statement */}
      <div className="relative mx-auto grid max-w-[1440px] gap-8 px-4 py-16 sm:px-8 md:py-24 lg:grid-cols-12">
        <Reveal className="lg:col-span-7">
          <h2 className="display text-[clamp(3rem,10vw,8.5rem)]">
            {profile.statement.map((l, i) => (
              <span key={l} className={`block ${i === 1 ? "text-outline" : "text-orange"}`}>
                {l}
              </span>
            ))}
          </h2>
        </Reveal>
        <Reveal delay={0.15} className="flex flex-col justify-end gap-8 lg:col-span-5">
          <p className="font-mono text-sm uppercase leading-relaxed text-white/85 sm:text-base">{profile.statementBody}</p>
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
        <Spark aria-hidden className="pointer-events-none absolute right-6 top-6 hidden h-12 w-12 text-orange motion-safe:animate-spin-slow md:block" />
      </div>

      <div className="-rotate-2 scale-105 bg-orange py-4 text-ink sm:py-5">
        <Marquee items={marquee} className="display text-[clamp(1.75rem,5vw,3.5rem)]" duration={28} />
      </div>
    </section>
  );
}

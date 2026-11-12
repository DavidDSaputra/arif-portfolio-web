"use client";

import Image from "next/image";
import { Fragment, useRef, type CSSProperties } from "react";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "motion/react";
import { contact, marquee, profile, skills, socials } from "@/lib/content";
import { ArrowRight, Instagram, Mail, WhatsApp } from "./icons";
import { Marquee, OpenBox, Pill, Reveal, outExpo } from "./ui";
import PixelSky from "./PixelSky";

const ease = [0.22, 1, 0.36, 1] as const;
const socialIcons = { Instagram, WhatsApp, Email: Mail } as const;

// rotasi awal tiap huruf saat meletup (deterministik, supaya SSR = client)
const ROT = [-14, 10, -8, 16, -12, 7, -16, 12, -6, 14, -10, 8];

/** Satu baris huruf yang meletup satu per satu (CSS .pop-* di globals.css). */
function PopLine({ text, start, className = "" }: { text: string; start: number; className?: string }) {
  return (
    <span aria-hidden className={`block whitespace-nowrap ${className}`}>
      {[...text].map((ch, i) => (
        <span
          key={i}
          className="pop-ch"
          style={{ "--d": `${start + i * 70}ms`, "--r": `${ROT[(Math.round(start / 70) + i) % ROT.length]}deg` } as CSSProperties}
        >
          <span className="pop-hv">{ch}</span>
        </span>
      ))}
    </span>
  );
}

/** Stiker kecil yang ikut meletup di sekitar nama. */
const stickers = [
  { text: skills.fields[0], pos: "left-[4%] top-[22%] sm:left-[10%] sm:top-[24%]", rot: -8, delay: 1500 },
  { text: skills.fields[1], pos: "right-[4%] top-[18%] sm:right-[12%] sm:top-[22%]", rot: 7, delay: 1650 },
  { text: skills.fields[2], pos: "left-[5%] top-[50%] hidden sm:block lg:left-[12%]", rot: 6, delay: 1800 },
  { text: `@${profile.handle}`, pos: "right-[5%] top-[46%] hidden sm:block lg:right-[11%]", rot: -6, delay: 1950 },
];

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // nama sedikit turun & memudar saat hero di-scroll
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const nameY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "28%"]);
  const nameOpacity = useTransform(scrollYProgress, [0, 0.8], [1, reduce ? 1 : 0.2]);

  const { scrollYProgress: photoProgress } = useScroll({ target: photoRef, offset: ["start end", "end start"] });
  // dipantau di pembungkus (bukan elemen ber-clip-path, yang luas terlihatnya 0 saat masih tertutup)
  const photoIn = useInView(photoRef, { once: true, amount: 0.2 });
  const photoY = useTransform(photoProgress, [0, 1], reduce ? ["0%", "0%"] : ["-8%", "8%"]);

  return (
    <section id="top" aria-label="Perkenalan" className="relative overflow-hidden">
      {/* Hero tipografi: pola piksel di tepi, nama besar di tengah yang meletup per huruf */}
      <div ref={heroRef} className="relative bg-paper">
        <PixelSky
          className="absolute inset-0"
          clear={{ cx: 0.5, cy: 0.5, rx: 0.46, ry: 0.42 }}
          clearNarrow={{ cx: 0.5, cy: 0.5, rx: 0.7, ry: 0.42 }}
        />

        {stickers.map((s) => (
          <span
            key={s.text}
            aria-hidden
            className={`pop-sticker absolute z-10 rounded-full border-2 border-blue bg-cream px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-[0.14em] text-blue shadow-[3px_3px_0_var(--color-blue)] sm:text-sm ${s.pos}`}
            style={{ "--d": `${s.delay}ms`, "--rot": `${s.rot}deg` } as CSSProperties}
          >
            {s.text}
          </span>
        ))}

        <div className="relative mx-auto flex min-h-[100svh] max-w-[1440px] flex-col items-center justify-center px-4 pb-32 pt-28 text-center sm:px-8">
          <motion.p
            className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-blue sm:text-sm"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: outExpo }}
          >
            [ {profile.label} ]
          </motion.p>

          <motion.h1 style={{ y: nameY, opacity: nameOpacity }} className="display mt-4 text-blue">
            <span className="sr-only">{profile.fullName}</span>
            <PopLine text={profile.firstName} start={150} className="text-[clamp(5.5rem,27vw,17rem)] leading-[0.8]" />
            <PopLine text={profile.lastName} start={150 + profile.firstName.length * 70} className="text-[clamp(5.5rem,27vw,17rem)] leading-[0.8]" />
          </motion.h1>

          <motion.p
            className="mt-5 font-mono text-sm font-extrabold uppercase tracking-[0.32em] text-navy sm:text-lg"
            initial={reduce ? false : { opacity: 0, letterSpacing: "0.6em" }}
            animate={{ opacity: 1, letterSpacing: "0.32em" }}
            transition={{ delay: 1.1, duration: 1, ease: outExpo }}
          >
            {profile.role}
          </motion.p>

          <p className="mt-6 max-w-3xl font-mono text-[clamp(1.35rem,3.4vw,2.4rem)] font-semibold leading-[1.15] tracking-[-0.01em] text-navy">
            {profile.headline.split(" ").map((w, i) => (
              <Fragment key={i}>
                <span className="pop-word" style={{ "--d": `${1250 + i * 90}ms` } as CSSProperties}>
                  {w}
                </span>{" "}
              </Fragment>
            ))}
          </p>

          <OpenBox delay={1.9} className="mt-6 w-full max-w-2xl">
            <p className="font-mono text-[13px] font-semibold uppercase leading-[1.5] text-navy sm:text-[15px]">{profile.heroIntro}</p>
          </OpenBox>

          <motion.ul
            className="mt-2 flex flex-wrap justify-center gap-3"
            aria-label="Kontak & sosial media"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.1, duration: 0.8, ease: outExpo }}
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
                    className="flex items-center gap-2 rounded-full border-2 border-blue/40 bg-paper/80 px-3 py-2 font-mono text-[13px] font-semibold text-navy transition-colors hover:border-blue hover:bg-blue hover:text-cream sm:text-sm"
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

      {/* Statement + foto (dipindah dari hero) */}
      <div className="relative mx-auto grid max-w-[1440px] items-end gap-10 px-4 py-20 sm:px-8 md:py-28 lg:grid-cols-12 lg:gap-12">
        <div ref={photoRef} className="relative mx-auto w-[72%] max-w-[380px] lg:col-span-4 lg:w-full lg:max-w-none">
          <motion.div
            initial={reduce ? false : { clipPath: "inset(100% 0 0 0 round 999px 999px 0 0)" }}
            animate={photoIn || reduce ? { clipPath: "inset(0% 0 0 0 round 999px 999px 0 0)" } : undefined}
            transition={{ duration: 1.3, ease }}
            className="relative aspect-[3/4.2] overflow-hidden rounded-t-full border-2 border-blue bg-cream"
          >
            <motion.div style={{ y: photoY }} className="absolute inset-[-8%]">
              <Image
                src={profile.photos.hero.src}
                alt={profile.photos.hero.alt}
                fill
                sizes="(min-width: 1024px) 30vw, 72vw"
                className="object-cover object-[50%_35%] grayscale"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-blue/55 via-sky/10 to-transparent mix-blend-multiply" />
          </motion.div>
          <span
            aria-hidden
            className="absolute -right-2 bottom-8 rotate-6 rounded-full border-2 border-blue bg-cream px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-[0.14em] text-blue shadow-[3px_3px_0_var(--color-blue)]"
          >
            {profile.fullName}
          </span>
        </div>

        <div className="grid gap-8 lg:col-span-8">
          <Reveal>
            <h2 className="display text-[clamp(3.5rem,12vw,10rem)]">
              {profile.statement.map((l, i) => (
                <span key={l} className={`block ${i === 1 ? "text-outline" : "text-blue"}`}>
                  {l}
                </span>
              ))}
            </h2>
          </Reveal>
          <Reveal delay={0.15} className="flex flex-col gap-8 lg:max-w-2xl">
            <p className="font-mono text-base font-medium leading-relaxed text-navy sm:text-lg">{profile.statementBody}</p>
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
        </div>
      </div>

      <div className="-rotate-2 scale-105 bg-blue py-4 text-cream sm:py-5">
        <Marquee items={marquee} className="display text-[clamp(2rem,6vw,4.25rem)]" duration={28} />
      </div>
    </section>
  );
}

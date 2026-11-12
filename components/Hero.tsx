"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import { contact, marquee, profile, socials } from "@/lib/content";
import { ArrowRight, Instagram, LongArrow, Mail, Spark, WhatsApp } from "./icons";
import { Marquee, OpenBox, Pill, Reveal, outExpo } from "./ui";
import PixelSky from "./PixelSky";
import PixelHeadline from "./PixelHeadline";

const ease = [0.22, 1, 0.36, 1] as const;
const socialIcons = { Instagram, WhatsApp, Email: Mail } as const;

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const photoY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "18%"]);
  // Kata-kata nama memudar naik bergiliran (--out: 0 → 1) saat nama itu sendiri mendekati tepi atas layar
  // (bukan saat hero mulai di-scroll — di HP nama berada di bawah foto).
  const { scrollYProgress: nameOut } = useScroll({ target: nameRef, offset: ["start 90px", "end start"] });
  useMotionValueEvent(nameOut, "change", (v) => {
    nameRef.current?.style.setProperty("--out", reduce ? "0" : v.toFixed(3));
  });

  return (
    <section id="top" aria-label="Perkenalan" className="relative overflow-hidden">
      {/* Layout Fearless (nama besar + foto lengkung + kotak ngebuka) dengan animasi piksel ala andreas.vision */}
      <div ref={heroRef} className="relative bg-navy">
        {/* Langit piksel: awan hanya di tepi & sudut, tengah bersih untuk konten */}
        <PixelSky
          className="absolute inset-0"
          clear={{ cx: 0.5, cy: 0.5, rx: 0.56, ry: 0.46 }}
          clearNarrow={{ cx: 0.5, cy: 0.5, rx: 0.8, ry: 0.47 }}
        />

        <div className="relative mx-auto grid min-h-[100svh] max-w-[1440px] grid-cols-1 px-4 pb-28 pt-24 sm:px-8 lg:grid-cols-12 lg:gap-8 lg:pt-28">
          {/* Foto (arch, gaya PDF) */}
          <div className="relative order-1 mx-auto mb-8 w-[72%] max-w-[420px] lg:order-2 lg:col-span-5 lg:mb-0 lg:w-full lg:max-w-none lg:self-stretch">
            <motion.div
              initial={reduce ? false : { clipPath: "inset(100% 0 0 0 round 999px 999px 0 0)" }}
              animate={{ clipPath: "inset(0% 0 0 0 round 999px 999px 0 0)" }}
              transition={{ duration: 1.3, ease, delay: 0.1 }}
              className="relative aspect-[3/4.4] overflow-hidden rounded-t-full bg-panel lg:absolute lg:inset-0 lg:aspect-auto"
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
            </motion.div>
          </div>

          {/* Teks */}
          <div className="relative z-10 order-2 flex flex-col justify-end lg:order-1 lg:col-span-7">
            <div className="mb-6 flex items-center gap-4 text-sky">
              <span className="flex gap-1.5" aria-hidden>
                <span className="h-2 w-2 bg-blue" />
                <span className="h-2 w-2 bg-blue" />
              </span>
              <LongArrow className="h-8 w-40 sm:w-52" />
            </div>

            {/* Nama: tiap kata "meletup" dari kotak piksel */}
            <PixelHeadline
              ref={nameRef}
              lines={[`${profile.firstName} -`, profile.lastName]}
              delay={300}
              stagger={140}
              lineClassName="whitespace-nowrap"
              className="display text-sky text-[clamp(3rem,15vw,9rem)] lg:-mr-[30%] lg:text-[clamp(4rem,10.5vw,11rem)]"
            />

            {/* Tagline serif italic, muncul per kata setelah nama */}
            <PixelHeadline
              as="p"
              lines={[profile.headline]}
              delay={850}
              stagger={70}
              className="mt-4 font-serif text-[clamp(1.6rem,3.6vw,3rem)] italic leading-[1.1] tracking-[-0.02em] text-fg"
            />

            <OpenBox delay={1.3} className="-mx-[10px] mt-2 max-w-2xl">
              <p className="font-mono text-[13px] uppercase leading-[1.4] text-fg sm:text-base sm:leading-[1.3]">{profile.heroIntro}</p>
            </OpenBox>

            <motion.ul
              className="mt-3 flex flex-wrap gap-3 sm:gap-[18px]"
              aria-label="Kontak & sosial media"
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.7, duration: 0.8, ease: outExpo }}
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
                      className="flex items-center gap-2 border-[0.8px] border-fg/25 bg-navy/80 px-2 py-2 font-mono text-[13px] text-fg/80 transition-colors hover:border-sky hover:text-ice sm:text-sm"
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
      </div>

      {/* Statement */}
      <div className="relative mx-auto grid max-w-[1440px] gap-8 px-4 py-16 sm:px-8 md:py-24 lg:grid-cols-12">
        <Reveal className="lg:col-span-7">
          <h2 className="display text-[clamp(3rem,10vw,8.5rem)]">
            {profile.statement.map((l, i) => (
              <span key={l} className={`block ${i === 1 ? "text-outline" : "text-sky"}`}>
                {l}
              </span>
            ))}
          </h2>
        </Reveal>
        <Reveal delay={0.15} className="flex flex-col justify-end gap-8 lg:col-span-5">
          <p className="font-mono text-sm uppercase leading-relaxed text-fg/85 sm:text-base">{profile.statementBody}</p>
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
        <Spark aria-hidden className="pointer-events-none absolute right-6 top-6 hidden h-12 w-12 text-sky motion-safe:animate-spin-slow md:block" />
      </div>

      <div className="-rotate-2 scale-105 bg-blue py-4 text-white sm:py-5">
        <Marquee items={marquee} className="display text-[clamp(1.75rem,5vw,3.5rem)]" duration={28} />
      </div>
    </section>
  );
}

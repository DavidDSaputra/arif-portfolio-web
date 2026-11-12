"use client";

import Image from "next/image";
import { useRef, type CSSProperties } from "react";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "motion/react";
import { contact, profile, skills, socials } from "@/lib/content";
import { ArrowUpRight, Instagram, Mail, WhatsApp } from "./icons";
import { FlickerText, Scramble, WaveText } from "./ui";
import Logo from "./Logo";

const socialIcons = { Instagram, WhatsApp, Email: Mail } as const;

/** Baris info "LABEL  NILAI" ala tabel spesifikasi. */
const facts = [
  { label: "Role", value: profile.role },
  { label: "Handle", value: `@${profile.handle}` },
  { label: "Tools", value: skills.software.slice(0, 4).join(" / ") },
  { label: "Untuk", value: skills.fields.join(", ") },
];

/** Logo besar yang miring mengikuti mouse (pengganti badge 3D). */
function TiltBadge() {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--tx", `${(nx * 28).toFixed(1)}deg`);
    el.style.setProperty("--ty", `${(-ny * 28).toFixed(1)}deg`);
  };
  const reset = () => {
    ref.current?.style.setProperty("--tx", "0deg");
    ref.current?.style.setProperty("--ty", "0deg");
  };
  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      data-cursor={profile.handle}
      className="relative grid aspect-square w-40 place-items-center sm:w-52 lg:w-60 [perspective:700px]"
      style={{ "--tx": "0deg", "--ty": "0deg" } as CSSProperties}
    >
      <div className="transition-transform duration-300 ease-out [transform:rotateX(var(--ty))_rotateY(var(--tx))]">
        <Logo size={170} className="h-auto w-32 drop-shadow-[0_18px_30px_rgba(0,0,0,0.45)] sm:w-40 lg:w-44" />
      </div>
      <p className="absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap font-pixel text-[10px] uppercase text-mute">
        Est. {profile.handle}
      </p>
    </div>
  );
}

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const headY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-12%"]);
  // dipantau di pembungkus: elemen ber-clip-path yang masih tertutup dianggap tidak terlihat oleh IntersectionObserver
  const photoRef = useRef<HTMLDivElement>(null);
  const photoIn = useInView(photoRef, { once: true, amount: 0.15 });

  return (
    <section id="top" aria-label="Perkenalan" className="relative overflow-hidden">
      {/* ── Hero: judul raksasa (padat + outline) ala yeahright.co ── */}
      <div ref={heroRef} className="relative mx-auto flex min-h-[100svh] max-w-[1600px] flex-col justify-between px-4 pb-32 pt-28 sm:px-8 lg:pt-32">
        <motion.div style={{ y: headY }}>
          <h1 className="sr-only">
            {profile.fullName} — {profile.role}
          </h1>
          <WaveText lines={["Social Media"]} delay={100} className="display block text-[clamp(3rem,16.5vw,17rem)] text-fg" />
          <FlickerText as="span" lines={["Specialist"]} delay={500} className="display block text-[clamp(3rem,16.5vw,17rem)] text-blue" />
          <p className="mt-4 text-right font-mono text-sm uppercase text-fg sm:text-lg lg:text-xl">
            <Scramble text={`[${profile.headline}]`} delay={900} />
          </p>
        </motion.div>

        <div className="mt-14 flex flex-col gap-10 sm:flex-row sm:items-end sm:justify-between">
          <div className="font-mono text-xs uppercase sm:text-sm">
            <p className="mb-3 text-blue">
              <Scramble text={`[${profile.fullName}]`} delay={1100} />
            </p>
            <dl className="grid grid-cols-[5.5rem_1fr] gap-x-4 gap-y-1.5">
              {facts.map((f, i) => (
                <div key={f.label} className="contents">
                  <dt className="text-mute">
                    <Scramble text={f.label} delay={1200 + i * 90} />
                  </dt>
                  <dd className="text-fg">
                    <Scramble text={f.value} delay={1250 + i * 90} />
                  </dd>
                </div>
              ))}
            </dl>
            <ul className="mt-6 flex flex-wrap gap-2" aria-label="Kontak & sosial media">
              {socials.map((s) => {
                const Icon = socialIcons[s.label];
                return (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${s.label}: ${s.handle}`}
                      data-cursor={s.label}
                      className="flex items-center gap-2 border border-fg/20 px-3 py-2 normal-case text-fg/85 transition-colors hover:border-blue hover:text-blue"
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{s.handle}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="self-center sm:self-auto">
            <TiltBadge />
          </div>
        </div>
      </div>

      {/* ── Pembuka: pengalaman + foto + ajakan ── */}
      <div className="relative mx-auto max-w-[1600px] px-4 py-20 sm:px-8 md:py-28">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-9">
            <WaveText lines={["2+ Tahun", "Pengalaman"]} className="display text-[clamp(4rem,13vw,12.5rem)] text-fg" />
          </div>
          <div className="hidden items-end justify-end lg:col-span-3 lg:flex">
            {/* panah bergaya tangan */}
            <svg viewBox="0 0 110 210" aria-hidden className="h-40 w-auto text-blue">
              <path d="M30 6c50 30 62 92 34 156" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              <path d="M44 150l18 22 22-16" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <div ref={photoRef} className="lg:col-span-5 lg:col-start-2">
            <motion.div
              initial={reduce ? false : { clipPath: "inset(0 0 100% 0)" }}
              animate={photoIn || reduce ? { clipPath: "inset(0 0 0% 0)" } : undefined}
              transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
              data-cursor={profile.firstName}
              className="group relative aspect-square w-full max-w-[460px] overflow-hidden border border-fg/20 bg-deep scanlines"
            >
              <Image
                src={profile.photos.hero.src}
                alt={profile.photos.hero.alt}
                fill
                sizes="(min-width: 1024px) 34vw, 92vw"
                className="object-cover object-[50%_30%] grayscale contrast-125 transition-transform duration-700 group-hover:scale-105"
              />
              {/* nada warna aksen (duotone) — memudar saat di-hover */}
              <div className="absolute inset-0 bg-blue opacity-70 mix-blend-multiply transition-opacity duration-500 group-hover:opacity-30" />
              <p className="absolute bottom-3 left-3 font-pixel text-[10px] uppercase text-fg">Fig. 01 — {profile.fullName}</p>
            </motion.div>
          </div>

          <div className="flex flex-col justify-end gap-6 lg:col-span-6">
            <FlickerText lines={profile.statement} className="display text-[clamp(3.25rem,9vw,8.5rem)] text-blue" />
            <a href="#contact" data-cursor="Kontak" className="group inline-flex w-fit items-center gap-2 font-mono text-base uppercase text-fg sm:text-xl">
              <Scramble text={`[${contact.ctas.primary}]`} />
              <ArrowUpRight className="h-5 w-5 text-blue transition-transform duration-300 group-hover:rotate-45" />
            </a>
            <p className="max-w-xl font-mono text-sm leading-relaxed text-fg/80 sm:text-base">{profile.heroIntro}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

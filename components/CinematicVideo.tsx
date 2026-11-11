"use client";

import Image from "next/image";
import { getWork, showcases, type Media } from "@/lib/content";
import { Play } from "./icons";
import { DetailLink, Reveal, ScriptTitle } from "./ui";

type VideoMedia = Extract<Media, { kind: "video" }>;

/** Mockup monitor (gaya slide PDF): layar hitam, dagu putih, kaki abu-abu. */
function Monitor({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[760px]">
      <div className="rounded-t-[1.4rem] bg-black p-[2.6%] pb-[4%] shadow-[0_40px_120px_-30px_rgba(0,90,156,0.5)] ring-1 ring-navy/10">
        <div className="relative aspect-video overflow-hidden rounded-[0.3rem] bg-surface">{children}</div>
      </div>
      <div className="h-[clamp(26px,6vw,58px)] rounded-b-[1.4rem] bg-gradient-to-b from-[#efefef] to-[#d4d4d4]" />
      <div aria-hidden className="mx-auto h-[clamp(36px,9vw,92px)] w-[22%] bg-gradient-to-b from-[#c4c4c4] to-[#a8a8a8] [clip-path:polygon(16%_0,84%_0,100%_100%,0_100%)]" />
      <div aria-hidden className="mx-auto h-[6px] w-[34%] rounded-full bg-[#cfcfcf]" />
    </div>
  );
}

function CinemaScreen({ m }: { m: VideoMedia }) {
  if (m.src) {
    return (
      <video
        src={m.src}
        poster={m.poster.src}
        controls
        playsInline
        preload="none"
        className="absolute inset-0 h-full w-full object-cover"
        aria-label={m.poster.alt}
      />
    );
  }
  return (
    <>
      <Image src={m.poster.src} alt={m.poster.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="animate-kenburns object-cover" />
      <div className="absolute inset-0 grid place-items-center bg-gradient-to-t from-navy/50 via-transparent to-transparent">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-blue text-white shadow-lg">
          <Play className="ml-1 h-7 w-7" />
        </span>
      </div>
      <span className="absolute bottom-3 left-3 rounded-full bg-white/85 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-blue">
        Video menyusul
      </span>
    </>
  );
}

/** Slide "Cinematic Video — Trip to Sukabumi / Bugel Beach" dari PDF. */
export default function CinematicVideo() {
  const s = showcases.cinematic;
  const work = getWork(s.slug);
  if (!work) return null;
  const video = work.media.find((m): m is VideoMedia => m.kind === "video");

  return (
    <section id="cinematic" aria-labelledby="cinematic-title" className="relative scroll-mt-20 overflow-hidden border-b border-line py-24 md:py-32">
      <div aria-hidden className="pointer-events-none absolute -left-40 bottom-0 h-[26rem] w-[26rem] rounded-full bg-sky/25 blur-[130px]" />
      <div aria-hidden className="pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full bg-sky/20 blur-[120px]" />

      <div className="relative mx-auto grid max-w-[1440px] items-center gap-14 px-4 sm:px-8 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-5">
          {/* di desktop kolomnya hanya 5/12 → ukuran dibatasi agar "CINEMATIC" tidak tertimpa monitor */}
          <ScriptTitle id="cinematic-title" words={s.words} className="text-[clamp(2.75rem,12.5vw,7rem)] lg:text-[clamp(3rem,5.2vw,6rem)]" />
          <p className="display mt-6 text-[clamp(1.5rem,3.4vw,2.75rem)] text-navy [text-shadow:0_0_28px_rgba(96,193,229,0.55)]">
            {s.subtitle.map((l) => (
              <span key={l} className="block">
                {l}
              </span>
            ))}
          </p>
          <p className="mt-3 font-mono text-xs uppercase tracking-[0.16em] text-mute sm:text-sm">{s.tag}</p>
          <p className="mt-8 max-w-md font-mono text-sm leading-relaxed text-navy/80 sm:text-base">{work.summary}</p>
          <div className="mt-10">
            <DetailLink href={`/work/${s.slug}`} />
          </div>
        </Reveal>

        <Reveal delay={0.15} className="lg:col-span-7">
          {video && (
            <Monitor>
              <CinemaScreen m={video} />
            </Monitor>
          )}
        </Reveal>
      </div>
    </section>
  );
}

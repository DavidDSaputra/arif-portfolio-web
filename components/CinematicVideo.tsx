"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { getWork, showcases, works, type Media } from "@/lib/content";
import TvScreen from "./TvScreen";
import { Play } from "./icons";
import { DetailLink, Reveal, ScriptTitle } from "./ui";

type VideoMedia = Extract<Media, { kind: "video" }>;

/** Siaran di TV tabung: poster + tombol putar → semburan "semut" → video diputar dengan kontrol. */
function CinemaTv({ m, channel }: { m: VideoMedia; channel: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [on, setOn] = useState(false);

  const start = () => {
    setOn(true);
    // beri waktu semburan statis sebentar sebelum gambar muncul
    window.setTimeout(() => ref.current?.play().catch(() => {}), 380);
  };

  return (
    <TvScreen channel={channel} staticKey={on ? "on" : "off"}>
      {m.src && on ? (
        <video
          ref={ref}
          src={m.src}
          poster={m.poster.src}
          controls
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full bg-black object-cover"
          aria-label={m.poster.alt}
        />
      ) : (
        <>
          <Image src={m.poster.src} alt={m.poster.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="animate-kenburns object-cover" />
          {m.src ? (
            <button
              type="button"
              onClick={start}
              data-cursor="Putar"
              aria-label={`Putar video: ${m.poster.alt}`}
              className="group absolute inset-0 z-10 grid place-items-center bg-gradient-to-t from-black/60 via-transparent to-transparent"
            >
              <span className="flex items-center gap-3 border border-blue bg-paper/80 px-5 py-3 font-mono text-sm uppercase text-blue backdrop-blur-sm transition-colors group-hover:bg-blue group-hover:text-cream">
                <Play className="h-4 w-4" /> [Putar]
              </span>
            </button>
          ) : (
            <span className="absolute bottom-[6%] left-[4%] z-10 bg-paper/85 px-3 py-1 font-mono text-[11px] uppercase text-fg">Video menyusul</span>
          )}
        </>
      )}
    </TvScreen>
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
          {/* di desktop kolomnya hanya 5/12 → ukuran dibatasi agar "CINEMATIC" tidak tertimpa TV */}
          <ScriptTitle id="cinematic-title" words={s.words} className="text-[clamp(2.75rem,12.5vw,7rem)] lg:text-[clamp(3rem,5.2vw,6rem)]" />
          <p className="display mt-6 text-[clamp(1.5rem,3.4vw,2.75rem)] text-blue">
            {s.subtitle.map((l) => (
              <span key={l} className="block">
                {l}
              </span>
            ))}
          </p>
          <p className="mt-3 font-mono text-xs uppercase text-mute sm:text-sm">{s.tag}</p>
          <p className="mt-8 max-w-md font-mono text-sm leading-relaxed text-fg/80 sm:text-base">{work.summary}</p>
          <div className="mt-10">
            <DetailLink href={`/work/${s.slug}`} />
          </div>
        </Reveal>

        <Reveal delay={0.15} className="lg:col-span-7">
          {video && <CinemaTv m={video} channel={`CH ${String(works.findIndex((w) => w.slug === s.slug) + 1).padStart(2, "0")}`} />}
        </Reveal>
      </div>
    </section>
  );
}

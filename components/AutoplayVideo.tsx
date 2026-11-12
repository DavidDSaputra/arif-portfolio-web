"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

/**
 * Video preview tanpa suara yang otomatis main (loop) selama terlihat di layar,
 * dan berhenti saat keluar layar supaya hemat baterai & data.
 * Bila pengunjung memilih "kurangi animasi", video tidak autoplay (hanya poster).
 */
export default function AutoplayVideo({
  src,
  poster,
  label,
  className = "",
  onPlayingChange,
}: {
  src: string;
  poster: string;
  label: string;
  className?: string;
  onPlayingChange?: (playing: boolean) => void;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const v = ref.current;
    if (!v || reduce) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.25 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [reduce]);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={label}
      onPlay={() => onPlayingChange?.(true)}
      onPause={() => onPlayingChange?.(false)}
      className={className}
    />
  );
}

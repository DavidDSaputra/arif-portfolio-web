"use client";

import dynamic from "next/dynamic";

// three.js dimuat terpisah, hanya di browser
const ColorBends = dynamic(() => import("./reactbits/ColorBends"), { ssr: false });

// di luar komponen agar referensinya stabil (tidak memicu efek ulang tiap render)
const COLORS = ["#A0E0EF", "#60C1E5", "#CDEFF7"];

/**
 * Latar animasi untuk bagian setelah hero — React Bits ColorBends.
 * Menempel di layar (fixed) di belakang konten. Hero menutupinya dengan latar putihnya sendiri,
 * jadi pita warna ini baru terlihat mulai blok "Let's work together" ke bawah.
 * Dibuat lembut (warna biru muda + opacity) agar teks tetap terbaca.
 */
export default function BendsBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 opacity-60">
      <ColorBends
        className=""
        colors={COLORS}
        rotation={60}
        speed={0.15}
        scale={1.2}
        frequency={1}
        warpStrength={1}
        mouseInfluence={0}
        parallax={0}
        noise={0}
        iterations={1}
        intensity={1}
        bandWidth={5}
        transparent
      />
    </div>
  );
}

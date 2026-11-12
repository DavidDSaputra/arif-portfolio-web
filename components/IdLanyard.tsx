"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { buildIdCardImages, type IdCardImages } from "@/lib/idCard";
import { profile } from "@/lib/content";

// three.js cukup berat → dimuat terpisah, hanya di browser
const Lanyard = dynamic(() => import("./reactbits/Lanyard"), { ssr: false });

/** Kartu ID 3D Samsul (React Bits — Lanyard) dengan desain kartu bertema portofolio. */
export default function IdLanyard({ className = "" }: { className?: string }) {
  const [images, setImages] = useState<IdCardImages | null>(null);

  useEffect(() => {
    let alive = true;
    buildIdCardImages()
      .then((imgs) => alive && setImages(imgs))
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div
      role="img"
      aria-label={`Kartu identitas 3D ${profile.fullName}, ${profile.role}. Tarik untuk mengayun, klik untuk membalik kartu.`}
      className={`relative ${className}`}
    >
      {images ? (
        <Lanyard
          frontImage={images.front}
          backImage={images.back}
          strapImage={images.strap}
          strapColor="#1B365D"
          strapWidth={0.85}
          cardColor="#ffffff"
          finish="glossy"
          metal="silver"
          size={0.62}
          strapLength={0.42}
          breeze={0.4}
          damping={0.55}
        />
      ) : (
        <div aria-hidden className="absolute left-1/2 top-[18%] h-[56%] w-[40%] -translate-x-1/2 animate-pulse rounded-3xl bg-panel" />
      )}
    </div>
  );
}

import CRTWarp from "./reactbits/CRTWarp";

/**
 * Latar animasi seluruh situs — React Bits CRTWarp.
 * lightMode = "tinta" biru langit di atas kertas putih (bukan tabung gelap), supaya latar tetap putih.
 * Efek CRT dibuat halus agar teks tetap terbaca; 30 fps & dpr 1 agar ringan di semua perangkat.
 */
export default function CrtBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <CRTWarp
        lightMode
        color="#60C1E5"
        backgroundColor="#ffffff"
        mask="aperture"
        maskStrength={0.18}
        brightness={0.45}
        speed={0.35}
        levels={3}
        columns={64}
        persistence={0.5}
        curvature={0}
        scanlineStrength={0.35}
        scanlineFrequency={220}
        bloom={0.8}
        rgbShift={0.0015}
        noise={0.05}
        flicker={0.05}
        interference={0.08}
        vignette={0.2}
        mouseReact
        mouseStrength={0.5}
        changeOnClick={false}
        dpr={1}
        fps={30}
      />
    </div>
  );
}

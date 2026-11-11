import type { CSSProperties, FC } from "react";

/** Tipe untuk React Bits — CRTWarp (sumber: CRTWarp.jsx, tabel props React Bits). */
export interface CRTWarpProps {
  color?: string;
  backgroundColor?: string;
  lightMode?: boolean;
  mask?: "aperture" | "shadow" | "slot" | "none";
  speed?: number;
  variation?: number;
  waveAmplitude?: number;
  waveFrequency?: number;
  levels?: number;
  columns?: number;
  persistence?: number;
  curvature?: number;
  corners?: number;
  scanlineStrength?: number;
  scanlineFrequency?: number;
  maskStrength?: number;
  bloom?: number;
  bloomRadius?: number;
  rgbShift?: number;
  noise?: number;
  flicker?: number;
  interference?: number;
  vignette?: number;
  brightness?: number;
  intro?: boolean;
  mouseReact?: boolean;
  mouseStrength?: number;
  changeOnClick?: boolean;
  dpr?: number;
  fps?: number;
  paused?: boolean;
  className?: string;
  style?: CSSProperties;
}

declare const CRTWarp: FC<CRTWarpProps>;
export default CRTWarp;

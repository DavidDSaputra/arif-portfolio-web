import type { CSSProperties, FC, RefObject } from "react";

/** Tipe untuk React Bits — Crosshair (sumber: Crosshair.jsx, tabel props React Bits). */
export interface CrosshairProps {
  color?: string;
  containerRef?: RefObject<HTMLElement | null> | null;
  thickness?: number;
  opacity?: number;
  lineStyle?: "solid" | "dashed" | "dotted";
  gap?: number;
  fade?: number;
  smoothing?: number;
  showCoordinates?: boolean;
  targetEffect?: "lock" | "glitch" | "none";
  targetSelector?: string;
  clickPulse?: boolean;
  hideCursor?: boolean;
  blendMode?: "normal" | "difference";
  className?: string;
  style?: CSSProperties;
}

declare const Crosshair: FC<CrosshairProps>;
export default Crosshair;

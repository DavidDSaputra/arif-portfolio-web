import type { CSSProperties, FC } from "react";

/** Tipe untuk React Bits — ColorBends (sumber: ColorBends.jsx, tabel props React Bits). */
export interface ColorBendsProps {
  rotation?: number;
  autoRotate?: number;
  speed?: number;
  colors?: string[];
  transparent?: boolean;
  scale?: number;
  frequency?: number;
  warpStrength?: number;
  mouseInfluence?: number;
  parallax?: number;
  noise?: number;
  iterations?: number;
  intensity?: number;
  bandWidth?: number;
  className?: string;
  style?: CSSProperties;
}

declare const ColorBends: FC<ColorBendsProps>;
export default ColorBends;

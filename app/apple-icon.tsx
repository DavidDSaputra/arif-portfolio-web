import { ImageResponse } from "next/og";
import { LOGO_ACCENTS, LOGO_CELLS, LOGO_COLORS } from "@/lib/logo";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Ikon homescreen (iPhone/Android) — logo S berpiksel. */
export default function AppleIcon() {
  const cell = 18;
  const off = 27; // (180 - 7*18) / 2
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: LOGO_COLORS.bg }}>
        {LOGO_CELLS.map(({ x, y }) => (
          <div key={`${x}-${y}`} style={{ position: "absolute", left: off + x * cell, top: off + y * cell, width: cell, height: cell, background: LOGO_COLORS.fg }} />
        ))}
        {LOGO_ACCENTS.map(({ x, y, color }) => (
          <div key={`a${x}-${y}`} style={{ position: "absolute", left: off + x * cell, top: off + y * cell, width: cell, height: cell, background: color }} />
        ))}
      </div>
    ),
    size,
  );
}

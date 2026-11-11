/** Logo "S" berpiksel (Samsul). Grid 7×7; X = piksel putih. */
export const LOGO_GRID = [
  ".XXXXX.",
  "XX.....",
  "XX.....",
  ".XXXXX.",
  ".....XX",
  ".....XX",
  "XXXXXX.",
];

export const LOGO_COLORS = { bg: "#005A9C", fg: "#FFFFFF", sky: "#60C1E5", ice: "#A0E0EF", navy: "#1B365D" };

/** Piksel aksen di sudut kosong (biru langit & biru es) */
export const LOGO_ACCENTS = [
  { x: 6, y: 0, color: LOGO_COLORS.sky },
  { x: 6, y: 6, color: LOGO_COLORS.ice },
];

export const LOGO_CELLS = LOGO_GRID.flatMap((row, y) => [...row].flatMap((c, x) => (c === "X" ? [{ x, y }] : [])));

import { LOGO_ACCENTS, LOGO_CELLS, LOGO_COLORS } from "@/lib/logo";

/** Logo "S" berpiksel dalam kotak biru membulat. */
export default function Logo({ size = 32, className = "", title }: { size?: number; className?: string; title?: string }) {
  const cell = 3;
  const off = 5;
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      shapeRendering="crispEdges"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <rect width="32" height="32" rx="7" fill={LOGO_COLORS.bg} />
      {LOGO_CELLS.map(({ x, y }) => (
        <rect key={`${x}-${y}`} x={off + x * cell} y={off + y * cell} width={cell} height={cell} fill={LOGO_COLORS.fg} />
      ))}
      {LOGO_ACCENTS.map(({ x, y, color }) => (
        <rect key={`a${x}-${y}`} x={off + x * cell} y={off + y * cell} width={cell} height={cell} fill={color} />
      ))}
    </svg>
  );
}

import { LOGO_ACCENTS, LOGO_CELLS } from "@/lib/logo";

/** Logo "S" berpiksel; warnanya ikut palet aktif (aksen + latar). */
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
      <rect width="32" height="32" rx="7" style={{ fill: "var(--color-blue)" }} />
      {LOGO_CELLS.map(({ x, y }) => (
        <rect key={`${x}-${y}`} x={off + x * cell} y={off + y * cell} width={cell} height={cell} style={{ fill: "var(--color-paper)" }} />
      ))}
      {LOGO_ACCENTS.map(({ x, y }) => (
        <rect key={`a${x}-${y}`} x={off + x * cell} y={off + y * cell} width={cell} height={cell} style={{ fill: "var(--color-paper)", opacity: 0.55 }} />
      ))}
    </svg>
  );
}

// Decorative geometric house pattern that sits behind the hero content on the
// terracotta field. Reproduced as vector art because the frame bakes the hero
// headline and photo on top of the pattern, so a clean raster crop is not
// available. Tones and motif (overlapping house silhouettes plus one mustard
// accent) follow the frame.
export default function HeroPattern() {
  // one house silhouette: square body with a triangular roof
  const House = ({
    x,
    y,
    s,
    fill,
    opacity,
    rotate = 0,
  }: {
    x: number;
    y: number;
    s: number;
    fill: string;
    opacity: number;
    rotate?: number;
  }) => (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`} opacity={opacity}>
      <path
        d={`M0 ${s * 0.45} L${s * 0.5} 0 L${s} ${s * 0.45} L${s} ${s} L0 ${s} Z`}
        fill={fill}
      />
    </g>
  );

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 1440 620"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <House x={120} y={40} s={220} fill="#d8c8b8" opacity={0.35} rotate={8} />
      <House x={430} y={-30} s={180} fill="#eadfce" opacity={0.28} rotate={-6} />
      <House x={620} y={110} s={260} fill="#d8c8b8" opacity={0.3} rotate={4} />
      <House x={300} y={300} s={200} fill="#c9a24a" opacity={0.4} rotate={-10} />
      <House x={0} y={360} s={240} fill="#d8c8b8" opacity={0.25} rotate={6} />
      <House x={860} y={-40} s={210} fill="#eadfce" opacity={0.24} rotate={10} />
      <House x={1040} y={120} s={280} fill="#d8c8b8" opacity={0.32} rotate={-5} />
      <House x={1250} y={330} s={200} fill="#eadfce" opacity={0.26} rotate={7} />
      <House x={760} y={360} s={230} fill="#d8c8b8" opacity={0.22} rotate={-8} />
      <House x={480} y={430} s={170} fill="#eadfce" opacity={0.22} rotate={5} />
    </svg>
  );
}

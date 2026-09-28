import { cn } from "cn";

const PALETTES = [
  "from-[oklch(0.9_0.02_75)] via-[oklch(0.83_0.03_60)] to-[oklch(0.72_0.05_35)]",
  "from-[oklch(0.9_0.02_140)] via-[oklch(0.82_0.03_140)] to-[oklch(0.68_0.05_150)]",
  "from-[oklch(0.92_0.015_85)] via-[oklch(0.85_0.02_75)] to-[oklch(0.7_0.04_60)]",
  "from-[oklch(0.9_0.03_20)] via-[oklch(0.8_0.04_20)] to-[oklch(0.68_0.06_25)]",
  "from-[oklch(0.93_0.01_260)] via-[oklch(0.85_0.02_240)] to-[oklch(0.72_0.03_230)]",
];

function paletteFor(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return PALETTES[hash % PALETTES.length];
}

interface PlaceholderImageProps {
  seed: string;
  className?: string;
  label?: string;
}

/**
 * Soft gradient stand-in used until real product photography is uploaded
 * through the admin Media/Products flow. Deterministic per `seed` so the
 * same product always renders the same placeholder.
 */
export function PlaceholderImage({ seed, className, label }: PlaceholderImageProps) {
  return (
    <div
      className={cn(
        "relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br",
        paletteFor(seed),
        className
      )}
      aria-hidden
    >
      <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay">
        <svg width="100%" height="100%" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice">
          <circle cx="40" cy="30" r="60" fill="white" />
          <circle cx="170" cy="170" r="80" fill="black" />
        </svg>
      </div>
      {label ? (
        <span className="relative font-heading text-sm tracking-[0.2em] text-ink/50 uppercase">
          {label}
        </span>
      ) : null}
    </div>
  );
}

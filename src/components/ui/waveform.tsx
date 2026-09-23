/**
 * The site's one recurring mark: a waveform.
 *
 * A violin is a time instrument and a score is read left to right, so the
 * ornament here travels rather than turns. It stands in for the thing the
 * whole site is actually about, which a decorative shape would not.
 *
 * The amplitudes come from a seeded generator rather than `Math.random`, so
 * the same bars render on the server and on the client and React does not
 * report a hydration mismatch. The same seed always gives the same wave, so a
 * given section keeps its shape between builds.
 */

/** Deterministic 0..1 noise. Small integer hash, no dependency. */
function noise(seed: number, i: number): number {
  const x = Math.sin(seed * 12.9898 + i * 78.233) * 43758.5453
  return x - Math.floor(x)
}

/**
 * Envelope shaped like a bowed note: a fast attack, a long sustain, a
 * decay at the tail. A flat envelope reads as a barcode instead.
 */
function envelope(t: number): number {
  if (t < 0.06) return t / 0.06
  if (t > 0.86) return (1 - t) / 0.14
  return 1
}

export function Waveform({
  bars = 96,
  seed = 7,
  className,
  /** Height of the tallest bar as a fraction of the box. */
  intensity = 1,
}: {
  bars?: number
  seed?: number
  className?: string
  intensity?: number
}) {
  const W = 1000
  const H = 100
  const gap = 0.35
  const step = W / bars
  const w = step * (1 - gap)

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className={`pointer-events-none select-none ${className ?? ''}`}
      aria-hidden="true"
      focusable="false"
    >
      {Array.from({ length: bars }, (_, i) => {
        const t = i / (bars - 1)
        // Two octaves of noise so the wave has both shape and grain.
        const a = noise(seed, i) * 0.65 + noise(seed * 3.1, i * 2) * 0.35
        const h = Math.max(1.5, a * envelope(t) * intensity * (H * 0.92))
        return (
          <rect
            key={i}
            x={i * step}
            y={(H - h) / 2}
            width={w}
            height={h}
            rx={w / 2}
            fill="currentColor"
            opacity={0.25 + a * 0.75}
          />
        )
      })}
    </svg>
  )
}

/**
 * A single travelling line, used where a full waveform would be too loud:
 * under a heading, or as the rule between two sections.
 */
export function BowRule({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1000 12"
      preserveAspectRatio="none"
      className={`pointer-events-none select-none ${className ?? ''}`}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M0 6 Q 125 1, 250 6 T 500 6 T 750 6 T 1000 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

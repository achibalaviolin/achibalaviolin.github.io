/**
 * The soundhole: concentric rings that turn slowly behind a portrait.
 *
 * The site's one recurring ornament. It sits behind the bout-framed
 * photograph on the home hero and on every page header, so the routes read as
 * one site rather than five.
 *
 * Pure SVG and one CSS animation, no canvas and no library: it is decorative
 * on every route, and a WebGL dependency to draw circles would cost every page
 * a bundle for something strokes already give for free.
 */
export function Soundhole({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 400"
      className={`pointer-events-none select-none ${className ?? ''}`}
      aria-hidden="true"
      focusable="false"
    >
      <g
        fill="none"
        stroke="currentColor"
        style={{ transformOrigin: '200px 200px' }}
        className="motion-safe:animate-[soundhole-turn_120s_linear_infinite]"
      >
        <circle cx="200" cy="200" r="196" strokeWidth="0.5" opacity="0.5" />
        <circle cx="200" cy="200" r="168" strokeWidth="0.5" opacity="0.35" />
        <circle cx="200" cy="200" r="132" strokeWidth="0.5" opacity="0.25" />
        {/* Tick marks around the rim, at the spacing of a fingerboard. */}
        {Array.from({ length: 48 }, (_, i) => {
          const angle = (i / 48) * Math.PI * 2
          const inner = 176
          const outer = i % 4 === 0 ? 192 : 186
          return (
            <line
              key={i}
              x1={200 + Math.cos(angle) * inner}
              y1={200 + Math.sin(angle) * inner}
              x2={200 + Math.cos(angle) * outer}
              y2={200 + Math.sin(angle) * outer}
              strokeWidth="0.75"
              opacity={i % 4 === 0 ? 0.55 : 0.22}
            />
          )
        })}
      </g>
      <circle
        cx="200"
        cy="200"
        r="96"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.18"
      />
    </svg>
  )
}

'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from '@/components/animations/use-reduced-motion'

/**
 * Four strings, tuned G D A E, that pluck when the pointer crosses them.
 *
 * Each string is an SVG path. Crossing one displaces it at the crossing point
 * and then lets it ring: a standing wave whose amplitude decays, drawn per
 * frame until it settles. The four decay at different rates because a thicker,
 * lower string rings longer than a thin one, which is the detail that makes it
 * read as an instrument rather than as a wobbling line.
 *
 * The whole thing is decorative and pointer-only. Under reduced motion, on
 * touch, or without JS, it renders four still hairlines, which is exactly what
 * the design wants there anyway.
 */

/**
 * G D A E. `decay` is per-second, and lower strings ring longer.
 *
 * Tuned so the longest ring settles in about a second: at the first values
 * tried the G string took 2.35s to fall below the cutoff, which on a page
 * reads as a wobble that will not stop rather than as a note.
 */
const STRINGS = [
  { note: 'G', y: 0.2, decay: 4.2, thickness: 1.5 },
  { note: 'D', y: 0.4, decay: 5.1, thickness: 1.2 },
  { note: 'A', y: 0.6, decay: 6.2, thickness: 1 },
  { note: 'E', y: 0.8, decay: 7.5, thickness: 0.8 },
]

const round = (n: number) => Math.round(n * 1000) / 1000

type Ring = { amp: number; phase: number; at: number; freq: number }

export function Strings({ className }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const pathRefs = useRef<(SVGPathElement | null)[]>([])
  const reduced = useReducedMotion()

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap || reduced) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    const W = 1000
    const H = 100
    const rings: (Ring | null)[] = STRINGS.map(() => null)
    let lastY: number | null = null
    let raf = 0
    let running = false

    const draw = (time: number, prev: number) => {
      const dt = Math.min(0.05, (time - prev) / 1000)
      let alive = false

      STRINGS.forEach((s, i) => {
        const path = pathRefs.current[i]
        if (!path) return
        const ring = rings[i]
        const y = s.y * H

        if (!ring || ring.amp < 0.15) {
          if (ring) {
            rings[i] = null
            path.setAttribute('d', `M0 ${y} L${W} ${y}`)
            path.setAttribute('opacity', String(round(0.32 - i * 0.045)))
          }
          return
        }

        alive = true
        ring.phase += dt * ring.freq
        ring.amp *= Math.exp(-s.decay * dt)

        // Light the string in proportion to how hard it is still ringing, so
        // the pluck is what draws the eye rather than the resting lines.
        const rest = 0.32 - i * 0.045
        path.setAttribute(
          'opacity',
          String(round(rest + Math.min(1, ring.amp / 11) * 0.5))
        )

        // A plucked string is a standing wave pinned at both ends, with the
        // antinode at the pluck point. Quadratics either side of `at` give
        // that shape in two curve segments.
        const offset = Math.sin(ring.phase) * ring.amp
        const x = ring.at * W
        path.setAttribute(
          'd',
          `M0 ${y} Q ${x / 2} ${y + offset}, ${x} ${y + offset} T ${W} ${y}`
        )
      })

      if (alive) {
        raf = requestAnimationFrame((t) => draw(t, time))
      } else {
        running = false
        raf = 0
      }
    }

    const start = () => {
      if (running) return
      running = true
      raf = requestAnimationFrame((t) => draw(t, t - 16))
    }

    const onMove = (e: PointerEvent) => {
      const rect = wrap.getBoundingClientRect()
      const ny = (e.clientY - rect.top) / rect.height
      const nx = (e.clientX - rect.left) / rect.width
      if (nx < 0 || nx > 1) return

      if (lastY !== null) {
        STRINGS.forEach((s, i) => {
          // Did the pointer cross this string since the last frame?
          const crossed = (lastY! - s.y) * (ny - s.y) < 0
          if (!crossed) return
          // Faster crossings pluck harder, to a ceiling.
          const speed = Math.min(1, Math.abs(ny - lastY!) * 14)
          rings[i] = {
            amp: 4 + speed * 9,
            phase: 0,
            at: nx,
            // Thinner strings sound higher.
            freq: 26 + (3 - i) * -4 + i * 9,
          }
          start()
        })
      }
      lastY = ny
    }

    const onLeave = () => {
      lastY = null
    }

    wrap.addEventListener('pointermove', onMove)
    wrap.addEventListener('pointerleave', onLeave)
    return () => {
      wrap.removeEventListener('pointermove', onMove)
      wrap.removeEventListener('pointerleave', onLeave)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [reduced])

  return (
    <div ref={wrapRef} className={className} aria-hidden="true">
      <svg
        viewBox="0 0 1000 100"
        preserveAspectRatio="none"
        className="h-full w-full overflow-visible"
        focusable="false"
      >
        {STRINGS.map((s, i) => (
          <path
            key={s.note}
            ref={(el) => {
              pathRefs.current[i] = el
            }}
            d={`M0 ${s.y * 100} L1000 ${s.y * 100}`}
            fill="none"
            stroke="currentColor"
            strokeWidth={s.thickness}
            vectorEffect="non-scaling-stroke"
            // Resting weight, tuned for the light theme: ink on paper reads
            // at a much lower alpha than the ivory-on-dark version did, and
            // the old 0.14 came out around 0.06 once the parent's own opacity
            // was applied, which was invisible. The ring handler raises this
            // on the string being touched and eases it back as the note
            // decays.
            opacity={0.32 - i * 0.045}
          />
        ))}
      </svg>
    </div>
  )
}

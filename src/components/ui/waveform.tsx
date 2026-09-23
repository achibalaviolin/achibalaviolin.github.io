'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from '@/components/animations/use-reduced-motion'

/**
 * The site's one recurring mark, and the only one that moves.
 *
 * A violin is a time instrument, so the ornament travels rather than turns.
 * Three behaviours, all of them about the page behaving like something being
 * played rather than something being read:
 *
 *   1. bars rise left to right when the wave scrolls into view, at the pace of
 *      a bow being drawn rather than all at once
 *   2. given `levels`, the bars ARE the audio: driven from an FFT of the hero
 *      video's own track, so the wave is the music and not a likeness of it
 *   3. otherwise bars swell toward the pointer, so the wave answers the cursor
 *      the way a string answers a finger
 *   4. an optional playhead lights every bar behind it
 *
 * Amplitudes come from a seeded generator rather than `Math.random`, so the
 * same seed always gives the same wave and a section keeps its shape between
 * builds.
 *
 * Every number that reaches an attribute is rounded to three decimals. A
 * seeded generator is not on its own enough to survive hydration: Node and the
 * browser disagree about `Math.sin` around the twelfth decimal place, which
 * React reported as a mismatch on `y`, `height` and `opacity` for every bar.
 * Rounding puts both sides on the same value.
 */

/** Three decimals is past anything a rendered pixel can show. */
const round = (n: number) => Math.round(n * 1000) / 1000

/** Deterministic 0..1 noise. Small integer hash, no dependency. */
function noise(seed: number, i: number): number {
  const x = Math.sin(seed * 12.9898 + i * 78.233) * 43758.5453
  return x - Math.floor(x)
}

/**
 * Envelope shaped like a bowed note: fast attack, long sustain, decay at the
 * tail. A flat envelope reads as a barcode instead of a sound.
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
  /** Bars up to this fraction render as played. Omit for a plain wave. */
  progress,
  /** Bars swell toward the pointer. Desktop only, off under reduced motion. */
  reactive = true,
  /**
   * Live levels, 0..1 per bar. When supplied and returning data, the wave is
   * the audio rather than the seeded shape, and the pointer swell steps aside
   * so the two are not fighting over the same bars.
   */
  levels,
}: {
  bars?: number
  seed?: number
  className?: string
  intensity?: number
  progress?: number
  reactive?: boolean
  levels?: (count: number) => number[] | null
}) {
  const svgRef = useRef<SVGSVGElement>(null)
  const barsRef = useRef<SVGRectElement[]>([])
  const reduced = useReducedMotion()

  const W = 1000
  const H = 100
  const gap = 0.34
  const step = W / bars
  const w = step * (1 - gap)

  const amps = Array.from({ length: bars }, (_, i) => {
    const t = i / (bars - 1)
    // Two octaves of noise so the wave has both shape and grain.
    const a = round(noise(seed, i) * 0.65 + noise(seed * 3.1, i * 2) * 0.35)
    return { a, h: round(Math.max(1.5, a * envelope(t) * intensity * (H * 0.92))) }
  })

  /* --- 1. entry: bars rise left to right --- */
  useEffect(() => {
    const svg = svgRef.current
    if (!svg || reduced) return

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        barsRef.current.forEach((bar, i) => {
          if (!bar) return
          // Both behaviours drive `--swell` rather than `transform`, so the
          // pointer swell multiplies the entry scale instead of replacing it.
          // Writing `transform` here would freeze the bar at scaleY(1) and
          // the cursor would do nothing.
          bar.style.transition = 'transform 620ms cubic-bezier(.16,1,.3,1)'
          bar.style.transitionDelay = `${(i / bars) * 620}ms`
          bar.style.setProperty('--swell', '1')
        })
      },
      { threshold: 0.15 }
    )

    io.observe(svg)
    return () => io.disconnect()
  }, [bars, reduced])

  /* --- 1b. live audio: the wave becomes the track --- */
  useEffect(() => {
    const svg = svgRef.current
    if (!svg || !levels || reduced) return

    let raf = 0
    const tick = () => {
      raf = requestAnimationFrame(tick)
      const out = levels(bars)
      if (!out) return
      for (let i = 0; i < barsRef.current.length; i++) {
        const bar = barsRef.current[i]
        if (!bar) continue
        // The rect's own height is the seeded shape; this scales it, so a
        // silent passage collapses to a line rather than to nothing.
        const v = 0.18 + out[i] * 2.4
        bar.style.transition = 'transform 90ms linear'
        bar.style.transitionDelay = '0ms'
        bar.style.setProperty('--swell', v.toFixed(3))
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [levels, bars, reduced])

  /* --- 2. pointer: bars swell toward the cursor --- */
  useEffect(() => {
    const svg = svgRef.current
    if (!svg || reduced || !reactive || levels) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    let frame = 0
    let pointerX = -1
    let tookOver = false

    const apply = () => {
      frame = 0
      const rect = svg.getBoundingClientRect()
      barsRef.current.forEach((bar, i) => {
        if (!bar) return
        // The entry stagger leaves a 620ms transition with a per-bar delay on
        // each bar; keeping it would make the wave lag the cursor by half a
        // second. Hand over to a short, undelayed one on first move.
        if (!tookOver) {
          bar.style.transitionDelay = '0ms'
          bar.style.transition = 'transform 280ms cubic-bezier(.16,1,.3,1)'
        }
        if (pointerX < 0) {
          bar.style.setProperty('--swell', '1')
          return
        }
        const barX = ((i + 0.5) / bars) * rect.width
        const d = Math.abs(barX - pointerX) / rect.width
        // Narrow falloff, so the swell reads as a touch rather than a bulge.
        const swell = 1 + Math.max(0, 1 - d / 0.11) ** 2 * 1.35
        bar.style.setProperty('--swell', swell.toFixed(3))
      })
      tookOver = true
    }

    const onMove = (e: PointerEvent) => {
      const rect = svg.getBoundingClientRect()
      pointerX = e.clientX - rect.left
      if (!frame) frame = requestAnimationFrame(apply)
    }
    const onLeave = () => {
      pointerX = -1
      if (!frame) frame = requestAnimationFrame(apply)
    }

    svg.addEventListener('pointermove', onMove)
    svg.addEventListener('pointerleave', onLeave)
    return () => {
      svg.removeEventListener('pointermove', onMove)
      svg.removeEventListener('pointerleave', onLeave)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [bars, reactive, reduced, levels])

  const playedUpTo = progress === undefined ? -1 : progress * bars

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className={`pointer-events-auto select-none ${className ?? ''}`}
      aria-hidden="true"
      focusable="false"
    >
      {amps.map(({ a, h }, i) => {
        const played = playedUpTo < 0 || i <= playedUpTo
        return (
          <rect
            key={i}
            ref={(el) => {
              if (el) barsRef.current[i] = el
            }}
            x={round(i * step)}
            y={round((H - h) / 2)}
            width={round(w)}
            height={h}
            rx={round(w / 2)}
            fill="currentColor"
            opacity={played ? round(0.25 + a * 0.75) : 0.08}
            style={{
              transformBox: 'fill-box',
              transformOrigin: 'center',
              // The entry animation scales this from 0; the pointer swell
              // multiplies it. Both write the same property, so they compose.
              transform: reduced ? 'scaleY(1)' : 'scaleY(var(--swell, 0))',
              ['--swell' as string]: reduced ? 1 : undefined,
            }}
          />
        )
      })}
    </svg>
  )
}

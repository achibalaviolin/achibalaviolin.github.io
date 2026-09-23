'use client'

import { motion, useMotionTemplate, useTransform, type MotionValue } from 'motion/react'
import { useReducedMotion } from '@/components/animations/use-reduced-motion'

/**
 * The headline, lit by the ribbon as it passes.
 *
 * The footage has a pale ribbon that leaves the violin and sweeps leftward
 * across the empty half of the frame, which is exactly where this sits. The
 * window was measured off the encode rather than guessed: detail in the left
 * 44% of frame is flat until 3.5s, rises through 5.0s, holds to 7.5s and is
 * gone by 9.0s. So the light crosses the words between `SWEEP_IN` and
 * `SWEEP_OUT` and the type brightens to ember under it, once per loop.
 *
 * The text is ink at all times and the sweep only recolours it. If the video
 * never plays, or `background-clip: text` is unsupported, the headline is a
 * plain ink headline and nothing is lost: the guard below means the
 * transparent fill is only ever applied where the clip actually works.
 */

/** Seconds into the loop, measured from the encode. */
export const SWEEP_IN = 3.6
export const SWEEP_OUT = 8.0

export function HeroHeadline({
  lines,
  /** Video position in seconds. */
  time,
  className,
}: {
  lines: string[]
  time: MotionValue<number>
  className?: string
}) {
  const reduced = useReducedMotion()

  /*
   * The ribbon travels right to left, so the lit band does too: `--sweep` is
   * the centre of the band as a percentage across the headline, running from
   * past the right edge to past the left one over the window. The gradient
   * itself is sized to the element; see the note in globals.css for why that
   * matters.
   */
  const sweep = useTransform(time, [SWEEP_IN, SWEEP_OUT], [125, -25], { clamp: true })
  const sweepPos = useMotionTemplate`${sweep}%`

  const label = lines.join(' ')

  if (reduced) {
    return (
      <h1 className={className}>
        {lines.map((line, i) => (
          <span key={i} className="block">
            {line}
          </span>
        ))}
      </h1>
    )
  }

  return (
    <motion.h1
      className={`hero-sweep ${className ?? ''}`}
      aria-label={label}
      style={{ ['--sweep' as string]: sweepPos }}
    >
      {lines.map((line, i) => (
        <span key={i} className="mask-line" aria-hidden="true">
          <motion.span
            className="block"
            initial={{ y: '112%' }}
            animate={{ y: '0%' }}
            transition={{ duration: 1.1, delay: 0.3 + i * 0.09, ease: [0.16, 1, 0.3, 1] }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </motion.h1>
  )
}

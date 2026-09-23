'use client'

import { motion, useScroll, useTransform } from 'motion/react'
import { useRef, type ReactNode } from 'react'
import { useReducedMotion } from './use-reduced-motion'

/**
 * Moves its children against the scroll direction as the section passes.
 *
 * `distance` is in percent of the element's own height, so it scales with the
 * content instead of needing per-breakpoint tuning. Wrap in a container with
 * `overflow-hidden` to avoid the edges showing.
 */
export function Parallax({
  children,
  distance = 12,
  className,
}: {
  children: ReactNode
  distance?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  /*
   * The ref must be attached in BOTH branches below. Returning early under
   * reduced motion without rendering the ref'd element leaves Motion holding
   * a ref that never resolves, which it reports as "Target ref is defined but
   * not hydrated" on every mount.
   */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [`${distance}%`, `-${distance}%`])

  return (
    <div ref={ref} className={className}>
      {reduced ? (
        <div className="h-full w-full">{children}</div>
      ) : (
        <motion.div style={{ y }} className="h-full w-full">
          {children}
        </motion.div>
      )}
    </div>
  )
}

/**
 * Wipes an image in behind a travelling clip-path.
 *
 * The wipe runs left to right, on the same axis as the bow stroke, the
 * waveform and the page transition. An upward wipe would be the only vertical
 * movement on the site and would read as borrowed from somewhere else.
 *
 * Kept separate from `Reveal` because a clip reveal must not also fade: the
 * two together read as a mistake rather than an effect.
 */
export function ClipReveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const reduced = useReducedMotion()

  if (reduced) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={{ clipPath: 'inset(0 100% 0 0)' }}
      whileInView={{ clipPath: 'inset(0 0% 0 0)' }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1.1, delay, ease: [0.65, 0, 0.35, 1] }}
    >
      {children}
    </motion.div>
  )
}

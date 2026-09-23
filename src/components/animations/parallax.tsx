'use client'

import { motion, useInView, useScroll, useTransform } from 'motion/react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
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
 * Wipes an image in behind a travelling clip-path, left to right, on the same
 * axis as the bow stroke and the page transition.
 *
 * It fails OPEN. The clip is driven by state that a safety timer will clear
 * even if the viewport observer never fires, because the alternative failure
 * is an image that stays 100% clipped and is simply gone from the page: that
 * happened to the whole stills band on the homepage, and to the awards rail
 * before it. An effect that does not run should cost the effect, never the
 * content.
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
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const inView = useInView(ref, { once: true, amount: 0.15 })
  const [shown, setShown] = useState(false)

  useEffect(() => {
    if (reduced) {
      setShown(true)
      return
    }
    if (inView) {
      setShown(true)
      return
    }
    // Backstop: reveal regardless after a beat, so a missed observer can
    // never leave the image hidden.
    const t = setTimeout(() => setShown(true), 2500)
    return () => clearTimeout(t)
  }, [inView, reduced])

  if (reduced) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={false}
      animate={{ clipPath: shown ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)' }}
      transition={{ duration: 1.1, delay: shown ? delay : 0, ease: [0.65, 0, 0.35, 1] }}
    >
      {children}
    </motion.div>
  )
}

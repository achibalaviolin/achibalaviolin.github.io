'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { motion, useScroll, useSpring, useMotionValueEvent } from 'motion/react'
import { Waveform } from '@/components/ui/waveform'
import { useReducedMotion } from '@/components/animations/use-reduced-motion'

/**
 * The transport: the page as a track being played.
 *
 * A fixed strip at the foot of the window holding the page's waveform, with
 * everything behind the playhead lit and everything ahead of it dim. Scrolling
 * scrubs it. It is the site's scroll-progress indicator, but stated in the
 * only vocabulary that belongs to this artist rather than as a bar at the top
 * of the screen that every site has.
 *
 * It is decoration over a real signal, so it is `aria-hidden` and the numbers
 * beside it are the only part that would matter to a screen reader, which the
 * page structure already conveys.
 *
 * Hidden entirely under reduced motion: it is a moving element whose whole
 * purpose is the movement.
 */
export function Transport() {
  const pathname = usePathname()
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll()

  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)

  /* A spring so scrubbing settles rather than snapping with the wheel. */
  const smooth = useSpring(scrollYProgress, { stiffness: 180, damping: 30, mass: 0.4 })

  useMotionValueEvent(smooth, 'change', (v) => {
    setProgress(Math.min(1, Math.max(0, v)))
    // Stay out of the way until the visitor has actually started.
    setVisible(v > 0.015)
  })

  /* A new route is a new track. */
  useEffect(() => {
    setProgress(0)
    setVisible(false)
  }, [pathname])

  if (reduced) return null

  /* The wave is seeded off the route, so every page has its own shape. */
  const seed =
    pathname.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % 997

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 hidden md:block"
      initial={false}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 14 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="relative border-t border-rule-soft bg-void/70 backdrop-blur-md">
        <div className="relative h-8">
          <Waveform
            seed={seed}
            bars={180}
            intensity={0.62}
            progress={progress}
            reactive={false}
            className="absolute inset-0 h-full w-full text-ember"
          />

          {/* The playhead itself. */}
          <motion.span
            className="absolute inset-y-0 w-px bg-ember-lit"
            style={{ left: `${progress * 100}%` }}
          >
            <span className="absolute -top-px left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-ember-lit" />
          </motion.span>
        </div>
      </div>
    </motion.div>
  )
}

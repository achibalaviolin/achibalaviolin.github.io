'use client'

import { AnimatePresence, motion } from 'motion/react'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useReducedMotion } from '@/components/animations/use-reduced-motion'

/**
 * Route change as a bow stroke.
 *
 * A vermilion band sweeps in from the left, covers, and leaves to the right,
 * on the same axis and easing as every other movement on the site. The
 * incoming page is revealed behind it rather than cross-fading, so the two
 * routes never overlap at different scroll positions.
 *
 * The name of the arriving page is carried on the band. A wipe on its own is
 * just a delay; naming the destination makes the wait informative, and it is
 * the moment the transition earns its ~700ms.
 *
 * Under reduced motion the children render directly with no wipe and no
 * mounting delay.
 */

const LABELS: Record<string, string> = {
  '/': 'Achi Bala Violin',
  '/about': 'About',
  '/works': 'Works',
  '/events': 'Events',
  '/listen': 'Listen',
  '/recognition': 'Recognition',
  '/gallery': 'Gallery',
  '/contact': 'Work together',
  '/roopa-fine-arts': 'Roopa Fine Arts',
  '/achritique': 'Achritique',
}

function labelFor(pathname: string): string {
  const clean = pathname.replace(/\/$/, '') || '/'
  if (LABELS[clean]) return LABELS[clean]
  // Deeper routes: title-case the last segment.
  const last = clean.split('/').filter(Boolean).pop() ?? ''
  return last.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const reduced = useReducedMotion()

  const [covering, setCovering] = useState(false)
  const first = useRef(true)

  useEffect(() => {
    window.scrollTo(0, 0)

    /* No wipe on first paint; there is nothing to leave. */
    if (first.current) {
      first.current = false
      return
    }
    if (reduced) return

    setCovering(true)
    const t = setTimeout(() => setCovering(false), 520)
    return () => clearTimeout(t)
  }, [pathname, reduced])

  if (reduced) return <>{children}</>

  return (
    <>
      <AnimatePresence>
        {covering ? (
          <motion.div
            key={pathname}
            className="pointer-events-none fixed inset-0 z-[90] flex items-center justify-center bg-ember-press"
            initial={{ x: '-100%' }}
            animate={{ x: '0%' }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.52, ease: [0.65, 0, 0.35, 1] }}
          >
            <motion.span
              className="font-display text-[clamp(2rem,6vw,5rem)] text-ivory"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.14 }}
            >
              {labelFor(pathname)}
            </motion.span>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35, delay: 0.12 }}
      >
        {children}
      </motion.div>
    </>
  )
}

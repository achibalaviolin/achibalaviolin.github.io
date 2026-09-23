'use client'

import { AnimatePresence, motion } from 'motion/react'
import { usePathname } from 'next/navigation'
import { useEffect, type ReactNode } from 'react'
import { useReducedMotion } from '@/components/animations/use-reduced-motion'

/**
 * Cross-route transition: the outgoing page fades under a gold-edged curtain,
 * the incoming one rises into place.
 *
 * `mode="wait"` means the new route is not painted until the old one has
 * left, which keeps the two from overlapping at different scroll positions.
 * Scroll is reset on arrival because Lenis does not do it for us.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const reduced = useReducedMotion()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  if (reduced) return <>{children}</>

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

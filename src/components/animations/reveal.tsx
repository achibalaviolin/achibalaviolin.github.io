'use client'

import { motion, useInView, type Variants } from 'motion/react'
import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react'
import { useReducedMotion } from './use-reduced-motion'

/**
 * Scroll reveals.
 *
 * Every one of these FAILS OPEN.
 *
 * The earlier implementation used Motion's `whileInView`, which mounts the
 * element at opacity 0 and waits for a viewport trigger. When that trigger did
 * not fire the content was not merely un-animated, it was gone: it took out
 * the awards rail, the pinned award tiles, the whole stills band, and then
 * every award card on the recognition page. Four separate outages, one cause.
 *
 * So the reveal is now driven by state that a timer will set regardless of
 * whether the observer ever fires. An effect that does not run costs the
 * effect; it must never cost the content.
 */

/** How long to wait for the observer before revealing anyway. */
const BACKSTOP_MS = 2500

/** Shared: true once in view, or once the backstop has fired, or if reduced. */
function useReveal(ref: React.RefObject<Element | null>, amount: number) {
  const reduced = useReducedMotion()
  const inView = useInView(ref, { once: true, amount })
  const [shown, setShown] = useState(false)

  useEffect(() => {
    if (reduced || inView) {
      setShown(true)
      return
    }
    const t = setTimeout(() => setShown(true), BACKSTOP_MS)
    return () => clearTimeout(t)
  }, [inView, reduced])

  return { shown, reduced }
}

type RevealProps = {
  children: ReactNode
  delay?: number
  distance?: number
  as?: ElementType
  className?: string
  amount?: number
}

/** Fades and lifts its children once, when scrolled into view. */
export function Reveal({
  children,
  delay = 0,
  distance = 26,
  as = 'div',
  className,
  amount = 0.2,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { shown, reduced } = useReveal(ref, amount)
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div

  if (reduced) {
    const Tag = as as ElementType
    return <Tag className={className}>{children}</Tag>
  }

  return (
    <MotionTag
      ref={ref}
      className={className}
      initial={false}
      animate={{ opacity: shown ? 1 : 0, y: shown ? 0 : distance }}
      transition={{ duration: 0.8, delay: shown ? delay : 0, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </MotionTag>
  )
}

const listVariants: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] } },
}

/** Stagger container. Pair with `RevealItem`. */
export function RevealList({
  children,
  className,
  as = 'div',
  amount = 0.12,
}: {
  children: ReactNode
  className?: string
  as?: ElementType
  amount?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { shown, reduced } = useReveal(ref, amount)
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div

  if (reduced) {
    const Tag = as as ElementType
    return <Tag className={className}>{children}</Tag>
  }

  return (
    <MotionTag
      ref={ref}
      className={className}
      variants={listVariants}
      initial="hidden"
      // Driven by state rather than `whileInView`, so the backstop can force
      // it even if the observer never reports an intersection.
      animate={shown ? 'shown' : 'hidden'}
    >
      {children}
    </MotionTag>
  )
}

export function RevealItem({
  children,
  className,
  as = 'div',
}: {
  children: ReactNode
  className?: string
  as?: ElementType
}) {
  const reduced = useReducedMotion()
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div

  if (reduced) {
    const Tag = as as ElementType
    return <Tag className={className}>{children}</Tag>
  }

  return (
    <MotionTag className={className} variants={itemVariants}>
      {children}
    </MotionTag>
  )
}

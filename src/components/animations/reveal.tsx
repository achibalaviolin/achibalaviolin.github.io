'use client'

import { motion, type Variants } from 'motion/react'
import type { ElementType, ReactNode } from 'react'
import { useReducedMotion } from './use-reduced-motion'

type RevealProps = {
  children: ReactNode
  /** Seconds to wait after the element enters view. */
  delay?: number
  /** Distance travelled, in pixels. */
  distance?: number
  as?: ElementType
  className?: string
  /** Fraction of the element that must be visible before it plays. */
  amount?: number
}

/**
 * Fades and lifts its children once, when scrolled into view.
 *
 * Under reduced motion the element is simply present — no fade, no travel.
 * Content is never hidden behind an animation that might not run.
 */
export function Reveal({
  children,
  delay = 0,
  distance = 28,
  as = 'div',
  className,
  amount = 0.25,
}: RevealProps) {
  const reduced = useReducedMotion()
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div

  if (reduced) {
    const Tag = as as ElementType
    return <Tag className={className}>{children}</Tag>
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </MotionTag>
  )
}

/** Stagger container — pair with `RevealItem` for lists and grids. */
const listVariants: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
}

export function RevealList({
  children,
  className,
  as = 'div',
  amount = 0.15,
}: {
  children: ReactNode
  className?: string
  as?: ElementType
  amount?: number
}) {
  const reduced = useReducedMotion()
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div

  if (reduced) {
    const Tag = as as ElementType
    return <Tag className={className}>{children}</Tag>
  }

  return (
    <MotionTag
      className={className}
      variants={listVariants}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount }}
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

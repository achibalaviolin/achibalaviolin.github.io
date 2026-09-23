'use client'

import { motion, useMotionValue, useSpring } from 'motion/react'
import { useRef, type ReactNode } from 'react'
import { useReducedMotion } from './use-reduced-motion'

type MagneticProps = {
  children: ReactNode
  className?: string
  /** How far the element chases the pointer, as a fraction of the offset. */
  strength?: number
}

/**
 * Pulls its child a little way toward the pointer while hovered.
 *
 * Pointer-only: a coarse pointer (touch) gets nothing, since there is no hover
 * state to speak of and the transform would fight the tap target.
 */
export function Magnetic({ children, className, strength = 0.28 }: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduced = useReducedMotion()

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 240, damping: 18, mass: 0.6 })
  const springY = useSpring(y, { stiffness: 240, damping: 18, mass: 0.6 })

  if (reduced) {
    return <span className={className}>{children}</span>
  }

  const onMove = (e: React.PointerEvent<HTMLSpanElement>) => {
    if (e.pointerType !== 'mouse' || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength)
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength)
  }

  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.span
      ref={ref}
      className={`inline-block ${className ?? ''}`}
      style={{ x: springX, y: springY }}
      onPointerMove={onMove}
      onPointerLeave={reset}
    >
      {children}
    </motion.span>
  )
}

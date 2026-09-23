'use client'

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'motion/react'
import { useRef } from 'react'
import { useReducedMotion } from './use-reduced-motion'

/**
 * An infinite marquee that speeds up, skews and reverses with scroll velocity.
 *
 * The track holds two identical copies of the children and wraps at -50%, so
 * the seam is never visible. Scroll velocity feeds a spring, which both scales
 * the base speed and applies a small skew — the visual equivalent of the line
 * being dragged along.
 */
export function Marquee({
  items,
  baseVelocity = 26,
  className,
}: {
  items: readonly string[]
  /** Pixels per second at rest. */
  baseVelocity?: number
  className?: string
}) {
  const reduced = useReducedMotion()
  const baseX = useMotionValue(0)
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)

  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  })
  /** Scroll speed → a multiplier on the marquee's own drift. */
  const velocityFactor = useTransform(smoothVelocity, [-2500, 0, 2500], [-4, 1, 4], {
    clamp: false,
  })
  const skew = useTransform(smoothVelocity, [-2500, 0, 2500], [5, 0, -5], { clamp: true })

  const directionRef = useRef(1)

  useAnimationFrame((_, delta) => {
    if (reduced) return

    let moveBy = directionRef.current * baseVelocity * (delta / 1000)
    const factor = velocityFactor.get()

    // Scrolling backwards drags the marquee backwards with it.
    if (factor < 0) directionRef.current = -1
    else if (factor > 0) directionRef.current = 1

    moveBy += moveBy * Math.abs(factor)

    const next = baseX.get() + moveBy
    // The track is two copies wide, so wrap over a single copy's width.
    baseX.set(next <= -50 ? next + 50 : next >= 0 ? next - 50 : next)
  })

  const x = useTransform(baseX, (v) => `${v}%`)

  const row = (copy: number) => (
    <span className="flex shrink-0 items-center" aria-hidden={copy > 0 || undefined}>
      {items.map((item, i) => (
        <span key={`${copy}-${i}`} className="flex shrink-0 items-center">
          <span className="px-[0.6em] whitespace-nowrap">{item}</span>
          <span className="text-gold/60 select-none" aria-hidden="true">
            &#10022;
          </span>
        </span>
      ))}
    </span>
  )

  if (reduced) {
    // A static, wrapping list of the same words — no motion, same information.
    return (
      <ul className={`flex flex-wrap justify-center gap-x-6 gap-y-2 ${className ?? ''}`}>
        {items.map((item) => (
          <li key={item} className="whitespace-nowrap">
            {item}
          </li>
        ))}
      </ul>
    )
  }

  return (
    <div className={`overflow-hidden ${className ?? ''}`}>
      <motion.div className="flex w-max flex-nowrap" style={{ x, skewX: skew }}>
        {row(0)}
        {row(1)}
      </motion.div>
    </div>
  )
}

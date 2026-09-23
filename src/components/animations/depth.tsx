'use client'

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react'
import { useRef, type ReactNode } from 'react'
import { useReducedMotion } from './use-reduced-motion'

/**
 * Three-dimensional primitives.
 *
 * All of them share one rule: perspective is declared on a parent that does
 * not itself rotate. Putting `transform-perspective` on the rotating element
 * makes the vanishing point travel with it, and the result reads as a warp
 * rather than as an object with a far side.
 *
 * Angles are kept small. Past about eight degrees the far edge of a card of
 * text is measurably harder to read, and the effect stops being depth and
 * starts being a demo.
 */

/**
 * A card that turns toward the pointer, with a light that moves across its
 * face as it turns and an edge that catches where the surface is nearest.
 */
export function Card3D({
  children,
  className,
  max = 7,
}: {
  children: ReactNode
  className?: string
  max?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)

  const spring = { stiffness: 190, damping: 22, mass: 0.5 }
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), spring)
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), spring)

  /* The lift is largest at the centre, so the card rises as it is approached. */
  const lift = useSpring(
    useTransform([px, py], ([a, b]: number[]) => {
      const d = Math.hypot(a - 0.5, b - 0.5)
      return (1 - Math.min(1, d * 2)) * 26
    }),
    spring
  )

  const sheenX = useTransform(px, (v) => `${v * 100}%`)
  const sheenY = useTransform(py, (v) => `${v * 100}%`)
  const sheen = useMotionTemplate`radial-gradient(22rem circle at ${sheenX} ${sheenY}, rgba(202,58,18,0.10), transparent 60%)`

  if (reduced) return <div className={className}>{children}</div>

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width)
    py.set((e.clientY - r.top) / r.height)
  }

  const reset = () => {
    px.set(0.5)
    py.set(0.5)
  }

  return (
    // Perspective lives here, on the element that never rotates.
    <div style={{ perspective: 1100 }} className={className}>
      <motion.div
        ref={ref}
        className="group/card relative h-full"
        style={{ rotateX, rotateY, z: lift, transformStyle: 'preserve-3d' }}
        onPointerMove={onMove}
        onPointerLeave={reset}
      >
        {children}
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
          style={{ background: sheen, transform: 'translateZ(1px)' }}
        />
      </motion.div>
    </div>
  )
}

/**
 * A panel that arrives edge-on and rotates flat as it enters the viewport,
 * like a page being turned toward the reader. Driven by scroll position
 * rather than a one-shot trigger, so it also plays in reverse.
 */
export function TurnIn({
  children,
  className,
  /** Degrees it starts rotated by, about the X axis. */
  from = 26,
}: {
  children: ReactNode
  className?: string
  from?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center center'],
  })

  const rotateX = useTransform(scrollYProgress, [0, 1], [from, 0])
  const y = useTransform(scrollYProgress, [0, 1], [48, 0])
  /*
   * No opacity ramp.
   *
   * It used to run 0 to 1 across the first half of the range, which meant
   * every row below the fold on /works/ was invisible until scrolled to, and
   * invisible for good for anyone who never scrolled. The rotation and the
   * lift are the effect; the text stays readable throughout. Caught by
   * `npm run check:visible`.
   */

  /*
   * The ref is attached in BOTH branches. Returning early without rendering
   * the ref'd element leaves Motion holding a ref that never resolves, and it
   * reports "Target ref is defined but not hydrated" on every mount. This was
   * fixed once in Parallax and reintroduced here; the shape below is the one
   * that is safe.
   */
  return (
    <div ref={ref} style={reduced ? undefined : { perspective: 1400 }} className={className}>
      {reduced ? (
        <div className="h-full">{children}</div>
      ) : (
        <motion.div
          style={{ rotateX, y, transformOrigin: 'center bottom' }}
          className="h-full"
        >
          {children}
        </motion.div>
      )}
    </div>
  )
}

/**
 * Layered depth: children move at different rates along Z as the section
 * passes, so the foreground overtakes the background.
 *
 * `depth` runs 0 (far) to 1 (near).
 */
export function Layer({
  children,
  depth = 0.5,
  className,
}: {
  children: ReactNode
  depth?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const travel = 70 * (depth - 0.5) * 2
  const y = useTransform(scrollYProgress, [0, 1], [travel, -travel])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1 + depth * 0.05, 1])

  /* Ref attached in both branches; see the note in TurnIn. */
  return (
    <div ref={ref} className={className}>
      {reduced ? (
        <div className="h-full">{children}</div>
      ) : (
        <motion.div style={{ y, scale }} className="h-full">
          {children}
        </motion.div>
      )}
    </div>
  )
}

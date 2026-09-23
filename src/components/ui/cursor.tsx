'use client'

import { motion, useMotionValue, useSpring } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '@/components/animations/use-reduced-motion'

type Mode = 'default' | 'link' | 'play'

/**
 * The cursor leaves a bow stroke.
 *
 * A literal violin was tried here and removed: an illustration pinned to the
 * pointer is a costume, it sits on top of whatever is being read, and at
 * cursor size the detail that makes it a violin is the first thing lost.
 *
 * What is left is the gesture rather than the object. A small ink dot moves
 * exactly with the pointer, a ring follows a beat behind it, and the path
 * between recent positions is drawn as a stroke that fades, the way a bow
 * leaves a sound that outlasts the movement. Faster movement draws a longer,
 * heavier stroke; stopping lets it decay to nothing.
 *
 * Fine pointers only, never under reduced motion, and the real cursor stays
 * visible underneath so nothing is lost if this fails to paint.
 */

/** How many recent positions the stroke is drawn through. */
const TRAIL = 14

export function Cursor() {
  const reduced = useReducedMotion()
  const [enabled, setEnabled] = useState(false)
  const [mode, setMode] = useState<Mode>('default')
  const [visible, setVisible] = useState(false)

  const pathRef = useRef<SVGPathElement>(null)
  const x = useMotionValue(-200)
  const y = useMotionValue(-200)

  /* The ring lags; the dot does not. The gap between them is the gesture. */
  const ringX = useSpring(x, { stiffness: 210, damping: 24, mass: 0.5 })
  const ringY = useSpring(y, { stiffness: 210, damping: 24, mass: 0.5 })

  useEffect(() => {
    setEnabled(window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reduced)
  }, [reduced])

  useEffect(() => {
    if (!enabled) return

    const points: { x: number; y: number }[] = []
    let raf = 0

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      points.push({ x: e.clientX, y: e.clientY })
      if (points.length > TRAIL) points.shift()
      setVisible(true)

      const el = e.target as HTMLElement | null
      if (el?.closest('[data-cursor="play"]')) setMode('play')
      else if (el?.closest('a, button, [role="button"], summary, input, textarea'))
        setMode('link')
      else setMode('default')
    }

    /**
     * Redraw every frame whether or not the pointer moved, so the stroke
     * decays on its own once movement stops instead of hanging in the air.
     */
    const draw = () => {
      raf = requestAnimationFrame(draw)
      const path = pathRef.current
      if (!path) return

      if (points.length < 2) {
        path.setAttribute('d', '')
        return
      }

      path.setAttribute(
        'd',
        points
          .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
          .join(' ')
      )

      // Stroke weight follows how much ground was covered recently, so a slow
      // drift is a hairline and a sweep is a full stroke.
      const first = points[0]
      const last = points[points.length - 1]
      const span = Math.hypot(last.x - first.x, last.y - first.y)
      path.setAttribute('stroke-width', String(Math.min(2.4, 0.5 + span / 90)))
      path.setAttribute('opacity', String(Math.min(0.5, span / 260)))

      // Retire the oldest point each frame: the tail catches the head when the
      // pointer stops, and the stroke disappears on its own.
      points.shift()
    }

    const onLeave = () => {
      setVisible(false)
      points.length = 0
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    raf = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(raf)
    }
  }, [enabled, x, y])

  if (!enabled) return null

  const ringSize = mode === 'play' ? 78 : mode === 'link' ? 46 : 26

  return (
    <>
      {/* The stroke. Full-viewport, so it is never clipped by a section. */}
      <svg
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[99] h-full w-full"
        style={{ opacity: visible ? 1 : 0, transition: 'opacity .3s' }}
      >
        <path
          ref={pathRef}
          fill="none"
          stroke="var(--color-ember)"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* The ring, a beat behind. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[100]"
        style={{ x: ringX, y: ringY }}
      >
        <motion.div
          className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-ember/70"
          animate={{
            width: ringSize,
            height: ringSize,
            opacity: visible ? 1 : 0,
            backgroundColor:
              mode === 'default' ? 'rgba(202,58,18,0)' : 'rgba(202,58,18,0.92)',
          }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          initial={false}
        >
          <motion.span
            className="font-mono text-[9px] tracking-[0.18em] text-paper uppercase"
            animate={{ opacity: mode === 'play' ? 1 : 0 }}
            transition={{ duration: 0.18 }}
          >
            Play
          </motion.span>
        </motion.div>
      </motion.div>

      {/* The point itself, exactly under the pointer. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[101]"
        style={{ x, y }}
      >
        <motion.span
          className="block h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember"
          animate={{ opacity: visible && mode === 'default' ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>
    </>
  )
}

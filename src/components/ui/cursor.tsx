'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { useEffect, useState } from 'react'
import { useReducedMotion } from '@/components/animations/use-reduced-motion'

type Mode = 'default' | 'link' | 'play'

/**
 * A violin as the cursor.
 *
 * Drawn as an outline rather than a solid: at cursor size a filled silhouette
 * turns into an inkblot, while the waist, the f-holes and the scroll survive
 * as strokes and are what make it legible as a violin rather than as a pear.
 *
 * It banks in the direction of travel, the way a held instrument does when you
 * turn, and settles upright when the pointer stops. Over a link it opens into
 * a ring so the thing being pointed at is not obscured by an illustration;
 * over a video it reads "Play".
 *
 * Fine pointers only, and never under reduced motion. The real cursor is kept
 * visible underneath rather than hidden, so nothing is lost if this fails to
 * paint.
 */
export function Cursor() {
  const reduced = useReducedMotion()
  const [enabled, setEnabled] = useState(false)
  const [mode, setMode] = useState<Mode>('default')
  const [visible, setVisible] = useState(false)

  const x = useMotionValue(-200)
  const y = useMotionValue(-200)
  const vx = useMotionValue(0)

  const sx = useSpring(x, { stiffness: 620, damping: 38, mass: 0.35 })
  const sy = useSpring(y, { stiffness: 620, damping: 38, mass: 0.35 })
  /* Horizontal speed drives the tilt, capped so it never spins. */
  const tilt = useSpring(useTransform(vx, [-60, 0, 60], [-22, 0, 22]), {
    stiffness: 200,
    damping: 22,
  })

  useEffect(() => {
    setEnabled(window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reduced)
  }, [reduced])

  useEffect(() => {
    if (!enabled) return

    let lastX = 0
    let lastT = 0

    const onMove = (e: PointerEvent) => {
      const now = performance.now()
      const dt = Math.max(8, now - lastT)
      vx.set(((e.clientX - lastX) / dt) * 16)
      lastX = e.clientX
      lastT = now

      x.set(e.clientX)
      y.set(e.clientY)
      setVisible(true)

      const el = e.target as HTMLElement | null
      if (el?.closest('[data-cursor="play"]')) setMode('play')
      else if (el?.closest('a, button, [role="button"], summary, input, textarea'))
        setMode('link')
      else setMode('default')
    }

    const onLeave = () => setVisible(false)

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
    }
  }, [enabled, x, y, vx])

  if (!enabled) return null

  const isViolin = mode === 'default'
  const size = mode === 'play' ? 76 : mode === 'link' ? 44 : 30

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[100]"
      style={{ x: sx, y: sy }}
    >
      <motion.div
        className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
        animate={{ width: size, height: size, opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        initial={false}
      >
        {/* The ring, for links and videos. */}
        <motion.span
          className="absolute inset-0 rounded-full border border-ember-lit bg-ember-press/15 backdrop-blur-[1px]"
          animate={{ opacity: isViolin ? 0 : 1, scale: isViolin ? 0.6 : 1 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        />

        <motion.span
          className="absolute font-mono text-[9px] tracking-[0.18em] text-ivory uppercase"
          animate={{ opacity: mode === 'play' ? 1 : 0 }}
          transition={{ duration: 0.18 }}
        >
          Play
        </motion.span>

        {/* The violin. */}
        {/*
          * Sized independently of the ring box. A violin is roughly 40:96, so
          * fitting it inside the square container scaled it to the container's
          * height and left it about 15px wide, which read as a scratch rather
          * than an instrument. Fixed height, width from the aspect ratio.
          */}
        <motion.svg
          viewBox="0 0 40 96"
          className="absolute h-14 w-auto text-ember-lit drop-shadow-[0_2px_6px_rgba(0,0,0,.65)]"
          style={{ rotate: tilt }}
          animate={{ opacity: isViolin ? 1 : 0, scale: isViolin ? 1 : 0.7 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Body: upper bout, waist, lower bout. */}
          <path d="M20 34c-8 0-13 5-13 12 0 5 3 8 6 10-3 2-6 5-6 11 0 9 6 15 13 15s13-6 13-15c0-6-3-9-6-11 3-2 6-5 6-10 0-7-5-12-13-12z" />
          {/* Neck and fingerboard. */}
          <path d="M20 34V12" />
          {/* Scroll. */}
          <path d="M20 12c0-4-5-6-7-3s1 6 4 5" />
          {/* Pegs. */}
          <path d="M16 18h8M16 23h8" strokeWidth="1.8" />
          {/* f-holes. */}
          <path d="M13 52c-2 3-2 8 0 11M27 52c2 3 2 8 0 11" strokeWidth="1.6" opacity="0.75" />
          {/* Bridge. */}
          <path d="M13 62h14" strokeWidth="1.6" opacity="0.75" />
        </motion.svg>
      </motion.div>
    </motion.div>
  )
}

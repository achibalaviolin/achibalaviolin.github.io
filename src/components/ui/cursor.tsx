'use client'

import { motion, useMotionValue, useSpring } from 'motion/react'
import { useEffect, useState } from 'react'
import { useReducedMotion } from '@/components/animations/use-reduced-motion'

type Mode = 'default' | 'link' | 'play'

/**
 * A custom cursor for fine pointers only.
 *
 * It grows over links and reads "Play" over a video facade (anything marked
 * `data-cursor="play"`). It is decoration on top of the real cursor's job —
 * the native cursor is never hidden on touch, and the ring is aria-hidden.
 */
export function Cursor() {
  const reduced = useReducedMotion()
  const [enabled, setEnabled] = useState(false)
  const [mode, setMode] = useState<Mode>('default')
  const [visible, setVisible] = useState(false)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 520, damping: 34, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 520, damping: 34, mass: 0.4 })

  useEffect(() => {
    // Only where there is a real mouse and motion is welcome.
    setEnabled(window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reduced)
  }, [reduced])

  useEffect(() => {
    if (!enabled) return

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      setVisible(true)

      const el = e.target as HTMLElement | null
      if (el?.closest('[data-cursor="play"]')) setMode('play')
      else if (el?.closest('a, button, [role="button"], summary')) setMode('link')
      else setMode('default')
    }

    const onLeave = () => setVisible(false)

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
    }
  }, [enabled, x, y])

  if (!enabled) return null

  const size = mode === 'play' ? 72 : mode === 'link' ? 48 : 18

  return (
    // Outer element carries the pointer position; the inner one centres itself
    // on it, so the growing ring expands from the pointer rather than below it.
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[100] mix-blend-difference"
      style={{ x: sx, y: sy }}
    >
      <motion.div
        className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-solid"
        animate={{
          width: size,
          height: size,
          opacity: visible ? 1 : 0,
          backgroundColor: mode === 'default' ? 'rgb(244,239,230)' : 'rgba(244,239,230,0)',
          borderColor: 'rgb(244,239,230)',
          borderWidth: mode === 'default' ? 0 : 1,
        }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        initial={false}
      >
        <motion.span
          className="text-[10px] font-medium tracking-[0.18em] text-ivory uppercase"
          animate={{ opacity: mode === 'play' ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          Play
        </motion.span>
      </motion.div>
    </motion.div>
  )
}

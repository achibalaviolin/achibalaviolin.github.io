'use client'

import { motion } from 'motion/react'
import { useReducedMotion } from '@/components/animations/use-reduced-motion'

/**
 * Sound control for the hero.
 *
 * It cannot start unmuted. Chrome, Safari and Firefox all refuse to autoplay a
 * video that has sound until the visitor has interacted with the page, and a
 * video marked `autoplay` without `muted` does not play at all: the hero would
 * be a still frame. So the video starts muted and this turns it on.
 *
 * Deliberately a real, labelled control rather than a hover-to-discover one.
 * The choice is remembered, so a returning visitor is not asked twice.
 *
 * The bars animate only while sound is on, which makes the state readable
 * without needing the label, and they are pure CSS so nothing is scheduled
 * while the sound is off.
 */
export function SoundToggle({
  on,
  onToggle,
  className,
}: {
  on: boolean
  onToggle: () => void
  className?: string
}) {
  const reduced = useReducedMotion()

  return (
    <motion.button
      type="button"
      onClick={onToggle}
      aria-pressed={on}
      className={`group inline-flex items-center gap-3 rounded-full border border-rule bg-paper/80 py-2 pr-5 pl-3 backdrop-blur-sm transition-colors duration-500 hover:border-ember/60 ${className ?? ''}`}
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.2, duration: 0.8 }}
    >
      <span aria-hidden="true" className="flex h-4 w-4 items-end justify-between gap-[2px]">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={`w-[2px] rounded-full bg-ember transition-[height] duration-300 ${
              on ? 'motion-safe:animate-[eq_900ms_ease-in-out_infinite]' : ''
            }`}
            style={{
              height: on ? '100%' : `${[40, 70, 50, 85][i]}%`,
              animationDelay: `${i * 130}ms`,
              // Bars at rest read as a static level meter.
              ...(on ? {} : { opacity: 0.45 }),
            }}
          />
        ))}
      </span>

      <span className="font-mono text-[10px] tracking-[0.2em] text-ink uppercase">
        {on ? 'Sound on' : 'Sound off'}
      </span>
    </motion.button>
  )
}

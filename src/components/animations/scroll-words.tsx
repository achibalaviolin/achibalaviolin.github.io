'use client'

import { motion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { useRef, type ElementType } from 'react'
import { useReducedMotion } from './use-reduced-motion'

/**
 * Text that inks in word by word as it is scrolled through, and fades back
 * when scrolled up. Scrubbed, not triggered: the scroll position IS the
 * animation, so it reads like a bow drawn across the line at the reader's
 * own tempo.
 *
 * FAILS OPEN, like the reveals. SSR and first paint render plain text at full
 * ink (`useReducedMotion` starts true), so if the effect never mounts the
 * words are simply there. Only the words are dimmed, never the layout, so
 * nothing reflows when it does mount.
 */
export function ScrollWords({
  text,
  as: Tag = 'p',
  className,
  /** How faint a word is before it is reached. */
  from = 0.16,
}: {
  text: string
  as?: ElementType
  className?: string
  from?: number
}) {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    // Starts as the text's top enters the lower fifth of the screen, and is
    // fully inked by the time its bottom reaches the middle, so a reader is
    // never left waiting on a line they are already reading.
    offset: ['start 0.85', 'end 0.5'],
  })

  const words = text.split(/\s+/).filter(Boolean)

  // The ref goes on both branches: `useScroll` binds its target once, so the
  // element it measures has to exist from the first render.
  if (reduced) {
    return (
      <Tag ref={ref} className={className}>
        {text}
      </Tag>
    )
  }

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {words.map((word, i) => (
        <Word
          key={i}
          progress={scrollYProgress}
          range={[i / words.length, (i + 1) / words.length]}
          from={from}
        >
          {word}
        </Word>
      ))}
    </Tag>
  )
}

function Word({
  children,
  progress,
  range,
  from,
}: {
  children: string
  progress: MotionValue<number>
  range: [number, number]
  from: number
}) {
  const opacity = useTransform(progress, range, [from, 1])
  return (
    <>
      <motion.span aria-hidden="true" style={{ opacity }}>
        {children}
      </motion.span>{' '}
    </>
  )
}

/**
 * Outlined display type that fills with colour as it scrolls into view,
 * left to right, the direction a bow travels. A filled copy sits over the
 * outline and is uncovered by a clip, so the type never changes size or
 * weight mid-stroke.
 */
export function ScrollFill({
  children,
  className,
  fillClassName = 'text-ember',
  strokeColor = 'rgba(20,17,14,0.5)',
}: {
  children: React.ReactNode
  className?: string
  fillClassName?: string
  strokeColor?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.9', 'end 0.55'] })
  const clip = useTransform(scrollYProgress, (p) => `inset(0 ${100 - p * 100}% 0 0)`)

  return (
    <span ref={ref} className={`relative block ${className ?? ''}`}>
      <span
        className="block text-transparent"
        style={{ WebkitTextStroke: `1px ${strokeColor}` }}
      >
        {children}
      </span>
      {reduced ? null : (
        <motion.span
          aria-hidden="true"
          className={`absolute inset-0 block ${fillClassName}`}
          style={{ clipPath: clip }}
        >
          {children}
        </motion.span>
      )}
    </span>
  )
}

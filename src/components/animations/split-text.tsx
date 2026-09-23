'use client'

import { motion } from 'motion/react'
import { useReducedMotion } from './use-reduced-motion'

type SplitTextProps = {
  /** Each string is one line. Splitting is explicit so lines never reflow badly. */
  lines: string[]
  className?: string
  lineClassName?: string
  delay?: number
  /** Seconds between lines. */
  stagger?: number
  as?: 'h1' | 'h2' | 'p' | 'div'
}

/**
 * Reveals text line by line from behind a mask.
 *
 * Lines are passed in already split rather than derived from a measured DOM
 * node: measuring causes a flash of unstyled text and breaks when a webfont
 * swaps in. The whole string stays in the accessibility tree via aria-label,
 * and the per-line spans are hidden from screen readers.
 */
export function SplitText({
  lines,
  className,
  lineClassName,
  delay = 0,
  stagger = 0.09,
  as: Tag = 'h1',
}: SplitTextProps) {
  const reduced = useReducedMotion()
  const label = lines.join(' ')

  if (reduced) {
    return (
      <Tag className={className}>
        {lines.map((line, i) => (
          <span key={i} className={`block ${lineClassName ?? ''}`}>
            {line}
          </span>
        ))}
      </Tag>
    )
  }

  return (
    <Tag className={className} aria-label={label}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden" aria-hidden="true">
          <motion.span
            className={`block ${lineClassName ?? ''}`}
            initial={{ y: '110%' }}
            animate={{ y: '0%' }}
            transition={{
              duration: 1.1,
              delay: delay + i * stagger,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}

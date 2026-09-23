import type { ReactNode } from 'react'
import { Reveal } from '@/components/animations/reveal'

/**
 * A page section with its own id (used by the header's scroll spy) and
 * consistent vertical rhythm.
 */
export function Section({
  id,
  children,
  className,
  wrap = true,
  divider = false,
}: {
  id?: string
  children: ReactNode
  className?: string
  /** Set false for full-bleed sections that manage their own container. */
  wrap?: boolean
  divider?: boolean
}) {
  return (
    <section
      id={id}
      className={`scroll-mt-24 py-24 md:py-32 lg:py-40 ${divider ? 'rule-top' : ''} ${className ?? ''}`}
    >
      {wrap ? <div className="wrap">{children}</div> : children}
    </section>
  )
}

/** Eyebrow + display heading + optional standfirst, revealed as a group. */
export function SectionHead({
  eyebrow,
  title,
  children,
  align = 'left',
  className,
}: {
  eyebrow: string
  title: ReactNode
  children?: ReactNode
  align?: 'left' | 'center'
  className?: string
}) {
  return (
    <header
      className={`max-w-3xl ${align === 'center' ? 'mx-auto text-center' : ''} ${className ?? ''}`}
    >
      <Reveal>
        <p className="rubric">{eyebrow}</p>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="mt-5 text-grand">{title}</h2>
      </Reveal>
      {children ? (
        <Reveal delay={0.16}>
          <div className="mt-6 text-lede text-muted">{children}</div>
        </Reveal>
      ) : null}
    </header>
  )
}

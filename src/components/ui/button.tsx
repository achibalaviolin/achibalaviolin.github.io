import Link from 'next/link'
import type { ReactNode } from 'react'
import { Magnetic } from '@/components/animations/magnetic'

type Variant = 'primary' | 'secondary' | 'ghost'

const base =
  'relative inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium tracking-wide transition-colors duration-500 ease-[cubic-bezier(.16,1,.3,1)]'

const variants: Record<Variant, string> = {
  primary:
    'bg-ember-press text-ivory hover:bg-ember shadow-[0_18px_50px_-24px_rgba(202,58,18,.9)]',
  secondary:
    'border border-rule text-ivory hover:border-ember/70 hover:text-ember-lit bg-surface/40 backdrop-blur-sm',
  ghost: 'text-ivory hover:text-ember-lit',
}

type ButtonLinkProps = {
  href: string
  children: ReactNode
  variant?: Variant
  className?: string
  /** Set for links that leave the site. */
  external?: boolean
  magnetic?: boolean
}

/**
 * The site's only button. Internal hrefs route through `next/link`; anything
 * starting `http`, `mailto:` or `tel:` renders a plain anchor.
 */
export function ButtonLink({
  href,
  children,
  variant = 'primary',
  className,
  external,
  magnetic = true,
}: ButtonLinkProps) {
  const isExternal = external ?? /^(https?:|mailto:|tel:)/.test(href)
  const classes = `${base} ${variants[variant]} ${className ?? ''}`

  const inner = isExternal ? (
    <a
      href={href}
      className={classes}
      {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
    </a>
  ) : (
    <Link href={href} className={classes}>
      {children}
    </Link>
  )

  return magnetic ? <Magnetic>{inner}</Magnetic> : inner
}

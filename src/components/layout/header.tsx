'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useEffect, useState, type ReactNode } from 'react'
import { navLinks, primaryActions, secondaryLinks, site } from '@/content/site'
import { Wordmark } from '@/components/ui/wordmark'
import { useReducedMotion } from '@/components/animations/use-reduced-motion'

/**
 * Sticky header that hides on scroll down and returns on scroll up.
 *
 * The active indicator marks the current route. It used to track the scroll
 * position within one long homepage; with each section on its own route the
 * pathname is the answer, which is both simpler and correct on arrival rather
 * than after an observer fires.
 *
 * The announcement bar is rendered inside this fixed element rather than as a
 * sibling above it. As a separate block it sat in the document flow and the
 * fixed header simply covered it. It collapses once the page is scrolled.
 */
export function Header({ announcement }: { announcement?: ReactNode }) {
  const pathname = usePathname()
  const reduced = useReducedMotion()
  const { scrollY } = useScroll()

  const [hidden, setHidden] = useState(false)
  const [atTop, setAtTop] = useState(true)
  const [open, setOpen] = useState(false)

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setAtTop(y < 24)
    if (open || y < 140) {
      setHidden(false)
      return
    }
    setHidden(y > prev)
  })

  /* Lock the page and wire Escape while the overlay is open. */
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => setOpen(false), [pathname])

  const isCurrent = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50"
        animate={{ y: hidden && !reduced ? '-100%' : '0%' }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        {announcement ? (
          <motion.div
            className="overflow-hidden border-b border-rule-soft bg-paper/85 backdrop-blur-xl"
            animate={{ height: atTop && !open ? 'auto' : 0, opacity: atTop && !open ? 1 : 0 }}
            initial={false}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {announcement}
          </motion.div>
        ) : null}

        <div
          className={`transition-colors duration-500 ${
            atTop && !open
              ? 'bg-transparent'
              : 'border-b border-rule-soft bg-paper/85 backdrop-blur-xl'
          }`}
        >
          <div className="wrap flex h-[4.5rem] items-center justify-between gap-6">
            <Link href="/" className="shrink-0" aria-label={`${site.name}, home`}>
              <Wordmark className="h-8 w-auto text-ink transition-colors duration-500 hover:text-ember sm:h-9" />
            </Link>

            <nav aria-label="Primary" className="hidden xl:block">
              <ul className="flex items-center gap-7 text-sm">
                {navLinks.map((link) => {
                  const current = isCurrent(link.href)
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        aria-current={current ? 'page' : undefined}
                        className={`relative py-1 transition-colors duration-300 ${
                          current ? 'text-ember' : 'text-ink/70 hover:text-ink'
                        }`}
                      >
                        {link.label}
                        {current ? (
                          <motion.span
                            layoutId="nav-indicator"
                            className="absolute -bottom-0.5 left-0 h-px w-full bg-ember"
                            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                          />
                        ) : null}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>

            <div className="flex items-center gap-3">
              <Link
                href={primaryActions.book.href}
                className="hidden rounded-full border border-ember/40 px-5 py-2 text-sm text-ember transition-colors duration-500 hover:bg-ember hover:text-paper sm:inline-block"
              >
                Book
              </Link>

              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls="site-menu"
                className="relative z-10 flex h-10 w-10 cursor-pointer flex-col items-center justify-center gap-[5px] xl:hidden"
              >
                <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
                <motion.span
                  className="block h-px w-6 bg-ink"
                  animate={{ rotate: open ? 45 : 0, y: open ? 3 : 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                />
                <motion.span
                  className="block h-px w-6 bg-ink"
                  animate={{ rotate: open ? -45 : 0, y: open ? -3 : 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="site-menu"
            className="fixed inset-0 z-40 flex flex-col justify-center overflow-y-auto bg-paper pt-24 pb-10 xl:hidden"
            initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
            exit={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <nav aria-label="Site" className="wrap">
              <ul className="flex flex-col">
                {navLinks.map((link, i) => (
                  <motion.li
                    key={link.href}
                    initial={reduced ? false : { opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.1 + i * 0.045,
                      duration: 0.6,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <Link
                      href={link.href}
                      aria-current={isCurrent(link.href) ? 'page' : undefined}
                      className={`block py-2 font-display text-[clamp(1.75rem,7vw,3rem)] transition-colors duration-300 ${
                        isCurrent(link.href)
                          ? 'text-ember'
                          : 'text-ink hover:text-ember'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-rule-soft pt-8 text-sm">
                {secondaryLinks.map((l) => (
                  <Link key={l.href} href={l.href} className="bow-link text-muted hover:text-ink">
                    {l.label}
                  </Link>
                ))}
                <a href={primaryActions.lessons.href} className="bow-link text-ember">
                  {primaryActions.lessons.label}
                </a>
              </div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}

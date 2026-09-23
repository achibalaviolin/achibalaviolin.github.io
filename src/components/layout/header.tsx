'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useEffect, useState, type ReactNode } from 'react'
import { navLinks, primaryActions, site } from '@/content/site'
import { useReducedMotion } from '@/components/animations/use-reduced-motion'

/**
 * Sticky header that hides on scroll down and returns on scroll up, with an
 * indicator that follows the section currently in view.
 *
 * The announcement bar is rendered inside this fixed element rather than as a
 * sibling above it — as a separate block it sat in the document flow and the
 * fixed header simply covered it. It collapses once the page is scrolled, so
 * the bar is there on arrival but the sticky chrome stays slim afterwards.
 *
 * The mobile menu is a full-screen overlay. While it is open the page behind
 * it is inert and Escape closes it.
 */
export function Header({ announcement }: { announcement?: ReactNode }) {
  const pathname = usePathname()
  const reduced = useReducedMotion()
  const { scrollY } = useScroll()

  const [hidden, setHidden] = useState(false)
  const [atTop, setAtTop] = useState(true)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<string | null>(null)

  const onHome = pathname === '/'

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setAtTop(y < 24)
    // Don't retract while the menu is open, or near the very top.
    if (open || y < 140) {
      setHidden(false)
      return
    }
    setHidden(y > prev)
  })

  /* Scroll spy — only on the homepage, where the nav points at sections. */
  useEffect(() => {
    if (!onHome) {
      setActive(null)
      return
    }

    const sections = navLinks
      .map((l) => document.getElementById(l.id))
      .filter((el): el is HTMLElement => el !== null)

    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        // The section closest to the top of the viewport wins.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    )

    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [onHome])

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

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50"
        animate={{ y: hidden && !reduced ? '-100%' : '0%' }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        {announcement ? (
          <motion.div
            className="overflow-hidden border-b border-rule-soft bg-void/85 backdrop-blur-xl"
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
              : 'border-b border-rule-soft bg-void/80 backdrop-blur-xl'
          }`}
        >
          <div className="wrap flex h-[4.5rem] items-center justify-between gap-6">
            <Link
              href="/"
              className="font-display text-lg tracking-tight whitespace-nowrap"
              aria-label={`${site.name} — home`}
            >
              Achi Bala <span className="text-gold">Violin</span>
            </Link>

            <nav aria-label="Primary" className="hidden lg:block">
              <ul className="flex items-center gap-8 text-sm">
                {navLinks.map((link) => {
                  const isActive = onHome
                    ? active === link.id
                    : pathname.startsWith(link.href) && link.href !== '/#lineage'
                  return (
                    <li key={link.id}>
                      <Link
                        href={link.href}
                        className={`relative py-1 transition-colors duration-300 ${
                          isActive ? 'text-gold-bright' : 'text-ivory/75 hover:text-ivory'
                        }`}
                      >
                        {link.label}
                        {isActive ? (
                          <motion.span
                            layoutId="nav-indicator"
                            className="absolute -bottom-0.5 left-0 h-px w-full bg-gold-bright"
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
              <a
                href={primaryActions.book.href}
                className="hidden rounded-full border border-gold/40 px-5 py-2 text-sm text-gold-bright transition-colors duration-500 hover:bg-gold hover:text-void sm:inline-block"
              >
                Book
              </a>

              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls="mobile-menu"
                className="relative z-10 flex h-10 w-10 cursor-pointer flex-col items-center justify-center gap-[5px] lg:hidden"
              >
                <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
                <motion.span
                  className="block h-px w-6 bg-ivory"
                  animate={{ rotate: open ? 45 : 0, y: open ? 3 : 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                />
                <motion.span
                  className="block h-px w-6 bg-ivory"
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
            id="mobile-menu"
            // Scrollable, with clearance for the header row above it: at seven
            // links plus two calls to action the list is taller than a short
            // phone viewport and the first item was being clipped.
            className="fixed inset-0 z-40 flex flex-col justify-center overflow-y-auto bg-void pt-24 pb-10 lg:hidden"
            initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
            exit={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <nav aria-label="Mobile" className="wrap">
              <ul className="flex flex-col gap-1">
                {navLinks.map((link, i) => (
                  <motion.li
                    key={link.id}
                    initial={reduced ? false : { opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12 + i * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="block py-2.5 font-display text-[clamp(1.75rem,7vw,3rem)] text-ivory transition-colors duration-300 hover:text-gold-bright"
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-12 flex flex-col gap-3 border-t border-rule-soft pt-8">
                <a href={primaryActions.book.href} className="bow-link w-fit text-gold-bright">
                  {primaryActions.book.label}
                </a>
                <a href={primaryActions.lessons.href} className="bow-link w-fit text-muted">
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

'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { MediaImage } from '@/components/ui/media-image'
import { Section } from '@/components/ui/section'
import { RevealItem, RevealList } from '@/components/animations/reveal'
import { useReducedMotion } from '@/components/animations/use-reduced-motion'
import { gallery } from '@/content/gallery'
import { media } from '@/content/generated/media'

/**
 * Masonry gallery with a keyboard-accessible lightbox.
 *
 * Layout uses CSS columns, which keeps the natural aspect ratio of every
 * photograph — a fixed grid would crop portraits and square social shots into
 * the same box and lose what makes them different.
 *
 * The lightbox is a modal dialog: focus moves in on open, is trapped while
 * open, returns to the triggering thumbnail on close, and arrow keys move
 * between images.
 */
export function GalleryGrid() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const triggersRef = useRef<(HTMLButtonElement | null)[]>([])
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const reduced = useReducedMotion()

  const close = useCallback(() => {
    setOpenIndex((current) => {
      if (current !== null) triggersRef.current[current]?.focus()
      return null
    })
  }, [])

  const step = useCallback((delta: number) => {
    setOpenIndex((i) => (i === null ? i : (i + delta + gallery.length) % gallery.length))
  }, [])

  useEffect(() => {
    if (openIndex === null) return

    closeRef.current?.focus()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close()
        return
      }
      if (e.key === 'ArrowRight') {
        step(1)
        return
      }
      if (e.key === 'ArrowLeft') {
        step(-1)
        return
      }
      if (e.key !== 'Tab') return

      // Trap focus inside the dialog.
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>('button')
      if (!focusable?.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [openIndex, close, step])

  const active = openIndex === null ? null : gallery[openIndex]

  return (
    <Section divider>
      <RevealList className="columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
        {gallery.map((image, i) => (
          <RevealItem key={image.key} className="break-inside-avoid">
            <button
              ref={(el) => {
                triggersRef.current[i] = el
              }}
              type="button"
              onClick={() => setOpenIndex(i)}
              className="group relative block w-full cursor-pointer overflow-hidden rounded-md"
              aria-label={`View larger: ${image.alt}`}
            >
              <MediaImage
                img={image.key}
                alt={image.alt}
                sizes="(min-width: 1024px) 31vw, (min-width: 640px) 47vw, 100vw"
                className="w-full transition-transform duration-[1.5s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.06]"
              />
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-void/35 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
              />
            </button>
          </RevealItem>
        ))}
      </RevealList>

      <AnimatePresence>
        {active ? (
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Image viewer"
            className="fixed inset-0 z-[120] flex items-center justify-center bg-void/96 p-4 backdrop-blur-sm sm:p-8"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) close()
            }}
          >
            <motion.figure
              key={active.key}
              className="flex max-h-full flex-col items-center gap-5"
              initial={reduced ? false : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduced ? undefined : { opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <img
                src={media[active.key].src}
                srcSet={media[active.key].srcSet}
                sizes="90vw"
                width={media[active.key].width}
                height={media[active.key].height}
                alt={active.alt}
                className="max-h-[78vh] w-auto rounded-md object-contain"
              />
              <figcaption className="max-w-xl text-center text-sm text-muted">
                {active.caption ?? active.alt}
                <span className="mt-1 block text-xs text-faint tabular-nums">
                  {openIndex! + 1} / {gallery.length}
                </span>
              </figcaption>
            </motion.figure>

            <button
              type="button"
              onClick={() => step(-1)}
              className="absolute top-1/2 left-3 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-rule text-ivory transition-colors hover:border-gold hover:text-gold sm:left-6"
              aria-label="Previous image"
            >
              &#8249;
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              className="absolute top-1/2 right-3 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-rule text-ivory transition-colors hover:border-gold hover:text-gold sm:right-6"
              aria-label="Next image"
            >
              &#8250;
            </button>
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              className="absolute top-4 right-4 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-rule text-ivory transition-colors hover:border-gold hover:text-gold sm:top-6 sm:right-6"
              aria-label="Close image viewer"
            >
              &times;
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </Section>
  )
}

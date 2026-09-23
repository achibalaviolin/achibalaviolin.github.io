'use client'

import { AnimatePresence, motion, useScroll, useTransform } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { SplitText } from '@/components/animations/split-text'
import { useReducedMotion } from '@/components/animations/use-reduced-motion'
import { MediaImage } from '@/components/ui/media-image'
import { ButtonLink } from '@/components/ui/button'
import { Strings } from '@/components/ui/strings'
import { heroSlides } from '@/content/gallery'
import { primaryActions } from '@/content/site'

const SLIDE_MS = 6500

/**
 * The opening frame.
 *
 * Slides crossfade rather than slide — a horizontal track fights the vertical
 * scroll that follows it. Each slide holds a slow Ken Burns push so the frame
 * is never quite still, and the whole layer drifts on scroll.
 *
 * The heading is a real, visible h1. The previous site's only h1 was
 * screen-reader-only, which left the page with no visible top-level heading.
 */
export function Hero() {
  const reduced = useReducedMotion()
  const [index, setIndex] = useState(0)
  const ref = useRef<HTMLElement>(null)

  /*
   * Driven by raw page scroll rather than the section's own progress.
   *
   * A target-relative `useScroll` has to measure the element, and the hero is
   * the very first thing painted — the measurement lands before hydration and
   * reports the section as already scrolled past, which fades the headline to
   * zero while the page is still at the top. Pixel offsets from `scrollY` need
   * no measurement at all, and the hero is always at the top of the document,
   * so the two are equivalent here.
   */
  const { scrollY } = useScroll()
  /*
   * Gentle. An earlier pass sank the copy 38% of its own height over 900px,
   * which keeps the headline on screen while the page moves underneath it and
   * makes the hero feel like it will not end. The copy now clears the fold at
   * roughly the rate the page does.
   */
  const imageY = useTransform(scrollY, [0, 700], ['0%', '10%'], { clamp: true })
  const copyY = useTransform(scrollY, [0, 700], ['0%', '12%'], { clamp: true })
  const copyOpacity = useTransform(scrollY, [0, 420], [1, 0], { clamp: true })

  useEffect(() => {
    if (reduced) return
    const t = setInterval(() => setIndex((i) => (i + 1) % heroSlides.length), SLIDE_MS)
    return () => clearInterval(t)
  }, [reduced])

  const slide = heroSlides[index]

  return (
    <section
      ref={ref}
      id="top"
      className="relative flex min-h-[100svh] items-end overflow-hidden"
      aria-label="Introduction"
    >
      {/* --- image layer --- */}
      <motion.div className="absolute inset-0" style={reduced ? undefined : { y: imageY }}>
        <AnimatePresence initial={false}>
          <motion.div
            key={slide.key}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              className="h-full w-full"
              initial={reduced ? false : { scale: 1.06 }}
              animate={reduced ? undefined : { scale: 1.16 }}
              transition={{ duration: SLIDE_MS / 1000 + 2, ease: 'linear' }}
            >
              <MediaImage
                img={slide.key}
                alt={slide.alt}
                priority={index === 0}
                sizes="100vw"
                fill
                className="h-full w-full object-cover"
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/*
          * The scrim lightens rather than darkens now: the type is ink on a
          * light ground, so it needs the photograph pulled UP behind it, and
          * hardest on the left where the headline sits.
          */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-paper via-paper/72 to-transparent"
        />
        {/* Just enough at the foot to seat the photograph on the page. */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-paper to-transparent"
        />
      </motion.div>

      {/*
        * Four strings across the frame. They sit above the image and below the
        * type, and pluck where the pointer crosses them.
        */}
      <Strings className="pointer-events-auto absolute inset-x-0 top-[30%] z-[5] h-[46%] text-ink/45" />

      {/* --- copy --- */}
      <motion.div
        className="wrap relative z-10 pb-20 md:pb-28"
        style={reduced ? undefined : { y: copyY, opacity: copyOpacity }}
      >
        <motion.p
          className="slate"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          Violinist · Composer · Storyteller
        </motion.p>

        <SplitText
          as="h1"
          lines={['Carnatic roots,', 'global voice.']}
          className="mt-5 max-w-5xl font-display text-hero"
          delay={0.35}
        />

        <motion.p
          className="mt-7 max-w-xl text-lede text-muted"
          initial={reduced ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          Film-music energy and a performance language shaped between Chennai and Texas.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-wrap items-center gap-4"
          initial={reduced ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <ButtonLink href={primaryActions.watch.href}>Watch performances</ButtonLink>
          <ButtonLink href={primaryActions.book.href} variant="secondary">
            Book a collaboration
          </ButtonLink>
        </motion.div>

        {/* Slide selector, real buttons, labelled. */}
        <div className="mt-10 flex items-center gap-3" role="group" aria-label="Choose image">
          {heroSlides.map((s, i) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Image ${i + 1} of ${heroSlides.length}`}
              aria-current={i === index}
              className="group cursor-pointer py-2"
            >
              <span
                className={`block h-px w-10 transition-colors duration-500 ${
                  i === index ? 'bg-ember' : 'bg-ink/30 group-hover:bg-ink/60'
                }`}
              />
            </button>
          ))}
        </div>
      </motion.div>

      {/*
        * A real control, not a decorative label. It read as something to
        * press, so it now is: it moves the page to the first section.
        */}
      <motion.button
        type="button"
        onClick={() => {
          const next = ref.current?.nextElementSibling
          next?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }}
        className="group absolute bottom-6 left-1/2 hidden -translate-x-1/2 cursor-pointer flex-col items-center gap-2 py-2 md:flex"
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
      >
        <span className="font-mono text-[10px] tracking-[0.3em] text-ink/45 uppercase transition-colors group-hover:text-ember">
          Scroll
        </span>
        <span
          aria-hidden="true"
          className="block h-6 w-px bg-gradient-to-b from-ink/40 to-transparent transition-colors group-hover:from-ember"
        />
      </motion.button>
    </section>
  )
}

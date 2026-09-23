'use client'

import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { SplitText } from '@/components/animations/split-text'
import { useReducedMotion } from '@/components/animations/use-reduced-motion'
import { ButtonLink } from '@/components/ui/button'
import { Strings } from '@/components/ui/strings'
import { HeroVideo } from '@/components/ui/hero-video'
import { Waveform } from '@/components/ui/waveform'
import { primaryActions } from '@/content/site'

/**
 * The opening frame.
 *
 * Headline on the page, moving panel beside it. The photographic slider that
 * used to sit here full-bleed has moved to the inner pages, where each frame
 * heads the section it belongs to rather than cycling past in six seconds.
 *
 * The panel is framed rather than full-bleed because the footage is near
 * black: behind the headline it would need light type over it and would
 * invert a white page. In a frame it reads as a screen on a white wall.
 *
 * The heading is a real, visible h1. The previous site's only h1 was
 * screen-reader-only, which left the page with no visible top-level heading.
 */
export function Hero() {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLElement>(null)

  /*
   * Driven by raw page scroll rather than the section's own progress. A
   * target-relative `useScroll` has to measure the element, and the hero is
   * the first thing painted: the measurement lands before hydration and
   * reports the section as already scrolled past, which fades the headline to
   * zero while the page is still at the top.
   */
  const { scrollY } = useScroll()
  const panelY = useTransform(scrollY, [0, 700], ['0%', '-7%'], { clamp: true })
  const copyY = useTransform(scrollY, [0, 700], ['0%', '12%'], { clamp: true })

  return (
    <section
      ref={ref}
      id="top"
      className="relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-20"
      aria-label="Introduction"
    >
      {/* A wash of his vermilion behind the panel, so the dark frame sits on
          something rather than being dropped onto bare white. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 right-0 h-full w-3/5 bg-[radial-gradient(60%_60%_at_70%_35%,var(--color-ember-soft),transparent_70%)]"
      />

      <div className="wrap relative grid items-center gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
        {/* --- copy --- */}
        <motion.div className="relative z-10" style={reduced ? undefined : { y: copyY }}>
          <motion.p
            className="slate"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.8 }}
          >
            Violinist · Composer · Storyteller
          </motion.p>

          <SplitText
            as="h1"
            lines={['Carnatic roots,', 'global voice.']}
            className="mt-6 font-display text-hero"
            delay={0.3}
          />

          <motion.p
            className="mt-7 max-w-md text-lede text-muted"
            initial={reduced ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            Film-music energy and a performance language shaped between Chennai and Texas.
          </motion.p>

          <motion.div
            className="mt-9 flex flex-wrap items-center gap-4"
            initial={reduced ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <ButtonLink href={primaryActions.watch.href}>Watch performances</ButtonLink>
            <ButtonLink href={primaryActions.book.href} variant="secondary">
              Book a collaboration
            </ButtonLink>
          </motion.div>

          {/* The four strings, under the copy rather than across the frame. */}
          <Strings className="pointer-events-auto mt-12 hidden h-16 w-full text-ink/70 md:block" />
        </motion.div>

        {/* --- the moving panel --- */}
        <motion.div
          className="relative"
          style={reduced ? undefined : { y: panelY }}
          initial={reduced ? false : { opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="relative overflow-hidden rounded-sm bg-ink shadow-[0_40px_90px_-50px_rgba(20,17,14,.6)]">
            <HeroVideo className="aspect-[4/3] w-full object-cover lg:aspect-[1200/922]" />
          </div>

          {/* The wave, tucked under the panel's foot. */}
          <Waveform
            seed={41}
            bars={110}
            intensity={0.5}
            className="mt-5 h-10 w-full text-ember/70"
          />
        </motion.div>
      </div>

      {/*
        * A real control, not a decorative label. It read as something to
        * press, so it now is: it moves the page to the first section.
        */}
      <motion.button
        type="button"
        onClick={() => {
          ref.current?.nextElementSibling?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          })
        }}
        className="group mx-auto mt-16 hidden flex-col items-center gap-2 py-2 md:flex"
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
      >
        <span className="font-mono text-[10px] tracking-[0.3em] text-faint uppercase transition-colors group-hover:text-ember">
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

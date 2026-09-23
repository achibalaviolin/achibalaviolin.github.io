'use client'

import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { useReducedMotion } from '@/components/animations/use-reduced-motion'
import { ButtonLink } from '@/components/ui/button'
import { Strings } from '@/components/ui/strings'
import { HeroVideo, useHeroVideo } from '@/components/ui/hero-video'
import { Waveform } from '@/components/ui/waveform'
import { HeroHeadline, SWEEP_IN, SWEEP_OUT } from './hero-headline'
import { primaryActions } from '@/content/site'

/**
 * The opening frame.
 *
 * Full-bleed footage shot on white, with the headline over the empty left half
 * of it. The subject stands in the right of frame and a pale ribbon leaves the
 * violin and crosses the type, so the copy is aligned to the composition
 * rather than dropped on top of it: nothing sits where the performer is.
 *
 * The headline and the wave animate against the video's own clock, so the
 * light crossing the words is the light in the footage rather than a timer
 * that happens to look close.
 *
 * The photographic slider that used to sit here has moved to the inner pages,
 * where each frame heads the section it belongs to.
 */
export function Hero() {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const time = useHeroVideo()

  /*
   * Driven by raw page scroll rather than the section's own progress. A
   * target-relative `useScroll` has to measure the element, and the hero is
   * the first thing painted: the measurement lands before hydration and
   * reports the section as already scrolled past.
   */
  const { scrollY } = useScroll()
  const copyY = useTransform(scrollY, [0, 700], ['0%', '10%'], { clamp: true })
  const videoY = useTransform(scrollY, [0, 700], ['0%', '6%'], { clamp: true })

  /* The wave under the copy swells as the ribbon passes, then settles. */
  const waveOpacity = useTransform(
    time,
    [SWEEP_IN - 1, SWEEP_IN + 1.2, SWEEP_OUT, SWEEP_OUT + 1],
    [0.35, 1, 1, 0.35],
    { clamp: true }
  )

  return (
    <section
      ref={ref}
      id="top"
      className="relative flex min-h-[94svh] items-center overflow-hidden pt-28 pb-20 md:pt-32"
      aria-label="Introduction"
    >
      {/* --- the footage, full bleed --- */}
      <motion.div className="absolute inset-0" style={reduced ? undefined : { y: videoY }}>
        <HeroVideo time={time} className="h-full w-full object-cover object-right" />

        {/*
          * The wall in shot is bright but not page-white, and it darkens
          * toward the left edge. This carries the page colour under the
          * headline column and clears by 55%, so the type has a clean ground
          * and the performer is untouched.
          */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-paper from-0% via-paper/72 via-30% to-transparent to-55%"
        />
        {/* The header has no background of its own at the top of the page. */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-paper to-transparent"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-paper to-transparent"
        />
      </motion.div>

      {/* --- copy, in the empty half of the frame --- */}
      <motion.div className="wrap relative z-10" style={reduced ? undefined : { y: copyY }}>
        <div className="max-w-xl">
          <motion.p
            className="slate"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.8 }}
          >
            Violinist · Composer · Storyteller
          </motion.p>

          <HeroHeadline
            lines={['Carnatic roots,', 'global voice.']}
            time={time}
            className="mt-6 font-display text-hero"
          />

          <motion.p
            className="mt-7 max-w-md text-lede text-muted"
            initial={reduced ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            Film-music energy and a performance language shaped between Chennai and Texas.
          </motion.p>

          {/* The wave answers the ribbon. */}
          <motion.div style={reduced ? undefined : { opacity: waveOpacity }}>
            <Waveform
              seed={41}
              bars={90}
              intensity={0.5}
              className="mt-8 h-9 w-full text-ember"
            />
          </motion.div>

          <motion.div
            className="mt-8 flex flex-wrap items-center gap-4"
            initial={reduced ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <ButtonLink href={primaryActions.watch.href}>Watch performances</ButtonLink>
            <ButtonLink href={primaryActions.book.href} variant="secondary">
              Book a collaboration
            </ButtonLink>
          </motion.div>

          <Strings className="pointer-events-auto mt-9 hidden h-10 w-full text-ink/60 md:block" />
        </div>
      </motion.div>

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
        className="group absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 py-2 md:flex"
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
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

'use client'

import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { VideoFacade } from '@/components/ui/video-facade'
import { ButtonLink } from '@/components/ui/button'
import { useReducedMotion } from '@/components/animations/use-reduced-motion'
import { featuredWork } from '@/content/works'
import { featuredVideo } from '@/content/videos'

/**
 * The Waltz of Chennai — a pinned, scroll-driven sequence.
 *
 * The section pins for roughly two screens while the stats count through and
 * the credits rise one at a time, then releases. ScrollTrigger is registered
 * here rather than globally so the plugin only loads on pages that use it.
 *
 * Under reduced motion nothing pins: the same content renders as an ordinary
 * stacked section, which is why the markup is shared rather than branched.
 */
export function Waltz() {
  const root = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const work = featuredWork

  useGSAP(
    () => {
      if (reduced || !root.current) return
      gsap.registerPlugin(ScrollTrigger)

      const mm = gsap.matchMedia()

      // Pinning is desktop-only: on a phone it eats the whole viewport and
      // makes the page feel stuck.
      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: '+=160%',
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
          },
        })

        tl.from('[data-waltz="title"]', { yPercent: 40, opacity: 0, duration: 1 })
          .from(
            '[data-waltz="body"]',
            { y: 40, opacity: 0, duration: 1, stagger: 0.25 },
            '-=0.5'
          )
          .from(
            '[data-waltz="stat"]',
            { y: 50, opacity: 0, duration: 0.8, stagger: 0.2 },
            '-=0.4'
          )
          .from(
            '[data-waltz="credit"]',
            { x: -30, opacity: 0, duration: 0.6, stagger: 0.15 },
            '-=0.6'
          )
          .from('[data-waltz="actions"]', { y: 30, opacity: 0, duration: 0.8 }, '-=0.3')
      })

      return () => mm.revert()
    },
    { scope: root, dependencies: [reduced] }
  )

  return (
    <section
      ref={root}
      id="waltz"
      className="rule-top relative flex min-h-screen items-center overflow-hidden py-24 lg:py-0"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(60%_60%_at_80%_20%,rgba(212,162,76,.1),transparent_70%)]"
      />

      <div className="wrap relative grid gap-14 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-20">
        <div>
          <p className="eyebrow">The film</p>

          <h2 data-waltz="title" className="mt-5 text-h1">
            {work.title}
          </h2>

          <div className="mt-8 space-y-5 text-lede text-muted">
            {work.body.map((p, i) => (
              <p key={i} data-waltz="body">
                {p}
              </p>
            ))}
          </div>

          {work.stats ? (
            <dl className="mt-12 grid grid-cols-3 gap-6 border-y border-rule-soft py-8">
              {work.stats.map((s) => (
                <div key={s.label} data-waltz="stat">
                  <dt className="sr-only">{s.label}</dt>
                  <dd>
                    <span className="block font-display text-5xl text-gold tabular-nums">
                      {s.value}
                    </span>
                    <span className="mt-1.5 block text-xs tracking-wider text-faint uppercase">
                      {s.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}

          <dl className="mt-10 space-y-2.5 text-sm">
            {work.credits.map((c) => (
              <div key={c.role} data-waltz="credit" className="flex gap-5">
                <dt className="w-28 shrink-0 text-faint">{c.role}</dt>
                <dd className="text-ivory/85">{c.names.join(', ')}</dd>
              </div>
            ))}
          </dl>

          <div data-waltz="actions" className="mt-10 flex flex-wrap gap-4">
            {work.links?.map((l, i) => (
              <ButtonLink key={l.href} href={l.href} variant={i === 0 ? 'primary' : 'secondary'}>
                {l.label}
              </ButtonLink>
            ))}
          </div>
        </div>

        <VideoFacade
          id={featuredVideo.id}
          title={featuredVideo.title}
          poster={featuredVideo.poster}
          posterAlt={featuredVideo.alt}
          sizes="(min-width: 1024px) 45vw, 100vw"
          className="aspect-video w-full"
        />
      </div>
    </section>
  )
}

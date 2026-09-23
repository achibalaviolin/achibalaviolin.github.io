'use client'

import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useReducedMotion } from '@/components/animations/use-reduced-motion'
import type { Work } from '@/content/works'

/**
 * A pinned, scrubbed credit roll for a work.
 *
 * The section holds for about two screens while the numbers count up and the
 * credits arrive one line at a time, at the reading pace of end titles. It is
 * the one place on the site that takes the scroll away from the visitor, so it
 * is used once, on the work pages, and nowhere else.
 *
 * ScrollTrigger is registered here rather than globally so the plugin is only
 * in the bundle of the routes that pin.
 *
 * Desktop and full-motion only. On a phone a pin eats the whole viewport and
 * makes the page feel stuck, and under reduced motion the content simply
 * renders in place: the markup is shared rather than branched, so nothing can
 * be left invisible if a trigger fails to fire.
 */
export function PinnedCredits({ work }: { work: Work }) {
  const root = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useGSAP(
    () => {
      if (reduced || !root.current) return
      gsap.registerPlugin(ScrollTrigger)

      const mm = gsap.matchMedia()

      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: '+=170%',
            pin: true,
            scrub: 0.9,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })

        /* Numbers count as the section is scrubbed through. */
        gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
          const target = Number(el.dataset.count)
          if (!Number.isFinite(target)) return
          const obj = { v: 0 }
          tl.to(
            obj,
            {
              v: target,
              duration: 1.2,
              ease: 'power2.out',
              onUpdate: () => {
                el.textContent = String(Math.round(obj.v))
              },
            },
            0
          )
        })

        tl.from('[data-stat]', { yPercent: 55, opacity: 0, duration: 1, stagger: 0.18 }, 0)
          .from(
            '[data-credit]',
            { x: -28, opacity: 0, duration: 0.7, stagger: 0.16 },
            0.5
          )
          .from('[data-roll-rule]', { scaleX: 0, duration: 1.1, ease: 'none' }, 0.2)
      })

      return () => mm.revert()
    },
    { scope: root, dependencies: [reduced] }
  )

  return (
    <div
      ref={root}
      className="rule-top relative flex min-h-screen items-center overflow-hidden py-24 lg:py-0"
    >
      {/*
        * No `w-full` here. It sets width:100%, which beats `wrap`'s
        * `width: min(100% - 2.5rem, 84rem)` in the cascade, and the container
        * then spans the viewport instead of centring, clipping the first
        * number and the first credit column against the left edge.
        */}
      <div className="wrap">
        <p className="slate">The credits</p>

        {work.stats?.length ? (
          <dl className="mt-12 grid gap-10 sm:grid-cols-3">
            {work.stats.map((s) => {
              const numeric = /^\d+$/.test(s.value)
              return (
                <div key={s.label} data-stat>
                  <dt className="sr-only">{s.label}</dt>
                  <dd>
                    <span className="block font-display text-colossal text-ember tabular-nums">
                      {numeric ? (
                        <span data-count={s.value}>0</span>
                      ) : (
                        s.value
                      )}
                    </span>
                    <span className="mt-3 block font-mono text-xs tracking-slate text-faint uppercase">
                      {s.label}
                    </span>
                  </dd>
                </div>
              )
            })}
          </dl>
        ) : null}

        <span
          data-roll-rule
          aria-hidden="true"
          className="mt-16 block h-px origin-left bg-ember/60"
        />

        <dl className="mt-12 grid gap-x-16 gap-y-4 md:grid-cols-2">
          {work.credits.map((c) => (
            <div key={c.role} data-credit className="flex gap-6 text-sm">
              <dt className="w-44 shrink-0 font-mono text-xs tracking-wide text-faint uppercase">
                {c.role}
              </dt>
              <dd className="text-ink/90">{c.names.join(', ')}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}

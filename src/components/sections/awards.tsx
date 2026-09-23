'use client'

import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { MediaImage } from '@/components/ui/media-image'
import { SectionHead } from '@/components/ui/section'
import { useReducedMotion } from '@/components/animations/use-reduced-motion'
import { additionalRecognition, awards, festivalCount } from '@/content/awards'

/**
 * Awards — a horizontal rail, pinned and scrubbed on desktop.
 *
 * On smaller screens (and under reduced motion) it degrades to an ordinary
 * scroll-snapping row that can simply be swiped, which is the behaviour most
 * people expect on a phone anyway.
 *
 * Each tile is captioned with the festival, the honour and who it names —
 * read off the certificates themselves. See content/awards.ts.
 */
export function Awards() {
  const root = useRef<HTMLElement>(null)
  const track = useRef<HTMLUListElement>(null)
  const reduced = useReducedMotion()

  useGSAP(
    () => {
      if (reduced || !root.current || !track.current) return
      gsap.registerPlugin(ScrollTrigger)

      const mm = gsap.matchMedia()

      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        const el = track.current!
        const distance = () => el.scrollWidth - el.parentElement!.clientWidth

        if (distance() <= 0) return

        // Horizontal scrub only.
        //
        // A per-tile `gsap.from({opacity: 0})` driven by `containerAnimation`
        // was tried here and removed: when its start marker is never crossed
        // the tile stays at opacity 0 and the citation is simply unreadable.
        // These tiles carry the festival names, so they must not depend on a
        // second animation firing correctly to be visible.
        gsap.to(el, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        })
      })

      return () => mm.revert()
    },
    { scope: root, dependencies: [reduced] }
  )

  return (
    <section
      ref={root}
      id="awards"
      className="rule-top relative flex min-h-screen flex-col justify-center overflow-hidden py-24 lg:py-0"
    >
      <div className="wrap">
        <SectionHead eyebrow="Recognition" title="Laurels and citations.">
          Recognition from {festivalCount} festivals and competitions — a Best Song win at
          the World Film Festival in Cannes, and the run of awards earned by{' '}
          <em className="text-ivory not-italic">The Waltz of Chennai</em>.
        </SectionHead>
      </div>

      <div className="mt-16 overflow-hidden">
        <ul
          ref={track}
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto px-[max(1.25rem,calc((100vw-78rem)/2))] pb-6 lg:overflow-visible lg:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {awards.map((award) => (
            <li
              key={award.id}
              data-award
              // A fixed rail height keeps the row readable; the varying widths
              // give it rhythm without letting a tall certificate run off the
              // bottom of the screen.
              className={`group relative h-[clamp(19rem,50vh,28rem)] shrink-0 snap-start overflow-hidden rounded-lg border border-rule bg-surface-2 ${
                award.size === 'wide'
                  ? 'w-[min(85vw,30rem)]'
                  : award.size === 'tall'
                    ? 'w-[min(60vw,17rem)]'
                    : 'w-[min(72vw,23rem)]'
              }`}
            >
              <MediaImage
                img={award.image}
                alt={award.alt}
                sizes="(min-width: 1024px) 30vw, 80vw"
                className="h-full w-full object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.04]"
              />

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-void via-void/90 to-transparent p-6 pt-20">
                <p className="text-xs tracking-wider text-gold uppercase">
                  {award.category}
                </p>
                <p className="mt-2 font-display text-lg leading-snug">{award.festival}</p>
                <p className="mt-2 text-xs text-muted">
                  {award.laureate}
                  <span className="text-faint">
                    {' · '}
                    {award.awarded}
                    {award.place ? ` · ${award.place}` : ''}
                  </span>
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="wrap mt-8 lg:mt-10">
        <p className="text-xs text-faint lg:hidden">Swipe to browse.</p>
        <ul className="mt-2 flex flex-wrap gap-x-8 gap-y-2 text-xs text-faint">
          {additionalRecognition.map((r) => (
            <li key={r.festival}>
              <span className="text-gold/70">{r.category}</span> · {r.festival}
              {r.place ? ` · ${r.place}` : ''}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

import type { Metadata } from 'next'
import { PageOverture } from '@/components/layout/page-overture'
import { NextStep } from '@/components/layout/next-step'
import { Reveal, RevealItem, RevealList } from '@/components/animations/reveal'
import { ClipReveal, Parallax } from '@/components/animations/parallax'
import { MediaImage } from '@/components/ui/media-image'
import { Section } from '@/components/ui/section'
import { bio, gurus, influences, milestones, places } from '@/content/bio'
import { site } from '@/content/site'
import { breadcrumbSchema, jsonLd } from '@/lib/structured-data'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Achi Bala is an independent violinist working across Carnatic, film and world music. Trained in Chennai, raised in Texas, and a disciple of Sri Delhi P. Sunder Rajan.',
  alternates: { canonical: '/about/' },
  openGraph: {
    title: `About · ${site.name}`,
    description:
      'Trained in Chennai, raised in Texas. The teachers, the influences and the work.',
    url: '/about/',
  },
}

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbSchema([
            { name: site.name, path: '/' },
            { name: 'About', path: '/about/' },
          ])
        )}
      />

      <PageOverture
        rubric="The artist"
        title={['Trained in Chennai.', 'Raised in Texas.']}
        image="gallery/achi-10"
        lede={bio.oneLine}
      />

      {/* --- the story --- */}
      <Section divider>
        <div className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:gap-24">
          <div className="space-y-6 text-lede text-muted">
            {bio.lineage.map((para, i) => (
              <Reveal key={i} delay={i * 0.06} as="p">
                {para}
              </Reveal>
            ))}
          </div>
          <div className="space-y-6 text-lede text-muted">
            {bio.legacyAbout.map((para, i) => (
              <Reveal key={i} delay={0.12 + i * 0.06} as="p">
                {para}
              </Reveal>
            ))}
          </div>
        </div>

        <RevealList as="dl" className="mt-20 grid grid-cols-1 gap-px bg-rule-soft sm:grid-cols-3">
          {places.map((p) => (
            <RevealItem as="div" key={p.city} className="bg-void p-8">
              <dt className="font-display text-grand text-gold">{p.city}</dt>
              <dd className="mt-2 text-sm text-faint">{p.note}</dd>
            </RevealItem>
          ))}
        </RevealList>
      </Section>

      {/* --- gurus --- */}
      <Section divider>
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div>
            <Reveal>
              <p className="rubric">The teachers</p>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="mt-6 text-grand">A line you can trace.</h2>
            </Reveal>
            <Reveal delay={0.14}>
              <p className="mt-6 text-muted">
                Formed by listening to {influences[0]} and {influences[1]} in Chennai. It is
                also why the writing on this site keeps returning to questions of lineage and
                memory.
              </p>
            </Reveal>
          </div>

          <RevealList as="ul" className="divide-y divide-rule-soft border-y border-rule-soft">
            {gurus.map((g) => (
              <RevealItem
                as="li"
                key={g.name}
                className="flex flex-col gap-2 py-6 sm:flex-row sm:items-baseline sm:justify-between sm:gap-10"
              >
                <span className="font-display text-recital">
                  {g.honorific ? (
                    <span className="mr-2 text-sm text-faint">{g.honorific}</span>
                  ) : null}
                  {g.name}
                </span>
                <span className="text-sm text-muted sm:max-w-sm sm:text-right">
                  {g.relationship}
                </span>
              </RevealItem>
            ))}
          </RevealList>
        </div>
      </Section>

      {/* --- milestones --- */}
      <Section divider>
        <Reveal>
          <p className="rubric">Selected milestones</p>
        </Reveal>

        <RevealList as="ol" className="mt-12 border-t border-rule-soft">
          {milestones.map((m) => (
            <RevealItem
              as="li"
              key={m.year + m.title}
              className="grid gap-4 border-b border-rule-soft py-10 md:grid-cols-[8rem_1fr_auto] md:gap-12"
            >
              <span className="font-display text-grand text-gold tabular-nums">{m.year}</span>
              <div>
                <h3 className="font-display text-recital">{m.title}</h3>
                <p className="mt-3 max-w-2xl text-muted">{m.detail}</p>
              </div>
              <span className="self-end text-xs text-faint md:max-w-[12rem] md:text-right">
                {m.source}
              </span>
            </RevealItem>
          ))}
        </RevealList>
      </Section>

      {/* --- a portrait --- */}
      <Section divider wrap={false}>
        <ClipReveal className="wrap">
          <Parallax distance={5} className="overflow-hidden rounded-sm">
            <MediaImage
              img="gallery/achi-1"
              alt="Achi Bala performing a Carnatic violin concert in a red kurta"
              sizes="90vw"
              className="w-full"
            />
          </Parallax>
        </ClipReveal>
      </Section>

      <NextStep
        heading="Where to go next."
        steps={[
          { href: '/works/', label: 'Works', note: 'Scores, films and records.' },
          { href: '/recognition/', label: 'Recognition', note: 'Awards and press.' },
          { href: '/gallery/', label: 'Gallery', note: 'Performance photographs.' },
        ]}
      />
    </>
  )
}

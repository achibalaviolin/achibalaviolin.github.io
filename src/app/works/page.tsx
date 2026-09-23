import type { Metadata } from 'next'
import Link from 'next/link'
import { PageOverture } from '@/components/layout/page-overture'
import { NextStep } from '@/components/layout/next-step'
import { RevealItem, RevealList } from '@/components/animations/reveal'
import { Section } from '@/components/ui/section'
import { works } from '@/content/works'
import { site } from '@/content/site'
import { breadcrumbSchema, jsonLd } from '@/lib/structured-data'

export const metadata: Metadata = {
  title: 'Works',
  description:
    'Original scores and music direction for film, stage and dance, alongside the records. The Waltz of Chennai, Arudra 2026, The Baroque-Carnatic Connection and more.',
  alternates: { canonical: '/works/' },
  openGraph: {
    title: `Works · ${site.name}`,
    description: 'Original scores and music direction for film, stage and dance.',
    url: '/works/',
  },
}

export default function WorksPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbSchema([
            { name: site.name, path: '/' },
            { name: 'Works', path: '/works/' },
          ])
        )}
      />

      <PageOverture
        slate="Works"
        title={['Composed,', 'directed,', 'performed.']}
        image="hero/banner-2"
        lede="Original scores and music direction for film, stage and dance, alongside the records."
      />

      {/*
       * An index, not a grid of cards. Each work is a full page, so the job
       * here is to let someone scan five titles and pick one, which a list of
       * large type does better than five boxes competing for the same glance.
       */}
      <Section divider wrap={false}>
        <RevealList as="ol" className="border-t border-rule-soft">
          {works.map((work, i) => (
            <RevealItem as="li" key={work.slug} className="border-b border-rule-soft">
              <Link
                href={`/works/${work.slug}/`}
                className="group block transition-colors duration-500 hover:bg-surface/60"
              >
                <div className="wrap grid gap-5 py-12 md:grid-cols-[4rem_1fr_9rem_auto] md:items-baseline md:gap-10 md:py-16">
                  <span className="font-display text-sm text-faint tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  <div>
                    <h2 className="font-display text-monumental transition-colors duration-500 group-hover:text-ember-lit">
                      {work.title}
                    </h2>
                    {work.subtitle ? (
                      <p className="mt-2 text-lede text-muted italic">{work.subtitle}</p>
                    ) : null}
                    <p className="mt-5 max-w-2xl text-muted">{work.summary}</p>
                  </div>

                  <span className="text-xs tracking-slate text-ember-lit uppercase">
                    {work.kind}
                  </span>

                  <span className="font-display text-recital text-faint tabular-nums">
                    {work.year}
                  </span>
                </div>
              </Link>
            </RevealItem>
          ))}
        </RevealList>
      </Section>

      <NextStep
        heading="Commissioning a score or a production?"
        lede="Original music for films, dance productions and theatre, plus arrangement and music direction."
        primary={{ href: '/contact/', label: 'Start a conversation' }}
        steps={[
          { href: '/listen/', label: 'Listen', note: 'The records and the video archive.' },
          { href: '/recognition/', label: 'Recognition', note: 'Festival awards and press.' },
          { href: '/events/', label: 'Events', note: 'Where to hear him live.' },
        ]}
      />
    </>
  )
}

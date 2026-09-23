import type { Metadata } from 'next'
import { PageOverture } from '@/components/layout/page-overture'
import { NextStep } from '@/components/layout/next-step'
import { Reveal, RevealItem, RevealList } from '@/components/animations/reveal'
import { MediaImage } from '@/components/ui/media-image'
import { Section } from '@/components/ui/section'
import { Card3D } from '@/components/animations/depth'
import { additionalRecognition, awards, festivalCount } from '@/content/awards'
import { formatPressDate, leadQuote, press } from '@/content/press'
import { site } from '@/content/site'
import { breadcrumbSchema, jsonLd } from '@/lib/structured-data'

export const metadata: Metadata = {
  title: 'Recognition',
  description:
    'Festival awards and press for violinist Achi Bala, including a Best Song win at the World Film Festival in Cannes and awards for The Waltz of Chennai.',
  alternates: { canonical: '/recognition/' },
  openGraph: {
    title: `Recognition · ${site.name}`,
    description: 'Festival awards, citations and press coverage.',
    url: '/recognition/',
  },
}

export default function RecognitionPage() {
  const rest = press.filter((p) => p.slug !== leadQuote.slug)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbSchema([
            { name: site.name, path: '/' },
            { name: 'Recognition', path: '/recognition/' },
          ])
        )}
      />

      <PageOverture
        slate="Recognition"
        title={['Laurels', 'and citations.']}
        image="awards/awards-2"
        lede={`Recognition from ${festivalCount} festivals and competitions, and what the reviews have said.`}
      />

      {/* --- the awards, one per row, each with its citation --- */}
      <Section divider>
        <Reveal>
          <h2 className="slate">Festival awards</h2>
        </Reveal>

        <RevealList as="ul" className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {awards.map((award) => (
            <RevealItem as="li" key={award.id}>
              <Card3D className="h-full">
              <figure className="group flex h-full flex-col overflow-hidden rounded-lg border border-rule bg-mist/50 transition-colors duration-700 hover:border-ember/40">
                <div className="aspect-[4/3] overflow-hidden bg-shade">
                  <MediaImage
                    img={award.image}
                    alt={award.alt}
                    sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
                    className="h-full w-full object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.04]"
                  />
                </div>

                <figcaption className="flex flex-1 flex-col p-7">
                  <span className="text-xs tracking-slate text-ember uppercase">
                    {award.category}
                  </span>
                  <span className="mt-3 font-display text-recital">{award.festival}</span>
                  <span className="mt-3 text-sm text-muted">{award.laureate}</span>
                  <span className="mt-auto pt-6 text-xs text-faint">
                    {award.work}
                    <span className="block">
                      {award.awarded}
                      {award.place ? ` · ${award.place}` : ''}
                    </span>
                  </span>
                </figcaption>
              </figure>
              </Card3D>
            </RevealItem>
          ))}
        </RevealList>

        {additionalRecognition.length > 0 ? (
          <Reveal>
            <div className="mt-14 border-t border-rule-soft pt-8">
              <h3 className="slate">Also selected</h3>
              <ul className="mt-5 flex flex-wrap gap-x-10 gap-y-3 text-sm text-muted">
                {additionalRecognition.map((r) => (
                  <li key={r.festival}>
                    <span className="text-ember/80">{r.category}</span> · {r.festival}
                    {r.place ? (
                      <span className="text-faint"> · {r.place}</span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ) : null}
      </Section>

      {/* --- press --- */}
      <Section divider>
        <Reveal>
          <h2 className="slate">What the reviews said</h2>
        </Reveal>

        <Reveal delay={0.08}>
          <figure className="relative mt-12 border-l-2 border-ember/50 pl-8 md:pl-12">
            <span
              aria-hidden="true"
              className="absolute -top-8 left-3 font-display text-[7rem] leading-none text-ember/20 select-none md:left-6"
            >
              &ldquo;
            </span>
            <blockquote className="relative font-display text-grand text-balance">
              {leadQuote.quote}
            </blockquote>
            <figcaption className="mt-8 text-sm text-muted">
              <a
                href={leadQuote.href}
                target="_blank"
                rel="noopener noreferrer"
                className="bow-link text-ember"
              >
                {leadQuote.publication}
              </a>
              {leadQuote.byline ? <span> · {leadQuote.byline}</span> : null}
              <span> · {formatPressDate(leadQuote.date)}</span>
            </figcaption>
          </figure>
        </Reveal>

        <RevealList as="ul" className="mt-20 border-t border-rule-soft">
          {rest.map((item) => (
            <RevealItem as="li" key={item.slug} className="border-b border-rule-soft">
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group grid gap-4 py-10 transition-colors duration-500 md:grid-cols-[12rem_1fr] md:gap-12"
              >
                <span className="text-sm">
                  <span className="block text-ember/80">{item.publication}</span>
                  <span className="block text-xs text-faint tabular-nums">
                    <time dateTime={item.date}>{formatPressDate(item.date)}</time>
                  </span>
                  {item.byline ? (
                    <span className="mt-1 block text-xs text-faint">{item.byline}</span>
                  ) : null}
                </span>

                <span>
                  <span className="block font-display text-recital transition-colors duration-500 group-hover:text-ember">
                    {item.headline}
                  </span>
                  <blockquote className="mt-4 max-w-2xl text-muted italic">
                    &ldquo;{item.quote}&rdquo;
                  </blockquote>
                  {item.quoteAttribution ? (
                    <span className="mt-3 block text-xs text-faint">
                      {item.quoteAttribution}, quoted in {item.publication}
                    </span>
                  ) : null}
                </span>
              </a>
            </RevealItem>
          ))}
        </RevealList>
      </Section>

      <NextStep
        heading="Writing about him?"
        lede="Photographs, biography and recordings are all on this site. Write in for anything else."
        primary={{ href: '/contact/', label: 'Press enquiries' }}
        steps={[
          { href: '/gallery/', label: 'Gallery', note: 'Performance photographs.' },
          { href: '/about/', label: 'About', note: 'Biography and training.' },
          { href: '/works/', label: 'Works', note: 'The full list of credits.' },
        ]}
      />
    </>
  )
}

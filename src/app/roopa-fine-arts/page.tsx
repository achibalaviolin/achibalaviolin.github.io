import type { Metadata } from 'next'
import Link from 'next/link'

import { Reveal, RevealItem, RevealList } from '@/components/animations/reveal'
import { Counter } from '@/components/animations/counter'
import { ButtonLink } from '@/components/ui/button'
import { MediaImage } from '@/components/ui/media-image'
import { Section, SectionHead } from '@/components/ui/section'
import {
  arangetrams,
  faqs,
  locationStats,
  programs,
  roopa,
  schoolStats,
} from '@/content/roopa'
import { site } from '@/content/site'
import { formatEventDate } from '@/content/events'
import { breadcrumbSchema, faqSchema, jsonLd, schoolSchema } from '@/lib/structured-data'

export const metadata: Metadata = {
  title: roopa.title,
  description: roopa.description,
  alternates: { canonical: roopa.path },
  openGraph: {
    type: 'website',
    title: roopa.title,
    description: roopa.socialDescription,
    url: roopa.path,
    siteName: site.name,
    images: [{ url: site.ogImage }],
  },
  twitter: {
    card: 'summary_large_image',
    title: roopa.title,
    description: roopa.socialDescription,
    images: [site.ogImage],
  },
}

const enquireHref = `mailto:${roopa.email}?subject=${encodeURIComponent('Lessons enquiry')}`

export default function RoopaFineArtsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(schoolSchema())} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faqSchema())} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbSchema([
            { name: site.name, path: '/' },
            { name: roopa.name, path: roopa.path },
          ])
        )}
      />

      {/* --- hero --- */}
      <header className="rule-top relative overflow-hidden pt-36 pb-24 md:pt-44 md:pb-32">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(70%_60%_at_20%_0%,rgba(212,162,76,.13),transparent_70%)]"
        />
        <div className="wrap relative">
          <nav aria-label="Breadcrumb" className="text-sm text-faint">
            <Link href="/" className="bow-link hover:text-ivory">
              {site.name}
            </Link>
            <span aria-hidden="true" className="px-2">
              /
            </span>
            <span className="text-muted">{roopa.name}</span>
          </nav>

          <Reveal>
            <p className="slate mt-10">
              {roopa.name} · est. {roopa.established}
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="mt-6 max-w-4xl text-monumental">{roopa.heading}</h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-8 max-w-2xl text-lede text-muted">
              Roopa Fine Arts is the teaching school of violinist{' '}
              <Link href="/" className="bow-link text-ember-lit">
                Achi Bala
              </Link>
              : Carnatic violin, Carnatic vocal, and music theory with exam preparation, in
              person across Austin and Houston, Texas, and online worldwide.
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <div className="mt-10 flex flex-wrap gap-4">
              <ButtonLink href={enquireHref}>Enquire about lessons</ButtonLink>
              <ButtonLink href="#programs" variant="secondary">
                See the programs
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </header>

      {/* --- the school --- */}
      <Section id="school" divider>
        <div className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <div>
            <Reveal>
              <p className="slate">The school</p>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="mt-5 text-grand">Classical training, modern classroom.</h2>
            </Reveal>
            <div className="mt-8 space-y-6 text-lede text-muted">
              {roopa.about.map((p, i) => (
                <Reveal key={i} delay={0.14 + i * 0.06} as="p">
                  {p}
                </Reveal>
              ))}
            </div>
          </div>

          <RevealList as="dl" className="grid h-fit grid-cols-2 gap-px bg-rule-soft">
            {schoolStats.map((stat) => (
              <RevealItem as="div" key={`${stat.value}-${stat.label}`} className="bg-void p-8">
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block font-display text-4xl text-ember-lit">
                    {stat.countTo ? <Counter to={stat.countTo} /> : stat.value}
                  </span>
                  <span className="mt-2 block text-xs tracking-wider text-faint uppercase">
                    {stat.label}
                  </span>
                </dd>
              </RevealItem>
            ))}
          </RevealList>
        </div>
      </Section>

      {/* --- programs --- */}
      <Section id="programs" divider>
        <SectionHead eyebrow="Programs" title="What you can learn.">
          Three tracks, one tradition. Every program is available in person in Texas or
          online.
        </SectionHead>

        <RevealList className="mt-16 grid gap-px bg-rule-soft md:grid-cols-3">
          {programs.map((p) => (
            <RevealItem key={p.number}>
              <article className="flex h-full flex-col bg-void p-9 transition-colors duration-700 hover:bg-surface/70 md:p-11">
                <span className="font-display text-sm text-ember-lit tabular-nums">{p.number}</span>
                <h3 className="mt-6 font-display text-recital">{p.title}</h3>
                <p className="mt-4 text-muted">{p.description}</p>
                <a href={enquireHref} className="bow-link mt-auto w-fit pt-10 text-sm text-ember-lit">
                  {p.cta}
                </a>
              </article>
            </RevealItem>
          ))}
        </RevealList>
      </Section>

      {/* --- arangetrams --- */}
      <Section id="arangetrams" divider>
        <SectionHead eyebrow="Student milestones" title="Arangetrams.">
          Celebrating the debut full-length concerts of Roopa Fine Arts students.
        </SectionHead>

        <RevealList className="mt-16 grid gap-6 md:grid-cols-2">
          {arangetrams.map((a) => (
            <RevealItem key={a.student}>
              <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-rule bg-surface/60">
                {a.image ? (
                  <div className="overflow-hidden">
                    <MediaImage
                      img={a.image}
                      alt={a.imageAlt ?? `${a.student}'s Arangetram flyer`}
                      sizes="(min-width: 768px) 46vw, 100vw"
                      className="w-full transition-transform duration-[1.6s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.04]"
                    />
                  </div>
                ) : (
                  <div
                    aria-hidden="true"
                    className="staff flex aspect-[4/5] items-center justify-center bg-surface-2"
                  >
                    <span className="rounded-full border border-rule bg-void px-5 py-2 text-xs tracking-wider text-faint uppercase">
                      Flyer coming soon
                    </span>
                  </div>
                )}

                <div className="p-8">
                  <p className="slate">
                    {a.date ? (
                      <time dateTime={a.date}>{formatEventDate(a.date)}</time>
                    ) : (
                      'Student milestone'
                    )}
                    {a.city ? ` · ${a.city}` : ''}
                  </p>
                  <h3 className="mt-4 font-display text-recital">{a.student}&rsquo;s Arangetram</h3>
                  {a.description ? <p className="mt-4 text-muted">{a.description}</p> : null}
                </div>
              </article>
            </RevealItem>
          ))}
        </RevealList>
      </Section>

      {/* --- locations --- */}
      <Section id="locations" divider>
        <div className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <div>
            <Reveal>
              <p className="slate">Where lessons happen</p>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="mt-5 text-grand">Austin, Houston, and online.</h2>
            </Reveal>
            <div className="mt-8 space-y-6 text-lede text-muted">
              {roopa.locations.map((p, i) => (
                <Reveal key={i} delay={0.14 + i * 0.06} as="p">
                  {p}
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.26}>
              <div className="mt-10">
                <ButtonLink href={enquireHref}>Find your lesson format</ButtonLink>
              </div>
            </Reveal>
          </div>

          <RevealList as="dl" className="grid h-fit grid-cols-2 gap-px bg-rule-soft">
            {locationStats.map((stat) => (
              <RevealItem as="div" key={`${stat.value}-${stat.label}`} className="bg-void p-8">
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block font-display text-3xl text-ember-lit">{stat.value}</span>
                  <span className="mt-2 block text-xs tracking-wider text-faint uppercase">
                    {stat.label}
                  </span>
                </dd>
              </RevealItem>
            ))}
          </RevealList>
        </div>
      </Section>

      {/* --- faq --- */}
      <Section id="faq" divider>
        <SectionHead eyebrow="Questions" title="Frequently asked." />

        <RevealList className="mt-14 max-w-3xl divide-y divide-rule-soft border-y border-rule-soft">
          {faqs.map((f) => (
            <RevealItem key={f.question}>
              <details className="group py-6">
                <summary className="flex cursor-pointer items-center justify-between gap-6 font-display text-lg marker:content-none [&::-webkit-details-marker]:hidden">
                  {f.question}
                  <span
                    aria-hidden="true"
                    className="shrink-0 text-ember-lit transition-transform duration-500 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-4 max-w-2xl text-muted">{f.answer}</p>
              </details>
            </RevealItem>
          ))}
        </RevealList>
      </Section>

      {/* --- enquire --- */}
      <Section id="enquire" divider className="text-center">
        <Reveal>
          <p className="slate">Enquire</p>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="mx-auto mt-6 max-w-3xl text-monumental">Begin your Carnatic journey.</h2>
        </Reveal>
        <Reveal delay={0.16}>
          <a
            href={enquireHref}
            className="mt-12 inline-block font-display text-[clamp(1.35rem,3.5vw,2.5rem)] text-ember-lit transition-colors duration-500 hover:text-ember-lit"
          >
            <span className="bow-link">{roopa.email}</span>
          </a>
        </Reveal>
        <Reveal delay={0.22}>
          <p className="mx-auto mt-8 max-w-xl text-muted">
            Include the student&rsquo;s age, experience level, and whether you prefer
            in-person lessons in Austin or Houston, or online.
          </p>
        </Reveal>
      </Section>
    </>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { PageOverture } from '@/components/layout/page-overture'
import { NextStep } from '@/components/layout/next-step'
import { Reveal, RevealItem, RevealList } from '@/components/animations/reveal'
import { Section } from '@/components/ui/section'
import { VideoFacade } from '@/components/ui/video-facade'
import { ButtonLink } from '@/components/ui/button'
import { works } from '@/content/works'
import { videos } from '@/content/videos'
import { awards } from '@/content/awards'
import { site } from '@/content/site'
import { breadcrumbSchema, jsonLd } from '@/lib/structured-data'

type Params = { slug: string }

export function generateStaticParams(): Params[] {
  return works.map((w) => ({ slug: w.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { slug } = await params
  const work = works.find((w) => w.slug === slug)
  if (!work) return {}

  return {
    title: work.title,
    description: work.summary,
    alternates: { canonical: `/works/${slug}/` },
    openGraph: {
      title: `${work.title} · ${site.name}`,
      description: work.summary,
      url: `/works/${slug}/`,
    },
  }
}

export default async function WorkPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const work = works.find((w) => w.slug === slug)
  if (!work) notFound()

  const index = works.findIndex((w) => w.slug === slug)
  const next = works[(index + 1) % works.length]

  /* The film has a video and a run of festival awards; nothing else does. */
  const video = slug === 'the-waltz-of-chennai' ? videos.find((v) => v.featured) : undefined
  const related = awards.filter((a) => a.work === work.title)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbSchema([
            { name: site.name, path: '/' },
            { name: 'Works', path: '/works/' },
            { name: work.title, path: `/works/${slug}/` },
          ])
        )}
      />

      <PageOverture
        slate={`${work.kind} · ${work.year}`}
        title={work.title.split(' ').length > 3 ? [work.title] : [work.title]}
        image={work.image}
        breadcrumb={{ label: 'All works', href: '/works/' }}
        lede={work.summary}
      >
        {work.venue ? <p className="mt-6 text-sm text-ember-lit">{work.venue}</p> : null}
      </PageOverture>

      <Section divider>
        <div className="grid gap-16 lg:grid-cols-[1.2fr_0.8fr] lg:gap-24">
          <div className="space-y-6 text-lede text-muted">
            {work.subtitle ? (
              <Reveal>
                <p className="font-display text-recital text-ivory italic">{work.subtitle}</p>
              </Reveal>
            ) : null}
            {work.body.map((p, i) => (
              <Reveal key={i} delay={i * 0.06} as="p">
                {p}
              </Reveal>
            ))}

            {work.links?.length ? (
              <Reveal delay={0.2}>
                <div className="flex flex-wrap gap-4 pt-6">
                  {work.links.map((l, i) => (
                    <ButtonLink
                      key={l.href}
                      href={l.href}
                      variant={i === 0 ? 'primary' : 'secondary'}
                    >
                      {l.label}
                    </ButtonLink>
                  ))}
                </div>
              </Reveal>
            ) : null}
          </div>

          <div>
            <Reveal>
              <h2 className="slate">Credits</h2>
            </Reveal>
            <RevealList as="dl" className="mt-8 border-t border-rule-soft">
              {work.credits.map((c) => (
                <RevealItem
                  as="div"
                  key={c.role}
                  className="grid gap-1 border-b border-rule-soft py-4 sm:grid-cols-[10rem_1fr] sm:gap-6"
                >
                  <dt className="text-sm text-faint">{c.role}</dt>
                  <dd className="text-ivory/90">{c.names.join(', ')}</dd>
                </RevealItem>
              ))}
            </RevealList>

            <Reveal delay={0.1}>
              <p className="mt-8 text-xs text-faint">Source: {work.source}</p>
            </Reveal>
          </div>
        </div>
      </Section>

      {work.stats?.length ? (
        <Section divider>
          <RevealList as="dl" className="grid gap-px bg-rule-soft sm:grid-cols-3">
            {work.stats.map((s) => (
              <RevealItem as="div" key={s.label} className="bg-void p-10 text-center">
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <span className="block font-display text-colossal text-ember-lit tabular-nums">
                    {s.value}
                  </span>
                  <span className="mt-3 block text-xs tracking-slate text-faint uppercase">
                    {s.label}
                  </span>
                </dd>
              </RevealItem>
            ))}
          </RevealList>
        </Section>
      ) : null}

      {video ? (
        <Section divider>
          <Reveal>
            <VideoFacade
              id={video.id}
              title={video.title}
              poster={video.poster}
              posterAlt={video.alt}
              sizes="90vw"
              className="aspect-video w-full"
            />
          </Reveal>
        </Section>
      ) : null}

      {related.length > 0 ? (
        <Section divider>
          <Reveal>
            <h2 className="slate">Recognition for this work</h2>
          </Reveal>
          <RevealList as="ul" className="mt-10 border-t border-rule-soft">
            {related.map((a) => (
              <RevealItem
                as="li"
                key={a.id}
                className="grid gap-2 border-b border-rule-soft py-6 md:grid-cols-[1fr_auto] md:gap-10"
              >
                <span>
                  <span className="block text-xs tracking-slate text-ember-lit uppercase">
                    {a.category}
                  </span>
                  <span className="mt-2 block font-display text-recital">{a.festival}</span>
                  <span className="mt-1 block text-sm text-muted">{a.laureate}</span>
                </span>
                <span className="self-end text-xs text-faint tabular-nums md:text-right">
                  {a.awarded}
                  {a.place ? ` · ${a.place}` : ''}
                </span>
              </RevealItem>
            ))}
          </RevealList>
          <Reveal>
            <Link href="/recognition/" className="bow-link mt-8 inline-block text-ember-lit">
              All recognition &rarr;
            </Link>
          </Reveal>
        </Section>
      ) : null}

      <NextStep
        heading="Next work."
        steps={[
          { href: `/works/${next.slug}/`, label: next.title, note: next.summary },
          { href: '/works/', label: 'All works', note: 'Back to the index.' },
          { href: '/contact/', label: 'Work together', note: 'Commissions and bookings.' },
        ]}
      />
    </>
  )
}

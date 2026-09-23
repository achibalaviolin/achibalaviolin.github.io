import type { Metadata } from 'next'
import { PageOverture } from '@/components/layout/page-overture'
import { NextStep } from '@/components/layout/next-step'
import { Reveal, RevealItem, RevealList } from '@/components/animations/reveal'
import { Section } from '@/components/ui/section'
import { SpotifyFacade } from '@/components/ui/spotify-facade'
import { VideoFacade } from '@/components/ui/video-facade'
import { site, socials } from '@/content/site'
import { videos } from '@/content/videos'
import { breadcrumbSchema, jsonLd } from '@/lib/structured-data'

export const metadata: Metadata = {
  title: 'Listen',
  description:
    'Stream the records on Spotify and watch the violin performances: The Waltz of Chennai, Kalaavathi, Ennavale, East Meets West and more.',
  alternates: { canonical: '/listen/' },
  openGraph: {
    title: `Listen · ${site.name}`,
    description: 'The records, and the video archive.',
    url: '/listen/',
  },
}

export default function ListenPage() {
  const [lead, ...rest] = videos

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbSchema([
            { name: site.name, path: '/' },
            { name: 'Listen', path: '/listen/' },
          ])
        )}
      />

      <PageOverture
        slate="Listen and watch"
        title={['Music for screen,', 'stage, and stream.']}
        image="gallery/achi-3"
        lede="Stream the records on Spotify, or step into the video archive."
      />

      {/* --- the featured film --- */}
      <Section divider>
        <div className="grid gap-12 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
          <div>
            <Reveal>
              <VideoFacade
                id={lead.id}
                title={lead.title}
                poster={lead.poster}
                posterAlt={lead.alt}
                sizes="(min-width: 1024px) 56vw, 100vw"
                className="aspect-video w-full"
              />
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="mt-6 font-display text-recital">{lead.short}</h2>
              {lead.credit ? <p className="mt-2 text-muted">{lead.credit}</p> : null}
            </Reveal>
          </div>

          <Reveal delay={0.12}>
            <p className="slate">On Spotify</p>
            <SpotifyFacade className="mt-6" />
          </Reveal>
        </div>
      </Section>

      {/* --- the archive --- */}
      <Section divider>
        <Reveal>
          <h2 className="slate">The video archive</h2>
        </Reveal>

        <RevealList className="mt-12 grid gap-10 sm:grid-cols-2">
          {rest.map((v) => (
            <RevealItem key={v.id}>
              <VideoFacade
                id={v.id}
                title={v.title}
                poster={v.poster}
                posterAlt={v.alt}
                sizes="(min-width: 640px) 45vw, 100vw"
                className="aspect-video w-full"
              />
              <h3 className="mt-5 font-display text-recital">{v.short}</h3>
              {v.credit ? <p className="mt-2 text-sm text-muted">{v.credit}</p> : null}
            </RevealItem>
          ))}
        </RevealList>
      </Section>

      {/* --- platforms --- */}
      <Section divider>
        <Reveal>
          <h2 className="slate">Follow along</h2>
        </Reveal>
        <RevealList as="ul" className="mt-10 grid gap-px bg-rule-soft sm:grid-cols-2 lg:grid-cols-5">
          {socials.map((s) => (
            <RevealItem as="li" key={s.label} className="bg-paper">
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col gap-2 p-7 transition-colors duration-500 hover:bg-mist/70"
              >
                <span className="font-display text-recital transition-colors duration-300 group-hover:text-ember">
                  {s.label}
                </span>
                <span className="text-sm text-faint">{s.handle}</span>
              </a>
            </RevealItem>
          ))}
        </RevealList>
      </Section>

      <NextStep
        heading="Want this on your stage?"
        lede="Solo recitals, film-music sets with a band, and music direction for productions."
        primary={{ href: '/contact/', label: 'Book a collaboration' }}
        steps={[
          { href: '/events/', label: 'Events', note: 'Upcoming dates and tickets.' },
          { href: '/works/', label: 'Works', note: 'Scores, films and records.' },
          { href: '/about/', label: 'About', note: 'The training behind the sound.' },
        ]}
      />
    </>
  )
}

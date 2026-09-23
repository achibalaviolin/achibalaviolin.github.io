import type { Metadata } from 'next'
import { PageOverture } from '@/components/layout/page-overture'
import { NextStep } from '@/components/layout/next-step'
import { Reveal, RevealItem, RevealList } from '@/components/animations/reveal'
import { MediaImage } from '@/components/ui/media-image'
import { ButtonLink } from '@/components/ui/button'
import { Section } from '@/components/ui/section'
import { formatEventDate, pastEvents, upcomingEvents } from '@/content/events'
import { site } from '@/content/site'
import { breadcrumbSchema, eventSchemas, jsonLd } from '@/lib/structured-data'

export const metadata: Metadata = {
  title: 'Events',
  description:
    'Upcoming concerts and recent appearances by violinist Achi Bala, across Texas and India.',
  alternates: { canonical: '/events/' },
  openGraph: {
    title: `Events · ${site.name}`,
    description: 'Upcoming concerts and recent appearances.',
    url: '/events/',
  },
}

export default function EventsPage() {
  const upcoming = upcomingEvents()
  const past = pastEvents()
  const [lead, ...rest] = upcoming

  return (
    <>
      {eventSchemas().map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={jsonLd(schema)} />
      ))}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbSchema([
            { name: site.name, path: '/' },
            { name: 'Events', path: '/events/' },
          ])
        )}
      />

      <PageOverture
        rubric="Events"
        title={['Where to hear', 'him next.']}
        image="events/ilaiyaraaja-night-2026"
        lede={
          upcoming.length > 0
            ? 'Upcoming concerts first, then the archive of recent appearances.'
            : 'No dates are currently announced. Recent appearances are below.'
        }
      />

      {lead ? (
        <Section divider>
          <Reveal>
            <p className="rubric">{lead.eyebrow}</p>
          </Reveal>

          <div className="mt-10 grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-20">
            {lead.image ? (
              <Reveal>
                <div className="overflow-hidden rounded-sm border border-rule">
                  <MediaImage
                    img={lead.image}
                    alt={lead.imageAlt ?? ''}
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="w-full"
                  />
                </div>
              </Reveal>
            ) : null}

            <div>
              <Reveal delay={0.08}>
                <h2 className="text-monumental">{lead.title}</h2>
              </Reveal>

              {lead.date ? (
                <Reveal delay={0.14}>
                  <p className="mt-8 font-display text-recital text-gold-bright">
                    <time dateTime={lead.date}>{formatEventDate(lead.date)}</time>
                  </p>
                </Reveal>
              ) : null}

              <Reveal delay={0.18}>
                <p className="mt-2 text-muted">
                  {[lead.time, lead.venue, lead.city].filter(Boolean).join(' · ')}
                </p>
              </Reveal>

              <Reveal delay={0.22}>
                <p className="mt-6 max-w-xl text-lede text-muted">{lead.description}</p>
              </Reveal>

              {lead.ticketUrl ? (
                <Reveal delay={0.28}>
                  <div className="mt-10">
                    <ButtonLink href={lead.ticketUrl}>
                      {lead.ticketLabel ?? 'Buy tickets'}
                    </ButtonLink>
                  </div>
                </Reveal>
              ) : null}
            </div>
          </div>
        </Section>
      ) : null}

      {rest.length > 0 ? (
        <Section divider>
          <Reveal>
            <h2 className="rubric">Also coming up</h2>
          </Reveal>
          <RevealList as="ul" className="mt-10 border-t border-rule-soft">
            {rest.map((e) => (
              <RevealItem as="li" key={e.slug} className="border-b border-rule-soft">
                <EventRow event={e} />
              </RevealItem>
            ))}
          </RevealList>
        </Section>
      ) : null}

      {past.length > 0 ? (
        <Section divider>
          <Reveal>
            <h2 className="rubric">Recent appearances</h2>
          </Reveal>
          <RevealList as="ul" className="mt-10 border-t border-rule-soft">
            {past.map((e) => (
              <RevealItem as="li" key={e.slug} className="border-b border-rule-soft">
                <EventRow event={e} muted />
              </RevealItem>
            ))}
          </RevealList>
        </Section>
      ) : null}

      <NextStep
        heading="Programming a concert or a festival?"
        lede="Solo, with a band, or as music director for a full production."
        primary={{ href: '/contact/', label: 'Enquire about a booking' }}
        steps={[
          { href: '/listen/', label: 'Listen', note: 'Hear the work first.' },
          { href: '/works/', label: 'Works', note: 'Scores and productions.' },
          { href: '/recognition/', label: 'Recognition', note: 'Awards and press.' },
        ]}
      />
    </>
  )
}

/** One row of the events list. Dates are the anchor, so they come first. */
function EventRow({
  event,
  muted = false,
}: {
  event: ReturnType<typeof upcomingEvents>[number]
  muted?: boolean
}) {
  return (
    <div className="grid gap-3 py-8 md:grid-cols-[14rem_1fr_auto] md:items-baseline md:gap-10">
      <span
        className={`text-sm tabular-nums ${muted ? 'text-faint' : 'text-gold-bright'}`}
      >
        {event.date ? (
          <time dateTime={event.date}>{formatEventDate(event.date)}</time>
        ) : (
          <span className="text-faint">Date on request</span>
        )}
      </span>

      <div>
        <h3 className="font-display text-recital">{event.title}</h3>
        <p className="mt-2 max-w-2xl text-sm text-muted">{event.description}</p>
      </div>

      <span className="text-xs tracking-wider text-faint uppercase md:text-right">
        {[event.venue, event.city].filter(Boolean).join(' · ') || event.eyebrow}
      </span>
    </div>
  )
}

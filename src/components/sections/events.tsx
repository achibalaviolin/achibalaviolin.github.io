import { Reveal, RevealItem, RevealList } from '@/components/animations/reveal'
import { TiltCard } from '@/components/animations/tilt-card'
import { MediaImage } from '@/components/ui/media-image'
import { ButtonLink } from '@/components/ui/button'
import { Section, SectionHead } from '@/components/ui/section'
import { formatEventDate, pastEvents, upcomingEvents, type EventItem } from '@/content/events'

function EventCard({ event, featured = false }: { event: EventItem; featured?: boolean }) {
  const hasTicket = Boolean(event.ticketUrl)

  return (
    <TiltCard className="h-full" max={featured ? 3 : 5}>
      <article
        className={`group relative flex h-full flex-col overflow-hidden rounded-lg border border-rule bg-surface/60 transition-colors duration-700 hover:border-gold/40 ${
          featured ? 'md:flex-row' : ''
        }`}
      >
        {event.image ? (
          <div
            className={`overflow-hidden ${featured ? 'md:w-2/5 md:shrink-0' : 'aspect-[4/5]'}`}
          >
            <MediaImage
              img={event.image}
              alt={event.imageAlt ?? ''}
              sizes={featured ? '(min-width: 768px) 40vw, 100vw' : '(min-width: 768px) 30vw, 100vw'}
              className="h-full w-full object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-105"
            />
          </div>
        ) : null}

        <div className="flex flex-1 flex-col p-7 md:p-9">
          <p className="eyebrow">{event.eyebrow}</p>

          <h3 className={`mt-4 font-display ${featured ? 'text-h2' : 'text-h3'}`}>
            {event.title}
          </h3>

          {event.date ? (
            <p className="mt-4 text-sm text-gold-bright">
              <time dateTime={event.date}>{formatEventDate(event.date)}</time>
              {event.time ? <span className="text-muted"> · {event.time}</span> : null}
            </p>
          ) : null}

          {event.venue || event.city ? (
            <p className="mt-1 text-sm text-muted">
              {[event.venue, event.city].filter(Boolean).join(' · ')}
            </p>
          ) : null}

          <p className="mt-4 text-muted">{event.description}</p>

          {hasTicket ? (
            <div className="mt-auto pt-8">
              <ButtonLink href={event.ticketUrl!} variant="primary">
                {event.ticketLabel ?? 'Buy tickets'}
              </ButtonLink>
            </div>
          ) : null}
        </div>
      </article>
    </TiltCard>
  )
}

export function Events() {
  const upcoming = upcomingEvents()
  const past = pastEvents()
  const [lead, ...restUpcoming] = upcoming

  return (
    <Section id="events" divider>
      <SectionHead eyebrow="Events" title="Where to hear him next.">
        {upcoming.length > 0
          ? 'Upcoming concerts first, then the archive of recent appearances.'
          : 'No dates are currently announced. Recent appearances are below.'}
      </SectionHead>

      {lead ? (
        <Reveal className="mt-16">
          <EventCard event={lead} featured />
        </Reveal>
      ) : null}

      {restUpcoming.length > 0 ? (
        <RevealList className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {restUpcoming.map((e) => (
            <RevealItem key={e.slug}>
              <EventCard event={e} />
            </RevealItem>
          ))}
        </RevealList>
      ) : null}

      {past.length > 0 ? (
        <>
          <Reveal>
            <h3 className="eyebrow mt-24">Recent appearances</h3>
          </Reveal>

          <RevealList as="ul" className="mt-8 divide-y divide-rule-soft border-y border-rule-soft">
            {past.map((e) => (
              <RevealItem
                as="li"
                key={e.slug}
                className="group grid gap-2 py-6 sm:grid-cols-[10rem_1fr_auto] sm:items-baseline sm:gap-8"
              >
                <span className="text-sm text-gold/80 tabular-nums">
                  {e.date ? (
                    <time dateTime={e.date}>{formatEventDate(e.date)}</time>
                  ) : (
                    <span className="text-faint">Date on request</span>
                  )}
                </span>
                <span>
                  <span className="block font-display text-lg">{e.title}</span>
                  <span className="mt-1 block text-sm text-muted">{e.description}</span>
                </span>
                <span className="text-xs tracking-wider text-faint uppercase">
                  {[e.venue, e.city].filter(Boolean).join(' · ') || e.eyebrow}
                </span>
              </RevealItem>
            ))}
          </RevealList>
        </>
      ) : null}
    </Section>
  )
}

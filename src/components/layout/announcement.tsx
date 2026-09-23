import Link from 'next/link'
import { upcomingEvents, formatEventDate } from '@/content/events'

/**
 * Announcement bar.
 *
 * Driven by the events data rather than hand-written, so it can never go stale
 * and advertise a concert that has already happened — it simply disappears
 * once there is nothing upcoming.
 */
export function Announcement() {
  const next = upcomingEvents()[0]
  if (!next) return null

  const href = next.ticketUrl ?? '/events/'
  const external = Boolean(next.ticketUrl)

  const inner = (
    <>
      <span className="slate shrink-0">Next</span>
      <span className="truncate">
        {next.title}
        {next.date ? (
          <span className="text-muted"> · {formatEventDate(next.date)}</span>
        ) : null}
        {next.city ? <span className="hidden text-muted sm:inline"> · {next.city}</span> : null}
      </span>
      <span className="shrink-0 text-ember-lit underline-offset-4 group-hover:underline">
        {next.ticketUrl ? 'Tickets' : 'Details'} &rarr;
      </span>
    </>
  )

  return (
    <div>
      <div className="wrap flex h-11 items-center">
        {external ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex w-full items-center gap-4 text-sm"
          >
            {inner}
          </a>
        ) : (
          <Link href={href} className="group flex w-full items-center gap-4 text-sm">
            {inner}
          </Link>
        )}
      </div>
    </div>
  )
}

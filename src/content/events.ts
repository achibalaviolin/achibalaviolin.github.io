/**
 * Concerts and appearances.
 *
 * `date` is ISO and drives both the upcoming/past split and the Event JSON-LD,
 * so fill it in wherever possible. Entries with `date: null` fall into the
 * archive group and are deliberately excluded from structured data — search
 * engines reject an Event without a start date.
 */

import { media } from './generated/media'

export type EventItem = {
  slug: string
  title: string
  /** ISO date, or null when the date is not on record. */
  date: string | null
  /** Human-readable time range, when known. */
  time?: string
  venue?: string
  city?: string
  eyebrow: string
  description: string
  image?: keyof typeof media
  imageAlt?: string
  ticketUrl?: string
  ticketLabel?: string
}

export const events: EventItem[] = [
  {
    slug: 'ilaiyaraaja-night-2026',
    title: 'Ilaiyaraaja Night',
    date: '2026-10-23',
    time: '8:00 PM – 10:00 PM',
    city: 'Austin, Texas',
    eyebrow: 'Upcoming concert',
    description:
      'An intimate live concert of timeless Tamil melodies, presented with a live band.',
    image: 'events/ilaiyaraaja-night-2026',
    imageAlt:
      'Ilaiyaraaja Night live music concert flyer featuring Achi, Arjun, and Akhila',
    ticketUrl:
      'https://www.zeffy.com/en-US/ticketing/ilaiyaraaja-night-timeless-tamil-melodies',
    ticketLabel: 'Buy tickets',
  },
  {
    slug: 'arudra-2026',
    title: 'Arudra 2026 — Navagrahamum Navakailasamum',
    date: '2026-02-08',
    eyebrow: 'Dance production',
    description:
      'A full-length production with concept, music composition, lyrics and violin by Achi Bala.',
    // TODO: venue on record? Add when confirmed.
  },
  {
    slug: 'navtar-violin-jugalbandi',
    title: 'Navtar Violin Jugalbandi',
    date: '2025-07-12',
    eyebrow: 'Jugalbandi',
    description:
      'Compositions traded across the navtar, Carnatic violin and mridangam, with Vishnu Ramprasad and Karun Salvady.',
  },
  {
    slug: 'baroque-carnatic-connection',
    title: 'The Baroque-Carnatic Connection',
    date: '2024-06-07',
    time: '8:30 PM',
    venue: 'Miller Outdoor Theatre',
    city: 'Houston, Texas',
    eyebrow: 'Music direction',
    description:
      'Baroque and Carnatic traditions in live conversation, produced by Silambam Houston. Free admission.',
  },
  {
    slug: 'samarpana-series',
    title: 'Samarpana Series',
    date: null, // TODO: date and venue not on record — add to enable structured data.
    eyebrow: 'Concert series',
    description: 'A highlight from the Samarpana concert series.',
    image: 'events/samarpana-series',
    imageAlt: 'Samarpana Series event poster',
  },
  {
    slug: 'chithirai-thiruvizha-mahotsavam',
    title: 'Chithirai Thiruvizha Mahotsavam',
    date: null, // TODO: date and venue not on record.
    eyebrow: 'Festival appearance',
    description: 'A cultural festival appearance.',
    image: 'events/chithirai-thiruvizha-mahotsavam',
    imageAlt: 'Chithirai Thiruvizha Mahotsavam event poster',
  },
]

/** Events with a known future date, soonest first. */
export function upcomingEvents(now = new Date()): EventItem[] {
  const today = now.toISOString().slice(0, 10)
  return events
    .filter((e) => e.date !== null && e.date >= today)
    .sort((a, b) => a.date!.localeCompare(b.date!))
}

/** Dated past events, most recent first, then undated archive entries. */
export function pastEvents(now = new Date()): EventItem[] {
  const today = now.toISOString().slice(0, 10)
  const dated = events
    .filter((e) => e.date !== null && e.date < today)
    .sort((a, b) => b.date!.localeCompare(a.date!))
  const undated = events.filter((e) => e.date === null)
  return [...dated, ...undated]
}

const DATE_FMT = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
})

export function formatEventDate(iso: string): string {
  return DATE_FMT.format(new Date(`${iso}T00:00:00Z`))
}

import { site, socials } from '@/content/site'
import { events, type EventItem } from '@/content/events'
import { roopa, faqs } from '@/content/roopa'

/**
 * JSON-LD builders.
 *
 * `@id` values are stable across pages so the graph links up: the school's
 * `founder` points at the same node the homepage defines as the Person.
 */

export const PERSON_ID = `${site.url}/#achibala`
export const SCHOOL_ID = `${site.url}${roopa.path}#school`

export function personSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': PERSON_ID,
    name: site.shortName,
    alternateName: site.fullName,
    url: `${site.url}/`,
    image: `${site.url}/media/gallery/achi-10-1200.webp`,
    jobTitle: 'Violinist, Composer, Music Educator',
    description:
      'Independent violinist performing Carnatic, film, and world music, based between Chennai and Texas. Founder of Roopa Fine Arts, a school for Carnatic violin, Carnatic vocal, and music theory in Austin, Houston, and online.',
    email: `mailto:${site.email}`,
    knowsAbout: [
      'Carnatic music',
      'Carnatic violin',
      'Film music',
      'World music',
      'Music education',
    ],
    sameAs: socials.map((s) => s.href),
  }
}

/** Only events with a real start date are eligible. */
export function eventSchemas() {
  return events
    .filter((e): e is EventItem & { date: string } => e.date !== null)
    .map((e) => ({
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: e.title,
      startDate: e.date,
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      description: e.description,
      performer: { '@id': PERSON_ID },
      ...(e.venue || e.city
        ? {
            location: {
              '@type': 'Place',
              name: e.venue ?? e.city,
              ...(e.city
                ? { address: { '@type': 'PostalAddress', addressLocality: e.city } }
                : {}),
            },
          }
        : {}),
      ...(e.ticketUrl
        ? {
            offers: {
              '@type': 'Offer',
              url: e.ticketUrl,
              availability: 'https://schema.org/InStock',
            },
          }
        : {}),
    }))
}

export function schoolSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['MusicSchool', 'School', 'LocalBusiness'],
    '@id': SCHOOL_ID,
    name: roopa.name,
    url: `${site.url}${roopa.path}`,
    description: roopa.description,
    foundingDate: String(roopa.established),
    email: roopa.email,
    image: `${site.url}${site.ogImage}`,
    founder: { '@id': PERSON_ID },
    areaServed: [
      {
        '@type': 'City',
        name: 'Austin',
        containedInPlace: { '@type': 'State', name: 'Texas' },
      },
      {
        '@type': 'City',
        name: 'Houston',
        containedInPlace: { '@type': 'State', name: 'Texas' },
      },
      { '@type': 'Place', name: 'Worldwide (online lessons)' },
    ],
    knowsAbout: [
      'Carnatic music',
      'Carnatic violin',
      'Carnatic vocal',
      'Indian classical music',
      'Music theory',
      'Arangetram preparation',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Lessons and programs',
      itemListElement: [
        {
          name: 'Carnatic violin lessons',
          description:
            'Carnatic violin instruction rooted in the South Indian classical tradition, from foundations through advanced repertoire and arangetram preparation.',
        },
        {
          name: 'Carnatic vocal lessons',
          description:
            'Carnatic vocal training covering sarali varisai through varnams, kritis, and concert repertoire.',
        },
        {
          name: 'Music theory and exam preparation',
          description:
            'Music theory instruction with structured preparation for graded music examinations.',
        },
      ].map((c) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Course',
          name: c.name,
          description: c.description,
          provider: { '@id': SCHOOL_ID },
        },
      })),
    },
  }
}

export function faqSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }
}

export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.name,
      item: `${site.url}${t.path}`,
    })),
  }
}

export function articleSchema(a: {
  title: string
  excerpt: string
  date: string
  slug: string
  ogImage?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.title,
    description: a.excerpt,
    datePublished: a.date,
    author: { '@id': PERSON_ID },
    publisher: { '@id': PERSON_ID },
    mainEntityOfPage: `${site.url}/achritique/${a.slug}/`,
    ...(a.ogImage ? { image: `${site.url}${a.ogImage}` } : {}),
  }
}

/** Renders a schema object as a script tag's children. */
export function jsonLd(data: object) {
  return { __html: JSON.stringify(data) }
}

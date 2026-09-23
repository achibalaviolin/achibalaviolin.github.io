/**
 * Site-wide identity, contacts and navigation.
 *
 * Everything here is carried over verbatim from the previous static site
 * unless a comment says otherwise. Edit this file rather than components.
 */

export const site = {
  name: 'Achi Bala Violin',
  /** Legal / concert-programme name, as it appears in press and on releases. */
  fullName: 'Abhishek Balakrishnan',
  shortName: 'Achi Bala',
  role: 'Violinist · Composer · Storyteller',
  url: 'https://achibalaviolin.com',
  domain: 'achibalaviolin.com',
  locale: 'en_US',

  title: 'Achi Bala Violin | Violinist, Composer, Storyteller',
  description:
    'Achi Bala is an independent violinist performing Carnatic, film and world music. Explore performances, awards, press, writing, studio services, and Carnatic music lessons through Roopa Fine Arts.',
  /** Shorter form used for Open Graph / Twitter, as on the previous site. */
  socialDescription:
    'Independent violinist performing Carnatic, film and world music. Performances, awards, press, writing, and studio services.',
  ogImage: '/media/hero/achi-bala-new-banner-1800.webp',

  email: 'achibalaviolin@gmail.com',
  lessonsEmail: 'roopafinearts@gmail.com',

  /** Cities, in the order the artist tells the story. */
  places: ['Chennai', 'Houston', 'Austin'] as const,
} as const

export type SocialLink = {
  label: string
  handle: string
  href: string
}

export const socials: SocialLink[] = [
  {
    label: 'Spotify',
    handle: 'Achi Bala Violin',
    href: 'https://open.spotify.com/artist/2E2Nkbb3jFT0d6SYp9jwjK',
  },
  {
    label: 'YouTube',
    handle: 'Achi Bala Violin',
    href: 'https://www.youtube.com/channel/UC4oWwKn8Sl1YirGaSQWEBcw',
  },
  {
    label: 'Instagram',
    handle: '@achibalaviolin',
    href: 'https://www.instagram.com/achibalaviolin/',
  },
  {
    label: 'Facebook',
    handle: '/achibalaviolin',
    href: 'https://www.facebook.com/achibalaviolin/',
  },
  {
    label: 'Tumblr',
    handle: 'achibalaviolin',
    href: 'https://www.tumblr.com/achibalaviolin',
  },
]

/** Spotify artist id, reused by the player facade and the JSON-LD `sameAs`. */
export const spotifyArtistId = '2E2Nkbb3jFT0d6SYp9jwjK'

/**
 * Primary nav. `id` matches the homepage section element id so the header's
 * active indicator can follow the scroll position.
 */
export const navLinks = [
  { id: 'lineage', label: 'About', href: '/#lineage' },
  { id: 'works', label: 'Works', href: '/#works' },
  { id: 'events', label: 'Events', href: '/#events' },
  { id: 'listen', label: 'Listen', href: '/#listen' },
  { id: 'press', label: 'Press', href: '/#press' },
  { id: 'teaching', label: 'Lessons', href: '/roopa-fine-arts/' },
  { id: 'achritique', label: 'Writing', href: '/achritique/' },
] as const

/** The three jobs every page has to make effortless. */
export const primaryActions = {
  watch: { label: 'Watch', href: '/#listen' },
  book: {
    label: 'Book a collaboration',
    href: `mailto:${site.email}?subject=${encodeURIComponent('Collaboration enquiry')}`,
  },
  lessons: {
    label: 'Enquire about lessons',
    href: `mailto:${site.lessonsEmail}?subject=${encodeURIComponent('Lessons enquiry')}`,
  },
} as const

/** Genre marquee copy, carried over from the previous site's intro strip. */
export const disciplines = [
  'Carnatic violin',
  'Film music',
  'World music',
  'Dance productions',
  'Studio recording',
  'Music education',
] as const

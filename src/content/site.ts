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

/**
 * The live social feed on the homepage, carried over from Roopa Arts.
 *
 * Facebook's own Page Plugin: no API key, no token, and it keeps itself
 * current. Instagram is not offered because it cannot be done from a static
 * site: its feed needs an app token, and there is nowhere here to keep one.
 *
 * `embedUrl` overrides the Facebook timeline. Paste a feed widget's embed URL
 * (Behold.so, LightWidget, SnapWidget, Curator.io) to show Instagram instead.
 */
export const socialFeed = {
  facebookPage: 'https://www.facebook.com/achibalaviolin',
  /** The plugin caps its own width at 500; this is the frame height. */
  height: 640,
  embedUrl: null as string | null,
  label: 'Latest posts from Achi Bala Violin on Facebook',
}

/**
 * "Join the audience": the mailing-list sign-up in the footer.
 *
 * Formspree relays each sign-up to email; it does not build a list or send
 * campaigns. Free tier: 50 submissions a month.
 */
export const mailingList = {
  endpoint: 'https://formspree.io/f/xrpbkjpe',
  field: 'email',
}

/** Spotify artist id, reused by the player facade and the JSON-LD `sameAs`. */
export const spotifyArtistId = '2E2Nkbb3jFT0d6SYp9jwjK'

/**
 * Primary navigation.
 *
 * Every entry is its own route. An earlier draft made the homepage a single
 * scroll with anchor links into it; a visitor who wants the events list should
 * be able to go straight to it, link someone to it, and land at the top of it,
 * none of which an anchor into a fourteen-section page does well.
 */
export const navLinks = [
  { href: '/about/', label: 'About' },
  { href: '/works/', label: 'Works' },
  { href: '/events/', label: 'Events' },
  { href: '/listen/', label: 'Listen' },
  { href: '/recognition/', label: 'Recognition' },
  { href: '/roopa-fine-arts/', label: 'Lessons' },
  { href: '/achritique/', label: 'Writing' },
] as const

/** Routes reachable from the footer but kept out of the main bar. */
export const secondaryLinks = [
  { href: '/gallery/', label: 'Gallery' },
  { href: '/contact/', label: 'Work together' },
] as const

/** The three jobs every page has to make effortless. */
export const primaryActions = {
  watch: { label: 'Watch', href: '/listen/' },
  book: { label: 'Book a collaboration', href: '/contact/' },
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

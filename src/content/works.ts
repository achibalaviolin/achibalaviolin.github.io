/**
 * Works — the composing and music-direction credits.
 *
 * This section did not exist on the previous site, which presented him only
 * as a performer. These are the credits that make the case to a commissioning
 * organiser, so they lead the page.
 */

import type { media } from './generated/media'

export type WorkCredit = { role: string; names: string[] }

export type Work = {
  slug: string
  title: string
  /** Optional subtitle / original-language title. */
  subtitle?: string
  kind: 'Film' | 'Production' | 'Record' | 'Collaboration'
  year: string
  /** ISO date when a single date is known, for sorting and JSON-LD. */
  date?: string
  venue?: string
  /** One-sentence hook. */
  summary: string
  /** Longer body copy; each string is a paragraph. */
  body: string[]
  credits: WorkCredit[]
  image?: keyof typeof media
  links?: { label: string; href: string }[]
  /** Shown as a stat row on the feature panel. */
  stats?: { value: string; label: string }[]
  featured?: boolean
  source: string
}

export const works: Work[] = [
  {
    slug: 'the-waltz-of-chennai',
    title: 'The Waltz of Chennai',
    kind: 'Film',
    year: '2025',
    summary:
      'An award-winning short film blending violin, dance, and movement, anchored by the Viennese Waltz and traversing seven iconic Tamil film songs.',
    body: [
      'Anchored by the timeless rhythm of the Viennese Waltz, the film traverses seven iconic Tamil film songs originally composed by AR Rahman and Anirudh Ravichander, each reimagined across a different soundscape: orchestral symphony, jazz, rock, lo-fi, Carnatic, and an explosive dappangkuthu finale.',
      'It was born from years of travel between Houston and Chennai, a deep love for ballroom dance, and the Tamil film songs that have soundtracked both cities. Director Shara Shanth and the crew at 37Factor guided the project across eighteen months of arrangements and re-arrangements, rehearsals and re-takes.',
    ],
    // Producer and production-company credits are transcribed from the
    // festival certificates in _source-media/awards/.
    credits: [
      { role: 'Violin', names: ['Achi Bala'] },
      { role: 'Director', names: ['Shara Shanth'] },
      { role: 'Producer', names: ['Achi Bala', 'Nirupama Balakrishnan'] },
      { role: 'Production', names: ['37Factor', 'Achi Bala Violin'] },
    ],
    stats: [
      { value: '7', label: 'Tamil classics' },
      { value: '6', label: 'Soundscapes' },
      { value: '18', label: 'Months in the making' },
    ],
    links: [
      { label: 'Watch on YouTube', href: 'https://www.youtube.com/watch?v=26HeFoJnRlI' },
      { label: 'FilmFreeway', href: 'https://filmfreeway.com/TheWaltzofChennai' },
    ],
    image: 'hero/award-home-banner',
    featured: true,
    source: 'achibalaviolin.com (previous site) and the Achritique announcement essay',
  },
  {
    slug: 'arudra-2026',
    title: 'Arudra 2026',
    subtitle: 'Navagrahamum Navakailasamum',
    kind: 'Production',
    year: '2026',
    date: '2026-02-08',
    summary:
      'Concept, music composition, lyrics and violin for a full-length dance production.',
    body: [
      'A full-length production staged in February 2026, with dance direction, screenplay and choreography by Shashank Iswara. Recorded, mixed and mastered by Kathivaran Natarajan at Aura Studios, recorded at R Srinivasan Hall.',
    ],
    credits: [
      { role: 'Concept and music composition', names: ['Achi Bala'] },
      {
        role: 'Dance direction, screenplay and choreography',
        names: ['Shashank Iswara'],
      },
      { role: 'Violin', names: ['Achi Bala'] },
      { role: 'Lyrics', names: ['Achi Bala', 'Dr. Maheetha Bharadwaj', 'Srinivas Prabhala'] },
      { role: 'Cello', names: ['Jahnavi Murali'] },
      { role: 'Keys', names: ['Dr. Maheetha Bharadwaj'] },
      { role: 'Mridangam', names: ['Naga Srinidhi Kuruvada', 'Aditya Iswara'] },
      { role: 'Flute', names: ['Visveshwar Nagarajan'] },
    ],
    image: 'gallery/achi-1',
    source: 'Roopa Arts Cultural Center programme for Arudra 2026',
  },
  {
    slug: 'baroque-carnatic-connection',
    title: 'The Baroque-Carnatic Connection',
    kind: 'Collaboration',
    year: '2024',
    date: '2024-06-07',
    venue: 'Miller Outdoor Theatre, Houston',
    summary:
      'Music director for a cross-cultural staging of Western baroque and South Indian classical music and dance.',
    body: [
      'A live musical conversation examining what Western baroque and South Indian classical traditions hold in common, performed with dancers in period costume. Conceptualised and directed by Lavanya Rajagopalan with choreographic input from Catherine Turocy, produced by Silambam Houston, with guest appearances from the Apollo Chamber Players and Roopa Fine Arts.',
    ],
    credits: [
      { role: 'Music direction', names: ['Abhishek Balakrishnan'] },
      { role: 'Carnatic vocal and violin', names: ['Abhishek Balakrishnan'] },
      { role: 'Conceptualised and directed by', names: ['Lavanya Rajagopalan'] },
      { role: 'Choreographic input', names: ['Catherine Turocy'] },
      { role: 'Mridangam', names: ['Naga Srinidhi Kuruvada'] },
      { role: 'Carnatic cello', names: ['Jahnavi Murali'] },
      { role: 'Producer', names: ['Silambam Houston'] },
    ],
    image: 'gallery/achi-6',
    source: 'Miller Outdoor Theatre performance page, 7 June 2024',
  },
  {
    slug: 'amruthavarshini',
    title: 'Amruthavarshini',
    kind: 'Record',
    year: '2024',
    summary:
      'Winner of Best Song at the World Film Festival in Cannes, Remember the Future.',
    body: [
      'A collaboration with Kavitha Jayaraman and Avi Patel, credited to the United States, which took the Best Song award at the World Film Festival in Cannes in February 2024.',
    ],
    credits: [
      { role: 'Written and performed by', names: ['Kavitha Jayaraman', 'Avi Patel', 'Abhishek Balakrishnan'] },
    ],
    image: 'awards/awards-5',
    source: 'World Film Festival in Cannes certificate, February 2024',
  },
  {
    slug: 'rama-nama-sharanam',
    title: 'Rama Nama Sharanam',
    subtitle: 'Carnatic Violin Solo',
    kind: 'Record',
    year: '2020',
    summary: 'A Carnatic violin solo record, released under his given name.',
    body: [
      'Released as Abhishek Balakrishnan, featuring Karun Salvady. Streaming on Spotify and Apple Music.',
    ],
    credits: [
      { role: 'Violin', names: ['Abhishek Balakrishnan'] },
      { role: 'Featuring', names: ['Karun Salvady'] },
    ],
    links: [
      {
        label: 'Spotify',
        href: 'https://open.spotify.com/album/4nKQeWwHDdxVZ3V5Zs9H9i',
      },
      {
        label: 'Apple Music',
        href: 'https://music.apple.com/us/album/1546339138',
      },
    ],
    image: 'gallery/achi-9',
    source: 'Spotify and Apple Music release listings',
  },
]

export const featuredWork = works.find((w) => w.featured) ?? works[0]

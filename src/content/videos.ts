/**
 * YouTube performances.
 *
 * Titles and credits were pulled from YouTube's oEmbed endpoint, so they match
 * the channel exactly — the previous site carried placeholder alt text like
 * "YouTube performance thumbnail" for four of these six.
 *
 * `poster` points at the local optimised thumbnail. Falling back to
 * i.ytimg.com would work but costs a third-party request on first paint.
 */

import { media } from './generated/media'

export type Video = {
  id: string
  /** Exact YouTube title. */
  title: string
  /** Short display title for cards. */
  short: string
  /** Who else is on it — shown under the title. */
  credit?: string
  poster: keyof typeof media
  alt: string
  featured?: boolean
}

export const videos: Video[] = [
  {
    id: '26HeFoJnRlI',
    title: 'The Waltz of Chennai - Official Music Video | Achi Bala Violin ©',
    short: 'The Waltz of Chennai',
    credit: 'Official music video',
    poster: 'hero/award-home-banner',
    alt: 'The Waltz of Chennai awards banner with festival laurels',
    featured: true,
  },
  {
    id: 'xfxC8uROZB4',
    title: 'Kalaavathi Violin Cover | Sid Sriram | MaheshBabu | Keerthy Suresh',
    short: 'Kalaavathi',
    credit: 'Sid Sriram · Mahesh Babu · Keerthy Suresh',
    poster: 'videos/video-3',
    alt: 'Achi Bala performing the Kalaavathi violin cover',
  },
  {
    id: 'CnvbsigUgio',
    title:
      'Ennavale | 1 Year of Violin Covers | Achi Bala Violin | Sai Vignesh | Hari SR | HGfilms',
    short: 'Ennavale',
    credit: 'Sai Vignesh · Hari SR · HGfilms',
    poster: 'videos/video-2',
    alt: 'Achi Bala performing Ennavale on violin',
  },
  {
    id: 'xrCR49HjZDE',
    title:
      'East Meets West | Pandit Ravi Shankar | Achi Bala Violin | Svetak Sundhar | Aditya Srivatsan',
    short: 'East Meets West',
    credit: 'A tribute to Pandit Ravi Shankar, with Svetak Sundhar and Aditya Srivatsan',
    poster: 'videos/video-1',
    alt: 'Achi Bala performing a tribute to Pandit Ravi Shankar',
  },
  {
    id: 's6EyMArpw44',
    title:
      'Kala Kalamaga Vazhum Violin Cover | Isaignani Ilayaraja | Kamal Haasan | Achi Bala Violin',
    short: 'Kala Kalamaga Vazhum',
    credit: 'Ilaiyaraaja · Kamal Haasan',
    poster: 'videos/video-4',
    alt: 'Achi Bala performing Kala Kalamaga Vazhum on violin',
  },
  {
    id: 'NQWv3HUXf3c',
    title:
      'Kanna Nidurinchara | 5 Years For Baahubali 2 Glory | Achi Bala Violin | Sai Shankar | HGfilms',
    short: 'Kanna Nidurinchara',
    credit: 'Baahubali 2 · Sai Shankar · HGfilms',
    poster: 'videos/video-5',
    alt: 'Achi Bala performing Kanna Nidurinchara on violin',
  },
]

export const featuredVideo = videos.find((v) => v.featured) ?? videos[0]

export const watchUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`
/** Privacy-preserving embed host, matching the previous site. */
export const embedUrl = (id: string) =>
  `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`

/**
 * Gallery.
 *
 * Alt text is carried over verbatim from the previous site, which described
 * these well. Two images that were sitting unused in the old repo
 * (gallery/achi-4, hero/slider-6) are included here — they were paid for and
 * shot, and there was no reason they were hidden.
 */

import { media } from './generated/media'

export type GalleryImage = {
  key: keyof typeof media
  alt: string
  /** Optional caption shown in the lightbox. */
  caption?: string
}

export const gallery: GalleryImage[] = [
  {
    key: 'gallery/achi-10',
    alt: 'Achi Bala playing violin on a New York street',
  },
  {
    key: 'gallery/achi-1',
    alt: 'Achi Bala performing a Carnatic violin concert in a red kurta',
  },
  {
    key: 'gallery/achi-3',
    alt: 'Achi Bala playing electric violin on a New York street',
  },
  {
    key: 'gallery/achi-5',
    alt: 'Achi Bala in a close-up moment performing into the violin',
  },
  {
    key: 'gallery/achi-6',
    alt: 'Achi Bala playing violin seated in a courtyard',
  },
  {
    key: 'gallery/achi-7',
    alt: 'Achi Bala smiling during a Carnatic concert in a pink kurta',
  },
  {
    key: 'gallery/achi-9',
    alt: 'Achi Bala backstage with a fellow musician',
  },
  {
    // Was unused in the previous repo.
    key: 'gallery/achi-4',
    alt: 'Achi Bala performing', // TODO: describe this image properly
  },
  {
    // Was unused in the previous repo.
    key: 'hero/slider-6',
    alt: 'Achi Bala on stage', // TODO: describe this image properly
  },
  {
    key: 'hero/banner-3',
    alt: 'Achi Bala mid-performance, bow raised, lit against a dark stage',
  },
  {
    key: 'hero/banner-2',
    alt: 'Achi Bala performing violin on a blue-lit concert stage',
  },
  {
    key: 'hero/abv-white',
    alt: 'Achi Bala looking upward, holding his violin, in a bright white archway',
  },
]

/**
 * The three frames that used to cycle in the homepage hero.
 *
 * They are no longer a slider. Each one now heads the page it belongs to,
 * where it is looked at rather than replaced after six seconds, and all three
 * are in `gallery` above as well, so none of them is lost:
 *
 *   hero/banner-3   heads /works
 *   hero/banner-2   heads /listen
 *   hero/abv-white  heads /contact
 *
 * Kept as a list because it records where they went.
 */
export const formerHeroFrames = [
  {
    // Was unused in the previous repo, the most cinematic frame of the set.
    key: 'hero/banner-3' as const,
    alt: 'Achi Bala mid-performance, bow raised, lit against a dark stage', // TODO: confirm this description
  },
  {
    key: 'hero/banner-2' as const,
    alt: 'Achi Bala performing violin on a blue-lit concert stage',
  },
  {
    key: 'hero/abv-white' as const,
    alt: 'Achi Bala looking upward, holding his violin, in a bright white archway',
  },
]

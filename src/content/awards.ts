/**
 * Awards and recognition.
 *
 * The previous site showed these seven images with generic alt text ("Award
 * recognition image") and no festival names anywhere in the markup. The names
 * below were read off the certificates and laurels themselves — every field
 * is transcribed from the artwork in `_source-media/awards/`, not inferred.
 *
 * Two things worth knowing when editing:
 *
 *  - The "Best Director" awards were won by the film's director, Shara Shanth,
 *    for The Waltz of Chennai. `laureate` records who each award actually
 *    names, so the page can stay accurate about that rather than implying
 *    they are all Achi Bala's.
 *  - `awards-5` is not a Waltz of Chennai award at all: it is a Best Song win
 *    at the World Film Festival in Cannes for "Amruthavarshini", a separate
 *    collaboration. It was previously indistinguishable from the rest.
 */

import { media } from './generated/media'

export type Award = {
  id: string
  image: keyof typeof media
  /** Festival or awarding body, as printed. */
  festival: string
  /** Award or honour, as printed. */
  category: string
  /** Edition/year label as printed, e.g. "December 2025". */
  awarded: string
  /** Sort key. */
  year: number
  /** City, where the certificate names one. */
  place?: string
  /** The work it recognises. */
  work: string
  /** Who the certificate names. */
  laureate: string
  alt: string
  size?: 'wide' | 'tall' | 'regular'
}

export const awards: Award[] = [
  {
    id: 'cannes-best-song',
    image: 'awards/awards-5',
    festival: 'World Film Festival in Cannes',
    category: 'Winner, Best Song',
    awarded: 'February 2024',
    year: 2024,
    work: 'Amruthavarshini',
    laureate: 'Kavitha Jayaraman, Avi Patel, Abhishek Balakrishnan',
    alt: 'Gold certificate: Winner, Best Song, for Amruthavarshini at the World Film Festival in Cannes, Remember the Future, February 2024',
  },
  {
    id: 'best-shorts-merit',
    image: 'awards/awards-1',
    festival: 'Best Shorts Competition',
    category: 'Award of Merit',
    awarded: 'December 2025',
    year: 2025,
    work: 'The Waltz of Chennai',
    laureate: 'Achi Bala (USA)',
    alt: 'Gold and black certificate: Award of Merit from the Best Shorts Competition to Achi Bala for The Waltz of Chennai music video, December 2025',
  },
  {
    id: 'best-shorts-merit-asian-theme',
    image: 'awards/awards-6',
    festival: 'Best Shorts Competition',
    category: 'Award of Merit, Asian Theme',
    awarded: 'December 2025',
    year: 2025,
    work: 'The Waltz of Chennai',
    laureate: 'Achi Bala (USA)',
    alt: 'Gold and black certificate: Award of Merit, Asian Theme, from the Best Shorts Competition to Achi Bala for The Waltz of Chennai, December 2025',
  },
  {
    id: 'indian-world-best-music-video',
    image: 'awards/awards-8',
    festival: '10th Indian World Film Festival-26',
    category: 'Certificate of Excellence, Best Music Video (Jury)',
    awarded: '7 March 2026',
    year: 2026,
    place: 'Hyderabad, India',
    work: 'The Waltz of Chennai',
    laureate: 'Directed by Shara Shanth · Produced by Achi Bala',
    alt: 'Blue Certificate of Excellence: Best Music Video, Jury, at the 10th Indian World Film Festival-26 in Hyderabad for The Waltz of Chennai',
    size: 'wide',
  },
  {
    id: 'mumbai-shorts-best-director',
    image: 'awards/awards-4',
    festival: '14th Mumbai Shorts International Film Festival-25',
    category: 'Certificate of Excellence, Best Director',
    awarded: '14 December 2025',
    year: 2025,
    place: 'Mumbai, India',
    work: 'The Waltz of Chennai',
    laureate: 'Shara Shanth, director',
    alt: 'Blue Certificate of Excellence: Best Director at the 14th Mumbai Shorts International Film Festival-25 for The Waltz of Chennai',
    size: 'tall',
  },
  {
    id: 'mumbai-shorts-selection',
    image: 'awards/awards-3',
    festival: '14th Mumbai Shorts International Film Festival-25',
    category: 'Official Selection',
    awarded: '2025',
    year: 2025,
    place: 'Mumbai, India',
    work: 'The Waltz of Chennai',
    laureate: 'The Waltz of Chennai',
    alt: 'Black laurel wreath: Official Selection, 14th Mumbai Shorts International Film Festival-25, Mumbai, India',
    size: 'wide',
  },
  {
    id: 'waltz-laurel-poster',
    image: 'awards/awards-2',
    festival: 'The Waltz of Chennai',
    category: 'Festival laurels',
    awarded: '2025–2026',
    year: 2025,
    work: 'The Waltz of Chennai',
    laureate: 'Achi Bala Violin production',
    alt: 'The Waltz of Chennai poster showing festival laurels from Barnstorm Dance Fest, Best Shorts Competition, Dada Saheb Phalke Film Festival, Mumbai Shorts International Film Festival and the Indian World Film Festival',
    size: 'tall',
  },
]

/**
 * Recognition named on the film's laurel artwork but without a separate
 * certificate in the media folder. Listed so the record is complete.
 *
 * TODO: add the certificates for these two if they exist.
 */
export const additionalRecognition = [
  {
    festival: '16th Dada Saheb Phalke Film Festival-26',
    category: 'Best Director',
    place: 'New Delhi, India',
    work: 'The Waltz of Chennai',
  },
  {
    festival: 'Barnstorm Dance Fest',
    category: 'Official Selection',
    work: 'The Waltz of Chennai',
  },
]

/** Distinct awarding bodies across both lists — used in the section header. */
export const festivalCount = new Set([
  ...awards.filter((a) => a.id !== 'waltz-laurel-poster').map((a) => a.festival),
  ...additionalRecognition.map((a) => a.festival),
]).size

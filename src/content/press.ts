/**
 * Press.
 *
 * The previous site showed three press cards with a title and an image and no
 * indication of what any of them said. Each entry now carries the publication,
 * the byline, the date, and a verbatim pull-quote — which is what an organiser
 * or a journalist actually reads.
 *
 * Two of these five (2011 and 2025) were not linked from the previous site.
 *
 * Quotes are verbatim. Do not paraphrase them.
 */

import { media } from './generated/media'

export type PressItem = {
  slug: string
  headline: string
  publication: string
  /** ISO date of publication. */
  date: string
  byline?: string
  href: string
  /** Verbatim excerpt. Keep the wording exactly as published. */
  quote: string
  /** Who is speaking, when the quote is not the publication's own prose. */
  quoteAttribution?: string
  image?: keyof typeof media
  imageAlt?: string
}

export const press: PressItem[] = [
  {
    slug: 'navtar-violin-roopa-arts',
    headline:
      "Vishnu R's unique Navtar and Achi Bala's violin enthral Roopa Arts' audience",
    publication: 'India Herald',
    date: '2025-07-16',
    href: 'https://india-herald.com/vishnu-rs-unqiue-navtar-and-achi-balas-violin-enthral-roopa-arts-audien-p9265-65.htm',
    quote:
      'An independent violinist who performs Carnatic, film, and world music styles.',
  },
  {
    slug: 'kalaavathi',
    headline: 'Kalaavathi Violin Cover',
    publication: 'India Herald',
    date: '2022-03-22',
    href: 'https://india-herald.com/kalaavathi-violin-cover-p8119-77.htm',
    quote:
      "My violin cover for Sid Sriram's new Telugu song Kalaavathi is now streaming on YouTube, applauded by music director Thaman and the Sarkaru Vaari Paata Team.",
    quoteAttribution: 'Achi Bala',
    image: 'press/press-release',
    imageAlt: 'Kalaavathi violin cover press feature',
  },
  {
    slug: 'dimensions-of-tabla',
    headline: "Pt. Shantilal Shah's Dimensions of Tabla Leaves Lasting Impact",
    publication: 'Indo-American News',
    date: '2018-03-15',
    byline: 'Vamsi Ahobila',
    href: 'https://indoamerican-news.com/pt-shantilal-shahs-dimensions-of-tabla-leaves-lasting-impact/',
    quote:
      'The third item featured violinist Abhishek Balakrishnan in a thrilling Carnatic music performance with Aditya Srivatsan on Tabla.',
    image: 'press/laya',
    imageAlt: 'Laya performance featured in Indo-American News',
  },
  {
    slug: 'jvalanthi-arangetram',
    headline: 'Jvalanthi Prasad: Arangetram Review, A performance par excellence',
    publication: 'Indo-American News',
    date: '2016-07-28',
    byline: 'Anu Mahesh',
    href: 'https://indoamerican-news.com/jvalanthi-prasad-arangetram-review-a-performance-par-excellence/',
    quote:
      "Muthukumar's mellifluous flute and Abhishek Balakrishnan's soulful violin wove magical strains.",
    image: 'press/jwalanti',
    imageAlt: 'Jwalanti Prasad arangetram review',
  },
  {
    slug: 'aplomb',
    headline: 'Abhishek on the violin shows aplomb',
    publication: 'India Herald',
    date: '2011-05-25',
    byline: 'Vivek Natarajan & Ranjana Narasiman',
    href: 'https://india-herald.com/abhishek-on-the-violin-shows-aplomb-p2612-1.htm',
    quote:
      'A violin recital at Zilkha Hall, accompanied by three percussionists, drawing a standing ovation and a proclamation from the Mayor of Sugar Land.',
  },
]

/** The quote that leads the press section. */
export const leadQuote = press.find((p) => p.slug === 'jvalanthi-arangetram')!

const PRESS_DATE_FMT = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

export function formatPressDate(iso: string): string {
  return PRESS_DATE_FMT.format(new Date(`${iso}T00:00:00Z`))
}

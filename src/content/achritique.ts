/**
 * Achritique article loader.
 *
 * Articles live as .mdx files in src/content/achritique/. To publish a new
 * one, drop in a file with the frontmatter shape below — routing, the index
 * page, the sitemap and the legacy .html redirect are all generated from it.
 *
 * Read at build time only; this module is never sent to the browser.
 */

import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

const DIR = path.join(process.cwd(), 'src/content/achritique')

export type ArticleMeta = {
  slug: string
  title: string
  kicker: string
  standfirst: string
  excerpt: string
  /** ISO date, used for sorting and structured data. */
  date: string
  /** How the date is shown to a reader, e.g. "July 2026" or "From the archive". */
  displayDate: string
  category: string
  readingTime: string
  featured?: boolean
  ogImage?: string
  /**
   * True when the text on this page is a reconstruction rather than the
   * original post. Renders a short, honest note at the foot of the article.
   */
  needsOriginal?: boolean
}

export type Article = ArticleMeta & { body: string }

function parse(filename: string): Article {
  const slug = filename.replace(/\.mdx$/, '')
  const raw = fs.readFileSync(path.join(DIR, filename), 'utf8')
  const { data, content } = matter(raw)

  const date = data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date)

  return {
    slug,
    title: data.title,
    kicker: data.kicker ?? '',
    standfirst: data.standfirst ?? '',
    excerpt: data.excerpt ?? data.standfirst ?? '',
    date,
    displayDate: data.displayDate ?? '',
    category: data.category ?? '',
    readingTime: data.readingTime ?? '',
    featured: data.featured ?? false,
    ogImage: data.ogImage,
    needsOriginal: data.needsOriginal ?? false,
    body: content,
  }
}

/** All articles, newest first. */
export function getArticles(): Article[] {
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map(parse)
    .sort((a, b) => b.date.localeCompare(a.date))
}

export function getArticle(slug: string): Article | undefined {
  return getArticles().find((a) => a.slug === slug)
}

export function getFeaturedArticle(): Article {
  const all = getArticles()
  return all.find((a) => a.featured) ?? all[0]
}

export const achritique = {
  name: 'Achritique',
  path: '/achritique/',
  title: 'Achritique · the writing of Achi Bala',
  description:
    'Achritique: notes, essays and criticism by violinist Achi Bala on music, movies and the craft of art.',
  strapline:
    'Notes and criticism from Achi Bala: music, movies, and the craft behind the things we love.',
  est: 'A journal of notes & criticism',
} as const

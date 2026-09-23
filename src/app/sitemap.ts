import type { MetadataRoute } from 'next'
import { site } from '@/content/site'
import { roopa } from '@/content/roopa'
import { achritique, getArticles } from '@/content/achritique'

/**
 * Sitemap.
 *
 * Only canonical (new) URLs are listed. The legacy `.html` paths are
 * deliberately excluded — they exist to redirect old links, and listing them
 * would invite search engines to index both copies.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const today = new Date()

  return [
    {
      url: `${site.url}/`,
      lastModified: today,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${site.url}${roopa.path}`,
      lastModified: today,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${site.url}${achritique.path}`,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    ...getArticles().map((a) => ({
      url: `${site.url}/achritique/${a.slug}/`,
      lastModified: new Date(a.date),
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    })),
  ]
}

/** Required for `output: 'export'` — the route must be fully static. */
export const dynamic = 'force-static'

import type { MetadataRoute } from 'next'
import { site } from '@/content/site'
import { roopa } from '@/content/roopa'
import { achritique, getArticles } from '@/content/achritique'
import { works } from '@/content/works'

/**
 * Sitemap.
 *
 * Only canonical URLs are listed. The legacy `.html` paths are deliberately
 * excluded: they exist to redirect old links, and listing them would invite
 * search engines to index both copies of the same article.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const today = new Date()

  const page = (path: string, priority: number, changeFrequency: 'weekly' | 'monthly' | 'yearly') => ({
    url: `${site.url}${path}`,
    lastModified: today,
    changeFrequency,
    priority,
  })

  return [
    page('/', 1, 'monthly'),
    page('/about/', 0.8, 'yearly'),
    page('/works/', 0.9, 'monthly'),
    ...works.map((w) => page(`/works/${w.slug}/`, 0.7, 'yearly')),
    page('/events/', 0.9, 'weekly'),
    page('/listen/', 0.8, 'monthly'),
    page('/recognition/', 0.8, 'monthly'),
    page('/gallery/', 0.6, 'monthly'),
    page('/contact/', 0.7, 'yearly'),
    page(roopa.path, 0.9, 'monthly'),
    page(achritique.path, 0.7, 'weekly'),
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

import type { Metadata } from 'next'
import Link from 'next/link'
import { achritique, getArticles, getFeaturedArticle } from '@/content/achritique'
import { site } from '@/content/site'
import { Reveal, RevealItem, RevealList } from '@/components/animations/reveal'
import { breadcrumbSchema, jsonLd } from '@/lib/structured-data'

export const metadata: Metadata = {
  title: achritique.title,
  description: achritique.description,
  alternates: { canonical: achritique.path },
  openGraph: {
    type: 'website',
    title: achritique.title,
    description: achritique.description,
    url: achritique.path,
    siteName: site.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: achritique.title,
    description: achritique.description,
  },
}

export default function AchritiqueIndex() {
  const featured = getFeaturedArticle()
  const rest = getArticles().filter((a) => a.slug !== featured.slug)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbSchema([
            { name: site.name, path: '/' },
            { name: achritique.name, path: achritique.path },
          ])
        )}
      />

      <header className="rule-top pt-40 pb-20 text-center md:pt-48">
        <div className="wrap">
          <Reveal>
            <p className="slate">{achritique.est}</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="mt-6 font-display text-colossal">
              Achri<span className="text-ember-lit">tique</span>
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mx-auto mt-8 max-w-xl text-lede text-muted">
              {achritique.strapline}
            </p>
          </Reveal>
          <div aria-hidden="true" className="staff mx-auto mt-14 h-[25px] w-40 opacity-60" />
        </div>
      </header>

      <div className="wrap pb-32">
        <Reveal>
          <p className="slate border-t border-rule-soft pt-8">Featured essay</p>
        </Reveal>

        <Reveal delay={0.08}>
          <article className="mt-10 border-b border-rule-soft pb-16">
            <p className="flex items-center gap-3 text-xs tracking-wider text-faint uppercase">
              <span className="text-ember-lit">{featured.category}</span>
              <span>{featured.displayDate}</span>
            </p>
            <h2 className="mt-5 max-w-3xl text-monumental">
              <Link
                href={`/achritique/${featured.slug}/`}
                className="transition-colors duration-500 hover:text-ember-lit"
              >
                {featured.title}
              </Link>
            </h2>
            <p className="mt-6 max-w-2xl text-lede text-muted">{featured.excerpt}</p>
            <Link
              href={`/achritique/${featured.slug}/`}
              className="bow-link mt-8 inline-block text-ember-lit"
            >
              Read the essay &rarr;
            </Link>
          </article>
        </Reveal>

        <Reveal>
          <p className="slate mt-16">From the archive</p>
        </Reveal>

        <RevealList as="ol" className="mt-8 divide-y divide-rule-soft border-y border-rule-soft">
          {rest.map((a, i) => (
            <RevealItem as="li" key={a.slug}>
              <Link
                href={`/achritique/${a.slug}/`}
                className="group flex flex-col gap-4 py-8 sm:flex-row sm:items-baseline sm:gap-10"
              >
                <span className="font-display text-sm text-faint tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="flex-1">
                  <span className="flex items-center gap-3 text-xs tracking-wider text-faint uppercase">
                    <span className="text-ember-lit">{a.category}</span>
                    <span>{a.displayDate}</span>
                  </span>
                  <span className="mt-3 block font-display text-recital transition-colors duration-500 group-hover:text-ember-lit">
                    {a.title}
                  </span>
                  <span className="mt-3 block max-w-2xl text-muted">{a.excerpt}</span>
                </span>
                <span className="shrink-0 text-xs text-faint">{a.readingTime}</span>
              </Link>
            </RevealItem>
          ))}
        </RevealList>

        <Reveal>
          <p className="mt-20 text-center text-muted">
            <span aria-hidden="true" className="mb-4 block text-2xl text-ember/50">
              &#10086;
            </span>
            More essays are on their way from the archive.
            <br />
            Until then, more melodies coming your way.
          </p>
        </Reveal>
      </div>
    </>
  )
}

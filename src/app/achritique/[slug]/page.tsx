import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'

import { achritique, getArticle, getArticles } from '@/content/achritique'
import { site } from '@/content/site'
import { mdxComponents } from '@/components/mdx/mdx-components'
import { articleSchema, breadcrumbSchema, jsonLd } from '@/lib/structured-data'

type Params = { slug: string }

export function generateStaticParams(): Params[] {
  return getArticles().map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { slug } = await params
  const article = getArticle(slug)
  if (!article) return {}

  const title = `${article.title} · ${achritique.name}`
  const url = `/achritique/${slug}/`

  return {
    title,
    description: article.excerpt,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      title,
      description: article.excerpt,
      url,
      siteName: site.name,
      publishedTime: article.date,
      ...(article.ogImage ? { images: [{ url: article.ogImage }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: article.excerpt,
      ...(article.ogImage ? { images: [article.ogImage] } : {}),
    },
  }
}

export default async function ArticlePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const article = getArticle(slug)
  if (!article) notFound()

  const all = getArticles()
  const index = all.findIndex((a) => a.slug === slug)
  const next = all[index + 1] ?? all[0]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(articleSchema(article))}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbSchema([
            { name: site.name, path: '/' },
            { name: achritique.name, path: achritique.path },
            { name: article.title, path: `/achritique/${slug}/` },
          ])
        )}
      />

      <article className="font-read">
        <header className="rule-top pt-36 pb-14 md:pt-44">
          <div className="wrap-read">
            <p className="font-sans text-xs tracking-[0.2em] text-gold uppercase">
              {article.kicker}
            </p>
            <h1 className="mt-6 font-display text-monumental">{article.title}</h1>
            {article.standfirst ? (
              <p className="mt-7 text-[1.25rem] leading-relaxed text-muted italic">
                {article.standfirst}
              </p>
            ) : null}
            <p className="mt-8 font-sans text-sm text-faint">
              By <span className="text-ivory">Achi Bala</span> · {article.displayDate}
              {article.readingTime ? <span> · {article.readingTime}</span> : null}
            </p>
          </div>
        </header>

        <div className="wrap-read pb-8 text-ivory/90">
          <MDXRemote source={article.body} components={mdxComponents} />

          <p aria-hidden="true" className="mt-14 text-center text-2xl text-gold/50">
            &#10086;
          </p>

          {article.needsOriginal ? (
            <p className="mt-12 border-t border-rule-soft pt-6 font-sans text-xs leading-relaxed text-faint">
              <strong className="text-muted">A note on this text:</strong> this page was
              rebuilt from the original post. To restore it word-for-word, replace the body
              of{' '}
              <code className="text-ivory/70">
                src/content/achritique/{article.slug}.mdx
              </code>{' '}
              and delete its <code className="text-ivory/70">needsOriginal</code>{' '}
              frontmatter flag.
            </p>
          ) : null}
        </div>

        <nav
          aria-label="Article"
          className="wrap-read flex items-center justify-between gap-6 border-t border-rule-soft py-10 font-sans text-sm"
        >
          <Link href={achritique.path} className="bow-link text-muted hover:text-ivory">
            &larr; All essays
          </Link>
          {next && next.slug !== slug ? (
            <Link
              href={`/achritique/${next.slug}/`}
              className="bow-link text-right text-gold-bright"
            >
              {next.title} &rarr;
            </Link>
          ) : null}
        </nav>
      </article>
    </>
  )
}

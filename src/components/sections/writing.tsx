import Link from 'next/link'
import { Reveal, RevealItem, RevealList } from '@/components/animations/reveal'
import { ButtonLink } from '@/components/ui/button'
import { Section } from '@/components/ui/section'
import { achritique, type ArticleMeta } from '@/content/achritique'

/** Achritique teaser. Articles are passed in so this stays a server component. */
export function Writing({ articles }: { articles: ArticleMeta[] }) {
  return (
    <Section id="achritique" divider>
      <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div>
          <Reveal>
            <p className="eyebrow">The writing</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-5 text-h2">{achritique.name}</h2>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mt-6 text-lede text-muted">{achritique.strapline}</p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-10">
              <ButtonLink href={achritique.path} variant="secondary">
                Enter the reading room
              </ButtonLink>
            </div>
          </Reveal>
        </div>

        <RevealList as="ul" className="divide-y divide-rule-soft border-y border-rule-soft">
          {articles.slice(0, 3).map((a) => (
            <RevealItem as="li" key={a.slug}>
              <Link
                href={`/achritique/${a.slug}/`}
                className="group flex flex-col gap-3 py-7 sm:flex-row sm:items-baseline sm:gap-8"
              >
                <span className="shrink-0 text-xs tracking-wider text-faint uppercase sm:w-36">
                  {a.category} · {a.displayDate}
                </span>
                <span className="flex-1">
                  <span className="block font-display text-h3 transition-colors duration-500 group-hover:text-gold-bright">
                    {a.title}
                  </span>
                  <span className="mt-2 block text-muted">{a.excerpt}</span>
                </span>
                <span className="shrink-0 text-xs text-faint">{a.readingTime}</span>
              </Link>
            </RevealItem>
          ))}
        </RevealList>
      </div>
    </Section>
  )
}

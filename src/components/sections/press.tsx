import { Reveal, RevealItem, RevealList } from '@/components/animations/reveal'
import { Section, SectionHead } from '@/components/ui/section'
import { formatPressDate, leadQuote, press } from '@/content/press'

/**
 * Press.
 *
 * Built around verbatim pull-quotes rather than logos. The previous site
 * showed three cards with a one-word title and no indication of what any
 * review actually said; two further pieces (2011 and 2025) were not linked
 * at all.
 */
export function Press() {
  const rest = press.filter((p) => p.slug !== leadQuote.slug)

  return (
    <Section id="press" divider>
      <SectionHead eyebrow="Press" title="What the reviews said." />

      <Reveal className="mt-16">
        <figure className="relative border-l-2 border-gold/50 pl-8 md:pl-12">
          <span
            aria-hidden="true"
            className="absolute -top-6 left-4 font-display text-8xl leading-none text-gold/20 select-none md:left-7"
          >
            &ldquo;
          </span>
          <blockquote className="relative font-display text-h2 text-balance">
            {leadQuote.quote}
          </blockquote>
          <figcaption className="mt-8 text-sm text-muted">
            <a
              href={leadQuote.href}
              target="_blank"
              rel="noopener noreferrer"
              className="bow-link text-gold-bright"
            >
              {leadQuote.publication}
            </a>
            {leadQuote.byline ? <span> · {leadQuote.byline}</span> : null}
            <span> · {formatPressDate(leadQuote.date)}</span>
          </figcaption>
        </figure>
      </Reveal>

      <RevealList as="ul" className="mt-20 grid gap-px overflow-hidden rounded-lg bg-rule-soft md:grid-cols-2">
        {rest.map((item) => (
          <RevealItem as="li" key={item.slug} className="bg-void">
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full flex-col p-8 transition-colors duration-700 hover:bg-surface/70 md:p-10"
            >
              <div className="flex items-baseline justify-between gap-4">
                <span className="eyebrow">{item.publication}</span>
                <span className="text-xs text-faint tabular-nums">
                  <time dateTime={item.date}>{formatPressDate(item.date)}</time>
                </span>
              </div>

              <h3 className="mt-5 font-display text-h3 transition-colors duration-500 group-hover:text-gold-bright">
                {item.headline}
              </h3>

              <blockquote className="mt-5 text-muted italic">
                &ldquo;{item.quote}&rdquo;
              </blockquote>

              <p className="mt-auto pt-8 text-xs text-faint">
                {item.quoteAttribution
                  ? `${item.quoteAttribution}, quoted in ${item.publication}`
                  : (item.byline ?? item.publication)}
              </p>
            </a>
          </RevealItem>
        ))}
      </RevealList>
    </Section>
  )
}

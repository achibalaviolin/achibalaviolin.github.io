import { Reveal, RevealItem, RevealList } from '@/components/animations/reveal'
import { TiltCard } from '@/components/animations/tilt-card'
import { Section, SectionHead } from '@/components/ui/section'
import { works } from '@/content/works'

/**
 * Works — composing and music-direction credits.
 *
 * New section. The previous site presented him purely as a performer, which
 * undersells the thing an organiser is actually shopping for: someone who can
 * score a production. Each entry carries its real credit block.
 */
export function Works() {
  return (
    <Section id="works" divider>
      <SectionHead eyebrow="Works" title="Composed, directed, performed.">
        Original scores and music direction for film, stage, and dance — alongside the
        records.
      </SectionHead>

      <RevealList className="mt-16 grid gap-6 md:grid-cols-2">
        {works.map((work) => (
          <RevealItem key={work.slug}>
            <TiltCard className="h-full">
              <article className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-rule bg-surface/60 p-8 transition-colors duration-700 hover:border-gold/40 md:p-10">
                {/* Animated border sheen along the top edge. */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-transparent via-gold to-transparent transition-transform duration-1000 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-x-100"
                />

                <div className="flex items-center justify-between gap-4">
                  <span className="eyebrow">{work.kind}</span>
                  <span className="font-display text-sm text-faint tabular-nums">
                    {work.year}
                  </span>
                </div>

                <h3 className="mt-6 font-display text-h3">
                  {work.title}
                  {work.subtitle ? (
                    <span className="mt-1 block text-base text-muted italic">
                      {work.subtitle}
                    </span>
                  ) : null}
                </h3>

                {work.venue ? (
                  <p className="mt-2 text-sm text-gold/80">{work.venue}</p>
                ) : null}

                <p className="mt-4 text-muted">{work.summary}</p>

                <dl className="mt-8 space-y-2 border-t border-rule-soft pt-6 text-sm">
                  {work.credits.slice(0, 4).map((c) => (
                    <div key={c.role} className="flex gap-4">
                      <dt className="w-40 shrink-0 text-faint">{c.role}</dt>
                      <dd className="text-ivory/85">{c.names.join(', ')}</dd>
                    </div>
                  ))}
                </dl>

                {work.links?.length ? (
                  <div className="mt-auto flex flex-wrap gap-5 pt-8">
                    {work.links.map((l) => (
                      <a
                        key={l.href}
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bow-link text-sm text-gold-bright"
                      >
                        {l.label}
                      </a>
                    ))}
                  </div>
                ) : null}
              </article>
            </TiltCard>
          </RevealItem>
        ))}
      </RevealList>

      <Reveal delay={0.1}>
        <p className="mt-10 text-sm text-faint">
          Commissioning a score or a production?{' '}
          <a
            href="mailto:achibalaviolin@gmail.com?subject=Commission%20enquiry"
            className="bow-link text-gold-bright"
          >
            Start a conversation
          </a>
          .
        </p>
      </Reveal>
    </Section>
  )
}

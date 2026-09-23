import Link from 'next/link'
import { Reveal } from '@/components/animations/reveal'
import { ButtonLink } from '@/components/ui/button'

type Step = { href: string; label: string; note: string }

/**
 * The closing band on every page.
 *
 * Two jobs: make the booking route obvious from wherever the visitor happens
 * to have landed, and hand them somewhere sensible to go next so the site
 * does not dead-end. Each page names its own onward links.
 */
export function NextStep({
  heading,
  lede,
  primary,
  steps,
}: {
  heading: string
  lede?: string
  primary?: { href: string; label: string }
  steps?: Step[]
}) {
  return (
    <section className="rule-top py-24 md:py-32">
      <div className="wrap">
        <div className="max-w-3xl">
          <Reveal>
            <h2 className="text-grand">{heading}</h2>
          </Reveal>
          {lede ? (
            <Reveal delay={0.08}>
              <p className="mt-6 text-lede text-muted">{lede}</p>
            </Reveal>
          ) : null}
          {primary ? (
            <Reveal delay={0.16}>
              <div className="mt-10">
                <ButtonLink href={primary.href}>{primary.label}</ButtonLink>
              </div>
            </Reveal>
          ) : null}
        </div>

        {steps?.length ? (
          <ul className="mt-20 grid gap-px border-y border-rule-soft bg-rule-soft sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((s) => (
              <li key={s.href} className="bg-paper">
                <Link
                  href={s.href}
                  className="group flex h-full flex-col gap-2 p-8 transition-colors duration-500 hover:bg-mist/70"
                >
                  <span className="font-display text-recital transition-colors duration-300 group-hover:text-ember">
                    {s.label}
                  </span>
                  <span className="text-sm text-muted">{s.note}</span>
                  <span
                    aria-hidden="true"
                    className="mt-auto pt-6 text-ember transition-transform duration-500 group-hover:translate-x-1"
                  >
                    &rarr;
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  )
}

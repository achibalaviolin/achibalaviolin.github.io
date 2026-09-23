import Link from 'next/link'
import { Reveal, RevealItem, RevealList } from '@/components/animations/reveal'
import { Counter } from '@/components/animations/counter'
import { ButtonLink } from '@/components/ui/button'
import { Section } from '@/components/ui/section'
import { roopa, schoolStats } from '@/content/roopa'
import { primaryActions } from '@/content/site'

/** Roopa Fine Arts teaser on the homepage; the full story lives on its own page. */
export function Teaching() {
  return (
    <Section id="teaching" divider>
      <div className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        <div>
          <Reveal>
            <p className="eyebrow">The school</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-5 text-h2">{roopa.name}</h2>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mt-6 text-lede text-muted">
              Carnatic violin, Carnatic vocal, and music theory with exam preparation.
              Established in {roopa.established}, built on formal teaching since{' '}
              {roopa.teachingSince}.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-4 text-muted">
              Students take{' '}
              <Link href={roopa.path} className="bow-link text-gold-bright">
                Carnatic music lessons in Austin and Houston
              </Link>{' '}
              in person, and online worldwide. They have completed arangetrams and won
              prizes in competition.
            </p>
          </Reveal>
          <Reveal delay={0.26}>
            <div className="mt-10 flex flex-wrap gap-4">
              <ButtonLink href={roopa.path}>Explore Roopa Fine Arts</ButtonLink>
              <ButtonLink href={primaryActions.lessons.href} variant="secondary">
                Enquire about lessons
              </ButtonLink>
            </div>
          </Reveal>
        </div>

        <RevealList as="dl" className="grid grid-cols-2 gap-px bg-rule-soft">
          {schoolStats.map((stat) => (
            <RevealItem as="div" key={`${stat.value}-${stat.label}`} className="bg-void p-8">
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span className="block font-display text-4xl text-gold">
                  {stat.countTo ? <Counter to={stat.countTo} /> : stat.value}
                </span>
                <span className="mt-2 block text-xs tracking-wider text-faint uppercase">
                  {stat.label}
                </span>
              </dd>
            </RevealItem>
          ))}
        </RevealList>
      </div>
    </Section>
  )
}

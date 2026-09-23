import { Reveal, RevealItem, RevealList } from '@/components/animations/reveal'
import { ClipReveal, Parallax } from '@/components/animations/parallax'
import { MediaImage } from '@/components/ui/media-image'
import { Section } from '@/components/ui/section'
import { bio, gurus, influences, places } from '@/content/bio'

/**
 * About, told as lineage.
 *
 * The previous site's About was two paragraphs of positioning that could have
 * described any violinist. The teachers are the story: a US-raised player
 * carrying a Chennai inheritance, which is also why the writing section
 * exists. The guru list is the most specific, least replaceable thing here.
 */
export function Lineage() {
  return (
    <Section id="lineage" divider>
      <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
        <ClipReveal className="relative">
          <Parallax distance={6} className="overflow-hidden rounded-sm">
            <MediaImage
              img="gallery/achi-10"
              alt="Achi Bala playing violin on a New York street"
              sizes="(min-width: 1024px) 42vw, 100vw"
              className="w-full"
            />
          </Parallax>
        </ClipReveal>

        <div>
          <Reveal>
            <p className="eyebrow">The artist</p>
          </Reveal>

          <Reveal delay={0.08}>
            <h2 className="mt-5 text-h2">
              Trained in Chennai.
              <br />
              <span className="text-muted">Raised in Texas.</span>
            </h2>
          </Reveal>

          <div className="mt-8 space-y-6 text-lede text-muted">
            {bio.lineage.map((para, i) => (
              <Reveal key={i} delay={0.14 + i * 0.06} as="p">
                {para}
              </Reveal>
            ))}
          </div>

          {/* --- the teachers --- */}
          <Reveal delay={0.2}>
            <h3 className="eyebrow mt-14">Gurus</h3>
          </Reveal>

          <RevealList as="ul" className="mt-6 divide-y divide-rule-soft border-y border-rule-soft">
            {gurus.map((g) => (
              <RevealItem
                as="li"
                key={g.name}
                className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
              >
                <span className="font-display text-lg">
                  {g.honorific ? (
                    <span className="mr-1.5 text-sm text-faint">{g.honorific}</span>
                  ) : null}
                  {g.name}
                </span>
                <span className="text-sm text-muted sm:max-w-xs sm:text-right">
                  {g.relationship}
                </span>
              </RevealItem>
            ))}
          </RevealList>

          <Reveal delay={0.1}>
            <p className="mt-6 text-sm text-faint">
              Formed by listening to {influences[0]} and {influences[1]}.
            </p>
          </Reveal>

          {/* --- three cities --- */}
          <RevealList as="dl" className="mt-14 grid grid-cols-3 gap-6 border-t border-rule-soft pt-8">
            {places.map((p) => (
              <RevealItem key={p.city} as="div">
                <dt className="font-display text-xl text-gold">{p.city}</dt>
                <dd className="mt-1 text-sm text-faint">{p.note}</dd>
              </RevealItem>
            ))}
          </RevealList>
        </div>
      </div>
    </Section>
  )
}

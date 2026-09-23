import Link from 'next/link'
import { Reveal, RevealItem, RevealList } from '@/components/animations/reveal'
import { ClipReveal, Parallax } from '@/components/animations/parallax'
import { MediaImage } from '@/components/ui/media-image'
import { ButtonLink } from '@/components/ui/button'
import { Waveform } from '@/components/ui/waveform'
import { Section } from '@/components/ui/section'
import { formatEventDate, upcomingEvents } from '@/content/events'
import { featuredWork, works } from '@/content/works'
import { leadQuote, formatPressDate } from '@/content/press'
import { festivalCount } from '@/content/awards'
import { bio, gurus } from '@/content/bio'
import { roopa } from '@/content/roopa'
import { gallery } from '@/content/gallery'

/*
 * The homepage is a trailer, not a summary.
 *
 * Each scene below says one thing and then hands off to the page that holds
 * the rest. Nothing here is the only place a fact appears, so no scene has to
 * be exhaustive and the page stays short enough to read in one sitting.
 */

/** Scene 1: the next date. The single most perishable thing on the site. */
export function SceneNextDate() {
  const next = upcomingEvents()[0]
  if (!next) return null

  return (
    <Section divider>
      <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
        <div>
          <Reveal>
            <p className="slate">Next on stage</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-6 text-monumental">{next.title}</h2>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mt-7 font-display text-recital text-ember-lit">
              {next.date ? (
                <time dateTime={next.date}>{formatEventDate(next.date)}</time>
              ) : null}
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <p className="mt-2 text-muted">
              {[next.time, next.venue, next.city].filter(Boolean).join(' · ')}
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.24}>
          <div className="flex flex-wrap gap-4">
            {next.ticketUrl ? (
              <ButtonLink href={next.ticketUrl}>{next.ticketLabel ?? 'Buy tickets'}</ButtonLink>
            ) : null}
            <ButtonLink href="/events/" variant="secondary">
              All events
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}

/** Scene 2: who he is, in the fewest words that are still specific. */
export function SceneStory() {
  return (
    <Section divider>
      <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-24">
        <ClipReveal>
          <Parallax distance={6}>
            <div className="overflow-hidden rounded-sm">
              <MediaImage
                img="gallery/achi-10"
                alt="Achi Bala playing violin on a New York street"
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="w-full"
              />
            </div>
          </Parallax>
        </ClipReveal>

        <div>
          <Reveal>
            <p className="slate">The artist</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-6 text-monumental">
              Trained in Chennai.
              <br />
              <span className="text-muted">Raised in Texas.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mt-8 max-w-xl text-lede text-muted">{bio.lineage[0]}</p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-6 text-sm text-faint">
              A disciple of {gurus[gurus.length - 1].name}, after years with{' '}
              {gurus[3].name}.
            </p>
          </Reveal>
          <Reveal delay={0.26}>
            <div className="mt-10">
              <ButtonLink href="/about/" variant="secondary">
                The full story
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  )
}

/** Scene 3: the film, as the one work that stands for the rest. */
export function SceneFilm() {
  const film = featuredWork

  return (
    <Section divider className="relative overflow-hidden">
      <div className="relative max-w-3xl">
        <Reveal>
          <p className="slate">The film</p>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="mt-6 text-colossal">{film.title}</h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mt-10 text-lede text-muted">{film.summary}</p>
        </Reveal>
      </div>

      <Reveal delay={0.2}>
        <Waveform seed={19} bars={140} className="mt-14 h-20 w-full text-ember/40 md:h-28" />
      </Reveal>

      {film.stats ? (
        <RevealList as="dl" className="relative mt-16 grid gap-px bg-rule-soft sm:grid-cols-3">
          {film.stats.map((s) => (
            <RevealItem as="div" key={s.label} className="bg-void p-10">
              <dt className="sr-only">{s.label}</dt>
              <dd>
                <span className="block font-display text-grand text-ember-lit tabular-nums">
                  {s.value}
                </span>
                <span className="mt-3 block text-xs tracking-slate text-faint uppercase">
                  {s.label}
                </span>
              </dd>
            </RevealItem>
          ))}
        </RevealList>
      ) : null}

      <Reveal delay={0.1}>
        <div className="relative mt-12 flex flex-wrap gap-4">
          <ButtonLink href={`/works/${film.slug}/`}>Explore the film</ButtonLink>
          <ButtonLink href="/works/" variant="secondary">
            All {works.length} works
          </ButtonLink>
        </div>
      </Reveal>
    </Section>
  )
}

/** Scene 4: proof, in one quote and one number. */
export function SceneProof() {
  return (
    <Section divider>
      <div className="grid gap-14 lg:grid-cols-[1.3fr_0.7fr] lg:gap-20">
        <figure>
          <Reveal>
            <p className="slate">Press</p>
          </Reveal>
          <Reveal delay={0.08}>
            <blockquote className="mt-8 font-display text-grand text-balance">
              &ldquo;{leadQuote.quote}&rdquo;
            </blockquote>
          </Reveal>
          <Reveal delay={0.16}>
            <figcaption className="mt-8 text-sm text-muted">
              {leadQuote.publication}
              {leadQuote.byline ? ` · ${leadQuote.byline}` : ''} ·{' '}
              {formatPressDate(leadQuote.date)}
            </figcaption>
          </Reveal>
        </figure>

        <div className="flex flex-col justify-end border-t border-rule-soft pt-8 lg:border-t-0 lg:border-l lg:border-l-rule-soft lg:pt-0 lg:pl-12">
          <Reveal>
            <p className="font-display text-colossal text-ember-lit tabular-nums">
              {festivalCount}
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-4 text-muted">
              festivals and competitions, including a Best Song win at the World Film Festival
              in Cannes.
            </p>
          </Reveal>
          <Reveal delay={0.16}>
            <Link href="/recognition/" className="bow-link mt-8 w-fit text-ember-lit">
              See the recognition &rarr;
            </Link>
          </Reveal>
        </div>
      </div>
    </Section>
  )
}

/** Scene 5: the school, which is a different audience arriving for a different reason. */
export function SceneTeaching() {
  return (
    <Section divider>
      <div className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-20">
        <div>
          <Reveal>
            <p className="slate">The school</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-6 text-monumental">{roopa.name}</h2>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mt-8 max-w-xl text-lede text-muted">
              Carnatic violin, vocal and music theory. In person in Austin and Houston, and
              online worldwide. Established in {roopa.established}, built on formal teaching
              since {roopa.teachingSince}.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-10">
              <ButtonLink href={roopa.path}>Lessons at Roopa Fine Arts</ButtonLink>
            </div>
          </Reveal>
        </div>

        <ClipReveal>
          <div className="overflow-hidden rounded-sm border border-rule">
            <MediaImage
              img="roopa-fine-arts/siddarth-giridharan-arangetram-2026"
              alt="Siddarth Giridharan's Arangetram flyer"
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="w-full"
            />
          </div>
        </ClipReveal>
      </div>
    </Section>
  )
}


/**
 * Scene 6: the photographs.
 *
 * The trailer was carrying only two images, which for a performer reads as a
 * CV rather than as a stage. This is a band of stills at their own
 * proportions, wiping in left to right on the site's axis, ending at the
 * gallery.
 */
export function SceneStills() {
  const stills = gallery.slice(0, 5)

  return (
    <Section divider>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <Reveal>
          <h2 className="text-monumental">On stage,<br />and on the street.</h2>
        </Reveal>
        <Reveal delay={0.1}>
          <ButtonLink href="/gallery/" variant="secondary">
            Open the gallery
          </ButtonLink>
        </Reveal>
      </div>

      {/*
       * Deliberately uneven: every other frame is dropped and widened so the
       * row reads as a contact sheet rather than a grid of equal boxes.
       */}
      <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-5 md:gap-5">
        {stills.map((img, i) => (
          <ClipReveal
            key={img.key}
            delay={i * 0.07}
            className={
              i % 2 === 1
                ? 'md:mt-14 overflow-hidden rounded-sm'
                : 'overflow-hidden rounded-sm'
            }
          >
            <MediaImage
              img={img.key}
              alt={img.alt}
              sizes="(min-width: 768px) 19vw, 45vw"
              className="aspect-[3/4] w-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(.16,1,.3,1)] hover:scale-[1.05]"
            />
          </ClipReveal>
        ))}
      </div>
    </Section>
  )
}

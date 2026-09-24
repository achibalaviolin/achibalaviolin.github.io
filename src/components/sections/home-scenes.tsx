import Link from 'next/link'
import { Reveal, RevealItem, RevealList } from '@/components/animations/reveal'
import { ClipReveal, Parallax } from '@/components/animations/parallax'
import { Layer } from '@/components/animations/depth'
import { ScrollWords } from '@/components/animations/scroll-words'
import { MediaImage } from '@/components/ui/media-image'
import { ButtonLink } from '@/components/ui/button'
import { Section } from '@/components/ui/section'
import { upcomingEvents } from '@/content/events'
import { featuredWork, works } from '@/content/works'
import { leadQuote, formatPressDate } from '@/content/press'
import { additionalRecognition, awards, festivalCount } from '@/content/awards'
import { bio, gurus } from '@/content/bio'
import { roopa } from '@/content/roopa'
import { gallery } from '@/content/gallery'
import { featuredVideo, watchUrl } from '@/content/videos'
import { VideoFacade } from '@/components/ui/video-facade'
import { socialFeed, socials } from '@/content/site'

/*
 * The homepage is a trailer, not a summary.
 *
 * Each scene below says one thing and then hands off to the page that holds
 * the rest. Nothing here is the only place a fact appears, so no scene has to
 * be exhaustive and the page stays short enough to read in one sitting.
 */

/**
 * Scene 1: the next date, the single most perishable thing on the site.
 *
 * Laid out like the Roopa Arts featured event: the date is the loudest thing
 * on the screen, the flyer sits beside it, and buying a ticket is the only
 * primary action. "All upcoming events" is a slim strip, not a second button.
 */
export function SceneNextDate() {
  const upcoming = upcomingEvents()
  const next = upcoming[0]
  if (!next?.date) return null

  const when = new Date(`${next.date}T00:00:00Z`)
  const monthDay = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(when)
  // Built by hand: Intl puts the year first when given only weekday and year.
  const weekdayYear = `${new Intl.DateTimeFormat('en-US', { weekday: 'long', timeZone: 'UTC' }).format(when)} · ${when.getUTCFullYear()}`
  const where = [next.time, next.venue, next.city].filter(Boolean).join(' · ')
  const flyerHref = next.ticketUrl ?? '/events/'

  return (
    <Section divider>
      <Reveal>
        <p className="slate">Next on stage</p>
      </Reveal>

      <div
        className={`mt-10 grid gap-14 lg:items-center lg:gap-24 ${next.image ? 'lg:grid-cols-[1.15fr_1fr]' : ''}`}
      >
        <div>
          <time dateTime={next.date} className="block">
            <ScrollWords
              as="span"
              text={monthDay}
              className="block font-display text-monumental text-ember"
              from={0.12}
            />
            <Reveal delay={0.1}>
              <span className="slate mt-5 block text-muted">{weekdayYear}</span>
            </Reveal>
          </time>

          <Reveal delay={0.08}>
            <h2 className="mt-10 text-grand">{next.title}</h2>
          </Reveal>
          {where ? (
            <Reveal delay={0.12}>
              <p className="mt-4 text-muted">{where}</p>
            </Reveal>
          ) : null}
          <Reveal delay={0.16}>
            <p className="mt-8 max-w-lg text-lede text-muted">{next.description}</p>
          </Reveal>

          <Reveal delay={0.22}>
            <div className="mt-12">
              {next.ticketUrl ? (
                <ButtonLink href={next.ticketUrl}>
                  {next.ticketLabel ?? 'Buy tickets'}
                  <span className="sr-only"> for {next.title}</span>
                  <span aria-hidden="true">→</span>
                </ButtonLink>
              ) : (
                <ButtonLink href="/events/">Event details</ButtonLink>
              )}
            </div>
          </Reveal>
        </div>

        {next.image ? (
          <ClipReveal>
            <a
              href={flyerHref}
              {...(flyerHref.startsWith('http')
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {})}
              className="group block overflow-hidden rounded-sm border border-rule bg-raised"
            >
              <MediaImage
                img={next.image}
                alt={next.imageAlt ?? `Flyer for ${next.title}`}
                sizes="(min-width: 1024px) 42vw, 100vw"
                className="w-full object-contain"
              />
            </a>
          </ClipReveal>
        ) : null}
      </div>

      {/* Slim secondary strip, not a second primary action. */}
      <Reveal>
        <Link
          href="/events/"
          className="group mt-20 flex items-center justify-between border-t border-rule pt-7 text-muted transition-colors hover:text-ember"
        >
          <span className="slate text-current">
            {upcoming.length > 1
              ? `All ${upcoming.length} upcoming events`
              : 'All events, past and upcoming'}
          </span>
          <span
            aria-hidden="true"
            className="transition-transform duration-500 ease-out-expo group-hover:translate-x-2"
          >
            →
          </span>
        </Link>
      </Reveal>
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
          <ScrollWords text={bio.lineage[0]} className="mt-8 max-w-xl text-lede text-ink" />
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

/**
 * The six soundscapes the film moves through, in order. Transcribed from the
 * film's description in content/works.ts.
 */
const soundscapes = ['Orchestral', 'Jazz', 'Rock', 'Lo-fi', 'Carnatic', 'Dappankuthu']

/**
 * Scene 3: the film, as the one work that stands for the rest.
 *
 * The one dark band on the site: the house lights go down for the screening.
 * The video plays right here rather than sending people to YouTube, and the
 * festival record sits under it as the reason to press play.
 */
export function SceneFilm() {
  const film = featuredWork
  const video = featuredVideo
  const honours = [
    ...awards
      .filter((a) => a.work === film.title && a.id !== 'waltz-laurel-poster')
      .map((a) => ({ festival: a.festival, category: a.category })),
    ...additionalRecognition.filter((a) => a.work === film.title),
  ]
  const director = film.credits?.find((c) => c.role === 'Director')?.names[0]

  return (
    <section className="relative overflow-hidden bg-ink py-24 text-paper md:py-32 lg:py-40">
      <div className="wrap">
        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-4xl">
            <Reveal>
              <p className="slate text-ember-soft">
                The film · {film.year} · {honours.length} festival honours
              </p>
            </Reveal>
            <ScrollWords as="h2" text={film.title} className="mt-6 text-colossal" from={0.1} />
          </div>
          <ScrollWords
            text={film.summary}
            className="max-w-sm text-paper/80 lg:mb-4"
            from={0.1}
          />
        </div>

        <Reveal delay={0.1}>
          <VideoFacade
            id={video.id}
            title={video.title}
            poster={video.poster}
            posterAlt={video.alt}
            sizes="(min-width: 1344px) 84rem, 100vw"
            className="mt-14 aspect-video w-full shadow-[0_40px_120px_-40px_rgba(202,58,18,.55)] ring-1 ring-paper/10"
            dark
          />
        </Reveal>

        <Reveal delay={0.12}>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-sm text-paper/70">
            <p>
              Official music video
              {director ? <> · Directed by {director}</> : null}
            </p>
            <a
              href={watchUrl(video.id)}
              target="_blank"
              rel="noopener noreferrer"
              className="bow-link text-paper"
            >
              Watch on YouTube <span aria-hidden="true">↗</span>
            </a>
          </div>
        </Reveal>

        {/* The soundscapes, as a strip the film travels along. */}
        <RevealList as="ol" className="mt-20 grid grid-cols-2 gap-px bg-paper/10 sm:grid-cols-3 lg:grid-cols-6">
          {soundscapes.map((name, i) => (
            <RevealItem
              as="li"
              key={name}
              className="group bg-ink p-6 transition-colors duration-500 hover:bg-ember-press"
            >
              <span className="slate block text-paper/60 group-hover:text-paper">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="mt-3 block font-display text-recital">{name}</span>
            </RevealItem>
          ))}
        </RevealList>

        <div className="mt-20 grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          {film.stats ? (
            <RevealList as="dl" className="grid grid-cols-3 gap-6 self-start">
              {film.stats.map((s) => (
                <RevealItem as="div" key={s.label}>
                  <dt className="sr-only">{s.label}</dt>
                  <dd>
                    <span className="block font-display text-grand text-ember-soft tabular-nums">
                      {s.value}
                    </span>
                    <span className="mt-3 block text-xs tracking-slate text-paper/60 uppercase">
                      {s.label}
                    </span>
                  </dd>
                </RevealItem>
              ))}
            </RevealList>
          ) : null}

          <div>
            <Reveal>
              <h3 className="slate text-ember-soft">On the festival circuit</h3>
            </Reveal>
            <RevealList as="ul" className="mt-6 border-t border-paper/15">
              {honours.map((h) => (
                <RevealItem
                  as="li"
                  key={`${h.festival}-${h.category}`}
                  className="flex flex-col gap-1 border-b border-paper/15 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
                >
                  <span className="font-display text-xl">{h.category}</span>
                  <span className="text-sm text-paper/60 sm:text-right">{h.festival}</span>
                </RevealItem>
              ))}
            </RevealList>
          </div>
        </div>

        <Reveal delay={0.1}>
          <div className="mt-16 flex flex-wrap items-center gap-x-10 gap-y-6">
            <ButtonLink href={`/works/${film.slug}/`}>Explore the film</ButtonLink>
            <Link href="/works/" className="bow-link text-sm text-paper/80 hover:text-paper">
              All {works.length} works <span aria-hidden="true">→</span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
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
            <p className="font-display text-colossal text-ember tabular-nums">
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
            <Link href="/recognition/" className="bow-link mt-8 w-fit text-ember">
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
          <ScrollWords as="h2" text={roopa.name} className="mt-6 text-monumental" />
          <ScrollWords
            text={`Carnatic violin, vocal and music theory. In person in Austin and Houston, and online worldwide. Established in ${roopa.established}, built on formal teaching since ${roopa.teachingSince}.`}
            className="mt-8 max-w-xl text-lede text-ink"
          />
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
          <Layer key={img.key} depth={i % 2 === 1 ? 0.85 : 0.25}>
          <ClipReveal
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
          </Layer>
        ))}
      </div>
    </Section>
  )
}

/**
 * Scene 7: the live feed. New dates and releases go out on social before
 * they reach this site, so this is where they land first.
 *
 * A real embed, not a link out: Facebook's Page Plugin renders the actual
 * timeline and keeps itself current. See `socialFeed` in content/site.ts.
 *
 * Deliberately not sandboxed: with `sandbox` the plugin renders its header
 * and then spins forever, because an opaque origin denies it the storage it
 * needs. The cost is that the frame can set its own cookies.
 */
export function SceneSocial() {
  const params = new URLSearchParams({
    href: socialFeed.facebookPage,
    tabs: 'timeline',
    width: '500',
    height: String(socialFeed.height),
    small_header: 'false',
    adapt_container_width: 'true',
    hide_cover: 'false',
    show_facepile: 'true',
  })
  const src = socialFeed.embedUrl ?? `https://www.facebook.com/plugins/page.php?${params}`

  return (
    <Section divider className="bg-mist/40">
      <div className="grid gap-14 lg:grid-cols-2 lg:items-center lg:gap-20">
        <div>
          <Reveal>
            <p className="slate">Follow along</p>
          </Reveal>
          <ScrollWords
            as="h2"
            text="Announcements land here first."
            className="mt-6 max-w-xl text-grand"
          />
          <ScrollWords
            text="New concerts, releases and collaborations go out on social before they reach this site. This is the live feed."
            className="mt-7 max-w-md text-lede text-ink"
          />
          <Reveal delay={0.2}>
            <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bow-link slate text-ember"
                  >
                    {s.label} <span aria-hidden="true">→</span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="mx-auto w-full max-w-[500px] overflow-hidden rounded-sm border border-rule bg-raised">
            <iframe
              src={src}
              title={socialFeed.label}
              height={socialFeed.height}
              loading="lazy"
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              allowFullScreen
              className="block w-full border-0"
            />
          </div>
        </Reveal>
      </div>
    </Section>
  )
}

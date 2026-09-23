import { Reveal, RevealItem, RevealList } from '@/components/animations/reveal'
import { Section, SectionHead } from '@/components/ui/section'
import { SpotifyFacade } from '@/components/ui/spotify-facade'
import { VideoFacade } from '@/components/ui/video-facade'
import { socials } from '@/content/site'
import { videos } from '@/content/videos'

/**
 * Listen & watch.
 *
 * Every video now carries its real YouTube title and collaborators — four of
 * the six were unlabelled thumbnails on the previous site. Both the Spotify
 * player and the videos sit behind facades, so this section costs almost
 * nothing until someone presses play.
 */
export function Listen() {
  const [lead, ...rest] = videos

  return (
    <Section id="listen" divider>
      <SectionHead eyebrow="Listen & watch" title="Music for screen, stage, and stream.">
        Stream the records on Spotify, or step into the video archive.
      </SectionHead>

      <div className="mt-16 grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-14">
        <div>
          <Reveal>
            <VideoFacade
              id={lead.id}
              title={lead.title}
              poster={lead.poster}
              posterAlt={lead.alt}
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="aspect-video w-full"
            />
          </Reveal>
          <Reveal delay={0.08}>
            <h3 className="mt-5 font-display text-h3">{lead.short}</h3>
            {lead.credit ? <p className="mt-1 text-sm text-muted">{lead.credit}</p> : null}
          </Reveal>
        </div>

        <Reveal delay={0.12}>
          <SpotifyFacade />
        </Reveal>
      </div>

      <RevealList className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {rest.map((v) => (
          <RevealItem key={v.id}>
            <VideoFacade
              id={v.id}
              title={v.title}
              poster={v.poster}
              posterAlt={v.alt}
              sizes="(min-width: 1024px) 24vw, (min-width: 640px) 45vw, 100vw"
              className="aspect-video w-full"
            />
            <h3 className="mt-4 font-display text-base">{v.short}</h3>
            {v.credit ? <p className="mt-1 text-xs text-faint">{v.credit}</p> : null}
          </RevealItem>
        ))}
      </RevealList>

      <RevealList as="ul" className="mt-16 flex flex-wrap gap-x-10 gap-y-4 border-t border-rule-soft pt-8">
        {socials.map((s) => (
          <RevealItem as="li" key={s.label}>
            <a
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-baseline gap-3"
            >
              <span className="bow-link font-display text-lg group-hover:text-gold-bright">
                {s.label}
              </span>
              <span className="text-xs text-faint">{s.handle}</span>
            </a>
          </RevealItem>
        ))}
      </RevealList>
    </Section>
  )
}

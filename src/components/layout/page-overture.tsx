import Link from 'next/link'
import type { ReactNode } from 'react'
import { MediaImage } from '@/components/ui/media-image'
import { Waveform } from '@/components/ui/waveform'
import { SplitText } from '@/components/animations/split-text'
import { Reveal } from '@/components/animations/reveal'
import type { MediaKey } from '@/content/generated/media'

/**
 * The opening of every inner page.
 *
 * The composition is a title card: a slate line, the title set large, and a
 * waveform running the full width beneath it, over a letterboxed still.
 * Type sits on the page rather than beside a framed portrait, because the
 * headline is the loudest thing here and does not need an ornament competing
 * with it from the right.
 *
 * Shorter than the home hero. These pages have content to get to.
 */
export function PageOverture({
  slate,
  title,
  lede,
  image,
  breadcrumb,
  children,
}: {
  slate: string
  /** Each string is one line, so the break is deliberate rather than reflowed. */
  title: string[]
  lede?: ReactNode
  image?: MediaKey
  breadcrumb?: { label: string; href: string }
  children?: ReactNode
}) {
  return (
    <header className="relative isolate overflow-hidden pt-32 pb-16 md:pt-44 md:pb-20">
      {image ? (
        <>
          <div aria-hidden="true" className="absolute inset-0 -z-10">
            <MediaImage
              img={image}
              alt=""
              sizes="100vw"
              priority
              fill
              className="h-full w-full object-cover"
            />
          </div>
          {/*
           * Ivory type over a photograph is unreadable wherever the image
           * goes pale, so the page colour is carried across it. Heavier at
           * the foot, where the waveform and the lede sit.
           */}
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-gradient-to-t from-void via-void/92 to-void/70"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-gradient-to-r from-void via-void/75 to-void/45"
          />
        </>
      ) : null}

      <div className="wrap">
        {breadcrumb ? (
          <nav aria-label="Breadcrumb" className="mb-10 font-mono text-xs text-faint">
            <Link href={breadcrumb.href} className="bow-link hover:text-ivory">
              {breadcrumb.label}
            </Link>
          </nav>
        ) : null}

        <Reveal>
          <p className="slate">{slate}</p>
        </Reveal>

        <SplitText
          as="h1"
          lines={title}
          className="mt-8 max-w-5xl font-display text-monumental"
          delay={0.1}
        />

        {lede ? (
          <Reveal delay={0.35}>
            <div className="mt-9 max-w-xl text-lede text-muted">{lede}</div>
          </Reveal>
        ) : null}

        {children ? <Reveal delay={0.45}>{children}</Reveal> : null}
      </div>

      {/* The mark: a wave running the full width, under everything. */}
      <Reveal delay={0.5}>
        <Waveform
          seed={title.join('').length + title[0].charCodeAt(0)}
          bars={120}
          intensity={0.55}
          className="mt-16 h-14 w-full text-ember/45 md:mt-20 md:h-20"
        />
      </Reveal>
    </header>
  )
}

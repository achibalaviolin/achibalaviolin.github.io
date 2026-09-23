import Link from 'next/link'
import type { ReactNode } from 'react'
import { MediaImage } from '@/components/ui/media-image'
import { Soundhole } from '@/components/ui/soundhole'
import { SplitText } from '@/components/animations/split-text'
import { Reveal } from '@/components/animations/reveal'
import type { MediaKey } from '@/content/generated/media'

/**
 * The opening of every inner page.
 *
 * Same parts in the same places on all nine routes: rubric, display headline
 * on a narrow measure, lede, and the page's photograph in the bout frame with
 * the soundhole turning behind it. That repetition is what makes the site feel
 * like one place rather than a stack of templates.
 *
 * Shorter than the home hero's full viewport. These pages have content to get
 * to, and a screen-height header on every route buries it.
 */
export function PageOverture({
  rubric,
  title,
  lede,
  image,
  imageAlt,
  breadcrumb,
  children,
}: {
  rubric: string
  /** Each string is one line, so the break is deliberate rather than reflowed. */
  title: string[]
  lede?: ReactNode
  image?: MediaKey
  imageAlt?: string
  breadcrumb?: { label: string; href: string }
  children?: ReactNode
}) {
  return (
    <header className="relative isolate flex min-h-[72svh] items-center overflow-hidden pt-32 pb-20 md:min-h-[80svh] md:pt-40">
      {image ? (
        <>
          {/*
           * Ring and portrait share one positioned box so they stay
           * concentric. Sized off the same box as well, so the ring always
           * reads as the instrument's soundhole behind the body rather than
           * drifting to one side of it.
           */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 z-[1] flex w-full items-center justify-center opacity-25 lg:w-[48%] lg:opacity-100"
          >
            <div className="relative flex aspect-square h-[76%] items-center justify-center">
              <Soundhole className="absolute inset-0 h-full w-full text-gold/45" />
              <div className="bout gpu relative h-[82%] w-[72%]">
                <MediaImage
                  img={image}
                  alt=""
                  sizes="(min-width: 1024px) 36vw, 70vw"
                  priority
                  fill
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>

          {/*
           * Ivory type over a photograph is unreadable wherever the image goes
           * pale, so the page colour is carried under the text and faded out
           * to the right. Painted above the image and below the type.
           */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-r from-void via-void/92 to-void/40 lg:via-void/80 lg:to-transparent"
          />
        </>
      ) : null}

      <div className="wrap relative z-10">
        {breadcrumb ? (
          <nav aria-label="Breadcrumb" className="mb-10 text-sm text-faint">
            <Link href={breadcrumb.href} className="bow-link hover:text-ivory">
              {breadcrumb.label}
            </Link>
          </nav>
        ) : null}

        <Reveal>
          <p className="rubric">{rubric}</p>
        </Reveal>

        <SplitText
          as="h1"
          lines={title}
          className="mt-7 max-w-4xl font-display text-monumental"
          delay={0.1}
        />

        {lede ? (
          <Reveal delay={0.35}>
            <div className="mt-8 max-w-xl text-lede text-muted">{lede}</div>
          </Reveal>
        ) : null}

        {children ? <Reveal delay={0.45}>{children}</Reveal> : null}
      </div>
    </header>
  )
}

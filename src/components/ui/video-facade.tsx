'use client'

import { useState } from 'react'
import { MediaImage } from './media-image'
import type { MediaKey } from '@/content/generated/media'
import { embedUrl } from '@/content/videos'

/**
 * A click-to-play poster that only mounts the YouTube iframe once asked.
 *
 * A cold YouTube embed costs well over a megabyte and several hundred
 * milliseconds of main-thread time before anyone presses play, which is the
 * single biggest thing standing between this page and a good mobile score.
 *
 * It is a real `<button>`, so it is keyboard-reachable and announces itself.
 */
export function VideoFacade({
  id,
  title,
  poster,
  posterAlt,
  className,
  sizes = '(min-width: 1024px) 50vw, 100vw',
  dark = false,
}: {
  id: string
  title: string
  poster: MediaKey
  posterAlt: string
  className?: string
  sizes?: string
  /** For a poster sitting on a dark band: shade to ink, not to paper. */
  dark?: boolean
}) {
  const [playing, setPlaying] = useState(false)

  return (
    <div
      className={`group relative isolate overflow-hidden rounded-xl bg-shade ${className ?? ''}`}
    >
      {playing ? (
        <iframe
          src={embedUrl(id)}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          data-cursor="play"
          className="absolute inset-0 h-full w-full cursor-pointer"
          aria-label={`Play video: ${title}`}
        >
          <MediaImage
            img={poster}
            alt={posterAlt}
            sizes={sizes}
            fill
            className="h-full w-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.04]"
          />
          <span
            aria-hidden="true"
            className={`absolute inset-0 bg-gradient-to-t ${dark ? 'from-ink/70 via-ink/10' : 'from-paper/85 via-paper/20'} to-transparent`}
          />
          <span
            aria-hidden="true"
            className={`absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full backdrop-blur-sm transition-all ${dark ? 'h-20 w-20 border border-paper/70 bg-ink/35 text-paper md:h-24 md:w-24' : 'h-16 w-16 border border-ember/60 bg-paper/55'} duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-110 group-hover:border-ember group-hover:bg-ember group-hover:text-paper`}
          >
            <svg viewBox="0 0 24 24" className="ml-0.5 h-5 w-5 fill-current">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  )
}

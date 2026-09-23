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
}: {
  id: string
  title: string
  poster: MediaKey
  posterAlt: string
  className?: string
  sizes?: string
}) {
  const [playing, setPlaying] = useState(false)

  return (
    <div
      className={`group relative isolate overflow-hidden rounded-xl bg-surface-2 ${className ?? ''}`}
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
            className="absolute inset-0 bg-gradient-to-t from-void/85 via-void/20 to-transparent"
          />
          <span
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gold/60 bg-void/55 backdrop-blur-sm transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-110 group-hover:border-gold group-hover:bg-gold group-hover:text-void"
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

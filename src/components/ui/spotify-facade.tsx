'use client'

import { useState } from 'react'
import { spotifyArtistId } from '@/content/site'

/**
 * Click-to-load Spotify player.
 *
 * Same reasoning as the video facade: the embed is heavy and almost nobody
 * presses play. The fallback link out to Spotify is always rendered, so the
 * music is reachable even if the iframe is blocked by an extension — the
 * previous site had to add that link manually for the same reason.
 */
export function SpotifyFacade({ className }: { className?: string }) {
  const [loaded, setLoaded] = useState(false)
  const artistUrl = `https://open.spotify.com/artist/${spotifyArtistId}`

  return (
    <div className={className}>
      <div className="relative overflow-hidden rounded-xl border border-rule bg-surface-2">
        {loaded ? (
          <iframe
            src={`https://open.spotify.com/embed/artist/${spotifyArtistId}?utm_source=generator&theme=0`}
            title="Achi Bala Violin on Spotify"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="h-[22rem] w-full border-0"
          />
        ) : (
          <button
            type="button"
            onClick={() => setLoaded(true)}
            className="flex h-[22rem] w-full cursor-pointer flex-col items-center justify-center gap-5 px-6 text-center transition-colors duration-500 hover:bg-surface-3"
            aria-label="Load the Spotify player for Achi Bala Violin"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full border border-gold/50 text-gold transition-colors duration-500 group-hover:bg-gold">
              <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden="true">
                <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.586 14.424a.623.623 0 0 1-.857.207c-2.348-1.435-5.304-1.76-8.785-.964a.623.623 0 1 1-.277-1.215c3.809-.871 7.077-.496 9.712 1.115.293.18.386.563.207.857Zm1.223-2.722a.78.78 0 0 1-1.072.257c-2.687-1.652-6.785-2.131-9.965-1.166a.78.78 0 1 1-.452-1.492c3.632-1.102 8.147-.568 11.232 1.329a.78.78 0 0 1 .257 1.072Zm.105-2.835c-3.223-1.914-8.54-2.09-11.617-1.156a.935.935 0 1 1-.542-1.79c3.532-1.072 9.404-.865 13.115 1.338a.935.935 0 1 1-.956 1.608Z" />
              </svg>
            </span>
            <span>
              <span className="block font-display text-h3">Play the records</span>
              <span className="mt-1.5 block text-sm text-muted">
                Load the Spotify player
              </span>
            </span>
          </button>
        )}
      </div>

      <a
        href={artistUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="bow-link mt-4 inline-block text-sm text-muted hover:text-gold-bright"
      >
        Open in Spotify
      </a>
    </div>
  )
}

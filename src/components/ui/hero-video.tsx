'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '@/components/animations/use-reduced-motion'
import { heroVideo } from '@/content/site'

/**
 * The hero's moving panel.
 *
 * Framed rather than full-bleed. The footage is near-black and the page is
 * white, so behind the headline it would need light type over it and would
 * invert the whole page; in a frame it reads as a screen on a white wall,
 * which is the register the rest of the site is already in.
 *
 * It starts from the poster, so first paint is a 50KB image rather than a
 * 1.9MB download, and the video is only fetched once the element is actually
 * on screen. No audio track exists in the file at all.
 *
 * It does not play if the visitor asked for less motion or has Save-Data on.
 * In those cases the poster is the hero, which is a still from the same
 * footage and loses nothing.
 */
export function HeroVideo({ className }: { className?: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  const reduced = useReducedMotion()
  const [play, setPlay] = useState(false)

  const src = `/video/hero-${heroVideo.framing}.mp4`
  const poster = `/video/hero-${heroVideo.framing}-poster.webp`

  useEffect(() => {
    if (reduced) return

    // `saveData` is not in the standard Navigator type.
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } })
      .connection
    if (conn?.saveData) return

    const el = ref.current
    if (!el) return

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPlay(true)
          io.disconnect()
        }
      },
      { rootMargin: '200px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [reduced])

  /* Pause while the tab is hidden; a looping background need not run there. */
  useEffect(() => {
    if (!play) return
    const el = ref.current
    if (!el) return
    const onVis = () => {
      if (document.visibilityState === 'hidden') el.pause()
      else void el.play().catch(() => {})
    }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [play])

  return (
    <video
      ref={ref}
      className={className}
      poster={poster}
      /* Metadata only until it is worth more. */
      preload="none"
      muted
      loop
      playsInline
      autoPlay={play}
      // A decorative loop with no narrative content and no audio.
      aria-hidden="true"
      tabIndex={-1}
      {...(play ? { src } : {})}
    />
  )
}

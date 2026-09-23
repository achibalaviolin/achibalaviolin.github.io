'use client'

import { useMotionValue, type MotionValue } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '@/components/animations/use-reduced-motion'

/**
 * The hero's moving frame, and the clock the headline animates against.
 *
 * The footage is shot on white, so it sits full-bleed behind the type rather
 * than in a panel: the subject is in the right of frame and the left half is
 * empty wall, which is where the headline goes.
 *
 * `time` is a MotionValue carrying playback position in seconds. It is driven
 * from `requestVideoFrameCallback` where that exists, so the headline sweep is
 * locked to actual presented frames rather than to a timer that drifts against
 * them. A MotionValue rather than state, because this updates 24 times a
 * second and must not re-render React.
 *
 * Poster first, fetched only once on screen, paused when the tab is hidden,
 * and not played at all under reduced motion or Save-Data.
 */

type WithRVFC = HTMLVideoElement & {
  requestVideoFrameCallback?: (cb: (now: number, meta: { mediaTime: number }) => void) => number
  cancelVideoFrameCallback?: (handle: number) => void
}

export function useHeroVideo() {
  return useMotionValue(0)
}

/** Remembers the visitor's sound choice between visits. */
const SOUND_KEY = 'abv:hero-sound'

/**
 * Sound state for the hero, persisted.
 *
 * Always starts `false` on the server and on first paint, whatever was
 * stored: the video cannot autoplay unmuted anyway, and reading storage
 * during render would mismatch hydration.
 */
export function useHeroSound() {
  const [on, setOn] = useState(false)

  useEffect(() => {
    try {
      if (localStorage.getItem(SOUND_KEY) === 'on') setOn(true)
    } catch {
      /* Private mode, or storage disabled. The default stands. */
    }
  }, [])

  const toggle = () => {
    setOn((v) => {
      const next = !v
      try {
        localStorage.setItem(SOUND_KEY, next ? 'on' : 'off')
      } catch {
        /* Not fatal; the choice just is not remembered. */
      }
      return next
    })
  }

  return { on, toggle }
}

export function HeroVideo({
  className,
  time,
  poster = '/video/hero-white-poster.webp',
  src = '/video/hero-white.mp4',
  soundOn = false,
}: {
  className?: string
  time?: MotionValue<number>
  poster?: string
  src?: string
  /** Sound is off until the visitor asks for it; see SoundToggle. */
  soundOn?: boolean
}) {
  const ref = useRef<HTMLVideoElement>(null)
  const reduced = useReducedMotion()
  const [play, setPlay] = useState(false)

  useEffect(() => {
    if (reduced) return

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

  /* Publish playback position for anything animating against the footage. */
  useEffect(() => {
    if (!play || !time) return
    const el = ref.current as WithRVFC | null
    if (!el) return

    let handle = 0
    let raf = 0

    if (typeof el.requestVideoFrameCallback === 'function') {
      const onFrame = (_now: number, meta: { mediaTime: number }) => {
        time.set(meta.mediaTime)
        handle = el.requestVideoFrameCallback!(onFrame)
      }
      handle = el.requestVideoFrameCallback(onFrame)
    } else {
      // Safari below 15.4 and older Firefox: a rAF loop reading currentTime.
      const tick = () => {
        time.set(el.currentTime)
        raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }

    return () => {
      if (handle && el.cancelVideoFrameCallback) el.cancelVideoFrameCallback(handle)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [play, time])

  /*
   * Mute is a property, not an attribute, so React's `muted` prop does not
   * reliably reach the element after the first render. Set it directly, and
   * nudge playback: some browsers pause on an unmute that they consider
   * unsanctioned, and the call is inside the click that asked for it.
   */
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.muted = !soundOn
    if (soundOn && el.paused) void el.play().catch(() => {})
  }, [soundOn, play])

  /* A looping background need not run in a hidden tab. */
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
      preload="none"
      /* Must start muted or the browser refuses to autoplay at all. */
      muted
      loop
      playsInline
      autoPlay={play}
      aria-hidden="true"
      tabIndex={-1}
      {...(play ? { src } : {})}
    />
  )
}

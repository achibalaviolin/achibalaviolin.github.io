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
  videoRef,
}: {
  className?: string
  time?: MotionValue<number>
  poster?: string
  src?: string
  /** Sound is off until the visitor asks for it. */
  soundOn?: boolean
  /** Lets the hero reach the element, for the audio analyser. */
  videoRef?: React.RefObject<HTMLVideoElement | null>
}) {
  const own = useRef<HTMLVideoElement>(null)
  const ref = videoRef ?? own
  const reduced = useReducedMotion()
  const [play, setPlay] = useState(false)
  const [onScreen, setOnScreen] = useState(true)

  useEffect(() => {
    if (reduced) return

    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } })
      .connection
    if (conn?.saveData) return

    const el = ref.current
    if (!el) return

    /*
     * Playback follows visibility both ways.
     *
     * Starting on first sight is a load optimisation; STOPPING when the video
     * leaves is about the sound. Once someone turns audio on and scrolls to
     * the events list, music from a hero they can no longer see is just noise
     * coming from nowhere, and their only way to stop it is to scroll back up
     * and find the control. So the observer is kept rather than disconnected,
     * and the video pauses on its way out and resumes on its way back.
     */
    const io = new IntersectionObserver(
      ([entry]) => {
        setOnScreen(entry.isIntersecting)
        if (entry.isIntersecting) setPlay(true)
      },
      // Generous enough that it does not flicker at the boundary, tight
      // enough that the sound is gone by the time the hero is.
      { rootMargin: '0px', threshold: 0.12 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [reduced])

  /*
   * Pause on the way out, resume on the way back.
   *
   * A refused `play()` is not the end of it. iOS in Low Power Mode refuses
   * muted autoplay outright, and all the visitor sees is the poster, which
   * reads as a video that is broken. A tap is a user gesture every browser
   * honours, so the first one anywhere on the page starts it.
   */
  useEffect(() => {
    if (!play) return
    const el = ref.current
    if (!el) return
    if (!onScreen) {
      el.pause()
      return
    }

    const retry = () => {
      void el.play().catch(() => {})
    }
    const events = ['touchend', 'click'] as const
    let armed = false
    el.play().catch(() => {
      armed = true
      for (const e of events) document.addEventListener(e, retry, { once: true, passive: true })
    })
    return () => {
      if (armed) for (const e of events) document.removeEventListener(e, retry)
    }
  }, [onScreen, play])

  /*
   * Asking for sound is asking for the video. Without this, a visitor with
   * Data Saver on (where the footage is never loaded) could press the sound
   * control and get nothing at all.
   */
  useEffect(() => {
    if (soundOn) setPlay(true)
  }, [soundOn])

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
      // Only resume if the hero is actually on screen; otherwise returning to
      // the tab would restart audio for a video that is scrolled past.
      else if (onScreen) void el.play().catch(() => {})
    }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [play, onScreen])

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

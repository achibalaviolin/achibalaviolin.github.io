'use client'

import { useCallback, useEffect, useRef, type RefObject } from 'react'

/**
 * Frequency levels from the hero video's own audio.
 *
 * Lets the waveform be driven by the music instead of by a seeded shape, so
 * the bars are the track rather than a decoration that resembles one.
 *
 * Three things about the Web Audio graph are worth knowing here:
 *
 *  1. `createMediaElementSource` may be called ONCE per element, ever. Calling
 *     it twice throws and takes the audio with it, so the node is cached on
 *     the element itself and survives re-renders and effect re-runs.
 *  2. Once an element is routed into a graph, its sound only comes out if the
 *     graph reaches `destination`. Connecting the analyser alone gives a
 *     working visualiser and silence.
 *  3. An `AudioContext` starts suspended unless it is created inside a user
 *     gesture, which is why this only runs once sound has been asked for.
 *
 * Returns a getter rather than state: this is read every frame and must not
 * re-render React.
 */

type Wired = HTMLVideoElement & {
  __abvSource?: MediaElementAudioSourceNode
  __abvContext?: AudioContext
}

export function useAudioLevels(
  ref: RefObject<HTMLVideoElement | null>,
  enabled: boolean
) {
  const analyserRef = useRef<AnalyserNode | null>(null)
  const dataRef = useRef<Uint8Array | null>(null)

  useEffect(() => {
    if (!enabled) return
    const el = ref.current as Wired | null
    if (!el) return

    let cancelled = false

    try {
      const Ctx =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext
      if (!Ctx) return

      const ctx = el.__abvContext ?? new Ctx()
      el.__abvContext = ctx

      const source = el.__abvSource ?? ctx.createMediaElementSource(el)
      el.__abvSource = source

      const analyser = ctx.createAnalyser()
      // Small FFT: this drives ~90 bars, not a spectrogram, and a big window
      // makes the bars sluggish.
      analyser.fftSize = 256
      analyser.smoothingTimeConstant = 0.72

      source.connect(analyser)
      // And on to the speakers, or routing the element kills its sound.
      analyser.connect(ctx.destination)

      if (ctx.state === 'suspended') void ctx.resume()

      if (!cancelled) {
        analyserRef.current = analyser
        dataRef.current = new Uint8Array(analyser.frequencyBinCount)
      }
    } catch {
      /* No Web Audio, or the element is cross-origin. The seeded wave stands. */
    }

    return () => {
      cancelled = true
      analyserRef.current?.disconnect()
      analyserRef.current = null
    }
  }, [enabled, ref])

  /**
   * Current levels as `count` values in 0..1, low frequencies first.
   * Returns null when there is nothing to read, and the caller falls back.
   */
  return useCallback(
    (count: number): number[] | null => {
      const analyser = analyserRef.current
      const data = dataRef.current
      if (!analyser || !data) return null

      analyser.getByteFrequencyData(data as Uint8Array<ArrayBuffer>)

      /*
       * The useful energy sits in the lower half of the bins, so only that is
       * spread across the bars: mapping the whole range leaves most of the
       * wave flat. Each bar averages the bins it covers rather than sampling
       * one, which stops it flickering between neighbours.
       */
      const usable = Math.floor(data.length * 0.62)
      const per = usable / count
      const out: number[] = []

      for (let i = 0; i < count; i++) {
        const start = Math.floor(i * per)
        const end = Math.max(start + 1, Math.floor((i + 1) * per))
        let sum = 0
        for (let j = start; j < end; j++) sum += data[j]
        out.push(sum / (end - start) / 255)
      }
      return out
    },
    []
  )
}

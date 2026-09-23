'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from './use-reduced-motion'

/**
 * Smooth scrolling, driven by GSAP's ticker.
 *
 * Lenis and ScrollTrigger both want to own the rAF loop; running two loops
 * makes pinned sections jitter by a frame. So Lenis is stepped from GSAP's
 * ticker and ScrollTrigger is told to update on every Lenis scroll event.
 *
 * Under reduced motion this mounts nothing at all and the browser's native
 * scrolling is left alone.
 */
export function SmoothScroll() {
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return

    gsap.registerPlugin(ScrollTrigger)

    const lenis = new Lenis({
      duration: 1.05,
      // Gentle exponential ease-out; anything slower feels like lag.
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.6,
    })

    lenis.on('scroll', ScrollTrigger.update)

    const step = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(step)
    gsap.ticker.lagSmoothing(0)

    // Anchor links have to go through Lenis or they jump.
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement | null)?.closest?.('a[href*="#"]')
      if (!(anchor instanceof HTMLAnchorElement)) return

      const url = new URL(anchor.href, window.location.href)
      if (url.pathname !== window.location.pathname || !url.hash) return

      const target = document.querySelector(url.hash)
      if (!target) return

      e.preventDefault()
      lenis.scrollTo(target as HTMLElement, { offset: -80 })
      history.pushState(null, '', url.hash)
    }

    document.addEventListener('click', onClick)

    return () => {
      document.removeEventListener('click', onClick)
      gsap.ticker.remove(step)
      lenis.destroy()
    }
  }, [reduced])

  return null
}

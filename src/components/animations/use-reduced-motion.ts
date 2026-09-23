'use client'

import { useEffect, useState } from 'react'

/**
 * Tracks `prefers-reduced-motion`, and keeps tracking it — the user can flip
 * the OS setting while the page is open.
 *
 * Returns `true` during SSR and first paint so that nothing animates before we
 * know the preference. Effects that would be wasteful to start and then tear
 * down should gate on this.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(true)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)

    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return reduced
}

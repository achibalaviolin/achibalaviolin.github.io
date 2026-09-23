'use client'

import Link from 'next/link'
import { useState, type FormEvent } from 'react'
import { mailingList, site } from '@/content/site'

/**
 * "Join the audience": an oversized outlined call that fills with ember on
 * hover, and the mailing-list sign-up in the space beside it. Carried over
 * from the Roopa Arts footer.
 *
 * The form is a real <form> with a real action, so it submits without
 * JavaScript. With JavaScript it posts in the background and answers in
 * place; if that fails it hands the reader an email instead, so the form
 * is never a dead end.
 */
export function JoinAudience() {
  const [email, setEmail] = useState('')
  const [trap, setTrap] = useState('')
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const mailto = (address: string) =>
    `mailto:${site.email}?subject=${encodeURIComponent('Add me to the mailing list')}&body=${encodeURIComponent(
      `Please add ${address || 'me'} to the ${site.name} mailing list.`,
    )}`

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // Bots fill every field they find; people never see this one.
    if (trap) return
    if (state === 'sending') return

    setState('sending')
    setMessage('')
    try {
      const body = new FormData()
      body.append(mailingList.field, email)
      const res = await fetch(mailingList.endpoint, {
        method: 'POST',
        body,
        headers: { Accept: 'application/json' },
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setState('done')
      setMessage('You are on the list. Watch for the next announcement.')
      setEmail('')
    } catch {
      // Never strand someone who typed their address in.
      setState('error')
      setMessage('That did not go through. Email us and we will add you by hand.')
    }
  }

  return (
    <div className="grid gap-14 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-center lg:gap-20">
      <Link href="/events/" className="group block">
        <span className="sr-only">Join the audience: upcoming concerts</span>
        <span
          aria-hidden="true"
          className="block font-display text-colossal text-transparent transition-colors duration-700 ease-out-expo [-webkit-text-stroke:1px_rgba(20,17,14,0.5)] group-hover:text-ember"
        >
          Join the
          <br />
          audience
        </span>
      </Link>

      <div className="border border-rule bg-raised p-8 xl:p-10">
        <p className="slate">Mailing list</p>
        <h2 className="mt-5 font-display text-recital">Never miss a date.</h2>
        <p className="mt-5 max-w-sm text-muted">
          New concerts, releases and the occasional note from the studio. A few times a year,
          never more.
        </p>

        <form action={mailingList.endpoint} method="POST" onSubmit={onSubmit} className="mt-7">
          <label htmlFor="ml-email" className="sr-only">
            Email address
          </label>
          <div className="flex flex-wrap items-stretch gap-2">
            <input
              id="ml-email"
              name={mailingList.field}
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="min-w-0 flex-1 basis-48 rounded-full border border-rule bg-paper px-5 py-3.5 text-ink placeholder:text-faint focus-visible:border-ember focus-visible:outline-none"
            />
            <button
              type="submit"
              disabled={state === 'sending'}
              className="shrink-0 rounded-full bg-ember-press px-7 py-3.5 text-sm font-medium tracking-wide text-paper transition-colors duration-500 hover:bg-ember disabled:opacity-60"
            >
              {state === 'sending' ? 'Sending' : 'Sign up'}
            </button>
          </div>

          <div className="hidden" aria-hidden="true">
            <label htmlFor="ml-trap">Leave this empty</label>
            <input
              id="ml-trap"
              name="_gotcha"
              type="text"
              tabIndex={-1}
              value={trap}
              onChange={(e) => setTrap(e.target.value)}
            />
          </div>

          <p
            role="status"
            aria-live="polite"
            className={`mt-4 max-w-sm text-sm ${state === 'error' ? 'text-ember-deep' : 'text-ember'} ${message ? '' : 'sr-only'}`}
          >
            {message}
            {state === 'error' ? (
              <>
                {' '}
                <a href={mailto(email)} className="bow-link underline">
                  {site.email}
                </a>
              </>
            ) : null}
          </p>

          <p className="mt-4 text-xs text-faint">
            Your address is used for these announcements only. Unsubscribe any time.
          </p>
        </form>
      </div>
    </div>
  )
}

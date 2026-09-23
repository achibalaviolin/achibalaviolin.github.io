import Link from 'next/link'
import { navLinks, primaryActions, secondaryLinks, site, socials } from '@/content/site'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="rule-top bg-surface/40">
      <div className="wrap py-20">
        <div className="grid gap-14 lg:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <p className="font-display text-recital">
              Achi Bala <span className="text-ember-lit">Violin</span>
            </p>
            <p className="mt-5 max-w-sm text-muted">
              Carnatic, film and world music, between Chennai and Texas.
            </p>
            <a
              href={`mailto:${site.email}`}
              className="bow-link mt-7 inline-block text-ember-lit"
            >
              {site.email}
            </a>
            <p className="mt-2">
              <a href={primaryActions.lessons.href} className="bow-link text-sm text-muted">
                {site.lessonsEmail}
              </a>
            </p>
          </div>

          <nav aria-label="Footer">
            <h2 className="slate">Explore</h2>
            <ul className="mt-6 space-y-2.5 text-sm text-muted">
              {[...navLinks, ...secondaryLinks].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="bow-link hover:text-ivory">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="slate">Listen and follow</h2>
            <ul className="mt-6 space-y-2.5 text-sm text-muted">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bow-link hover:text-ivory"
                  >
                    {s.label}
                    <span className="sr-only">, {s.handle}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Four strings, drawn the width of the page. */}
        <div aria-hidden="true" className="staff mt-16 h-[25px] opacity-50" />

        <div className="mt-8 flex flex-col gap-3 text-xs text-faint sm:flex-row sm:items-center sm:justify-between">
          <span>Carnatic · Film · World</span>
          <span>
            &copy; {year} {site.name}. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  )
}

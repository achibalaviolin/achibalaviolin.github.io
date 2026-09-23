import { Reveal } from '@/components/animations/reveal'
import { Magnetic } from '@/components/animations/magnetic'
import { Section } from '@/components/ui/section'
import { primaryActions, site, socials } from '@/content/site'

/**
 * Contact.
 *
 * Both addresses are offered side by side: an organiser and a parent looking
 * for lessons want different inboxes, and making them choose correctly here
 * saves a forwarded email later.
 */
export function Contact() {
  return (
    <Section id="contact" divider className="text-center">
      <Reveal>
        <p className="eyebrow">Contact</p>
      </Reveal>

      <Reveal delay={0.08}>
        <h2 className="mx-auto mt-6 max-w-4xl text-h1">
          Commissions, collaborations, and studio bookings.
        </h2>
      </Reveal>

      <Reveal delay={0.16}>
        <Magnetic strength={0.16}>
          <a
            href={`mailto:${site.email}`}
            className="mt-12 inline-block font-display text-[clamp(1.5rem,4vw,3rem)] text-gold-bright transition-colors duration-500 hover:text-gold"
          >
            <span className="bow-link">{site.email}</span>
          </a>
        </Magnetic>
      </Reveal>

      <Reveal delay={0.22}>
        <p className="mt-8 text-muted">
          Enquiring about lessons?{' '}
          <a href={primaryActions.lessons.href} className="bow-link text-ivory">
            {site.lessonsEmail}
          </a>
        </p>
      </Reveal>

      <Reveal delay={0.28}>
        <ul className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm">
          {socials.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="bow-link text-muted hover:text-gold-bright"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  )
}

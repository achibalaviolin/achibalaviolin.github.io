import type { Metadata } from 'next'
import { PageOverture } from '@/components/layout/page-overture'
import { Reveal, RevealItem, RevealList } from '@/components/animations/reveal'
import { Magnetic } from '@/components/animations/magnetic'
import { Section } from '@/components/ui/section'
import { serviceMailto, services } from '@/content/services'
import { site, socials } from '@/content/site'
import { roopa } from '@/content/roopa'
import { breadcrumbSchema, jsonLd } from '@/lib/structured-data'

export const metadata: Metadata = {
  title: 'Work together',
  description:
    'Commission a score, book a performance, record at the studio, or enquire about Carnatic music lessons at Roopa Fine Arts.',
  alternates: { canonical: '/contact/' },
  openGraph: {
    title: `Work together · ${site.name}`,
    description: 'Commissions, collaborations, studio bookings and lessons.',
    url: '/contact/',
  },
}

/**
 * Contact and services on one page.
 *
 * They were two sections on the old site. They belong together: the services
 * are the reasons someone writes in, so listing them next to the address means
 * a visitor picks the right subject line instead of sending "hello".
 */
export default function ContactPage() {
  const lessonsHref = `mailto:${roopa.email}?subject=${encodeURIComponent('Lessons enquiry')}`

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbSchema([
            { name: site.name, path: '/' },
            { name: 'Work together', path: '/contact/' },
          ])
        )}
      />

      <PageOverture
        rubric="Work together"
        title={['Commissions,', 'collaborations,', 'and bookings.']}
        image="gallery/achi-5"
        lede="Tell me what you are making and when it needs to exist."
      />

      {/* --- the two addresses --- */}
      <Section divider>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <div className="flex h-full flex-col rounded-lg border border-rule bg-surface/50 p-9 md:p-12">
              <p className="rubric">Music, performance and studio</p>
              <Magnetic strength={0.14}>
                <a
                  href={`mailto:${site.email}`}
                  className="mt-7 inline-block font-display text-[clamp(1.25rem,2.6vw,2rem)] break-all text-gold-bright transition-colors duration-500 hover:text-gold"
                >
                  <span className="bow-link">{site.email}</span>
                </a>
              </Magnetic>
              <p className="mt-6 text-muted">
                Concerts and festivals, original scores, music direction, session violin and
                mastering.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex h-full flex-col rounded-lg border border-rule bg-surface/50 p-9 md:p-12">
              <p className="rubric">Lessons</p>
              <Magnetic strength={0.14}>
                <a
                  href={lessonsHref}
                  className="mt-7 inline-block font-display text-[clamp(1.25rem,2.6vw,2rem)] break-all text-gold-bright transition-colors duration-500 hover:text-gold"
                >
                  <span className="bow-link">{roopa.email}</span>
                </a>
              </Magnetic>
              <p className="mt-6 text-muted">
                Carnatic violin, vocal and theory through Roopa Fine Arts. Include the
                student&rsquo;s age, experience level, and whether you want lessons in Austin,
                Houston or online.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* --- services --- */}
      <Section divider>
        <Reveal>
          <h2 className="rubric">Studio and services</h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="mt-6 max-w-2xl text-lede text-muted">
            Commission original music, polish a release, or record with a violinist-engineer
            who understands story and performance.
          </p>
        </Reveal>

        <RevealList className="mt-14 grid gap-px bg-rule-soft md:grid-cols-3">
          {services.map((service) => (
            <RevealItem key={service.number}>
              <article className="flex h-full flex-col bg-void p-9 transition-colors duration-700 hover:bg-surface/70 md:p-11">
                <span className="font-display text-sm text-gold tabular-nums">
                  {service.number}
                </span>
                <h3 className="mt-6 font-display text-recital">{service.title}</h3>
                <p className="mt-4 text-muted">{service.description}</p>
                <a
                  href={serviceMailto(service.subject)}
                  className="bow-link mt-auto w-fit pt-10 text-sm text-gold-bright"
                >
                  {service.cta}
                </a>
              </article>
            </RevealItem>
          ))}
        </RevealList>
      </Section>

      {/* --- elsewhere --- */}
      <Section divider>
        <Reveal>
          <h2 className="rubric">Elsewhere</h2>
        </Reveal>
        <RevealList as="ul" className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
          {socials.map((s) => (
            <RevealItem as="li" key={s.label}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-baseline gap-3"
              >
                <span className="bow-link font-display text-recital group-hover:text-gold-bright">
                  {s.label}
                </span>
                <span className="text-xs text-faint">{s.handle}</span>
              </a>
            </RevealItem>
          ))}
        </RevealList>
      </Section>
    </>
  )
}

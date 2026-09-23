import { RevealItem, RevealList } from '@/components/animations/reveal'
import { Section, SectionHead } from '@/components/ui/section'
import { serviceMailto, services } from '@/content/services'

export function Services() {
  return (
    <Section id="services" divider>
      <SectionHead eyebrow="Studio & services" title="Bring your sound to life.">
        Commission original music, polish a release, or record with a violinist-engineer who
        understands story and performance.
      </SectionHead>

      <RevealList className="mt-16 grid gap-px bg-rule-soft md:grid-cols-3">
        {services.map((service) => (
          <RevealItem key={service.number}>
            <article className="group flex h-full flex-col bg-void p-9 transition-colors duration-700 hover:bg-surface/70 md:p-11">
              <span className="font-display text-sm text-gold tabular-nums">
                {service.number}
              </span>
              <h3 className="mt-6 font-display text-h3">{service.title}</h3>
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
  )
}

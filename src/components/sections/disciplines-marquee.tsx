import { Marquee } from '@/components/animations/marquee'
import { disciplines } from '@/content/site'

/** The genre strip between the hero and the story. */
export function DisciplinesMarquee() {
  return (
    <section
      aria-label="Musical disciplines"
      className="border-y border-rule-soft bg-surface/50 py-6"
    >
      <Marquee
        items={disciplines}
        className="font-display text-2xl text-ivory/70 md:text-3xl"
      />
    </section>
  )
}

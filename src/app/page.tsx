import { getArticles } from '@/content/achritique'
import { eventSchemas, jsonLd } from '@/lib/structured-data'

import { Hero } from '@/components/sections/hero'
import { DisciplinesMarquee } from '@/components/sections/disciplines-marquee'
import { Lineage } from '@/components/sections/lineage'
import { Works } from '@/components/sections/works'
import { Waltz } from '@/components/sections/waltz'
import { Events } from '@/components/sections/events'
import { Listen } from '@/components/sections/listen'
import { Press } from '@/components/sections/press'
import { Awards } from '@/components/sections/awards'
import { Gallery } from '@/components/sections/gallery'
import { Teaching } from '@/components/sections/teaching'
import { Writing } from '@/components/sections/writing'
import { Services } from '@/components/sections/services'
import { Contact } from '@/components/sections/contact'

/**
 * Homepage.
 *
 * Section order differs from the old site in two deliberate ways:
 *
 *  1. Works sits directly after the story. An organiser deciding whether to
 *     commission him needs the composing credits before the photographs.
 *  2. Press sits next to Awards rather than after the streaming block, so the
 *     two "proof" sections read as one argument instead of being separated by
 *     five minutes of scrolling.
 */
export default function HomePage() {
  const articles = getArticles()
  const events = eventSchemas()

  return (
    <>
      {events.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLd(schema)}
        />
      ))}

      <Hero />
      <DisciplinesMarquee />
      <Lineage />
      <Works />
      <Waltz />
      <Events />
      <Listen />
      <Press />
      <Awards />
      <Gallery />
      <Teaching />
      <Writing articles={articles} />
      <Services />
      <Contact />
    </>
  )
}

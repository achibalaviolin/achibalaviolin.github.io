import { eventSchemas, jsonLd } from '@/lib/structured-data'

import { Hero } from '@/components/sections/hero'
import { DisciplinesMarquee } from '@/components/sections/disciplines-marquee'
import {
  SceneFilm,
  SceneNextDate,
  SceneProof,
  SceneStory,
  SceneTeaching,
} from '@/components/sections/home-scenes'
import { NextStep } from '@/components/layout/next-step'

/**
 * Home is a five-scene trailer.
 *
 * Anything that is not one of those five lives on its own page, and no scene
 * is the only place its subject appears. An earlier draft put all fourteen
 * sections here; it made every visitor scroll past the whole site to reach the
 * one thing they came for, and gave nobody a link they could send.
 */
export default function HomePage() {
  return (
    <>
      {eventSchemas().map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={jsonLd(schema)} />
      ))}

      <Hero />
      <DisciplinesMarquee />

      <SceneNextDate />
      <SceneStory />
      <SceneFilm />
      <SceneProof />
      <SceneTeaching />

      <NextStep
        heading="Let's make something."
        lede="Concerts and festivals, original scores, music direction, session violin and mastering."
        primary={{ href: '/contact/', label: 'Start a conversation' }}
        steps={[
          { href: '/listen/', label: 'Listen', note: 'The records and the video archive.' },
          { href: '/events/', label: 'Events', note: 'Upcoming dates and tickets.' },
          { href: '/achritique/', label: 'Achritique', note: 'Notes, essays and criticism.' },
        ]}
      />
    </>
  )
}

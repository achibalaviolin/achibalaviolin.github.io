import type { Metadata } from 'next'
import { PageOverture } from '@/components/layout/page-overture'
import { NextStep } from '@/components/layout/next-step'
import { GalleryGrid } from '@/components/sections/gallery'
import { site } from '@/content/site'
import { breadcrumbSchema, jsonLd } from '@/lib/structured-data'

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Performance photographs of violinist Achi Bala, on stage and on the street.',
  alternates: { canonical: '/gallery/' },
  openGraph: {
    title: `Gallery · ${site.name}`,
    description: 'Performance photographs, on stage and on the street.',
    url: '/gallery/',
  },
}

export default function GalleryPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbSchema([
            { name: site.name, path: '/' },
            { name: 'Gallery', path: '/gallery/' },
          ])
        )}
      />

      <PageOverture
        slate="Gallery"
        title={['Performance', 'moments.']}
        image="gallery/achi-7"
        lede="Portraits, live shots and square social crops, each at its own proportions."
      />

      <GalleryGrid />

      <NextStep
        heading="Need a press photograph?"
        lede="Write in and a high-resolution file will come back to you."
        primary={{ href: '/contact/', label: 'Request photographs' }}
        steps={[
          { href: '/listen/', label: 'Listen', note: 'The records and the videos.' },
          { href: '/events/', label: 'Events', note: 'Where to hear him next.' },
          { href: '/recognition/', label: 'Recognition', note: 'Awards and press.' },
        ]}
      />
    </>
  )
}

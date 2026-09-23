import type { Metadata } from 'next'
import { Fraunces, Inter, Newsreader } from 'next/font/google'
import './globals.css'

import { Header } from '@/components/layout/header'
import { Announcement } from '@/components/layout/announcement'
import { Footer } from '@/components/layout/footer'
import { SmoothScroll } from '@/components/animations/smooth-scroll'
import { Cursor } from '@/components/ui/cursor'
import { PageTransition } from '@/components/layout/page-transition'
import { site } from '@/content/site'
import { jsonLd, personSchema } from '@/lib/structured-data'

/** Display face — variable optical size, so it stays elegant at 8rem. */
const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  // Variable across both weight and optical size — `axes` requires that the
  // weight stays variable, so no explicit weight list here.
  axes: ['opsz'],
  variable: '--font-fraunces',
})

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

/** Reading face, used for Achritique long-form only. */
const newsreader = Newsreader({
  subsets: ['latin'],
  display: 'swap',
  style: ['normal', 'italic'],
  variable: '--font-newsreader',
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: site.name,
    title: site.title,
    description: site.socialDescription,
    url: '/',
    images: [{ url: site.ogImage, width: 1800, height: 825, alt: site.name }],
    locale: site.locale,
  },
  twitter: {
    card: 'summary_large_image',
    title: site.title,
    description: site.socialDescription,
    images: [site.ogImage],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='0.9em' font-size='90'>🎻</text></svg>",
      },
    ],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${newsreader.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLd(personSchema())}
        />

        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:rounded-full focus:bg-gold focus:px-5 focus:py-2.5 focus:text-void"
        >
          Skip to content
        </a>

        <SmoothScroll />
        <Cursor />
        <Header announcement={<Announcement />} />

        <PageTransition>
          <main id="main">{children}</main>
          <Footer />
        </PageTransition>
      </body>
    </html>
  )
}

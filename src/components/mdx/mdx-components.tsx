import type { MDXComponents } from 'mdx/types'
import { MediaImage } from '@/components/ui/media-image'
import type { MediaKey } from '@/content/generated/media'

/** A pulled-out line, set large between paragraphs. */
function Pull({ children }: { children: React.ReactNode }) {
  return (
    <p className="my-12 border-l-2 border-ember/50 py-1 pl-6 font-display text-[clamp(1.35rem,2.6vw,2rem)] leading-snug text-ink md:pl-8">
      {children}
    </p>
  )
}

/** A captioned figure, breaking wider than the reading measure. */
function Figure({
  src,
  alt,
  caption,
}: {
  src: MediaKey
  alt: string
  caption?: string
}) {
  return (
    <figure className="my-14 -mx-[max(0px,calc((100%-44rem)/2))]">
      <MediaImage
        img={src}
        alt={alt}
        sizes="(min-width: 1024px) 52rem, 100vw"
        className="w-full rounded-sm"
      />
      {caption ? (
        <figcaption className="mt-4 text-center font-sans text-sm text-faint">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  )
}

/**
 * Prose defaults for Achritique.
 *
 * Long-form is set in Newsreader at a generous size with a ~66ch measure —
 * essays are for reading, not skimming, and the interface sans used elsewhere
 * is too tight for it.
 */
export const mdxComponents: MDXComponents = {
  Pull,
  Figure,
  p: (props) => <p className="my-6 text-[1.1875rem] leading-[1.75]" {...props} />,
  h2: (props) => (
    <h2 className="mt-14 mb-5 font-display text-[1.75rem] leading-tight" {...props} />
  ),
  h3: (props) => <h3 className="mt-10 mb-4 font-display text-xl" {...props} />,
  em: (props) => <em className="italic" {...props} />,
  strong: (props) => <strong className="font-semibold text-ink" {...props} />,
  a: (props) => {
    const external = props.href?.startsWith('http')
    return (
      <a
        className="bow-link text-ember"
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...props}
      />
    )
  },
  blockquote: (props) => (
    <blockquote className="my-10 border-l-2 border-rule pl-6 text-muted italic" {...props} />
  ),
  ul: (props) => <ul className="my-6 list-disc space-y-2 pl-6" {...props} />,
  ol: (props) => <ol className="my-6 list-decimal space-y-2 pl-6" {...props} />,
  hr: () => (
    <hr className="mx-auto my-14 w-24 border-0 border-t border-rule" />
  ),
}

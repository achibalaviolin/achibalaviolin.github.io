import { media, type MediaKey } from '@/content/generated/media'

type MediaImageProps = {
  /** Key into the generated manifest, e.g. 'gallery/achi-1'. */
  img: MediaKey
  alt: string
  className?: string
  /** The `sizes` attribute. Get this right — it decides which file downloads. */
  sizes?: string
  priority?: boolean
  /** Override the intrinsic aspect ratio, e.g. for a cropped hero. */
  fill?: boolean
}

/**
 * A plain `<img>` against the pre-generated WebP set.
 *
 * `next/image` is deliberately not used: with `output: 'export'` and
 * `images.unoptimized`, it would ship a component and a wrapper element to
 * render exactly the same markup this does, minus the blur placeholder.
 *
 * Intrinsic `width`/`height` always come from the manifest, so every image
 * reserves its space before it loads and nothing shifts.
 */
export function MediaImage({
  img,
  alt,
  className,
  sizes = '100vw',
  priority = false,
  fill = false,
}: MediaImageProps) {
  const asset = media[img]

  return (
    <img
      src={asset.src}
      srcSet={asset.srcSet}
      sizes={sizes}
      width={asset.width}
      height={asset.height}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : undefined}
      className={className}
      style={{
        backgroundImage: `url(${asset.blurDataURL})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        ...(fill ? { width: '100%', height: '100%', objectFit: 'cover' } : {}),
      }}
    />
  )
}

/** Intrinsic aspect ratio, for reserving space around a `fill` image. */
export function aspectOf(img: MediaKey): number {
  const a = media[img]
  return a.width / a.height
}

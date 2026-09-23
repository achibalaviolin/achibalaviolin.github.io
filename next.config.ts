import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /** GitHub Pages serves plain files — no Node server, no Image Optimization API. */
  output: 'export',
  images: { unoptimized: true },
  /** Every route ends in a slash so Pages resolves it to index.html. */
  trailingSlash: true,
  reactStrictMode: true,
}

export default nextConfig

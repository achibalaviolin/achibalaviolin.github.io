/**
 * Post-export fixups that a static host cannot do for us.
 *
 *  1. Legacy `.html` redirects. The old site's articles lived at
 *     /achritique/<slug>.html and those URLs are indexed and shared. GitHub
 *     Pages has no redirect rules, so each old path gets a real file that
 *     canonicalises to the new URL and bounces the reader.
 *  2. A `.nojekyll` marker, without which Pages drops the `_next` directory.
 *
 * The CNAME is copied by Next itself, since it lives in public/.
 */
import { mkdir, writeFile, readdir, access } from 'node:fs/promises'
import path from 'node:path'

const OUT = path.resolve('out')
const SITE = 'https://achibalaviolin.com'
const ARTICLES = path.resolve('src/content/achritique')

/**
 * A redirect stub.
 *
 * Belt and braces: the canonical tag tells crawlers which URL wins, the
 * meta refresh moves anyone without JS, and the script handles the rest
 * instantly while preserving any hash the link carried.
 */
const redirectHtml = (to, title) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<link rel="canonical" href="${SITE}${to}">
<meta name="robots" content="noindex,follow">
<meta http-equiv="refresh" content="0; url=${to}">
<script>location.replace(${JSON.stringify(to)} + location.hash);</script>
<style>
  body{background:#06060c;color:#f4efe6;font:16px/1.6 system-ui,sans-serif;
       display:grid;place-items:center;min-height:100vh;margin:0;text-align:center}
  a{color:#f0c874}
</style>
</head>
<body>
<p>This page has moved.<br><a href="${to}">Continue to ${title}</a></p>
</body>
</html>
`

async function exists(p) {
  try {
    await access(p)
    return true
  } catch {
    return false
  }
}

async function main() {
  if (!(await exists(OUT))) {
    throw new Error('out/ not found — run `next build` first.')
  }

  // 1. Legacy article URLs.
  const slugs = (await readdir(ARTICLES))
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''))

  await mkdir(path.join(OUT, 'achritique'), { recursive: true })

  for (const slug of slugs) {
    const to = `/achritique/${slug}/`
    await writeFile(
      path.join(OUT, 'achritique', `${slug}.html`),
      redirectHtml(to, 'Achritique'),
      'utf8'
    )
  }

  // The old blog index was also reachable as /achritique/index.html, which
  // the export already produces. Nothing to do there.

  // 2. Pages would otherwise treat _next/ as a Jekyll partial and drop it.
  await writeFile(path.join(OUT, '.nojekyll'), '', 'utf8')

  // 3. Sanity check: the custom domain must survive every deploy.
  if (!(await exists(path.join(OUT, 'CNAME')))) {
    throw new Error('CNAME missing from out/ — the custom domain would break.')
  }

  console.log(`✓ ${slugs.length} legacy .html redirects written`)
  console.log('✓ .nojekyll written')
  console.log('✓ CNAME present')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

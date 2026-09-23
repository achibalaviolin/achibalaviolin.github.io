/**
 * Writes the legacy-URL redirects into vercel.json, from the article list.
 *
 * The old site published essays at /achritique/<slug>.html and those URLs are
 * indexed and shared. Two hosts, two mechanisms:
 *
 *   GitHub Pages  serves the stub files that scripts/post-build.mjs writes
 *                 into out/, because Pages has no redirect layer.
 *   Vercel        never reaches those files. Its router applies the Next
 *                 `trailingSlash` rule to every request and returns 404 for an
 *                 explicit `.html` path, so the redirect has to be declared.
 *
 * Both are generated from the same MDX filenames, so adding an essay cannot
 * leave one host with a redirect the other lacks.
 *
 * vercel.json is read before the build starts, so this cannot run during it.
 * Run `npm run redirects` after adding or renaming an essay and commit the
 * result; `npm run check:redirects` fails if it is out of date.
 */
import { readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const ARTICLES = path.resolve('src/content/achritique')
const CONFIG = path.resolve('vercel.json')

export async function buildRedirects() {
  const slugs = (await readdir(ARTICLES))
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''))
    .sort()

  return slugs.map((slug) => ({
    source: `/achritique/${slug}.html`,
    destination: `/achritique/${slug}/`,
    permanent: true,
  }))
}

async function main() {
  const check = process.argv.includes('--check')
  const config = JSON.parse(await readFile(CONFIG, 'utf8'))
  const redirects = await buildRedirects()

  const current = JSON.stringify(config.redirects ?? [])
  const next = JSON.stringify(redirects)

  if (current === next) {
    console.log(`  vercel.json redirects up to date (${redirects.length}).`)
    return
  }

  if (check) {
    console.error(
      `\n  vercel.json redirects are stale.\n  Run \`npm run redirects\` and commit the result.\n`
    )
    process.exit(1)
  }

  config.redirects = redirects
  await writeFile(CONFIG, `${JSON.stringify(config, null, 2)}\n`, 'utf8')
  console.log(`  wrote ${redirects.length} redirects to vercel.json`)
  for (const r of redirects) console.log(`    ${r.source}  ->  ${r.destination}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

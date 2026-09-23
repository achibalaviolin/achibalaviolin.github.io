/**
 * Contrast check for the palette.
 *
 * Reads the tokens straight out of globals.css so it can never drift from
 * what actually ships, and asserts every pair the site really uses. Run it
 * after any colour change: a small hue nudge moves these ratios more than it
 * looks, and two of them were already failing when this was first written
 * (meta text at 3.48, and the primary button at 3.95).
 *
 * `npm run check:contrast`. Exits non-zero on a failure.
 */
import { readFile } from 'node:fs/promises'
import path from 'node:path'

const CSS = path.resolve('src/app/globals.css')

const srgb = (c) => {
  const v = c / 255
  return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
}

const luminance = (hex) => {
  const n = parseInt(hex.slice(1), 16)
  return (
    0.2126 * srgb((n >> 16) & 255) +
    0.7152 * srgb((n >> 8) & 255) +
    0.0722 * srgb(n & 255)
  )
}

const ratio = (a, b) => {
  const [x, y] = [luminance(a), luminance(b)]
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)
}

/**
 * Every pair the design actually renders.
 *
 * `min` is the threshold that applies to that usage: 4.5 for normal text,
 * 3 for large display type and for non-text marks that only need to be
 * distinguishable.
 */
const PAIRS = [
  ['ink', 'paper', 4.5, 'body text'],
  ['muted', 'paper', 4.5, 'secondary text'],
  ['faint', 'paper', 4.5, 'dates, sources, meta'],
  ['ember', 'paper', 4.5, 'accent text and links'],
  ['ember-deep', 'paper', 4.5, 'accent headings'],
  ['brass', 'paper', 4.5, 'award text'],
  ['paper', 'ember-press', 4.5, 'primary button label'],
  ['ink', 'mist', 4.5, 'text on the tinted band'],
  ['muted', 'mist', 4.5, 'secondary text on the band'],
  ['faint', 'mist', 4.5, 'meta on the band'],
  ['ink', 'raised', 4.5, 'text on a raised panel'],
  ['faint', 'raised', 4.5, 'meta on a raised panel'],
  ['ink', 'shade', 4.5, 'text in a recessed well'],
  ['ember', 'mist', 3, 'waveform and rules (mark, not text)'],
]

/** A wash, never under text. The check records it so the rule is visible. */
const FILL_ONLY = ['ember-soft']

async function main() {
  const css = await readFile(CSS, 'utf8')
  const tokens = Object.fromEntries(
    [...css.matchAll(/--color-([a-z0-9-]+):\s*(#[0-9a-f]{6})/gi)].map((m) => [m[1], m[2]])
  )

  let failed = 0
  console.log('\n  pair                                     ratio   min   ')
  console.log('  ' + '-'.repeat(58))

  for (const [fg, bg, min, label] of PAIRS) {
    if (!tokens[fg] || !tokens[bg]) {
      console.log(`  ${label.padEnd(40)} MISSING TOKEN (${fg} / ${bg})`)
      failed++
      continue
    }
    const r = ratio(tokens[fg], tokens[bg])
    const ok = r >= min
    if (!ok) failed++
    console.log(
      `  ${label.padEnd(40)} ${r.toFixed(2).padStart(5)}  ${String(min).padStart(4)}   ${
        ok ? 'pass' : 'FAIL'
      }`
    )
  }

  console.log(
    `\n  fill-only tokens (must never carry text): ${FILL_ONLY.map((t) => `${t} ${tokens[t]}`).join(', ')}`
  )

  if (failed > 0) {
    console.error(`\n  ${failed} contrast failure(s).\n`)
    process.exit(1)
  }
  console.log(`\n  ${PAIRS.length} pairs, 0 failures.\n`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

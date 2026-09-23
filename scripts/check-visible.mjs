/**
 * Asserts that no page renders invisible content.
 *
 * Five separate outages on this site had the same shape: an element mounted at
 * opacity 0 or fully clipped, waiting for a scroll trigger that never fired,
 * so the content was gone rather than merely un-animated. Eyeballing caught
 * each one late and only by accident.
 *
 * This loads every built route in a headless browser, scrolls it end to end,
 * and fails if any image or any element carrying text is still invisible
 * afterwards. Run against `out/`, never the dev server: the dev bundle can be
 * stale, which has already sent me chasing a bug that was fixed.
 *
 *   npm run build && npm run check:visible
 */
import { readdir } from 'node:fs/promises'
import path from 'node:path'
import { spawn } from 'node:child_process'
import puppeteer from 'puppeteer'

const OUT = path.resolve('out')
const PORT = 4319

async function routes() {
  const found = []
  async function walk(dir, base = '') {
    for (const e of await readdir(dir, { withFileTypes: true })) {
      if (e.isDirectory()) await walk(path.join(dir, e.name), `${base}/${e.name}`)
      else if (e.name === 'index.html') found.push(`${base}/` || '/')
    }
  }
  await walk(OUT)
  return found.filter((r) => !r.includes('_next') && !r.includes('404')).sort()
}

const serve = () =>
  spawn('python3', ['-m', 'http.server', String(PORT), '--directory', OUT], {
    stdio: 'ignore',
  })

async function main() {
  const server = serve()
  await new Promise((r) => setTimeout(r, 1200))

  const browser = await puppeteer.launch({ args: ['--no-sandbox'] })
  const failures = []

  try {
    for (const route of await routes()) {
      const page = await browser.newPage()
      await page.setViewport({ width: 1440, height: 900 })
      await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'networkidle2' })

      /* Walk the page so anything gated on a scroll trigger gets its chance. */
      await page.evaluate(async () => {
        const step = window.innerHeight * 0.7
        for (let y = 0; y < document.body.scrollHeight; y += step) {
          window.scrollTo(0, y)
          await new Promise((r) => setTimeout(r, 120))
        }
        window.scrollTo(0, 0)
      })
      /* Past the reveal backstop, so a missed observer still resolves. */
      await new Promise((r) => setTimeout(r, 3200))

      const hidden = await page.evaluate(() => {
        const bad = []
        const nodes = document.querySelectorAll('img, h1, h2, h3, p, li, figcaption')
        for (const el of nodes) {
          const r = el.getBoundingClientRect()
          if (r.width === 0 && r.height === 0) continue
          let node = el
          let opacity = 1
          let clipped = false
          while (node && node !== document.body) {
            const cs = getComputedStyle(node)
            opacity *= Number(cs.opacity)
            if (cs.clipPath && /100%/.test(cs.clipPath)) clipped = true
            node = node.parentElement
          }
          if (opacity < 0.05 || clipped) {
            bad.push({
              tag: el.tagName,
              clipped,
              opacity: Number(opacity.toFixed(3)),
              text: (el.textContent || el.getAttribute('alt') || '').trim().slice(0, 46),
            })
          }
        }
        return bad
      })

      if (hidden.length) failures.push({ route, hidden })
      console.log(`  ${hidden.length ? 'FAIL' : 'ok  '}  ${route}`)
      await page.close()
    }
  } finally {
    await browser.close()
    server.kill()
  }

  if (failures.length) {
    console.error('\n  Invisible content:')
    for (const f of failures) {
      console.error(`\n  ${f.route}`)
      for (const h of f.hidden.slice(0, 6)) {
        console.error(
          `    ${h.tag.padEnd(5)} opacity=${h.opacity} clipped=${h.clipped}  ${h.text}`
        )
      }
      if (f.hidden.length > 6) console.error(`    (+${f.hidden.length - 6} more)`)
    }
    console.error('')
    process.exit(1)
  }
  console.log('\n  No invisible content.\n')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

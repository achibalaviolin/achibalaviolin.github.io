# Achi Bala Violin

The site for [achibalaviolin.com](https://achibalaviolin.com) — Next.js, statically exported,
deployed to GitHub Pages.

```
npm install
npm run media      # convert _source-media/ → public/media/ (only needed after adding images)
npm run dev        # http://localhost:3000
npm run build      # static export → out/
npm run check:contrast   # assert the palette still passes AA
```

---

## Updating content

**Everything editable lives in `src/content/`. You should not need to open a component.**

| What | File |
|---|---|
| Concerts and appearances | `content/events.ts` |
| Composing / music-direction credits | `content/works.ts` |
| Awards and citations | `content/awards.ts` |
| Press coverage | `content/press.ts` |
| Videos (YouTube) | `content/videos.ts` |
| Photographs | `content/gallery.ts` |
| Roopa Fine Arts — copy, programs, FAQs, arangetrams | `content/roopa.ts` |
| Studio services | `content/services.ts` |
| Biography, gurus, milestones | `content/bio.ts` |
| Name, emails, social links, nav | `content/site.ts` |
| Achritique essays | `content/achritique/*.mdx` |

### Adding an event

Add an entry to the `events` array in `content/events.ts`:

```ts
{
  slug: 'some-concert-2027',
  title: 'Some Concert',
  date: '2027-03-14',          // ISO. Use null only if genuinely unknown.
  time: '7:30 PM',
  venue: 'The Venue',
  city: 'Austin, Texas',
  eyebrow: 'Upcoming concert',
  description: 'One or two sentences.',
  ticketUrl: 'https://...',    // optional — adds the ticket button
}
```

Upcoming/past sorting, the announcement bar at the top of every page, and the `Event`
structured data are all derived from this. **An event with `date: null` is excluded from
structured data** — Google rejects an Event without a start date — so fill the date in
wherever you can.

### Adding an essay

Drop a `.mdx` file into `src/content/achritique/`. The filename becomes the URL
(`my-essay.mdx` → `/achritique/my-essay/`). Frontmatter:

```yaml
---
title: The title
kicker: Music · Lineage          # small line above the headline
standfirst: One-sentence intro, shown large under the title.
excerpt: Slightly longer summary, used on the index and in search results.
date: 2027-01-20                 # ISO — drives ordering
displayDate: January 2027        # what a reader sees
category: Music
readingTime: 5 min read
featured: true                   # optional — promotes it to the top of the index
---
```

Two components are available inside an essay beyond normal Markdown:

```mdx
<Pull>A line pulled out and set large.</Pull>

<Figure src="achritique/some-image" alt="Describe it" caption="Optional caption." />
```

`src` is a key from the generated media manifest — the path under `_source-media/` without
the extension.

The index page, the sitemap, and the legacy `.html` redirect are all generated from the file
list. Nothing else to update.

### Adding images

1. Put the original in `_source-media/<folder>/<name>.jpg` (or `.png`).
2. Run `npm run media`.
3. Reference it by key, e.g. `gallery/my-photo`, in the relevant content file.

The script writes WebP at 480/768/1200/1800px (2400 for `hero/`) plus an inline blur
placeholder, and regenerates `src/content/generated/media.ts`. It skips files that already
exist, so it is safe to re-run. Never edit the generated file by hand.

Originals stay in `_source-media/` and are **not** deployed — only the optimised
`public/media/` output ships. Converting the legacy library took it from 11 MB to 3.6 MB
across every responsive size.

---

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which installs, optimises media,
builds, and publishes `out/` to GitHub Pages.

`public/CNAME` holds `achibalaviolin.com` and is copied into every build. The post-build
script **fails the build** if it is missing, so the custom domain cannot be silently lost.

### Preserved URLs

Old article links stay alive. `scripts/post-build.mjs` writes a redirect stub at each legacy
path with a canonical tag pointing at the new URL:

| Old | New |
|---|---|
| `/achritique/the-lalgudi-bani.html` | `/achritique/the-lalgudi-bani/` |
| `/achritique/stay-tuned-for-the-waltz-of-chennai.html` | `/achritique/stay-tuned-for-the-waltz-of-chennai/` |
| `/achritique/notes-on-the-mcu.html` | `/achritique/notes-on-the-mcu/` |

`/`, `/achritique/` and `/roopa-fine-arts/` are unchanged. The stubs are `noindex, follow`
and are kept out of the sitemap so search engines consolidate on the new paths rather than
indexing both.

---

## Outstanding — things only you can answer

Marked `TODO` in the source. None of these block the site; all of them are places where I
would not guess.

1. **Two essays are reconstructions, not the originals.** `stay-tuned-for-the-waltz-of-chennai`
   and `notes-on-the-mcu` both carried an editor's note on the old site saying the text was
   rebuilt rather than the original post. They render with a short note at the foot. If you
   can recover the originals from Tumblr, paste them in and delete the `needsOriginal: true`
   frontmatter flag — the note disappears on its own.
2. **Two events have no date** (Samarpana Series, Chithirai Thiruvizha Mahotsavam). They sit
   in the archive list and are excluded from structured data until dated.
3. **Roopa Fine Arts has no counts** for arangetrams or competition prizes. Add `countTo`
   numbers to `schoolStats` in `content/roopa.ts` and they animate automatically.
4. **Kashyap Kalvakota's arangetram** has no date, city, or flyer.
5. **Three images need real alt text** — `gallery/achi-4`, `hero/slider-6`, `hero/banner-3`.
   These were unused in the old repo, so there was never any alt text to carry over.
6. **Two festival recognitions have no certificate** in the media folder — the Dada Saheb
   Phalke Best Director award and the Barnstorm Dance Fest selection. They are listed as
   text under the awards rail; add the artwork if you have it.

---

## Notes on some decisions

**Why the content reads differently from the old site.** Several things were verifiable in
public sources and simply absent from the site — the guru lineage, the Miller Outdoor Theatre
music-direction credit, the Cannes Best Song win, the real YouTube titles, the press
pull-quotes. Each entry in `content/` carries a `source` field or a comment naming where it
came from, so any of it can be re-checked. Nothing is invented; where a fact could not be
confirmed it is a `TODO` rather than a guess.

**The awards section.** The old markup described all seven images as "Award recognition
image" with no festival named anywhere. The names were read off the certificates themselves,
which is also how it emerged that one of them is not a Waltz of Chennai award at all: it is a
Best Song win at the World Film Festival in Cannes for *Amruthavarshini*, with Kavitha
Jayaraman and Avi Patel. `awards.ts` records who each certificate actually names in
`laureate`, because the two Best Director awards belong to the film's director, Shara Shanth,
and the page should not imply otherwise.

**Section order.** Works sits immediately after the story, because an organiser deciding
whether to commission a score needs the credits before the photographs. Press sits next to
Awards so the two proof sections read as one argument.

**The look, and where it comes from.** A violinist reads left to right, in time, so the
design is built on the horizontal rather than the radial: waveforms, staff rules, bow
strokes, letterboxed frames. Nothing turns, things travel. The one recurring mark is a
waveform, because it stands in for what the site is actually about in a way a decorative
shape would not.

**The palette is sampled off your own artwork, not invented.** The vermilion `#ca3a12` is
the CHENNAI wordmark on The Waltz of Chennai poster; the brass `#da7a44` is the Achi Bala
Violin logo above it. Brass is reserved for awards and laurels so the metallic means
something.

**Type.** Instrument Serif for display: high contrast, tight, one weight, and it reads as a
film title card rather than a concert programme, which is the right register for an artist
whose best-known work is an award-winning music video. Space Grotesk runs the interface.
Space Mono sets anything that behaves like a studio slate: dates, credits, catalogue lines.
Newsreader is kept for Achritique long-form only.

**On light mode.** There isn't one, deliberately. A light variant would need a second set of
image treatments and a second accent balance to work at all, and a single committed look is
worth more here than a toggle. If you want one later, every colour is a token in
`globals.css` and nothing is hard-coded.

**Colour rules, and how to keep them.** `ember` is the exact poster red and is a **fill
only**: at 3.95:1 on the background it fails AA, so it may never carry text and nothing
readable may sit on it. Buttons use `ember-press`, text accents use `ember-lit`. Run
`npm run check:contrast` after any colour change. It reads the tokens straight out of
`globals.css` and asserts all ten pairs the site actually renders, so it cannot drift from
what ships. Two pairs were failing when it was first written, which is the argument for
measuring rather than eyeballing.

**Accessibility and motion.** Every animation is gated on `prefers-reduced-motion`: the
parallax, the pinned sections, the marquee, and the custom cursor all switch off, leaving
plain content rather than degraded content. The marquee becomes a static list of the same
words. Focus states are visible and gold; the gallery lightbox traps focus, restores it on
close, and moves with arrow keys.

**Sound in the hero.** The hero video carries its audio track, but it cannot
start unmuted, and this is not a setting: Chrome, Safari and Firefox all refuse
to autoplay audible media until the visitor has interacted with the page, and a
video marked `autoplay` without `muted` does not play at all. So it starts
muted with a labelled Sound on/off control beside the buttons, and the choice
is remembered in `localStorage`. Worth knowing separately: the audio on that
clip is the stock footage's own, not Achi Bala playing, so anyone who turns it
on hears music that is not his. Replacing it with one of his own recordings
would fix that; the encode command is in `_source-media/video/NOTES.md`.

**Performance.** The YouTube and Spotify embeds sit behind click-to-play facades — a cold
YouTube embed costs over a megabyte before anyone presses play. Images ship as pre-sized
WebP with inline blur placeholders and explicit dimensions, so nothing shifts as the page
loads. GSAP's ScrollTrigger is registered only in the two components that use it.

---

## Stack

Next.js 16 (App Router, static export) · React 19 · TypeScript · Tailwind CSS v4 ·
Motion · GSAP + ScrollTrigger · Lenis · MDX via `next-mdx-remote` · `sharp` at build time.

Type faces are Instrument Serif (display), Space Grotesk (interface), Space Mono (slate
lines) and Newsreader (long-form reading), all self-hosted through `next/font`.

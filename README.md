# Achi Bala Violin — redesigned site

A sleek, dependency-free static redesign of [achibalaviolin.com](https://achibalaviolin.com):
a dark, cinematic one-page site for the artist, plus **Achritique** — the writing — rebuilt as an
editorial, literary-journal-style blog.

## Structure

```
index.html                                    Main site (one page, anchored sections)
achritique/index.html                         Achritique — blog index ("the reading room")
achritique/stay-tuned-for-the-waltz-of-chennai.html
achritique/notes-on-the-mcu.html              Article pages
assets/css/main.css                           Main site styles (dark / gold)
assets/css/achritique.css                     Blog styles (paper / ink / red seal)
assets/js/main.js                             Nav, scroll-reveal, hero string animation
assets/img/*.svg                              Image placeholders (see below)
```

Sections retained from the current site: hero ("More melodies coming your way"), about,
**The Waltz of Chennai** (with the official YouTube video embedded), listen/music (Spotify,
YouTube, Instagram, Facebook), Achritique, contact.

New sections: **Services** — Music Composition, Audio Engineering, Recording Services — each
with a mailto enquiry CTA to `achibalaviolin@gmail.com`.

## Image placeholders to replace

The original site could not be scraped from this build environment (its network policy blocks
the domain), so every photo is a clearly-labelled SVG placeholder. Drop in real photos with the
same filename (or update the `src` in HTML — a `.jpg`/`.webp` extension change is fine):

| Placeholder                 | Used on                 | Replace with                                |
| --------------------------- | ----------------------- | ------------------------------------------- |
| `assets/img/banner-1.svg`   | Home → banner carousel  | Original banner image 1 (wide, ~16:7)       |
| `assets/img/banner-2.svg`   | Home → banner carousel  | Waltz of Chennai still (wide, ~16:7)        |
| `assets/img/banner-3.svg`   | Home → banner carousel  | Studio photo (wide, ~16:7)                  |
| `assets/img/portrait.svg`   | Home → About            | Portrait of Achi with violin (4:5-ish)      |
| `assets/img/live-1.svg`     | Home → Listen gallery   | Live performance photo (4:5)                |
| `assets/img/live-2.svg`     | Home → Listen gallery   | Studio session photo (4:5)                  |
| `assets/img/live-3.svg`     | Home → Listen gallery   | Dance collaboration photo (4:5)             |
| `assets/img/waltz-art.svg`  | Achritique → Featured   | Waltz of Chennai poster or film still       |

Also placeholdered: the two Achritique article bodies are rebuilt from recovered excerpts —
each has an "editor's note" box; paste the original WordPress post text over the paragraphs to
complete the migration, then delete the note.

## Local preview

```
python3 -m http.server 8000
# open http://localhost:8000
```

No build step, no frameworks — plain HTML/CSS/JS. Fonts (Fraunces, Newsreader, Manrope) load
from Google Fonts.

## Deploying / repointing the domain

Any static host works (GitHub Pages, Netlify, Cloudflare Pages):

- **GitHub Pages:** repo Settings → Pages → deploy from branch, root folder. Then add
  `achibalaviolin.com` as the custom domain and point the domain's DNS (A/ALIAS or CNAME) at
  GitHub Pages. A `CNAME` file will be created automatically.

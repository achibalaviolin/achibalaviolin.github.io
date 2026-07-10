# Achi Bala Violin — website

The production site for [achibalaviolin.com](https://achibalaviolin.com): a bright,
paper-and-wine design with real performance media, plus **Achritique**, the writing, as an
editorial blog. This version merges the EA's `/redesigned` build (visual archive: hero banners,
events, awards, press, gallery) with the feedback rounds from this workspace.

## Structure

```
index.html                     Main site (one page, anchored sections)
achritique/                    Achritique blog (index + article pages)
assets/css/main.css            Main site styles
assets/css/achritique.css      Blog styles
assets/js/main.js              Nav, hero carousel, scroll reveal
assets/media/                  Real site media (hero, events, awards, press, gallery, videos)
assets/img/waltz-art.svg       Blog featured-art placeholder (replace with poster/still)
```

Sections in order: hero banner carousel, about (roots boxes), events, The Waltz of Chennai
(embedded film + award chip), awards & recognition, listen/watch (Spotify + YouTube), press,
gallery, studio & services, Roopa Fine Arts (teaching), Achritique, contact.

## Open items

- **Press links**: the three press cards (`Press Release`, `Jwalanti`, `Laya`) are anchors with
  `href="#press"` and a "Link coming soon" chip. Replace the href with the article URL and
  remove the `pending` class + `.soon` span. Marked with an HTML comment in `index.html`.
- **Awards links**: festival/citation links can be added to the award tiles when available
  (wrap the `<figure>` content in an `<a>`).
- **Events calendar**: planned; the events section currently shows poster highlights.
- **Video thumbnails**: currently link to the YouTube channel; swap each `href` for the
  specific video URL when known.
- **Blog featured art**: `assets/img/waltz-art.svg` is the last placeholder image.

## Local preview

```
python3 -m http.server 8000
# open http://localhost:8000
```

No build step. Fonts (Fraunces, Inter, Newsreader, Manrope) load from Google Fonts. The Spotify
embed requires the page to be served over http(s); it will not load from a `file://` path.

## Deploying

Any static host. For GitHub Pages: Settings → Pages → deploy from branch (root). To go live on
the apex domain, add `achibalaviolin.com` as the custom domain and point DNS at Pages.

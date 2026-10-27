# Achi Bala Violin — website

The production site for [achibalaviolin.com](https://achibalaviolin.com): a bright,
paper-and-wine design with real performance media, plus **Achritique**, the writing, as an
editorial blog. This version merges the EA's `/redesigned` build (visual archive: hero banners,
events, awards, press, gallery) with the feedback rounds from this workspace.

## Structure

```
index.html                     Main site (one page, anchored sections)
roopa-fine-arts/index.html     Roopa Fine Arts — Carnatic lessons landing page (SEO/GEO)
achritique/                    Achritique blog (index + article pages)
sitemap.xml                    Sitemap (submit in Google Search Console)
robots.txt                     Crawl rules + sitemap pointer
llms.txt                       Plain-text site summary for AI crawlers (GEO)
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

(Tracked weekly in the "Achi Bala Violin Admin/Website Briefs" Drive folder; IDs are ABV-n.)

- **Event title/venue (ABV-2)**: confirm the Ilaiyaraaja Night title/venue wording against the
  ticket page before updating the card.
- **Awards in text (ABV-4)**: add a text list of awards (festival, category, year) once the
  wording is approved; festival/citation links can then be added to the award tiles.
- **`new-site` redesign (ABV-6)**: unmerged Next.js redesign on the `new-site` branch; preview
  and approve before any work targets it.
- **Content refresh (ABV-10)**: events intro copy, event dates/venues for the Samarpana and
  Chithirai cards, a post-release Waltz of Chennai essay, fuller bio, dated press items, and
  2025–26 gallery photos — all waiting on approved copy/assets.
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

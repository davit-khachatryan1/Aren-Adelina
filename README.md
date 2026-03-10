# Aren & Adelina Wedding Invitation

Mobile-first one-page wedding invitation built with React + Vite + TypeScript.

## Run

```bash
npm install
npm run dev
```

## Build & tests

```bash
npm run build
npm test
```

## Social preview validation

After deploying, verify the shared root URL `https://aren-adelina.vercel.app/`:

1. Run the [Meta Sharing Debugger](https://developers.facebook.com/tools/debug/) and force a re-scrape.
2. Verify the live HTML and image manually:
   `curl -I https://aren-adelina.vercel.app/`
   `curl -I https://aren-adelina.vercel.app/assets/social/og-card.jpg`
3. Verify crawler user agents receive the same HTML:
   `curl -A 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)' -L https://aren-adelina.vercel.app/`
   `curl -A 'TelegramBot (like TwitterBot)' -L https://aren-adelina.vercel.app/`
4. Re-test Telegram after the re-scrape/crawl cache refresh.
5. If Instagram DMs still omit the card while Meta’s debugger is green, treat that as Instagram platform behavior rather than a site defect.

If chat apps have already cached a bad preview for the homepage, share the dedicated cache-busting URL instead:

- `https://aren-adelina.vercel.app/invite/`

That page keeps the homepage canonical for SEO, but gives social platforms a fresh page URL and a fresh OG image URL to scrape.

## Google indexing checklist

For Google, the current production site already exposes the core crawl signals:

- `https://aren-adelina.vercel.app/` returns `200`
- `https://aren-adelina.vercel.app/robots.txt` is public
- `https://aren-adelina.vercel.app/sitemap.xml` is public
- the prerendered HTML ships canonical and `index,follow` tags

If Google Search Console still shows `0 indexed` for a new property, use this checklist before changing code or Vercel config:

1. In Search Console, submit `https://aren-adelina.vercel.app/sitemap.xml`.
2. Inspect `https://aren-adelina.vercel.app/` and click `Request indexing`.
3. Keep the production URL stable while waiting for first indexing.
4. Keep Vercel production fully public:
   no Deployment Protection, no password gate, no login wall, no bot challenge for Googlebot.
5. Add at least one crawlable external link pointing to the homepage from a public page you control.
6. Wait several days and use Search Console as the source of truth instead of the public `site:` operator.

If indexing is still missing after roughly 2-4 weeks:

1. `Discovered - currently not indexed`:
   focus on discovery signals and external links.
2. `Crawled - currently not indexed`:
   improve page uniqueness or content depth instead of changing Vercel.
3. Fetch or robots errors:
   re-check the live response headers and any Vercel protection settings.

## RSVP endpoint

Set Google Apps Script/Webhook URL via environment variable:

```bash
VITE_RSVP_ENDPOINT="https://your-endpoint" npm run dev
```

Default fallback endpoint is `/rsvp` for local testing.

## Asset contract

- Hero image: `public/assets/images/hero-couple.jpg`
- Story images:
  - `public/assets/images/story-desktop-1.jpg`
  - `public/assets/images/story-desktop-2.jpg`
- Music: `public/assets/audio/wedding-theme.mp3`
- Schedule icons:
  - `public/assets/icons/rings.svg`
  - `public/assets/icons/champagne.svg`

## Content config

Update Armenian content/timings/locations in:

- `src/config/siteConfig.ts`

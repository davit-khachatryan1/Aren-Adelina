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

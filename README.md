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

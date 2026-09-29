# Ambrocio Construction & Remodeling — website

A cinematic single-page site built with Next.js 16, Tailwind CSS 4, GSAP (ScrollTrigger, SplitText, DrawSVG) and Lenis smooth scrolling.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Before going live

1. **Connect the estimate form.** Copy `.env.example` to `.env.local` and set `ESTIMATE_WEBHOOK_URL` to any endpoint that accepts a JSON POST (Formspree, Zapier/Make, a Slack incoming webhook, a CRM). Until it's set, the form doesn't pretend to send: it offers visitors a pre-filled text message to Eduardo, or a call button.
2. **Set the site URL.** Set `NEXT_PUBLIC_SITE_URL` to the real domain so canonical links, Open Graph and structured data are correct.
3. **Add real project photos.** Put images in `public/media/` and reference them in `src/content/media.ts`:
   - `portfolio` — the six "Our Work" slots. They're marked **Placeholder** on the site until they have a `photo.src`. Add `project` and `location` only when they are real.
   - `featurePhotos` — optional photos for the Build / Remodel / Improve panels and the final call-to-action. Until these are set, the site uses its built-in architectural drawings.

## Content rules

All company facts live in `src/content/site.ts` and come from the Ambrocio flyer. Don't add years in business, project counts, awards, testimonials or an address unless the business supplies them.

## Structure

```
src/app/                 layout (SEO, JSON-LD), page, OG image, /api/estimate
src/components/sections  one file per section, in story order (see page.tsx)
src/components/svg       the drawings: hero elevation, isometric build, section, room, detail plates
src/components/ui        button, reveal text, cursor, smooth scroll, media, dust
src/content              site facts + photo manifest
```

Motion: every scroll animation runs inside `gsap.matchMedia`. There are separate desktop and mobile timelines, and with `prefers-reduced-motion` visitors get static finished states and no smooth scrolling.

# Hotel OS — Official Website / Landing Page

Public-facing marketing website for **Hotel OS** (HotelOS Technologies Ltd.) — a hotel
management platform. Single-page, static, zero dependencies.

> **Brand:** "Hotel operations, simplified." · Deep Blue `#1A3C5E` · Orange `#E8821A` · White `#FFFFFF`
> Typography: Plus Jakarta Sans (primary) · Manrope (secondary) · JetBrains Mono (figures)

## Stack

Plain **HTML + CSS + JavaScript** — no framework, no build step, no npm packages.

```
/
├── index.html              # all 13 sections (semantic, accessible)
├── css/
│   ├── tokens.css          # brand design tokens (:root variables)
│   └── style.css           # components + responsive layout
├── js/
│   └── main.js             # nav, reveal, tabs, FAQ, form validation
├── assets/
│   ├── favicon.svg         # ⚠️ placeholder H symbol (official asset pending)
│   ├── logo/               # ⬜ official logo files go here
│   ├── screenshots/        # ⬜ real product screenshots go here
│   └── images/             # ⬜ photography / OG image go here
├── sitemap.xml
├── robots.txt
└── README.md
```

## Run locally

Any static server works:

```bash
# Python
python -m http.server 8080

# Node
npx serve .

# or simply open index.html in a browser (fonts require internet)
```

Open http://localhost:8080

## Deploy

The site is static — deploy anywhere:

| Platform | Settings |
|---|---|
| **Vercel** | Framework: *Other* · Build command: *(empty)* · Output dir: `.` |
| **Netlify** | Build command: *(empty)* · Publish directory: `.` |
| **GitHub Pages** | Upload repo contents as-is |

After choosing the domain: update the canonical/OG URLs in `index.html`,
`sitemap.xml` and `robots.txt` (all currently `https://example.com`).

## Configuration required before production

Nothing here is faked — complete this checklist before going live:

### 1. Demo enquiry form (blocking)
`js/main.js` → `FORM_ENDPOINT` is intentionally **empty**.
While empty, submitting shows an honest "not connected yet" state and opens a
mailto draft — it never shows a fake success.

- [ ] Set `FORM_ENDPOINT` to a real endpoint, e.g.
      `https://formspree.io/f/XXXXXXX` (Formspree free tier supports this)
- [ ] Set `FALLBACK_EMAIL` (currently `hello@hotelos.example`)

### 2. Brand assets (blocking for final review)
- [ ] **Official Hotel OS logo** (SVG: primary blue, reversed white, H symbol) → `assets/logo/`
      Replace the placeholder lockup in the navbar/footer and `assets/favicon.svg`
- [ ] **Brand Identity Presentation** (page 23 homepage concept) — for design cross-check
- [ ] **Favicon** — official H symbol replacing placeholder

### 3. Product screenshots (strongly recommended)
All product visuals are currently **clearly-labeled illustrative CSS previews**.
- [ ] Export 6 real screenshots → `assets/screenshots/`
      (Front Desk, Rooms, Housekeeping, Restaurant, Finance, Management)
- [ ] Replace hero preview + showcase panels + Section 9 previews

### 4. Photography
- [ ] Authentic Nigerian/African hospitality photography for Section 8
      (currently a labeled placeholder block)

### 5. Contact & social (Section 12 + Footer)
- [ ] Verified contact email/phone → `index.html` contact section + `FALLBACK_EMAIL`
- [ ] Social profile URLs → footer (commented template ready)
- [ ] Privacy Policy + Terms of Service pages (footer links are `#privacy`/`#terms` TODOs)

### 6. SEO finalization
- [ ] Replace `https://example.com` in: canonical, og:url, og:image/twitter:image,
      `sitemap.xml`, `robots.txt`
- [ ] Create `assets/images/og-image.png` (1200×630 share image)

## Content compliance

- Copy follows the approved brief exactly — no unverified claims, no fake
  testimonials, no fake pricing, no fabricated statistics.
- Financial figures (₦620,000 / ₦510,000 / ₦110,000) are **brand-sample figures**,
  labeled on-page as illustrative only.
- Every product visual is labeled "Illustrative preview" until real screenshots land.

## Accessibility & SEO notes

- Semantic landmarks (`header`/`nav`/`main`/`footer`), single `h1`, ordered headings
- Keyboard-accessible nav, tabs (arrow keys), accordion (`aria-expanded`), form labels
- Visible focus indicators, sufficient contrast, `prefers-reduced-motion` respected
- Meta title/description, Open Graph, Twitter cards, `sitemap.xml`, `robots.txt`

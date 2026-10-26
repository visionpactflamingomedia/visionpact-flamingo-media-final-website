# Visionpact Flamingo Media

A responsive creative-agency site built with React, TypeScript and Vite/Vinext. It includes service accordions, concept-work filters, accessible native dialogs, an interactive process, an illustrative AI workflow, studio notes and a database-backed inquiry form.

## Development

Use Node 22.13+ and npm. Run `npm ci`, `npm run dev`, and `npm run build`. The Sites configuration declares the logical D1 binding `DB`. Generate schema changes with `npm run db:generate`. Apply local migrations using the commands in the bundled Sites workflow. Production migrations are packaged automatically.

## Content and assets

- `app/content.ts` holds services, process steps and studio concepts.
- `app/page.tsx` contains reusable UI and interaction logic.
- `app/globals.css` contains the responsive visual system.
- `app/api/inquiries/route.ts` validates and stores inquiries with prepared statements and idempotent submission IDs. It does not send email.
- `db/schema.ts` and `drizzle/` hold the inquiry schema and migration.
- Artwork in `public/images/` is original AI-generated concept imagery, not client work. Typography is Manrope, distributed under the bundled OFL license.

The source PDF supports the studio name, founder roles and service scope. It does not supply the actual logo PDF, confirmed email/phone/address, verified client projects, performance metrics or incorporation completion. Those were not invented. The current wordmark is a text treatment. Contact notifications and verified contact details remain to be connected before a public business launch.

## Artwork prompts

Built-in image generation was used for two assets: a pink resin/chrome flamingo sculpture on a charcoal studio background; and an original FORM / FIELD editorial brand-stationery concept in pink, black and off-white. Both were converted to WebP and stored locally.

## Review

Subjective design self-assessment after refinement:

| Criterion | Score / 10 |
| --- | --- |
| Visual impact | 9.2 |
| UI/UX | 9.0 |
| Brand presentation | 8.8 |
| Professionalism | 9.1 |
| Animation quality | 8.8 |
| Mobile responsiveness | 9.1 |
| Content clarity | 9.2 |
| Conversion potential | 8.8 |
| Technical quality | 9.1 |
| Overall premium feel | 9.0 |

Overall: 9.0/10, a design judgement rather than a user-study result. Refinements improved body text, typography, image blending, section labels and contrast. The missing original logo, client case studies and contact details limit brand specificity.

Validation covered responsive widths of 360, 390, 768, 1024 and 1440 pixels; reduced motion; service and process controls; filter results; dialog opening/Escape; navigation targets; image loading; valid inquiry saving; invalid payload rejection; and input retention after simulated server failure. Automated accessibility review is complementary to human review, not a certification.


## September 15 update

Expanded all requested services into eight families and 40 scoped offerings. Added two original AI-generated service visuals, three proposed INR packages, a filterable rate menu, pricing FAQs, and package/service selection carried into the stored inquiry message. Rates are suggested introductory prices, not historical company charges or a binding quote.

## Updated design assessment

| Criterion | Score / 10 |
|---|---|
| Visual impact | 9.3 |
| UI/UX | 9.2 |
| Brand presentation | 9.0 |
| Professionalism | 9.3 |
| Animation quality | 8.8 |
| Mobile responsiveness | 9.3 |
| Content clarity | 9.4 |
| Conversion potential | 9.2 |
| Technical quality | 9.2 |
| Overall premium feel | 9.2 |

Overall self-assessment: 9.2/10 (subjective). The revised rates clarify scope and exclusions; selection carries the chosen offer into the inquiry. Contrast on the pink pricing card was improved after automated testing. The actual logo, confirmed contact details, client work and notification delivery remain the main brand/launch limitations.

The new artwork is stored in public/images/creative-services.webp and public/images/ai-product.webp. Both were made with built-in imagegen. Prompts: a pink/black/off-white editorial flatlay of headphones, invitations and graphic-design materials; an unbranded pale pink product bottle on a glossy black plinth with a translucent pink ribbon. These are illustrative concepts.

## September 16: multi-page website

The website now has nine directly accessible routes: `/`, `/studio`, `/services`, `/work`, `/process`, `/technology`, `/pricing`, `/insights`, and `/contact`. Each route has its own page title, description and primary heading. Shared content and interactions live in `app/site-page.tsx`; route entry files provide page-specific metadata.

`app/page-transitions.tsx` provides a 160ms exit fade and 420ms entrance animation for internal navigation, respecting reduced-motion settings, modifier-clicks, new tabs and browser history. Animation preference is retained for the browser session. Old home-page section links redirect to the corresponding page. Package selection is passed to Contact through its URL and included in the inquiry message.

Validation: all nine direct routes return HTTP 200, each has one primary heading, mobile routes do not overflow at 390px, client navigation remains within the same document, Back restores the previous page, mobile menus close after navigation, pricing selections carry through, the Studio accessibility audit reports no tested violations, and no browser runtime errors were reported.

To run the source locally: install Node.js 22.13 or later, open a terminal in the extracted folder, run `npm ci`, then `npm run dev`. The preview runs at http://localhost:5173 while that process remains running. Local inquiry storage also needs the included D1 migration applied; production storage remains a Sites/Cloudflare D1 binding. This source ZIP excludes installed dependencies, local data and credentials.

## Visibility, hero and navigation refinement

Navigation now follows Home, Services, Work, Process, Pricing, About, with a separate contact CTA. Home is explicitly discoverable, and the current page has a clear underline. The hero uses contain sizing and translation-only motion with internal clearance, preserving the complete flamingo on wide screens. Navigation retains 88% opacity while loading instead of hiding the whole site.

Verified at viewport widths 390, 768, 1024, 1440, 1872 and 2560: no horizontal overflow. All header navigation links resolve and return to full visibility. Home accessibility checks report no tested violations and the browser reports no runtime errors.

Subjective page ratings: Home 9.2/10; Services 9.2/10; Work 8.5/10; Process 9.0/10; Pricing 9.2/10; About 9.0/10. Overall approximately 9.0/10. Work remains concept-led; verified client case studies and the original logo would improve brand credibility.

## October 8: trust content, client logos and motion

- About (`/studio`): founder names removed. Added trusted-partner copy, a "Trusted by teams at" logo marquee, animated stats (calculated from `app/content.ts`), and four "Why brands trust us" cards.
- Home: compact logo marquee under the discipline strip.
- Logos live in `app/client-logos.tsx` as single-colour SVGs that follow the site palette; the list is `clients` in `app/content.ts`. Only show brands you have actually worked with.
- Motion: header condenses on scroll, page titles rise from a mask, staggered reveals, pointer-following glow on cards, button light sweep, count-up stats. The existing Motion toggle and reduced-motion setting still turn everything off (the marquee becomes a static row).
- Fixes: added the missing `build/sites-vite-plugin.ts` so `npm run dev` starts; inquiry table is created automatically on a fresh local database; card hover lifts now work after the reveal animation; friendlier form errors for network/non-JSON failures; request IDs work outside secure contexts; "LinkedIn Or Amazon Ads" capitalisation glitch.
- Fixed "process is not defined" when navigating after opening `/process` directly: the section's `id="process"` made `window.process` point at the HTML element, so Vite's dev runtime attached `process.env` to it and lost it when the page changed. The section id is now `our-process`. Avoid ids that match JavaScript globals (`process`, `global`, `name`, etc.).
- Logo: `public/images/visionpact-logo-nobg.png` is a transparent, cropped version of `visionpact-logo.png` (black converted to alpha, keeping soft edges). The site uses it everywhere instead of the old `mix-blend-mode: screen` crop, which could show a black box.

## Inquiry emails and contact details

- Every contact-form and feedback submission is saved to the database, copied to the Google Sheet, and emailed by the sheet's Apps Script (Gmail, `MailApp`) to `visionpactflamingomedia@gmail.com`, or to the `NOTIFY_EMAIL` script property when set. The email includes every form field and the reference; Reply goes to the visitor. Emails therefore need the Google Sheet connection below; FormSubmit is no longer used.
- The visitor also gets a thank-you email from the same Gmail when they entered an address: the reference, a listed service or priced package, and the rating for feedback, but never their own message, so the form cannot be used to send arbitrary text to someone else. Replies go to the studio inbox. Set the script property `SEND_CONFIRMATIONS` to `no` to turn these off. Gmail allows about 100 emails a day, and each submission uses up to two.
- After pasting a new `Code.gs`, run `testEmail` once in Apps Script to allow sending email, then publish a new version of the web app (Deploy > Manage deployments > Edit > New version).
- Contact details (email, phones, LinkedIn, Instagram) live in `contact` in `app/content.ts`. LinkedIn points to the studio's real profile (https://www.linkedin.com/in/visionpact-flamingo-media-3a99b1440/) and Instagram to https://www.instagram.com/visionpact.digital; both are listed as `sameAs` in the structured data.

## October 10: audit, security, SEO and new sections

**Security**
- Security headers on every response (`next.config.ts`): X-Content-Type-Options, X-Frame-Options DENY, Referrer-Policy, Permissions-Policy, Cross-Origin-Opener-Policy, HSTS, and a Content Security Policy in production builds (dev skips CSP because hot reload needs eval/websockets). `X-Powered-By` is removed.
- Inquiry API: same-origin check, JSON-only, 16 KB limit, zod validation, honeypot, and a rate limit of 6 inquiries per 10 minutes per visitor (`lib/db.ts`, table `inquiry_rate_limits`, migration `drizzle/0001_*`). IPs are stored only as a daily SHA-256 hash.
- The form saves first and skips the email when rate-limited; submissions made within 2 seconds of the page loading (bots) are never emailed; `<` and `>` are stripped from emailed fields.
- Dependencies: `next` 16.3.4 → 16.4.0, `eslint-config-next` → 16.4.0, `sharp` override 0.35.4 → 0.35.5, plus `npm audit fix`. `npm audit --omit=dev` reports 0 vulnerabilities; the remaining advisories are in local dev tooling only.

**SEO**
- Per-page titles/descriptions (`app/seo.ts` → `pageMetadata`), Open Graph and Twitter tags, `ProfessionalService` JSON-LD (name, email, phones only), `/robots.txt` and `/sitemap.xml` built from the request's domain, a branded 404 page (`app/not-found.tsx`, noindex).
- **Set `NEXT_PUBLIC_SITE_URL=https://your-domain` when building for the live site.** Canonical links and the share image (`public/images/og-image.jpg`, 1200×630) need an absolute URL and are omitted without it rather than pointing at localhost.

**Performance and accessibility**
- Tailwind now emits only its base reset (`source(none)`); CSS bundle 154 KB → 71.5 KB. Logo served as WebP (34 KB vs 97 KB PNG). Manrope font is preloaded.
- axe-core (WCAG 2.1 A/AA + best practices): 0 violations on all 9 pages, the mobile menu and the project dialog. Work cards are now `<article>` elements with one real button stretched over the card; hidden section headings fix heading order; Escape closes the mobile menu; the Motion button is disabled with an explanation when the OS requests reduced motion.
- Lint: 0 errors (was 5). The 6 remaining warnings suggest `next/image`; plain `<img>` is kept on purpose because the images are already sized WebP and image optimisation on Cloudflare would add a paid service.

**New content**
- Work: "Pulse dashboard" (second Digital project, animated CSS visual), "Every project includes", "Project types we take on" (links to Services) and a five-step process preview.
- Process: full five-step timeline with what you receive at each step, "What we need from you", four collaboration cards and a process FAQ (answers restate the Pricing page and terms).

**October 12: Process page and feedback form**
- Process: the five-step timeline that repeated the step tabs was replaced by "Your part. Our part." (what clients provide, plus an animated pre-delivery quality checklist). Each step tab now shows what you receive. The "how we work together" cards that overlapped the Work page were removed.
- Feedback form on `/process` and its own page `/feedback` (linked in the footer): name, optional email, service, 1–5 star rating, comments, permission to quote, consent. Saved through `/api/feedback` (table `feedback`, migration `drizzle/0002_*`), rate-limited separately from inquiries, then emailed to the studio inbox via FormSubmit with subject "New client feedback: N/5 | Name". If FormSubmit sends another "Activate Form" email when the first feedback arrives, click it once.
- Please confirm the six quality-checklist items match how you actually work (`qaChecks` in `app/site-page.tsx`).

**SEO (keywords, structured data) and feedback placement**
- The feedback form now sits at the end of About (`/studio`), beside the trust content, instead of Process. `/feedback` stays as a direct link for clients (noindex, not in the sitemap).
- Every page has a keyword-led title and description, page keywords, and visible copy that names the services (hero, Services, Pricing and About intros). `<html lang="en-IN">`.
- Structured data: ProfessionalService + WebSite on every page (services known, INR price range, email, phones, India); Pricing adds an OfferCatalog with all 53 starting prices plus FAQPage; Process adds FAQPage; breadcrumbs on inner pages once the site URL is set.
- Build settings for the live site:
  - `NEXT_PUBLIC_SITE_URL=https://your-domain` (canonical links, share image, breadcrumbs, logo URL).
  - `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=<code>` (optional; the content value from Google Search Console's HTML-tag method).
- After launch: verify the site in Google Search Console and Bing Webmaster Tools, submit `/sitemap.xml`, create a Google Business Profile with the same name, phone and email, and collect genuine reviews. Adding your city to the copy and Business Profile helps local searches ("branding agency in <city>").

**Google Sheet: requests, feedback and clients**
- Every service request and feedback submission is also copied to the studio's Google Sheet ("Visionpact Flamingo Media Business Data" in Drive). The API routes save to the database first, then `lib/sheets.ts` posts the row to the sheet's Apps Script web app in the background (`after()`), so a slow or unavailable sheet never delays or breaks a form. Retried submissions are never copied twice.
- Tabs built by the script: Dashboard (live totals, package value, conversion rate, monthly trend, charts), Service Requests, Feedback, Clients (project tracker with balance), Client Types, Services & Pricing (with how often each was requested), Website (pages, search titles, keywords, forms) and How to use.
- A "purchase" is a service request sent from a Pricing page button: the sheet shows the selected package and its starting price, which the server looks up from `app/content.ts` (`priceForSelection`) rather than trusting the browser. Setting a request's Status to Confirmed copies it to Clients.
- Set-up, once: open the sheet, Extensions > Apps Script, paste `integrations/google-sheets/Code.gs`, add the script property `SHEETS_WEBHOOK_SECRET` (Project Settings > Script properties) with a long private code, run `setup`, then Deploy > New deployment > Web app (Execute as: Me, Who has access: Anyone). Give the website two secrets: `SHEETS_WEBHOOK_URL` (the web app URL) and `SHEETS_WEBHOOK_SECRET` (the same code as the script property; locally the site reads `.dev.vars`, on Cloudflare add both either under the Worker's Settings > Build > Variables and secrets, which the build passes on to the Worker, or as Worker secrets under Settings > Variables and Secrets; not both, since Cloudflare rejects a name defined twice).
- `Code.ready.gs` and `.dev.vars` hold the secret and are ignored by git and left out of the zip. `Code.gs` is the shareable copy with a placeholder. After changing services or prices, run `node integrations/google-sheets/build.mjs`, paste the new `Code.ready.gs` and choose Visionpact > Rebuild layout in the sheet (rows are kept).
- Without the two secrets the website works exactly as before (database + email).

**Run locally**
```
npm ci
npm run dev        # http://localhost:5173
npm run build      # production build into dist/
npm start          # serve the production build at http://127.0.0.1:8787
npm run lint
npx tsc --noEmit
```

**Deploy**
- The project targets Cloudflare Workers with a D1 database binding named `DB` (`dist/server/wrangler.json` after a build). If you publish through the original Sites hosting, publish as before; migrations in `drizzle/` are applied automatically.
- To deploy to your own Cloudflare account instead: build with `NEXT_PUBLIC_SITE_URL` set, create a D1 database (`npx wrangler d1 create visionpact`), set the build variables `D1_DATABASE_ID=<its database_id>` and `D1_DATABASE_NAME=visionpact` (without them the build writes a placeholder ID that Cloudflare rejects), then run `npx wrangler deploy --config dist/server/wrangler.json`. With Cloudflare's Git integration (Workers Builds), add the same two variables under the Worker's Settings > Build > Variables and secrets. The app creates its tables on first use; to create them up front, run `npx wrangler d1 execute visionpact --remote --file drizzle/0000_hot_namorita.sql` and the same for `drizzle/0001_loving_lady_vermin.sql` and `drizzle/0002_curved_doorman.sql`.
- After going live, send one test inquiry from the live domain and click FormSubmit's activation email if a new one arrives.

For reopening the local preview after the server stops, double-click `START-WEBSITE.cmd` in the extracted source folder (after installing dependencies). Keep its terminal window open. This does not publish the site online.

**October 12: hero, footer, 2026 prices and website pricing page**
- Home hero: the "Bring your vision to life" button was removed; the header "Let's talk" button and the end-of-page call to action remain.
- Footer: email and phone numbers are icon rows on one left edge. The email stays on one line above 1050px wide (the contact column is wider) and can only wrap before the "@", never mid-word.
- Prices: all 53 service rates and the three packages raised to 2026 market levels. Sources and reasoning are in `PRICING-NOTES.md`. The Pricing page description now quotes live prices from `app/content.ts`.
- New page `/pricing/website-launch` (`app/website-pricing.tsx`): the Website launch package, then every website type from the price list with who it suits, what is included, a typical timeline and its starting price, plus the maintenance plan, what every website includes, what is paid separately and FAQs. The Website launch card on `/pricing` links to it. Details live in `websiteTypeDetails` in `app/content.ts`; prices still come from the Websites offers, so the Google Sheet price lookup keeps working. Added to the sitemap with its own title, description, breadcrumb and FAQ structured data.
- Google Sheet: `integrations/google-sheets/Code.gs` was regenerated with the new prices and page. Run `node integrations/google-sheets/build.mjs` once on your computer to get a fresh `Code.ready.gs` with your secret, paste it into Apps Script and choose Visionpact > Rebuild layout.

- `START-WEBSITE.cmd` now checks for Node.js 22.13+ and runs `npm ci` automatically the first time it is opened in a freshly extracted folder.
- Work page: the "How a project moves" strip is now "How a website project moves": the five process steps told for a website build, each with an icon, typical timing (Day 1–2 to launch day), what happens and what you receive, joined by a connector that fills step by step when the section scrolls into view (off with Motion off or reduced motion). Buttons go to website prices and the full process. Steps live in `websiteJourney` in `app/site-page.tsx`; timings match the business website on `/pricing/website-launch`.

**October 12 (later): website prices ₹15,000–₹50,000, AI dashboards & platforms ₹50,000–₹60,000**
- Website launch package now starts at ₹15,000 (one-page to five-page websites). Its "Discuss this package" button opens `/pricing/website-launch`; the other two packages still go straight to the inquiry form.
- Website types now run from ₹15,000 (landing page, portfolio) to ₹50,000 (educational & course website), in round thousands. The business website (₹20,000) is marked Recommended. A dark "Need something different?" tile completes the grid and asks for a custom quote.
- New "AI dashboards & platforms" block on that page: AI dashboard & admin panel ₹50,000 (renamed from "Dashboard & admin panel website", now with AI summaries), AI-powered website ₹55,000, business management platform ₹60,000 (renamed from "Company management platform (MVP)"). The list is `platformOffers` in `app/content.ts`; their details are in `websiteTypeDetails`.
- Google Sheet: `Code.gs` regenerated. Run `node integrations/google-sheets/build.mjs` on your computer and paste the new `Code.ready.gs` again, then Visionpact > Rebuild layout.
- Work page timeline: step names changed to Kick-off, Wireframe, Design, Testing and Go live (the Process page keeps Discover to Launch).
- Home logo line: if `clients` in `app/content.ts` is left empty (`[] as const`), the same moving line shows "Platforms we work on": Google Ads, Meta Ads, Instagram, Facebook, LinkedIn, YouTube, X (Twitter) and Amazon Ads, as plain text with the brand asterisk (all are platforms in the service list). With brands listed, it shows their logos under "Trusted by" as before. The hosted preview uses the platforms version.

**October 12: website starting price ₹23,000**
- Website launch package now starts at ₹23,000. Website types: landing page and portfolio ₹23,000, NGO & event ₹25,000, redesign ₹26,000, business website ₹28,000 (Recommended), restaurant & hotel ₹30,000, blog & news ₹32,000, booking ₹36,000, real estate ₹40,000, e-commerce ₹45,000, educational & course ₹50,000. AI dashboards & platforms stay ₹50,000–60,000 and the care plan ₹3,999 a month.
- Google Sheet: run `node integrations/google-sheets/build.mjs` again and paste the new `Code.ready.gs`.

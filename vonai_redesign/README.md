# Handoff: von-ai.com redesign (30-day workflow offer)

## Overview
This redesign covers von-ai.com for the new offer: **one AI workflow, live in 30 days, measured against a day-0 baseline.** It is aimed at professional services firms in Finland with 10–100 people.

The site is now:
- one long landing page (Home), with anchor navigation
- a Contact page
- a standalone Insights resource library

The look is restrained and docs-like: a warm off-white ground, near-black ink, one blue accent, and strong type. The only illustration is a product-UI mock (a results report in an app window); there are no decorative graphics.

Target repo: `obymanyando/von-ai-website` (React 18 + TS + Vite + Tailwind 3 + shadcn/ui + React Router v6 + i18next). Follow the repo's `CLAUDE.md`.

## About the design files
The files in `designs/` are **design references built in HTML**. They show the intended look and behaviour. **They are not production code, so do not copy them in.** Recreate them in the existing codebase:
- Pages live in `src/pages/` and are wrapped in `<Layout>` + `<SEO>`.
- The new nav and footer replace the existing `Navbar` / `Footer`.
- Use Tailwind with the HSL/CSS-variable tokens in `src/index.css`. Map the tokens below onto those variables rather than scattering hex values.
- Use shadcn/ui primitives where they fit: Accordion (FAQ), Checkbox, Input, Textarea, Button. Restyle them to match.

To preview a design, open `designs/*.dc.html` in a browser. `support.js` is only the preview runtime; ignore it.

**Copy:** `en.json` in this folder is the **source of truth** and replaces `src/i18n/locales/en.json`. Every visible string in the designs comes from it, apart from the few additions listed below.

## Hard rules
1. **No prices anywhere.** The website, the meta/OG tags, `llms.txt`, structured data and the chat assistant must not quote any price, price range or price floor. Specifically:
   - Do not render anything from `_parked`. That block holds the pricing section, the price line and the price floor.
   - Leave `_parked` in `en.json` as it is, but never reference it.
   - Pricing questions are answered with `home.faq.a1`: a fixed price agreed before starting, a monthly fee after go-live, and a quote after the free call.
2. **No About section or page.** `_parked.about` is not rendered. Remove the `/about` route if it exists, and do not link to it.
3. **Chat assistant** (`supabase/functions/chat/`, `ChatWidget.tsx`, `docs/AI_ASSISTANT_CONFIGURATION.md`): update the system prompt to the new offer. It must **never quote prices or a floor**. When asked about cost, it paraphrases `home.faq.a1` and offers the free call. Use the `chatWidget.*` strings for greeting and quick replies. The widget is currently commented out in `App.tsx`; leave that as it is unless told otherwise.
4. **Finnish is out of scope today.**
   - Do not edit `fi.json` and do not machine-translate.
   - The existing `fi.json` holds the old offer's copy, so FI visitors would see outdated content. **Hide the language switcher and force `en`** until FI is ready, for example `lng: "en"` in the i18n init, behind a clear `// TODO: re-enable FI` comment.
   - Add new keys to `en.json` only.

## Routes
| Design | Route | Notes |
|---|---|---|
| VonAI Home | `/` | Replaces Home.tsx. Single page with anchors `#offer`, `#process`, `#results`, `#faq`. |
| VonAI Contact | `/contact` | Restyle. Keep the real Calendly embed and the existing `send-contact-email` submission. |
| VonAI Insights | `/resources` | Replaces Resources.tsx. Keep `/resources/:slug` and its email capture. |

Remove or redirect to `/` any routes and pages that belong to the old offer: `/ai-roi-sprint`, `/services`, `/roi-calculator`, `/30-day-outcome-pilot` and `/about`. Check with Oby before deleting the PDF in `public/`. Leave `/privacy`, `/auth`, `/admin` and `/brand-guide` working. Update `sitemap.xml` and `llms.txt` to match. `llms.txt` must also carry no prices.

## Global layout
- Container: `max-width:1200px; margin:0 auto; padding:0 24px`. Page background `#FBFAF8`. Page root has `overflow-x:clip`.
- Sections: 112–128px vertical padding. Each section intro is a mono eyebrow, then an H2, then an optional lead paragraph.
- Grids use `repeat(auto-fit, minmax(320px,1fr))` so they wrap. Layouts must reflow down to 360px.
- `html { scroll-behavior:smooth }` and `section[id] { scroll-margin-top:72px }` so anchors clear the sticky nav.
- **Light theme only.** Set `defaultTheme="light"` or force it; no dark theme has been designed.

## Nav (all pages)
- Sticky at `top:0`, `z-index:20`. Background `rgba(251,250,248,.88)` with `backdrop-filter:blur(12px)`. Height 72px.
- Bottom border `1px solid #E7E5E1`. On Home it is transparent until `scrollY > 8`; on other pages it is always visible.
- Left: logo (`logo-dark.png`, shown at 104×24 and cropped to the wordmark; see the design).
- Centre (15px, 28px gaps, colour `#3A3936`):
  - The offer / How it works / Results / FAQ (`nav.offer`, `nav.process`, `nav.results`, `nav.faq`). On Home these are anchors; on other pages they link to `/#offer` etc.
  - **Insights** links to `/resources`. **This is a new key: add `nav.insights: "Insights"`.**
  - The active page gets `#1A1A1A` and weight 500.
- Right:
  - "Contact" (`nav.contact`): pill, bg `#EFEDE9`, hover `#E6E3DE`.
  - "Book a free call" (`nav.bookCall`): pill, bg `#1A1A1A`, text `#FBFAF8`, weight 500, hover `#333230`.
  - Pills use `padding:10px 16–18px; border-radius:999px`. Both go to `/contact`.
- Mobile (<768px): use a shadcn Sheet with the same items. This state has not been drawn, so use judgement.

## Footer (all pages)
1. **Closing CTA card.**
   - Padding `0 24px 24px`. Inner card bg `#1A1A1A`, text `#FBFAF8`, radius 24px, padding `clamp(56px,7vw,96px) clamp(28px,6vw,80px)`.
   - Decorative ring: 620px circle, `border:100px solid oklch(0.62 0.19 258)`, positioned `right:-300px; bottom:-380px`.
   - H2 `clamp(38px,4.4vw,60px)`, body 19px `#B7B5B0`.
   - Primary button: light pill "Book a free call →" to `/contact`. Next to it, a `mailto:hello@von-ai.com` text link in `#B7B5B0` with a 1px `#6E6C68` underline.
   - Home copy: `home.finalCta.*`. Insights copy is new; see the Insights section.
2. **Footer grid.**
   - Logo plus `footer.description`.
   - Column "ON THIS PAGE" (`footer.navigation`): offer, process, results, FAQ.
   - Column "COMPANY" (`footer.company`): Insights, Contact, Privacy policy (`footer.privacy`).
   - Column labels: Geist Mono 12px `#8A8781`, letter-spacing .05em.
   - Bottom row: border-top `#E7E5E1`, 13px `#8A8781`, `footer.rights` with the current year.

## Home (`/`)
In order:

1. **Hero** (`home.hero.*`)
   - Eyebrow pill: white, `1px #E7E5E1` border, radius 999px, padding `6px 14px`, 14px `#3A3936`, with a 7px blue dot (`oklch(0.58 0.2 258)`).
   - H1: `title1` + " " + `title2` in one heading. `title2` is coloured `#8A8781`. Size `clamp(44px,6.4vw,80px)`, weight 500, letter-spacing −.035em, line-height 1.02, `text-wrap:balance`, max-width 980px.
   - Subtitle: `clamp(18px,1.6vw,21px)`, `#55524D`, max-width 680px.
   - Buttons:
     - `cta`: dark pill, 17px, padding `15px 22px`, links to `/contact`.
     - `secondaryCta`: `#EFEDE9` pill, links to `#process`.
     - Then `priceLine` ("Fixed price, agreed before we start.") as 15px `#6B6964`. **Use `home.hero.priceLine`, never `_parked.hero.priceLine`.**
   - **Results-report window.** Sits 72px below, max-width 1248px, with two blue decorative rings behind it:
     - Ring 1: 760px, 120px border, `right:-260px; top:-160px`.
     - Ring 2: 520px, 90px border, `left:-300px; top:40px`.
     - Window chrome: translucent white `rgba(255,255,255,.72)`, radius `16px 16px 0 0`, shadow `0 30px 80px -30px rgba(10,20,50,.35)`. Three traffic-light dots and an "EXAMPLE REPORT" mono badge.
     - Body is a 2-column grid (`minmax(200px,260px) | 1fr`, min-height 360px). Left sidebar: a "WORKFLOW" label, two selectable tabs (01 Enquiry handling, 02 Proposal drafting), and a DAY 0 → DAY 30 bar captioned "Live in daily use".
     - Right pane: breadcrumb "Results report / {workflow}", a 26px heading, a description, and a 3-column table (MEASURE / DAY 0 / DAY 30). The DAY 30 column is blue, weight 500.
     - Selected tab: bg `oklch(0.96 0.03 258)`, text `oklch(0.45 0.2 258)`, weight 500.
     - The tab data (the `W` array in the design's logic) is **illustrative example data, clearly labelled "Example report"**. Put it in `src/data/` and add the strings to `en.json` under a new `home.report.*` key. Confirm the numbers with Oby before launch.
2. **Problem** (`home.problem.*`): 2-column. Left: eyebrow "THE PROBLEM" + H2. Right:
   - A ruled list of `pain1–4` with mono numbers 01–04 (`#A5A19A`), 19px text, rows padded 22px, `#E7E5E1` rules.
   - Below the list, `closing` at 19px `#55524D`, indented 56px.
3. **Offer** `#offer` (`home.offer.*`), section bg `#F1EFEB`.
   - Two white cards, radius 16px. On hover: `translateY(-3px)` + shadow `0 18px 36px -20px rgba(10,20,50,.3)`.
   - Each card has a blue mono number, a 26px title and a 16px description, then a `#F8F7F5` footer strip. The strip has a "WHAT WE MEASURE" mono label and the metrics as chips (white, `#DEDBD6` border, radius 999px).
   - The metrics come from `option1Metrics` / `option2Metrics`: strip the "What we measure:" prefix, split on commas, drop the trailing period.
   - Below the cards, `otherNote` sits in a dashed `#CFCBC4` box (radius 14px) with a "Book a free call →" underlined link.
4. **Process** `#process` (`home.process.*`)
   - **Timeline of 4 steps.** It must lay out as 4-across, 2×2 or 1-column, **never 3+1**. The design does this by nesting two pairs: outer grid `minmax(min(100%,420px),1fr)`, inner grids `minmax(min(100%,200px),1fr)`.
   - Each step: a 10px dot plus a 2px `#D9D5CF` line, then a mono label, a 20px title and a 15px description.
   - Split `stepNTitle` at the colon. The part before it is the label (uppercase, e.g. "WEEK 1"); the part after is the title.
   - The last step (Day 30) has a blue dot and blue label, and no line.
   - Then a white card, "What we need from you" (`requirementsTitle`), with `req1–3` in a ruled grid with mono numbers.
5. **Results** `#results` (`home.proof.*`)
   - One white card, flex-wrap. Left part (`flex:2 1 420px`): `case1Label` (mono), "The problem" + `case1Problem`, "What we built" + `case1Solution`.
   - Right part (`flex:1 1 260px`, bg `#F8F7F5`): a large "+40%" at `clamp(56px,6vw,80px)` in blue, with `case1Result` below.
   - **New keys:** "The problem" and "What we built" as `home.proof.problemLabel` / `solutionLabel`, and the stat "+40%" as `home.proof.case1Stat`.
6. **Fit** (`home.fit.*`), dark section bg `#18191C`, text `#EDECEA`.
   - Eyebrow "FIT" in `oklch(0.75 0.14 258)`.
   - Two cards, radius 16px, border `#2F3035`. The "good" card has bg `#1F2024` and blue tick marks. The "bad" card is transparent, with grey dashes and `#B7B5B0` text.
7. **FAQ** `#faq` (`home.faq.*`, **8 questions**)
   - Left column is sticky (`top:120px`): eyebrow, H2, then "Something else? hello@von-ai.com".
   - Right column is an accordion. One item is open at a time, and the first is open by default.
   - Question rows: 18px, 22px vertical padding. The "+" rotates 45° when open (`.2s`). Answers: 16px `#55524D`, max-width 600px.
8. **Closing CTA + footer** (see Footer).

## Contact (`/contact`, `contact.*`)
- Header: eyebrow, H1 `contact.hero.title`, subtitle.
- Two columns (`minmax(360px,1fr)`):
  - **Left:** a white card (radius 18px, `#E7E5E1` border). Header shows `bookCall.title` / `subtitle` with a "30 MIN" mono pill. Body is the **real Calendly inline embed**; the calendar in the design is a stand-in.
  - **Right:**
    - **Form card**, using `form.*` labels and placeholders. Inputs: `#DEDBD6` border, radius 8px, padding `11px 12px`, bg `#FBFAF8`.
    - Consent checkbox with a link to `/privacy`. If someone submits without consent, show `consentRequired` in red `#B3261E`.
    - Keep the existing validation and Supabase submission. Use toast for success and error with `successTitle`/`successDesc` and `errorTitle`/`errorDesc`.
    - Under the form: "Or email directly: hello@von-ai.com".
    - **"Useful to mention" card** (`whatHelps.*`), bg `#F1EFEB`, with blue bullet dots.

## Insights (`/resources`)
- Header:
  - Eyebrow "INSIGHTS".
  - H1 "Practical AI playbooks for service firms."
  - Lead: "Checklists, scorecards and templates you can use this week. Some are free. For the rest, leave your email and we'll send you a copy."
- **Featured resource banner:** dark card, radius 18px, with a blue ring and a mock document preview.
- **Filters:**
  - Type chips: All / Guide / Checklist / Template / Playbook / Scorecard. Active chip is `#1A1A1A` with light text.
  - Segmented access toggle: All / Free / Email required, on a `#EFEDE9` track with a white active thumb.
- **Card grid** `repeat(auto-fill,minmax(280px,1fr))`:
  - Each card has a mock-document thumbnail, type · access label, title, description, and an action ("Download" or "Get the PDF →").
  - Hover: border `#BDB8B0` + `translateY(-2px)`.
  - Empty state: "No resources match these filters."
- **The six resources in the design are placeholders.** Oby is supplying the real ones. Drive the grid and the featured slot from the existing resources data source, so adding a resource is a data change only.
- Closing CTA copy is new. Add it to `en.json` as `resources.cta.title`: "Rather talk it through?" and `resources.cta.subtitle`: "A guide gets you started. A free 30-minute call tells you which workflow to take on first."
- Add the header strings as `resources.hero.*`.

## Interactions
- Link hover: colour changes to `oklch(0.5 0.2 258)`.
- Pill hover: one shade darker (values above).
- Transitions: 150–300ms ease on background, border-color, transform and box-shadow.
- Respect `prefers-reduced-motion`.
- Tap targets must be at least 44px on mobile.

## Design tokens
**Colour**
| Role | Value |
|---|---|
| Page bg | `#FBFAF8` |
| Surface | `#FFFFFF` |
| Subtle surfaces | `#F1EFEB` (section/card), `#F8F7F5` (card footer, table head), `#F5F3F0` (hover), `#EFEDE9` (secondary button) |
| Borders | `#E7E5E1` default, `#EDEBE7` inner, `#DEDBD6` inputs/chips, `#D9D5CF` / `#CFCBC4` strong/dashed |
| Ink | `#1A1A1A` primary, `#3A3936`, `#55524D` body, `#6B6964` secondary, `#8A8781` meta, `#A5A19A` faint |
| Dark | `#1A1A1A` CTA card, `#18191C` section, `#1F2024` card, `#2F3035` border, `#B7B5B0` text, `#6E6C68` dim |
| Accent | `oklch(0.58 0.2 258)` base · `oklch(0.5 0.2 258)` text/links · `oklch(0.62 0.19 258)` rings · `oklch(0.75 0.14 258)` on dark · `oklch(0.96 0.03 258)` tint bg · `oklch(0.45 0.2 258)` text on tint |
| Error | `#B3261E` |

**Type:** Geist (400/500/600) for the UI; Geist Mono (400/500) for eyebrows, labels and table headers. Both are on Google Fonts, or use the `geist` package.

| Element | Size | Other |
|---|---|---|
| H1, Home | `clamp(44px,6.4vw,80px)` | weight 500, letter-spacing −.035em |
| H1, inner pages | `clamp(40px,5vw,64px)` | weight 500, letter-spacing −.035em |
| H2 | `clamp(34px,3.6vw,48px)` | letter-spacing −.03em, line-height 1.08 |
| Lead | 18–21px | `#55524D`, `text-wrap:pretty` |
| Body | 15–17px | |
| Eyebrow | 13px mono | `#8A8781`, letter-spacing .05em |
| Small mono labels | 11–12px | |

**Radius:**
- 999px: pills and chips
- 24px: CTA card
- 18px / 16px: cards and windows
- 14px: callouts
- 10px / 8px: rows and inputs

**Shadows:**
- Report window: `0 30px 80px -30px rgba(10,20,50,.35)`
- Card hover: `0 18px 36px -20px rgba(10,20,50,.3)`

**Spacing:** 4-based. Common steps: 8 / 12 / 16 / 20 / 24 / 28 / 32 / 48 / 56 / 64 / 112 / 128.

## Assets (`designs/assets/`)
- `logo-dark.png`: the same file as the repo's `src/assets/logo-dark.png`. It is cropped to the wordmark with `mix-blend-mode:multiply`; a trimmed SVG would be better if one exists.
- `logo-light.png`: not used on these pages.
- `oby.jpg`: not used (no About section).
- Icons: none. Arrows are the text glyph →, and ticks and chevrons are CSS borders. Lucide is fine if needed.

## Pending (from Oby)
- Real Insights resources (titles, descriptions, PDFs, which are gated).
- Confirmed or replaced example numbers for the hero results report.
- Finnish translation (a later session).

## Files
- `designs/VonAI Home.dc.html`
- `designs/VonAI Contact.dc.html`
- `designs/VonAI Insights.dc.html`
- `en.json`: copy source of truth

In each design file, the markup holds the exact styles, and the `class Component` block at the bottom holds the data arrays.

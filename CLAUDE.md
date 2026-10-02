# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## What This Is

VonAI website (von-ai.com): the landing site for one offer, "one AI workflow, live in 30 days, measured against a day-0 baseline", aimed at professional services firms in Finland with 10 to 100 people. Three public pages (single-page Home, Contact, Insights library), plus an admin dashboard and a (currently disabled) AI chat assistant. The design source is the handoff in `vonai_redesign/` (README, HTML references, `en.json`).

---

## Commands

Run from the repo root:

```bash
npm ci --legacy-peer-deps  # Install (vite 8 vs @vitejs/plugin-react-swc 3 peer conflict)
npm run dev                # Dev server at localhost:8080
npm run typecheck          # tsc --noEmit on the app
npm run lint               # ESLint (pre-existing findings in src/components/ui, Admin, Auth, BrandGuide)
npm run build              # Production build (Vite) chained with check:copy
npm run check:copy         # i18n keys resolve, _parked unreferenced, no prices shipped (needs dist/)
npm run preview            # Preview production build locally
```

No test runner is configured. `check:copy` is the automated copy gate; it runs after every build and fails the build on a violation.

---

## Stack

- **React 18 + TypeScript + Vite** (SWC transpiler)
- **Tailwind CSS 3** with HSL CSS variable tokens + shadcn/ui (Radix UI)
- **React Router v6** (client-side SPA routing)
- **TanStack React Query** for server state
- **Supabase** — PostgreSQL + Auth + Edge Functions (serverless)
- **i18next** — localization; English only for now (see Localization)
- **next-themes** — forced to the light theme (no dark theme is designed)

---

## Architecture

### Routing (`src/App.tsx`)

All routes are client-side. Public pages wrap themselves in `<Layout>` (Navbar + Footer). `<ChatWidget>` is commented out in `App.tsx`; leave it off unless told otherwise.

| Route | Page |
|---|---|
| `/` | Home: one long page with anchors `#offer`, `#process`, `#results`, `#faq` |
| `/contact` | Calendly inline embed + contact form (`send-contact-email`) |
| `/resources` | Insights library (featured banner, type/access filters) |
| `/resources/:slug` | Resource detail; gated ones use `GatedDownloadDialog` |
| `/privacy` | Privacy policy |
| `/auth` | Login / signup |
| `/admin` | Admin dashboard (role-gated) |
| `/brand-guide` | Brand guide + PDF export (still documents the old palette) |

`/ai-roi-sprint`, `/services`, `/roi-calculator`, `/30-day-outcome-pilot` and `/about` redirect to `/`: 301s in `public/_redirects` (Workers static assets) plus a client-side fallback (`RETIRED_PATHS` in `App.tsx`). `_redirects` also sends the deleted pilot PDF to `/`. There is no About page by design.

`ScrollToTop` scrolls to the URL hash target when there is one (instant on page change or cold load, smooth for same-page anchors); section links everywhere are router links to `/#id`.

### Component Conventions

- `src/components/ui/` — shadcn/ui primitives (do not hand-edit; regenerate via CLI)
- `src/components/` — shared components (`Layout`, `Navbar`, `Footer`, `ResourceCard`, `GatedDownloadDialog`, `ChatWidget`, `Section` for Privacy)
- `src/components/site/` — redesign primitives: `Logo` (transparent wordmark), `SectionIntro` (eyebrow + H2 + lead), `ClosingCta` (dark CTA card)
- `src/components/home/` — the Home sections in page order (`Hero` + `ResultsReport`, `Problem`, `Offer`, `Process`, `Results`, `Fit`, `Faq`)
- `src/pages/` — one file per route; use `<Layout>` and `<SEO>` at the top

`<Layout closingCta={{ title, subtitle }} footerVariant="full|minimal">`: Home and Insights pass a closing CTA; Contact uses the minimal footer.

Data and helpers:
- `src/lib/site.ts` — `CONTACT_EMAIL`, `CALENDLY_URL`, `HOME_SECTIONS`, `FAQ_COUNT`
- `src/lib/copy.ts` — derives display strings from en.json values (metric chips, "Week 1: Title" splits)
- `src/data/resources.ts` — the Insights library; adding a resource is a data-only change. `featured: true` picks the banner (falls back to newest)
- `src/data/exampleReport.ts` — structure of the hero "Example report"; its strings and illustrative numbers live in `home.report.*`

### Localization

All user-visible strings live in `src/i18n/locales/en.json`. Use the `useTranslation()` hook and dot-notation keys (`t("home.hero.title")`).

- **English is forced** (`lng: "en"` in `src/i18n/index.ts`) and `fi.json` is not imported, because it still holds the old offer (including a price). Both are marked `TODO: re-enable FI`. Do not edit `fi.json` or machine-translate; add new keys to `en.json` only until the FI translation exists.
- **No prices anywhere.** `en.json` keeps a `_parked` block (pricing, About copy) exactly as delivered, but nothing may reference it, and a Vite plugin (`stripParkedCopy` in `vite.config.ts`) removes it from the bundle. Cost questions are answered with `home.faq.a1`. `npm run check:copy` enforces this.

### Styling

Tailwind utility-first, light theme only (`forcedTheme="light"`). Fonts: Geist and Geist Mono (Google Fonts in `index.html`).

Colour tokens are CSS variables in `src/index.css`: the shadcn set (`background`, `foreground`, `primary` = ink, `secondary`, `muted`, `border`, `input`, `ring`, `destructive`) remapped to the redesign palette, plus the "Redesign palette" block mapped in `tailwind.config.ts` as `ink-*`, `surface-*`, `line-*`, `night-*` and `brand-*` (the accent, kept in oklch). Never use raw hex in components.

Shared component classes in `index.css` (`@layer components`): `site-container`, `eyebrow`, `mono-label`, `h1-home`, `h1-page`, `h2`, `h2-cta`, `lead`, `pill` + `pill-dark|pill-soft|pill-light|pill-lg`, `link-underline`, `ring-deco`. Shadows: `shadow-window`, `shadow-lift`. Reduced motion is respected globally.

### Supabase Integration

Client: `src/integrations/supabase/client.ts`
Types: `src/integrations/supabase/types.ts` (auto-generated — do not hand-edit)

**Tables:** `chat_conversations`, `chat_messages`, `contact_submissions`, `rate_limit_events`, `user_roles`
**RPC:** `has_role(user_id, role)`, `get_users_with_roles()`
**RLS:** enabled on all tables; admin role required for sensitive reads

### Edge Functions (`supabase/functions/`)

| Function | Purpose |
|---|---|
| `chat/` | AI chat streaming via SSE; called from `ChatWidget.tsx`. Its `VONAI_CONTEXT` prompt mirrors the offer copy and must never quote prices |
| `send-contact-email/` | Contact form email handler; called from `Contact.tsx`. Its `pilot-lead` branch has no caller since the pilot page was removed |
| `og-meta/` | Open Graph meta for `/`, `/contact`, `/resources` (other paths fall back to `/`) |

All three have `verify_jwt: false` (public endpoints with IP-based rate limiting).

### Environment Variables

Frontend (Vite prefix required):
```
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
```

Backend / Edge Functions:
```
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
SESSION_SECRET
```

`.env` and `.env.local` are gitignored; put the two `VITE_` values in `.env.local` for local dev. Edge function changes need `npx supabase functions deploy <name>`; they are not deployed by the site build.

---

## Key Files

| File | Purpose |
|---|---|
| `src/App.tsx` | Root: providers, router, all routes |
| `src/pages/Home.tsx` | Single-page Home; sections live in `src/components/home/`, JSON-LD has no price |
| `src/components/ChatWidget.tsx` | AI chat UI with SSE streaming |
| `src/components/Layout.tsx` | Global layout wrapper |
| `src/i18n/locales/en.json` | All English UI strings (redesign handoff copy + `resources.*`) |
| `vonai_redesign/README.md` | Design handoff: layout, tokens and hard rules for the site |
| `scripts/check-copy.mjs` | Copy guardrail behind `npm run check:copy` |
| `src/integrations/supabase/client.ts` | Supabase client init |
| `supabase/functions/chat/index.ts` | AI chat edge function |
| `tailwind.config.ts` | Colour tokens (shadcn + redesign palette), fonts, shadows |
| `vite.config.ts` | Build config, including the `_parked` stripping plugin |

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## What This Is

VonAI website — a B2B consulting platform and landing site for VonAI (von-ai.com). Includes AI chat, contact submissions, ROI calculator, admin dashboard, and bilingual support (EN/FI).

---

## Commands

Run from the repo root:

```bash
npm run dev        # Dev server at localhost:8080
npm run build      # Production build (Vite)
npm run lint       # ESLint
npm run preview    # Preview production build locally
```

No test runner is configured.

---

## Stack

- **React 18 + TypeScript + Vite** (SWC transpiler)
- **Tailwind CSS 3** with HSL CSS variable tokens + shadcn/ui (Radix UI)
- **React Router v6** (client-side SPA routing)
- **TanStack React Query** for server state
- **Supabase** — PostgreSQL + Auth + Edge Functions (serverless)
- **i18next** — EN/FI localization
- **next-themes** — dark/light mode via class toggle

---

## Architecture

### Routing (`src/App.tsx`)

All routes are client-side. The `<Layout>` wrapper (Navbar + Footer) wraps every page. A global `<ChatWidget>` is mounted at the app root.

| Route | Page |
|---|---|
| `/` | Home |
| `/services` | Services |
| `/ai-roi-sprint` | AI ROI Sprint details |
| `/roi-calculator` | Interactive ROI calculator |
| `/about` | About |
| `/contact` | Contact form + Calendly |
| `/auth` | Login / signup |
| `/admin` | Admin dashboard (role-gated) |
| `/brand-guide` | Brand guide + PDF export |

### Component Conventions

- `src/components/ui/` — shadcn/ui primitives (do not hand-edit; regenerate via CLI)
- `src/components/` — custom shared components (`Layout`, `Navbar`, `Footer`, `Section`, `CTAButton`, `Card`, `ChatWidget`, etc.)
- `src/pages/` — one file per route; use `<Layout>` and `<SEO>` at the top

Reusable layout primitives:
- `<Section variant="default|muted">` — full-width content container
- `<FeatureCard icon={Icon} title description />` — icon + text card
- `<CTAButton />` — localized CTA with variants

### Localization

All user-visible strings live in `src/i18n/locales/en.json` and `fi.json`. Use the `useTranslation()` hook and dot-notation keys (`t("home.hero.title")`). Language is detected from localStorage, then `navigator.language`, with English as fallback.

When adding new strings, add keys to **both** locale files.

### Styling

Tailwind utility-first. Dark mode via `.dark` class (next-themes). Color tokens are HSL CSS variables defined in `src/index.css` — use semantic names (`bg-background`, `text-foreground`, `bg-primary`, etc.) rather than raw Tailwind colors. Custom animations: `animate-fade-in-up`, `animate-fade-in`.

### Supabase Integration

Client: `src/integrations/supabase/client.ts`
Types: `src/integrations/supabase/types.ts` (auto-generated — do not hand-edit)

**Tables:** `chat_conversations`, `chat_messages`, `contact_submissions`, `rate_limit_events`, `user_roles`
**RPC:** `has_role(user_id, role)`, `get_users_with_roles()`
**RLS:** enabled on all tables; admin role required for sensitive reads

### Edge Functions (`supabase/functions/`)

| Function | Purpose |
|---|---|
| `chat/` | AI chat streaming via SSE; called from `ChatWidget.tsx` |
| `send-contact-email/` | Contact form email handler; called from `Contact.tsx` |
| `og-meta/` | Dynamic Open Graph meta generation |

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

The `.env` file is git-tracked in this repo — avoid committing secrets to it.

---

## Key Files

| File | Purpose |
|---|---|
| `src/App.tsx` | Root: providers, router, all routes |
| `src/pages/Home.tsx` | Landing page (hero, features, FAQ, CTA) |
| `src/components/ChatWidget.tsx` | AI chat UI with SSE streaming |
| `src/components/Layout.tsx` | Global layout wrapper |
| `src/i18n/locales/en.json` | All English UI strings |
| `src/integrations/supabase/client.ts` | Supabase client init |
| `supabase/functions/chat/index.ts` | AI chat edge function |
| `tailwind.config.ts` | Color tokens, animations, container config |

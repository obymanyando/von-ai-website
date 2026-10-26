# VonAI website

The site for VonAI's offer: one AI workflow, live in 30 days, measured against a day-0 baseline. For professional services firms with 10 to 100 people.

![VonAI](public/android-chrome-512x512.png)

## Overview

- **Home** - one long page: hero with an example results report, the problem, the offer, how it works from kickoff to results, results, fit, and FAQ
- **Contact** - Calendly booking and a contact form
- **Insights** - a library of free and email-gated PDF guides (hidden until real PDFs exist: `INSIGHTS_ENABLED` in `src/lib/site.ts`)
- **AI Assistant** - chat assistant (built, currently disabled on the site)

The design and copy come from the handoff in `vonai_redesign/`. The site never shows prices.

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **Hosting**: Cloudflare Workers (static assets)
- **Database**: Supabase (PostgreSQL + Auth + Edge Functions)
- **AI**: Google Gemini 2.5 Flash (direct API)
- **Email**: Resend
- **DNS**: Cloudflare
- **State Management**: TanStack Query
- **Routing**: React Router v6
- **i18n**: i18next (English only for now; Finnish disabled until translated)

## Features

### Pages
- **Home** (`/`) - single page with anchors `#offer`, `#process`, `#results`, `#faq`
- **Contact** (`/contact`) - Calendly inline embed + contact form (Resend via `send-contact-email`)
- **Insights** (`/resources`, `/resources/:slug`) - resource library with type/access filters and gated downloads; hidden for now, both routes redirect to `/`
- **Privacy** (`/privacy`), **Brand guide** (`/brand-guide`), **Admin** (`/admin`, `/auth`)

### AI Assistant
- Real-time streaming responses (SSE)
- Google Gemini 2.5 Flash via OpenAI-compatible endpoint
- Conversation persistence in Supabase
- IP-based rate limiting and abuse protection
- Quick reply suggestions

### Admin Dashboard
- Contact submission management
- User role management
- Rate limit monitoring

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/obymanyando/von-ai-website.git
cd von-ai-website
npm ci --legacy-peer-deps   # vite 8 vs @vitejs/plugin-react-swc 3 peer conflict
npm run dev
```

### Environment Variables

**Frontend** (`.env.local`, gitignored):
```env
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_PUBLISHABLE_KEY=<your-supabase-anon-key>
```

**Supabase Edge Functions** (set via `npx supabase secrets set`):
```env
GOOGLE_AI_API_KEY=<your-google-ai-api-key>
RESEND_API_KEY=<your-resend-api-key>
```

## Project Structure

```
├── public/                  # Static assets
├── src/
│   ├── components/         # Reusable components
│   │   └── ui/            # shadcn/ui components
│   ├── hooks/             # Custom React hooks
│   ├── i18n/              # Internationalization (EN/FI)
│   ├── integrations/      # Supabase client + types
│   ├── lib/               # Utility functions
│   └── pages/             # Page components
├── supabase/
│   └── functions/         # Supabase Edge Functions (Deno)
│       ├── chat/          # AI chat (Gemini 2.5 Flash, SSE streaming)
│       ├── send-contact-email/  # Contact form → Resend
│       └── og-meta/       # Dynamic Open Graph tags for social sharing
├── wrangler.toml          # Cloudflare Workers config
└── tailwind.config.ts     # Tailwind configuration
```

## Deployment

### Frontend (Cloudflare Workers)
Pushes to `main` auto-deploy via Cloudflare's GitHub integration.
- Build command: `npm run build`
- Output: `dist/` (served as static assets via `wrangler.toml`)
- SPA routing handled by `not_found_handling = "single-page-application"`

### Edge Functions (Supabase)
```bash
npx supabase login
npx supabase link --project-ref <project-ref>
npx supabase functions deploy chat
npx supabase functions deploy send-contact-email
npx supabase functions deploy og-meta
```

## Development

### Available Scripts

```bash
npm run dev         # Start development server (port 8080)
npm run typecheck   # TypeScript check
npm run lint        # Run ESLint
npm run build       # Build for production, then check:copy
npm run check:copy  # i18n keys resolve, no _parked references, no prices shipped
npm run preview     # Preview production build
```

### Code Style

- Light theme only; Geist / Geist Mono
- All visible strings in `src/i18n/locales/en.json`; no prices anywhere (see `CLAUDE.md`)
- ESLint for code quality
- Tailwind CSS for styling with semantic design tokens
- Component-based architecture with shadcn/ui

## Security

- Row Level Security (RLS) on all database tables
- IP-based rate limiting on AI endpoints (10 msg/min, 20 conversations/hr)
- Input validation and sanitization (2000 char limit, 50 message context cap)
- Admin-only access controls for sensitive data

## License

Proprietary - All rights reserved.

## Contact

For inquiries, visit [von-ai.com](https://von-ai.com) or use the contact form.

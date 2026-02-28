# VonAI - AI Consulting & Solutions

A modern B2B web application for AI consulting services, featuring interactive ROI tools and an AI-powered assistant.

![VonAI](public/android-chrome-512x512.png)

## Overview

VonAI is a professional consulting platform that helps businesses understand and implement AI solutions. The platform includes:

- **AI ROI Calculator** - Interactive tool to estimate potential returns from AI implementation
- **AI ROI Sprint** - Structured program for rapid AI value assessment
- **AI Assistant** - Intelligent chatbot for visitor engagement and support
- **Contact & Scheduling** - Integrated booking and contact forms

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
- **i18n**: i18next (EN/FI)

## Features

### Pages
- **Home** - Landing page with value propositions
- **AI ROI Sprint** - Sprint program details with ROI calculator
- **Contact** - Contact form with Calendly integration

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
npm install
npm run dev
```

### Environment Variables

**Frontend** (`.env`):
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
npm run dev      # Start development server (port 8080)
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Code Style

- TypeScript strict mode enabled
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

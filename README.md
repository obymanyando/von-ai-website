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
- **Backend**: Lovable Cloud (Supabase-powered)
- **AI Integration**: Lovable AI Gateway
- **State Management**: TanStack Query
- **Routing**: React Router v6

## Features

### Pages
- **Home** - Landing page with value propositions
- **Services** - AI consulting service offerings
- **AI ROI Sprint** - Sprint program details
- **ROI Calculator** - Interactive ROI estimation tool
- **About** - Company information
- **Contact** - Contact form with Calendly integration

### AI Assistant
- Real-time streaming responses
- Conversation persistence
- Rate limiting and abuse protection
- Quick reply suggestions

### Admin Dashboard
- Contact submission management
- User role management
- Rate limit monitoring

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or bun

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd vonai

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables

The following environment variables are required:

```env
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_PUBLISHABLE_KEY=<your-supabase-anon-key>
```

## Project Structure

```
├── docs/                    # Documentation
├── public/                  # Static assets
├── src/
│   ├── assets/             # Images and media
│   ├── components/         # Reusable components
│   │   └── ui/            # shadcn/ui components
│   ├── hooks/             # Custom React hooks
│   ├── integrations/      # External service integrations
│   ├── lib/               # Utility functions
│   └── pages/             # Page components
├── supabase/
│   └── functions/         # Edge functions
└── tailwind.config.ts     # Tailwind configuration
```

## Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Code Style

- TypeScript strict mode enabled
- ESLint for code quality
- Tailwind CSS for styling with semantic design tokens
- Component-based architecture with shadcn/ui

## Documentation

- [AI Assistant Configuration](docs/AI_ASSISTANT_CONFIGURATION.md) - Detailed documentation of the AI assistant implementation

## Security

- Row Level Security (RLS) on all database tables
- IP-based rate limiting on AI endpoints
- Input validation and sanitization
- Admin-only access controls for sensitive data

## License

Proprietary - All rights reserved.

## Contact

For inquiries, please use the contact form on the website or schedule a consultation through the integrated Calendly booking system.

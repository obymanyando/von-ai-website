import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const BASE_URL = "https://von-ai.com";
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`;

// Bot user agents to detect
const BOT_USER_AGENTS = [
  'facebookexternalhit',
  'Facebot',
  'LinkedInBot',
  'Twitterbot',
  'WhatsApp',
  'Slackbot',
  'TelegramBot',
  'Discordbot',
  'Pinterest',
  'Googlebot',
  'bingbot',
  'yandex',
  'Applebot',
];

// Route-specific meta data
const ROUTE_META: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'VonAI | One AI workflow, live in 30 days',
    description: 'One AI workflow, live in 30 days and measured against how you work today. For professional services firms with 10 to 100 people.',
  },
  '/contact': {
    title: 'Book a free call | VonAI',
    description: "A free 30-minute call. Tell us which workflow takes the most time, and we'll tell you honestly whether it's a good fit.",
  },
  '/resources': {
    title: 'Insights: practical AI playbooks for service firms | VonAI',
    description: "Checklists, scorecards and templates professional services firms can use this week. Some are free; for the rest, leave your email and we'll send a copy.",
  },
};

function isBot(userAgent: string): boolean {
  const ua = userAgent.toLowerCase();
  return BOT_USER_AGENTS.some(bot => ua.includes(bot.toLowerCase()));
}

function getMetaForPath(path: string): { title: string; description: string } {
  // Normalize path
  const normalizedPath = path === '' ? '/' : path.startsWith('/') ? path : `/${path}`;
  return ROUTE_META[normalizedPath] || ROUTE_META['/'];
}

function generateHTML(path: string): string {
  const meta = getMetaForPath(path);
  const canonicalUrl = `${BASE_URL}${path === '/' ? '' : path}`;
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- Primary Meta Tags -->
  <title>${meta.title}</title>
  <meta name="title" content="${meta.title}">
  <meta name="description" content="${meta.description}">
  
  <!-- Canonical -->
  <link rel="canonical" href="${canonicalUrl}">
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:title" content="${meta.title}">
  <meta property="og:description" content="${meta.description}">
  <meta property="og:image" content="${DEFAULT_IMAGE}">
  <meta property="og:site_name" content="VonAI">
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${canonicalUrl}">
  <meta name="twitter:title" content="${meta.title}">
  <meta name="twitter:description" content="${meta.description}">
  <meta name="twitter:image" content="${DEFAULT_IMAGE}">
  
  <!-- Redirect non-bots to actual page -->
  <meta http-equiv="refresh" content="0;url=${canonicalUrl}">
</head>
<body>
  <h1>${meta.title}</h1>
  <p>${meta.description}</p>
  <p>Redirecting to <a href="${canonicalUrl}">${canonicalUrl}</a>...</p>
</body>
</html>`;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.searchParams.get('path') || '/';
    const userAgent = req.headers.get('user-agent') || '';
    
    console.log(`Request for path: ${path}`);
    console.log(`User-Agent: ${userAgent}`);
    console.log(`Is bot: ${isBot(userAgent)}`);
    
    // Always return the pre-rendered HTML (bots need it, humans get redirected)
    const html = generateHTML(path);
    
    return new Response(html, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in og-meta function:', error);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

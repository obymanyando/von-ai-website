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
    title: 'VonAI - AI Consulting & Automation Solutions for Business',
    description: 'Transform your business with AI-powered solutions. VonAI provides expert consulting, automation, and custom AI implementations to drive efficiency and growth.',
  },
  '/services': {
    title: 'AI Services | VonAI',
    description: 'Discover our comprehensive AI services including consulting, automation, machine learning solutions, and custom AI development tailored for your business needs.',
  },
  '/ai-roi-sprint': {
    title: 'AI ROI Sprint - 2-Week AI Implementation | VonAI',
    description: 'Get measurable AI results in just 2 weeks. Our AI ROI Sprint delivers rapid implementation with clear business outcomes and proven ROI.',
  },
  '/roi-calculator': {
    title: 'AI ROI Calculator | VonAI',
    description: 'Calculate your potential return on investment from AI implementation. See how much time and money AI automation can save your business.',
  },
  '/about': {
    title: 'About VonAI | AI Consulting Experts',
    description: 'Learn about VonAI\'s mission to democratize AI for businesses. Meet our team of AI experts dedicated to helping you succeed with artificial intelligence.',
  },
  '/contact': {
    title: 'Contact VonAI | Get Started with AI',
    description: 'Ready to transform your business with AI? Contact VonAI today for a free consultation and discover how we can help you achieve your goals.',
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

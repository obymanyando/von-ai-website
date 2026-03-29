/**
 * Cloudflare Worker for Bot Detection and OG Meta Routing
 * 
 * This worker detects social media bot crawlers and proxies their requests
 * to the og-meta edge function to serve pre-rendered HTML with correct meta tags.
 * 
 * SETUP INSTRUCTIONS:
 * 1. Go to Cloudflare Dashboard → Workers & Pages → Create Worker
 * 2. Paste this code and deploy
 * 3. Go to your domain's DNS settings in Cloudflare
 * 4. Add a Worker Route: yourdomain.com/* → this worker
 * 
 * REQUIREMENTS:
 * - Custom domain connected to Lovable (not *.lovable.app)
 * - Cloudflare managing DNS for your domain
 * - The og-meta edge function deployed in your Lovable project
 */

// Bot user agents to detect
// Social/messaging bots that need pre-rendered HTML for link previews
// NOTE: Search engine bots (Googlebot, bingbot, yandex, Applebot) are
// intentionally EXCLUDED — they should crawl the real SPA so pages get indexed.
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
];

// Your Supabase edge function URL
const OG_META_FUNCTION_URL = 'https://dumubiidyhdszrmaezpv.supabase.co/functions/v1/og-meta';

// Your actual origin (Lovable hosting)
const ORIGIN_URL = 'https://von-ai.com'; // Change this to your actual domain

/**
 * Check if the user agent belongs to a bot crawler
 */
function isBot(userAgent) {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return BOT_USER_AGENTS.some(bot => ua.includes(bot.toLowerCase()));
}

/**
 * Main request handler
 */
async function handleRequest(request) {
  const userAgent = request.headers.get('User-Agent') || '';
  const url = new URL(request.url);
  const path = url.pathname;

  // Log for debugging (visible in Cloudflare dashboard)
  console.log(`Request: ${path}, User-Agent: ${userAgent}, Is Bot: ${isBot(userAgent)}`);

  // If it's a bot, serve pre-rendered HTML from edge function
  if (isBot(userAgent)) {
    try {
      const ogMetaUrl = `${OG_META_FUNCTION_URL}?path=${encodeURIComponent(path)}`;
      
      const response = await fetch(ogMetaUrl, {
        method: 'GET',
        headers: {
          'User-Agent': userAgent,
        },
      });

      if (response.ok) {
        const html = await response.text();
        
        // Return the pre-rendered HTML without the redirect meta tag for bots
        // Bots don't need to be redirected, they just need the meta tags
        const htmlWithoutRedirect = html.replace(
          /<meta http-equiv="refresh"[^>]*>/gi,
          ''
        );

        return new Response(htmlWithoutRedirect, {
          status: 200,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'public, max-age=3600',
            'X-Robots-Tag': 'noindex', // Prevent duplicate indexing
          },
        });
      }
    } catch (error) {
      console.error('Error fetching og-meta:', error);
      // Fall through to origin on error
    }
  }

  // For regular users and failed bot requests, pass through to origin
  return fetch(request);
}

// Cloudflare Workers event listener
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

// Alternative: Module syntax for newer Cloudflare Workers
export default {
  async fetch(request, env, ctx) {
    return handleRequest(request);
  },
};

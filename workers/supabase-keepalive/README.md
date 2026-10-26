# supabase-keepalive

Cloudflare Worker that keeps the site's Supabase project (`rqoxgcwicjuphfcwbxka`) from being paused. Free-tier projects pause after about 7 days without database activity, and a paused project breaks the contact form with no visible error (found 2026-10-26).

Every 3 days at 06:00 UTC it reads one row from `testimonials` through PostgREST with the publishable key, the same public key the site ships. `testimonials` is not in this repo's migrations (it predates them); if it is ever dropped, runs fail with 404 and the probe path needs a new public-read table. It retries once, then throws, which marks the run as failed in Cloudflare.

## Deploy (from repo root)
```bash
cd workers/supabase-keepalive
npx wrangler secret put SUPABASE_PUBLISHABLE_KEY   # paste the VITE_SUPABASE_PUBLISHABLE_KEY value
npx wrangler deploy
```

## Check it is working
- Right after deploy: `npx wrangler deploy` prints `schedule: 0 6 */3 * *` under triggers, and the dashboard's Settings, Triggers shows the same cron. The first run can be up to 3 days away.
- Cloudflare dashboard, Workers & Pages, `supabase-keepalive`: the Cron Events / Logs tab shows each run; a healthy run logs `keepalive_ok`.
- Nothing alerts on failure yet: a failed run is only visible in the dashboard.

## Test
`npm run test:workers` from the repo root (Node's built-in test runner, no extra dependencies).

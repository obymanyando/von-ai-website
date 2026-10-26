// Supabase pauses free-tier projects after about 7 days without database
// activity. A paused project silently broke the live contact form until
// 2026-10-26, and a laptop-bound Cowork job meant to prevent it had stopped
// running. The keepalive Worker runs this read every 3 days instead.

export interface Env {
  SUPABASE_URL: string;
  // Public key (already shipped in the site bundle), kept out of git anyway.
  SUPABASE_PUBLISHABLE_KEY: string;
}

// A page load or a health endpoint doesn't count as activity; a PostgREST
// query does. testimonials allows public reads, so no service-role key needed.
// The table isn't in this repo's migrations; if it is dropped, runs fail loudly (404).
export const PROBE_PATH = "/rest/v1/testimonials?select=id&limit=1";

const ATTEMPTS = 2;
const TIMEOUT_MS = 15_000;

type FetchLike = (url: string, init?: RequestInit) => Promise<Response>;

export async function probe(
  env: Env,
  fetchImpl: FetchLike = fetch,
  retryDelayMs = 5_000,
  timeoutMs = TIMEOUT_MS,
): Promise<number> {
  for (const key of ["SUPABASE_URL", "SUPABASE_PUBLISHABLE_KEY"] as const) {
    if (!env[key]) throw new Error(`keepalive: ${key} is not set`);
  }

  let lastError = "";
  for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
    try {
      const res = await fetchImpl(`${env.SUPABASE_URL}${PROBE_PATH}`, {
        headers: { apikey: env.SUPABASE_PUBLISHABLE_KEY },
        signal: AbortSignal.timeout(timeoutMs),
      });
      if (res.ok) return res.status;
      // Keep the status even if the body can't be read.
      const body = await res.text().catch(() => "");
      lastError = `${res.status} ${body.slice(0, 200)}`;
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
    }
    if (attempt < ATTEMPTS) await new Promise((r) => setTimeout(r, retryDelayMs));
  }
  throw new Error(`keepalive: Supabase read failed after ${ATTEMPTS} attempts: ${lastError}`);
}

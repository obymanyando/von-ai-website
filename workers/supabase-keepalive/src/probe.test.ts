import { test } from "node:test";
import assert from "node:assert/strict";
import { probe, PROBE_PATH, type Env } from "./probe.ts";

const env: Env = {
  SUPABASE_URL: "https://example.supabase.co",
  SUPABASE_PUBLISHABLE_KEY: "sb_publishable_test",
};

type Call = { url: string; init?: RequestInit };

function fakeFetch(responses: Array<Response | Error>) {
  const calls: Call[] = [];
  const impl = async (url: string, init?: RequestInit) => {
    calls.push({ url, init });
    const next = responses.shift();
    if (!next) throw new Error("unexpected extra fetch");
    if (next instanceof Error) throw next;
    return next;
  };
  return { impl, calls };
}

test("reads one row with the publishable key", async () => {
  const { impl, calls } = fakeFetch([new Response("[]", { status: 200 })]);
  const status = await probe(env, impl, 0);
  assert.equal(status, 200);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, `${env.SUPABASE_URL}${PROBE_PATH}`);
  assert.equal(new Headers(calls[0].init?.headers).get("apikey"), env.SUPABASE_PUBLISHABLE_KEY);
});

test("retries once after a failed attempt", async () => {
  const { impl, calls } = fakeFetch([new Response("down", { status: 503 }), new Response("[]", { status: 200 })]);
  assert.equal(await probe(env, impl, 0), 200);
  assert.equal(calls.length, 2);
});

test("retries once after a network error", async () => {
  const { impl, calls } = fakeFetch([new TypeError("fetch failed"), new Response("[]", { status: 200 })]);
  assert.equal(await probe(env, impl, 0), 200);
  assert.equal(calls.length, 2);
});

test("throws with the status when both attempts fail", async () => {
  const { impl, calls } = fakeFetch([new Response("down", { status: 503 }), new Response("paused", { status: 540 })]);
  await assert.rejects(probe(env, impl, 0), /540/);
  assert.equal(calls.length, 2);
});

test("throws without calling out when config is missing", async () => {
  const { impl, calls } = fakeFetch([]);
  await assert.rejects(probe({ ...env, SUPABASE_PUBLISHABLE_KEY: "" }, impl, 0), /SUPABASE_PUBLISHABLE_KEY/);
  assert.equal(calls.length, 0);
});

// A hung request must not block the run: each attempt aborts on its own timer.
test("aborts a hung request and retries", { timeout: 2_000 }, async (t) => {
  let calls = 0;
  const hang = (_url: string, init?: RequestInit) => {
    calls++;
    return new Promise<Response>((_, reject) => {
      init?.signal?.addEventListener("abort", () => reject(init.signal?.reason));
    });
  };
  // AbortSignal.timeout() uses an unref'd timer in Node, and neither this fake fetch nor
  // the per-test timeout holds the loop open. On Node 22 the loop drains before the abort
  // fires and the runner cancels the test ("Promise resolution is still pending but the
  // event loop has already resolved"); Node 26 happened to pass. A real fetch would hold
  // a socket, so hold the loop open in its place. Cleared in t.after, not a finally:
  // after a 2s timeout the body is abandoned and a finally would never run, so the
  // interval would keep the run (CI, the pre-commit hook) alive forever.
  const keepAlive = setInterval(() => {}, 1_000);
  t.after(() => clearInterval(keepAlive));
  await assert.rejects(probe(env, hang, 0, 20), /timeout|abort/i);
  assert.equal(calls, 2);
});

import { probe, type Env } from "./probe.ts";

// Only the default export lives here: workerd treats every named export of the
// main module as an entrypoint and refuses non-handler values.
export default {
  // Throwing marks the cron run as failed in Cloudflare's dashboard and logs,
  // which is the signal to check the project before the 7-day window closes.
  async scheduled(controller: { cron: string }, env: Env): Promise<void> {
    const status = await probe(env);
    console.log(JSON.stringify({ event: "keepalive_ok", status, cron: controller.cron }));
  },
};

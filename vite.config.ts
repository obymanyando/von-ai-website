import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

/**
 * en.json keeps a `_parked` block (pricing, About copy) so it is ready when
 * switched back on, but the site must not ship prices anywhere, including the
 * JS bundle that crawlers and LLMs read. Drop the block at build time; the
 * source file stays as the redesign handoff delivered it.
 */
function stripParkedCopy(): Plugin {
  return {
    name: "vonai:strip-parked-copy",
    enforce: "pre",
    transform(code, id) {
      if (!/[\\/]src[\\/]i18n[\\/]locales[\\/][a-z-]+\.json$/.test(id.split("?")[0])) return null;
      const data = JSON.parse(code);
      if (!("_parked" in data)) return null;
      delete data._parked;
      return { code: JSON.stringify(data), map: null };
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [stripParkedCopy(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});

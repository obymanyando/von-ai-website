#!/usr/bin/env node
/**
 * Copy guardrails for the redesign. Run after `npm run build`:
 *   npm run check:copy
 *
 * 1. Every translation key used in src/ exists in en.json. Literal t("a.b")
 *    keys must exist exactly; template keys like t(`home.faq.q${n}`) must
 *    match at least one key.
 * 2. Nothing references the `_parked` block (prices, About copy) outside the
 *    locale file itself.
 * 3. No price leaks: no currency amounts in the built bundle, index.html,
 *    llms.txt or the edge functions that talk to visitors.
 *
 * Exits non-zero with a list of failures.
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const failures = [];
const fail = (msg) => failures.push(msg);

function walk(dir, exts) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) return name === "node_modules" ? [] : walk(p, exts);
    return exts.some((e) => p.endsWith(e)) ? [p] : [];
  });
}

function flatten(obj, prefix = "") {
  return Object.entries(obj).flatMap(([k, v]) =>
    v && typeof v === "object" ? flatten(v, `${prefix}${k}.`) : [`${prefix}${k}`],
  );
}

// 1. Translation keys
const en = JSON.parse(readFileSync(join(ROOT, "src/i18n/locales/en.json"), "utf8"));
const keys = new Set(flatten(en));
const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
for (const file of walk(join(ROOT, "src"), [".ts", ".tsx"])) {
  const src = readFileSync(file, "utf8");
  for (const m of src.matchAll(/\bt\(\s*"([A-Za-z0-9_.]+)"/g)) {
    if (!keys.has(m[1])) fail(`missing key "${m[1]}" (${relative(ROOT, file)})`);
  }
  for (const m of src.matchAll(/\bt\(\s*`([^`]+)`/g)) {
    const pattern = new RegExp(
      "^" + m[1].split(/\$\{[^}]+\}/).map(escape).join("[^.]+") + "$",
    );
    if (![...keys].some((k) => pattern.test(k))) {
      fail(`no key matches template "${m[1]}" (${relative(ROOT, file)})`);
    }
  }
}

// 2. _parked references
const parkedScan = [
  ...walk(join(ROOT, "src"), [".ts", ".tsx"]),
  ...walk(join(ROOT, "supabase/functions"), [".ts", ".tsx"]),
  ...walk(join(ROOT, "public"), [".txt", ".xml", ".html", ".json"]),
  join(ROOT, "index.html"),
];
for (const file of parkedScan) {
  if (readFileSync(file, "utf8").includes("_parked")) {
    fail(`references _parked: ${relative(ROOT, file)}`);
  }
}

// 3. Price leaks
const PRICE = /€\s?\d|\d\s?€|\bEUR\b|\beuros?\b|\d[\d,. ]*\s?(?:\+\s?)?VAT\b|\bALV\b/i;
const priceScan = [
  ...walk(join(ROOT, "dist"), [".js", ".html", ".txt", ".xml", ".css"]),
  join(ROOT, "index.html"),
  join(ROOT, "public/llms.txt"),
  join(ROOT, "supabase/functions/chat/index.ts"),
  join(ROOT, "supabase/functions/og-meta/index.ts"),
];
if (!existsSync(join(ROOT, "dist"))) fail("dist/ not found: run `npm run build` first");
for (const file of priceScan) {
  const text = readFileSync(file, "utf8");
  const m = text.match(PRICE);
  if (m) {
    const at = text.indexOf(m[0]);
    fail(`price-like text "${text.slice(Math.max(0, at - 30), at + 30).replace(/\s+/g, " ")}" in ${relative(ROOT, file)}`);
  }
}

if (failures.length) {
  console.error(`check:copy failed (${failures.length}):\n- ${failures.join("\n- ")}`);
  process.exit(1);
}
console.log("check:copy passed: keys resolve, _parked unreferenced, no prices shipped.");

/**
 * Helpers that derive display strings from en.json values, so the copy file
 * stays the single source of truth (rules from the redesign handoff README).
 */

/** "What we measure: a, b, c." -> ["A", "B", "C"] */
export function parseMetrics(value: string): string[] {
  return value
    .replace(/^[^:]*:\s*/, "")
    .replace(/\.\s*$/, "")
    .split(",")
    .map((m) => m.trim())
    .filter(Boolean)
    .map((m) => m.charAt(0).toUpperCase() + m.slice(1));
}

/** "Week 1: Map and measure" -> { label: "Week 1", title: "Map and measure" } */
export function splitStepTitle(value: string): { label: string; title: string } {
  const i = value.indexOf(":");
  if (i === -1) return { label: "", title: value.trim() };
  return { label: value.slice(0, i).trim(), title: value.slice(i + 1).trim() };
}

/** 1 -> "01" */
export function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

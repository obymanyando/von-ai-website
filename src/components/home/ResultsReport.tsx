import { KeyboardEvent, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  EXAMPLE_REPORT_ROW_COUNT,
  EXAMPLE_REPORT_WORKFLOWS,
  type ExampleReportWorkflow,
} from "@/data/exampleReport";
import { pad2 } from "@/lib/copy";
import { cn } from "@/lib/utils";

/** Product-UI mock of a day-30 results report, in an app window. */
export function ResultsReport() {
  const { t } = useTranslation();
  const [active, setActive] = useState<ExampleReportWorkflow>("enquiry");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const k = (key: string) => t(`home.report.${active}.${key}`);

  // Roving focus between tabs, per the WAI-ARIA tabs pattern.
  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const last = EXAMPLE_REPORT_WORKFLOWS.length - 1;
    const next =
      e.key === "ArrowDown" || e.key === "ArrowRight"
        ? (i === last ? 0 : i + 1)
        : e.key === "ArrowUp" || e.key === "ArrowLeft"
          ? (i === 0 ? last : i - 1)
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? last
              : null;
    if (next === null) return;
    e.preventDefault();
    setActive(EXAMPLE_REPORT_WORKFLOWS[next]);
    tabRefs.current[next]?.focus();
  };

  return (
    <div
      role="figure"
      aria-label={t("home.hero.reportLabel")}
      className="relative z-[1] rounded-t-2xl border border-b-0 border-black/[.08] bg-white/[.72] px-2.5 pt-2.5 shadow-window backdrop-blur-[6px]"
    >
      <div className="flex h-[30px] items-center gap-[7px] px-2.5" aria-hidden>
        <span className="h-[11px] w-[11px] rounded-full bg-[#E6B3AE]" />
        <span className="h-[11px] w-[11px] rounded-full bg-[#EAD7A6]" />
        <span className="h-[11px] w-[11px] rounded-full bg-[#B8D9B4]" />
        <span className="ml-auto rounded-md border border-line bg-white px-2 py-0.5 font-mono text-[11px] uppercase text-ink-meta">
          {t("home.report.badge")}
        </span>
      </div>

      <div className="grid min-h-[360px] overflow-hidden rounded-t-[10px] border border-b-0 border-line-inner bg-white md:grid-cols-[minmax(200px,260px)_minmax(0,1fr)]">
        <div className="flex flex-col gap-1 border-b border-line-inner px-4 py-[22px] text-sm text-ink-body md:border-b-0 md:border-r">
          <p className="mono-label px-2.5 pb-2.5">{t("home.report.workflowLabel")}</p>
          <div role="tablist" aria-orientation="vertical" className="flex flex-col gap-1">
            {EXAMPLE_REPORT_WORKFLOWS.map((id, i) => {
              const selected = id === active;
              return (
                <button
                  key={id}
                  ref={(el) => (tabRefs.current[i] = el)}
                  type="button"
                  role="tab"
                  id={`report-tab-${id}`}
                  aria-selected={selected}
                  aria-controls="report-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(id)}
                  onKeyDown={(e) => onKeyDown(e, i)}
                  className={cn(
                    "flex min-h-[44px] items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors duration-150 md:min-h-0",
                    selected ? "bg-brand-tint font-medium text-brand-on-tint" : "hover:bg-surface-hover",
                  )}
                >
                  <span className="font-mono opacity-60">{pad2(i + 1)}</span>
                  {t(`home.report.${id}.title`)}
                </button>
              );
            })}
          </div>
          <div className="mt-4 flex flex-col gap-2 border-t border-line-inner px-2.5 pt-4 md:mt-auto">
            <div className="flex justify-between font-mono text-[11px] uppercase text-ink-meta">
              <span>{t("home.report.day0")}</span>
              <span>{t("home.report.day30")}</span>
            </div>
            <div className="h-1 rounded-sm bg-brand-ring" />
            <span className="text-[13px] text-ink-soft">{t("home.report.liveLabel")}</span>
          </div>
        </div>

        <div
          id="report-panel"
          role="tabpanel"
          aria-labelledby={`report-tab-${active}`}
          className="flex min-w-0 flex-col gap-4 px-[clamp(20px,3vw,40px)] pb-8 pt-[26px]"
        >
          <p className="text-[13px] text-ink-meta">
            {t("home.report.breadcrumb")} / {k("title")}
          </p>
          <p className="text-pretty text-[26px] font-medium leading-tight tracking-[-.02em]">{k("head")}</p>
          <p className="max-w-[720px] text-pretty text-[15px] leading-[1.5] text-ink-body">{k("desc")}</p>
          <table className="w-full overflow-hidden rounded-[10px] text-sm [border-collapse:separate] [border-spacing:0] [outline:1px_solid_hsl(var(--line-inner))]">
            <thead className="bg-surface-sub font-mono text-[11px] uppercase tracking-[.04em] text-ink-meta">
              <tr>
                <th scope="col" className="w-1/2 px-4 py-2.5 text-left font-normal">
                  {t("home.report.measure")}
                </th>
                <th scope="col" className="px-2 py-2.5 text-left font-normal">
                  {t("home.report.day0")}
                </th>
                <th scope="col" className="px-2 py-2.5 pr-4 text-left font-normal">
                  {t("home.report.day30")}
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: EXAMPLE_REPORT_ROW_COUNT }, (_, i) => i + 1).map((n) => (
                <tr key={n}>
                  <th scope="row" className="border-t border-line-inner px-4 py-3 text-left font-normal">
                    {k(`row${n}Label`)}
                  </th>
                  <td className="border-t border-line-inner px-2 py-3 text-ink-meta">{k(`row${n}Day0`)}</td>
                  <td className="border-t border-line-inner px-2 py-3 pr-4 font-medium text-brand-text">
                    {k(`row${n}Day30`)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

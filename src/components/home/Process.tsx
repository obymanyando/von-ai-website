import { useTranslation } from "react-i18next";
import { SectionIntro } from "@/components/site/SectionIntro";
import { pad2, splitStepTitle } from "@/lib/copy";
import { cn } from "@/lib/utils";

// Two nested pairs, not one 4-item grid: auto-fit on four items can wrap 3+1,
// pairs can only give 4-across, 2x2 or 1-column.
const STEP_PAIRS = [
  [1, 2],
  [3, 4],
] as const;
const LAST_STEP = 4;
const REQS = [1, 2, 3] as const;

export function Process() {
  const { t } = useTranslation();
  return (
    <section id="process">
      <div className="site-container flex flex-col gap-14 pb-28 pt-28 md:pt-32">
        <SectionIntro eyebrow={t("home.process.eyebrow")} title={t("home.process.title")} />
        <ol className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] gap-x-3 gap-y-10">
          {STEP_PAIRS.map((pair) => (
            <li key={pair[0]} className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-x-3 gap-y-10">
              {pair.map((n) => {
                const { label, title } = splitStepTitle(t(`home.process.step${n}Title`));
                const last = n === LAST_STEP;
                return (
                  <div key={n} className="flex flex-col gap-[18px]">
                    <div aria-hidden className="flex items-center gap-2.5">
                      <span className={cn("h-2.5 w-2.5 flex-none rounded-full", last ? "bg-brand" : "bg-ink")} />
                      <span className={cn("h-0.5 flex-1", last ? "bg-transparent" : "bg-line-strong")} />
                    </div>
                    <div className="flex flex-col gap-2.5 pr-4">
                      <span
                        className={cn(
                          "font-mono text-xs uppercase tracking-[.05em]",
                          last ? "text-brand-text" : "text-ink-meta",
                        )}
                      >
                        {label}
                      </span>
                      <h3 className="text-xl font-medium tracking-[-.01em]">{title}</h3>
                      <p className="text-pretty text-[15px] leading-[1.55] text-ink-body">
                        {t(`home.process.step${n}Desc`)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </li>
          ))}
        </ol>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-x-8 gap-y-6 rounded-2xl border border-line bg-white p-6 sm:p-7">
          <h3 className="text-xl font-medium tracking-[-.01em]">{t("home.process.requirementsTitle")}</h3>
          {REQS.map((n) => (
            <div key={n} className="grid grid-cols-[28px_minmax(0,1fr)] gap-2 text-[15px] leading-[1.5] text-ink-2">
              <span className="pt-[3px] font-mono text-xs text-ink-faint">{pad2(n)}</span>
              <span className="text-pretty">{t(`home.process.req${n}`)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

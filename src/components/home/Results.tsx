import { useTranslation } from "react-i18next";
import { SectionIntro } from "@/components/site/SectionIntro";

export function Results() {
  const { t } = useTranslation();
  return (
    <section id="results" className="border-t border-line">
      <div className="site-container flex flex-col gap-12 py-28">
        <SectionIntro eyebrow={t("home.proof.eyebrow")} title={t("home.proof.title")} />
        <article className="flex flex-wrap overflow-hidden rounded-2xl border border-line bg-white">
          <div className="flex min-w-0 flex-[2_1_420px] flex-col gap-[22px] p-6 sm:p-8">
            <p className="font-mono text-xs uppercase tracking-[.04em] text-ink-meta">{t("home.proof.case1Label")}</p>
            <div className="flex flex-col gap-1.5">
              <h3 className="text-[13px] font-normal text-ink-meta">{t("home.proof.problemLabel")}</h3>
              <p className="text-pretty text-[17px] leading-[1.55] text-ink-2">{t("home.proof.case1Problem")}</p>
            </div>
            <div className="flex flex-col gap-1.5">
              <h3 className="text-[13px] font-normal text-ink-meta">{t("home.proof.solutionLabel")}</h3>
              <p className="text-pretty text-[17px] leading-[1.55] text-ink-2">{t("home.proof.case1Solution")}</p>
            </div>
          </div>
          <div className="flex flex-[1_1_260px] flex-col justify-end gap-2 bg-surface-sub p-6 shadow-[-1px_0_0_hsl(var(--line-inner)),0_-1px_0_hsl(var(--line-inner))] sm:p-8">
            <p
              aria-hidden
              className="text-[clamp(56px,6vw,80px)] font-medium leading-none tracking-[-.04em] text-brand-text"
            >
              {t("home.proof.case1Stat")}
            </p>
            <p className="text-[17px] text-ink-2">{t("home.proof.case1Result")}</p>
          </div>
        </article>
      </div>
    </section>
  );
}

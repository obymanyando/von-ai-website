import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SectionIntro } from "@/components/site/SectionIntro";
import { pad2, parseMetrics } from "@/lib/copy";

const OPTIONS = [1, 2] as const;

export function Offer() {
  const { t } = useTranslation();
  return (
    <section id="offer" className="bg-muted">
      <div className="site-container flex flex-col gap-12 py-28">
        <SectionIntro
          eyebrow={t("home.offer.eyebrow")}
          title={t("home.offer.title")}
          lead={t("home.offer.subtitle")}
        />
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] gap-5">
          {OPTIONS.map((n) => (
            <article
              key={n}
              className="flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-[3px] hover:shadow-lift"
            >
              <div className="flex flex-1 flex-col gap-4 p-6 sm:p-7">
                <span className="font-mono text-[13px] text-brand-text">{pad2(n)}</span>
                <h3 className="text-[26px] font-medium tracking-[-.02em]">{t(`home.offer.option${n}Title`)}</h3>
                <p className="text-pretty text-base leading-[1.55] text-ink-body">{t(`home.offer.option${n}Desc`)}</p>
              </div>
              <div className="flex flex-col gap-3 border-t border-line-inner bg-surface-sub px-6 pb-6 pt-5 sm:px-7">
                <p className="mono-label">{t("home.offer.measureLabel")}</p>
                <ul className="flex flex-wrap gap-2">
                  {parseMetrics(t(`home.offer.option${n}Metrics`)).map((m) => (
                    <li key={m} className="rounded-full border border-line-input bg-white px-3 py-[5px] text-sm text-ink-2">
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-[14px] border border-dashed border-line-dashed px-6 py-5">
          <p className="max-w-[720px] text-pretty text-base leading-[1.5] text-ink-2">{t("home.offer.otherNote")}</p>
          <Link to="/contact" className="inline-flex min-h-[44px] items-center gap-2 text-base text-ink md:min-h-0">
            <span className="link-underline">
              {t("home.offer.otherCta")} <span aria-hidden>→</span>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

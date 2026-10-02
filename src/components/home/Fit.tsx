import { useTranslation } from "react-i18next";
import { SectionIntro } from "@/components/site/SectionIntro";

const ITEMS = [1, 2, 3] as const;

export function Fit() {
  const { t } = useTranslation();
  return (
    <section className="bg-night text-night-fg">
      <div className="site-container flex flex-col gap-12 py-28">
        <SectionIntro eyebrow={t("home.fit.eyebrow")} title={t("home.fit.title")} eyebrowClassName="text-brand-on-dark" />
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-5">
          <div className="flex flex-col gap-1.5 rounded-2xl border border-night-line bg-night-card p-6 sm:p-7">
            <h3 className="pb-3 text-xl font-medium">{t("home.fit.goodTitle")}</h3>
            <ul>
              {ITEMS.map((n) => (
                <li
                  key={n}
                  className="grid grid-cols-[28px_minmax(0,1fr)] gap-2 border-t border-night-line py-3.5 text-base leading-[1.5]"
                >
                  {/* Tick drawn with two borders, as in the design (no icon font). */}
                  <span aria-hidden className="mt-[5px] h-[9px] w-4 -rotate-45 border-b-2 border-l-2 border-brand-on-dark" />
                  <span className="text-pretty">{t(`home.fit.good${n}`)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-1.5 rounded-2xl border border-night-line p-6 sm:p-7">
            <h3 className="pb-3 text-xl font-medium">{t("home.fit.badTitle")}</h3>
            <ul>
              {ITEMS.map((n) => (
                <li
                  key={n}
                  className="grid grid-cols-[28px_minmax(0,1fr)] gap-2 border-t border-night-line py-3.5 text-base leading-[1.5] text-night-text"
                >
                  <span aria-hidden className="mt-[11px] h-0.5 w-3.5 bg-night-dim" />
                  <span className="text-pretty">{t(`home.fit.bad${n}`)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

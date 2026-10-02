import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ResultsReport } from "./ResultsReport";

export function Hero() {
  const { t } = useTranslation();
  return (
    <header className="relative overflow-hidden">
      <div className="site-container relative z-[2] flex flex-col gap-7 pt-16 md:pt-[88px]">
        <p className="flex items-center gap-2.5 self-start rounded-full border border-line bg-white px-3.5 py-1.5 text-sm text-ink-2">
          <span aria-hidden className="h-[7px] w-[7px] flex-none rounded-full bg-brand" />
          <span>{t("home.hero.eyebrow")}</span>
        </p>
        <h1 className="h1-home max-w-[980px]">
          {t("home.hero.title1")} <span className="text-ink-meta">{t("home.hero.title2")}</span>
        </h1>
        <p className="lead max-w-[680px] text-[clamp(18px,1.6vw,21px)]">{t("home.hero.subtitle")}</p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <Link to="/contact" className="pill pill-dark pill-lg">
            {t("home.hero.cta")} <span aria-hidden>→</span>
          </Link>
          <Link to="/#process" className="pill pill-soft pill-lg text-ink hover:text-ink">
            {t("home.hero.secondaryCta")}
          </Link>
          {/* Never _parked.hero.priceLine: no prices on the site. */}
          <span className="text-[15px] text-ink-soft">{t("home.hero.priceLine")}</span>
        </div>
      </div>

      <div className="relative mx-auto mt-14 max-w-[1248px] px-4 sm:px-6 md:mt-[72px]">
        {/* Spec sizes from md up; smaller below so the rings stay clear of the CTA row on phones. */}
        <div
          aria-hidden
          className="ring-deco right-[-200px] top-[-40px] h-[420px] w-[420px] border-[70px] md:right-[-260px] md:top-[-160px] md:h-[760px] md:w-[760px] md:border-[120px]"
        />
        <div
          aria-hidden
          className="ring-deco left-[-220px] top-[140px] h-[340px] w-[340px] border-[60px] md:left-[-300px] md:top-10 md:h-[520px] md:w-[520px] md:border-[90px]"
        />
        <ResultsReport />
      </div>
    </header>
  );
}

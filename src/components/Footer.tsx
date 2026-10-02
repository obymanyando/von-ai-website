import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Logo } from "@/components/site/Logo";
import { ClosingCta, type ClosingCtaCopy } from "@/components/site/ClosingCta";
import { HOME_SECTIONS } from "@/lib/site";

export type FooterVariant = "full" | "minimal";

interface FooterProps {
  /** Dark closing call-to-action card above the footer. Omit for none. */
  closingCta?: ClosingCtaCopy;
  /** "minimal" is a single row (used on Contact, where extra exits cost bookings). */
  variant?: FooterVariant;
}

const colLabel = "font-mono text-xs uppercase tracking-[.05em] text-ink-meta";
const colLink = "inline-flex min-h-[44px] items-center text-ink md:min-h-0";

export function Footer({ closingCta, variant = "full" }: FooterProps) {
  const { t } = useTranslation();
  const rights = t("footer.rights", { year: new Date().getFullYear() });

  if (variant === "minimal") {
    return (
      <footer className="site-container flex flex-wrap justify-between gap-3 border-t border-line pb-12 pt-10 text-[13px] text-ink-meta">
        <span>{rights}</span>
        <Link to="/privacy" className="inline-flex min-h-[44px] items-center text-ink-meta md:min-h-0">
          {t("footer.privacy")}
        </Link>
      </footer>
    );
  }

  return (
    <>
      {closingCta && <ClosingCta {...closingCta} />}
      <footer className="site-container grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-10 pb-12 pt-16 text-[15px]">
        <div className="flex min-w-0 flex-col gap-3.5 sm:col-span-2">
          <Link to="/" aria-label="VonAI home" className="inline-flex min-h-[44px] items-center self-start">
            <Logo />
          </Link>
          <p className="max-w-[360px] leading-[1.55] text-ink-soft">{t("footer.description")}</p>
        </div>
        <nav aria-label={t("footer.navigation")} className="flex flex-col gap-2.5">
          <p className={colLabel}>{t("footer.navigation")}</p>
          {HOME_SECTIONS.map((s) => (
            <Link key={s.id} to={`/#${s.id}`} className={colLink}>
              {t(s.labelKey)}
            </Link>
          ))}
        </nav>
        <nav aria-label={t("footer.company")} className="flex flex-col gap-2.5">
          <p className={colLabel}>{t("footer.company")}</p>
          <Link to="/resources" className={colLink}>
            {t("nav.insights")}
          </Link>
          <Link to="/contact" className={colLink}>
            {t("nav.contact")}
          </Link>
          <Link to="/privacy" className={colLink}>
            {t("footer.privacy")}
          </Link>
        </nav>
        <p className="col-span-full border-t border-line pt-5 text-[13px] text-ink-meta">{rights}</p>
      </footer>
    </>
  );
}

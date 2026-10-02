import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CONTACT_EMAIL } from "@/lib/site";

export interface ClosingCtaCopy {
  title: string;
  subtitle: string;
}

export function ClosingCta({ title, subtitle }: ClosingCtaCopy) {
  const { t } = useTranslation();
  return (
    <section className="px-4 pb-4 sm:px-6 sm:pb-6">
      <div className="relative mx-auto max-w-[1200px] overflow-hidden rounded-[24px] bg-ink px-[clamp(28px,6vw,80px)] py-[clamp(56px,7vw,96px)] text-background">
        <div
          aria-hidden
          className="ring-deco bottom-[-380px] right-[-300px] h-[620px] w-[620px] border-[100px]"
        />
        <div className="relative flex max-w-[640px] flex-col gap-[22px]">
          <h2 className="h2-cta">{title}</h2>
          <p className="text-pretty text-[19px] leading-[1.5] text-night-text">{subtitle}</p>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-5 gap-y-3">
            <Link to="/contact" className="pill pill-light pill-lg">
              {t("home.finalCta.cta")} <span aria-hidden>→</span>
            </Link>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex min-h-[44px] items-center text-base text-night-text hover:text-white md:min-h-0"
            >
              <span className="border-b border-night-dim pb-0.5">{CONTACT_EMAIL}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

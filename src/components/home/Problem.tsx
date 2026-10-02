import { useTranslation } from "react-i18next";
import { pad2 } from "@/lib/copy";

const PAINS = [1, 2, 3, 4] as const;

export function Problem() {
  const { t } = useTranslation();
  return (
    <section className="relative z-[2] border-t border-line bg-background">
      <div className="site-container grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-16 pb-28 pt-28 md:pt-32">
        <div className="flex flex-col gap-[18px]">
          <p className="eyebrow">{t("home.problem.eyebrow")}</p>
          <h2 className="h2 max-w-[480px]">{t("home.problem.title")}</h2>
        </div>
        <div className="flex flex-col gap-8">
          <ol className="flex flex-col border-t border-line">
            {PAINS.map((n) => (
              <li
                key={n}
                className="grid grid-cols-[40px_minmax(0,1fr)] gap-2 border-b border-line py-[22px] text-[17px] leading-[1.45] sm:grid-cols-[48px_minmax(0,1fr)] sm:text-[19px]"
              >
                <span className="pt-1 font-mono text-[13px] text-ink-faint">{pad2(n)}</span>
                <span className="text-pretty">{t(`home.problem.pain${n}`)}</span>
              </li>
            ))}
          </ol>
          <p className="lead text-[17px] sm:pl-14 sm:text-[19px]">{t("home.problem.closing")}</p>
        </div>
      </div>
    </section>
  );
}

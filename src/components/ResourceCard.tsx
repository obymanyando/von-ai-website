import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { Resource } from "@/data/resources";
import { cn } from "@/lib/utils";

interface Props {
  resource: Resource;
}

/** "Type · Free" / "Type · Email required" line shared by cards and the detail page. */
export function ResourceMeta({ resource, className }: Props & { className?: string }) {
  const { t } = useTranslation();
  return (
    <p className={cn("flex items-center gap-2 text-xs", className)}>
      <span className="text-ink-soft">{t(`resources.types.${resource.type}`)}</span>
      <span aria-hidden className="text-ink-dim">
        ·
      </span>
      <span className={cn("font-medium", resource.gated ? "text-ink-meta" : "text-brand-text")}>
        {resource.gated ? t("resources.gatedBadge") : t("resources.freeBadge")}
      </span>
    </p>
  );
}

export function ResourceCard({ resource }: Props) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.startsWith("fi") ? "fi" : "en";
  const title = lang === "fi" ? resource.titleFi : resource.titleEn;
  const desc = lang === "fi" ? resource.descFi : resource.descEn;

  return (
    <Link
      to={`/resources/${resource.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white text-ink transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-line-hover hover:text-ink"
    >
      {/* Mock first page of the document; decorative. */}
      <div aria-hidden className="relative h-[140px] overflow-hidden border-b border-line-inner bg-muted">
        <div className="absolute inset-x-6 -bottom-2.5 top-6 flex flex-col gap-2 rounded-t-lg border border-line bg-white p-3.5">
          <span className="font-mono text-[10px] uppercase tracking-[.05em] text-brand-text">
            {t(`resources.types.${resource.type}`)}
          </span>
          <span className="h-1.5 w-4/5 rounded-full bg-secondary" />
          <span className="h-1.5 w-3/5 rounded-full bg-secondary" />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2.5 p-5">
        <ResourceMeta resource={resource} />
        <h3 className="text-pretty text-[17px] font-medium leading-[1.35]">{title}</h3>
        <p className="text-pretty text-sm leading-[1.5] text-ink-soft">{desc}</p>
        <span className="mt-auto pt-2 text-sm text-ink group-hover:text-brand-text">
          {resource.gated ? t("resources.getPdf") : t("resources.download")} <span aria-hidden>→</span>
        </span>
      </div>
    </Link>
  );
}

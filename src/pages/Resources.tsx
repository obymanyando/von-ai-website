import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { ResourceCard } from "@/components/ResourceCard";
import { getFeaturedResource, resources, type Resource, type ResourceType } from "@/data/resources";
import { cn } from "@/lib/utils";

const TYPES: (ResourceType | "all")[] = ["all", "guide", "checklist", "template", "playbook", "scorecard"];
const GATES = ["all", "free", "gated"] as const;
type GateFilter = (typeof GATES)[number];

function FeaturedBanner({ resource }: { resource: Resource }) {
  const { t, i18n } = useTranslation();
  const fi = i18n.language.startsWith("fi");
  const typeLabel = t(`resources.types.${resource.type}`);
  return (
    <Link
      to={`/resources/${resource.slug}`}
      className="group relative grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] overflow-hidden rounded-[18px] bg-ink text-background hover:text-background"
    >
      <div className="relative z-[1] flex flex-col gap-4 p-[clamp(28px,4vw,48px)]">
        <span className="self-start rounded-full bg-brand-ring px-2.5 py-1 font-mono text-[11px] uppercase tracking-[.05em] text-white">
          {t("resources.featured")} {typeLabel}
        </span>
        <h2 className="text-[clamp(26px,2.8vw,36px)] font-medium leading-[1.12] tracking-[-.025em]">
          {fi ? resource.titleFi : resource.titleEn}
        </h2>
        <p className="max-w-[440px] text-base leading-[1.55] text-night-text">{fi ? resource.descFi : resource.descEn}</p>
        <span className="mt-2 text-[15px] group-hover:underline">
          {resource.gated ? t("resources.getPdf") : t("resources.download")} <span aria-hidden>→</span>
        </span>
      </div>
      {/* Mock document preview; decorative. */}
      <div aria-hidden className="relative min-h-[240px] overflow-hidden">
        <div className="ring-deco right-[-120px] top-[-80px] h-[460px] w-[460px] border-[90px]" />
        <div className="absolute inset-x-10 -bottom-5 top-10 flex flex-col gap-2.5 rounded-t-xl bg-white p-[18px]">
          <span className="font-mono text-[11px] uppercase text-ink-meta">{typeLabel} · 1</span>
          <span className="h-2 w-[70%] rounded bg-secondary" />
          <span className="h-2 w-[90%] rounded bg-secondary" />
          <span className="h-2 w-[40%] rounded bg-brand-soft" />
          <span className="h-2 w-[80%] rounded bg-secondary" />
        </div>
      </div>
    </Link>
  );
}

export default function Resources() {
  const { t } = useTranslation();
  const [type, setType] = useState<ResourceType | "all">("all");
  const [gate, setGate] = useState<GateFilter>("all");
  const featured = getFeaturedResource();

  const filtered = useMemo(
    () =>
      resources.filter((r) => {
        if (type !== "all" && r.type !== type) return false;
        if (gate === "free" && r.gated) return false;
        if (gate === "gated" && !r.gated) return false;
        return true;
      }),
    [type, gate],
  );

  return (
    <Layout closingCta={{ title: t("resources.cta.title"), subtitle: t("resources.cta.subtitle") }}>
      <SEO
        title="Insights: practical AI playbooks for service firms | VonAI"
        description="Checklists, scorecards and templates professional services firms can use this week. Some are free; for the rest, leave your email and we'll send a copy."
        canonical="/resources"
      />
      <header className="site-container flex flex-col gap-5 pb-10 pt-16 md:pt-[88px]">
        <p className="eyebrow">{t("resources.hero.eyebrow")}</p>
        <h1 className="h1-page max-w-[860px]">{t("resources.hero.title")}</h1>
        <p className="lead max-w-[620px] text-[19px]">{t("resources.hero.subtitle")}</p>
      </header>

      {featured && (
        <section className="site-container pb-10">
          <FeaturedBanner resource={featured} />
        </section>
      )}

      <section className="site-container flex flex-col gap-6 pb-28">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
          <div role="group" aria-label={t("resources.typeFilterLabel")} className="flex flex-wrap gap-1.5">
            {TYPES.map((tp) => {
              const on = type === tp;
              return (
                <button
                  key={tp}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setType(tp)}
                  className={cn(
                    "min-h-[44px] rounded-full border px-3.5 text-sm transition-colors duration-150 md:min-h-0 md:py-[7px]",
                    on
                      ? "border-ink bg-ink text-background"
                      : "border-line bg-white text-ink-2 hover:bg-surface-hover",
                  )}
                >
                  {tp === "all" ? t("resources.filterAll") : t(`resources.types.${tp}`)}
                </button>
              );
            })}
          </div>
          <div role="group" aria-label={t("resources.gateFilterLabel")} className="flex rounded-full bg-secondary p-[3px]">
            {GATES.map((g) => {
              const on = gate === g;
              return (
                <button
                  key={g}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setGate(g)}
                  className={cn(
                    "min-h-[44px] rounded-full px-3 text-[13px] transition-colors duration-150 md:min-h-0 md:py-1.5",
                    on ? "bg-white text-ink shadow-[0_1px_2px_rgba(0,0,0,.08)]" : "text-ink-soft hover:text-ink",
                  )}
                >
                  {t(`resources.gateFilter.${g}`)}
                </button>
              );
            })}
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-line-strong p-12 text-center text-ink-soft">
            {t("resources.empty")}
          </p>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,280px),1fr))] gap-4">
            {filtered.map((r) => (
              <ResourceCard key={r.slug} resource={r} />
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}

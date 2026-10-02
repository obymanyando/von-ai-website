import { useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { ResourceCard, ResourceMeta } from "@/components/ResourceCard";
import { GatedDownloadDialog } from "@/components/GatedDownloadDialog";
import { resources, getResourceBySlug, getResourceUrl } from "@/data/resources";
import { supabase } from "@/integrations/supabase/client";

export default function ResourceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  const [dialogOpen, setDialogOpen] = useState(false);

  const resource = slug ? getResourceBySlug(slug) : undefined;
  if (!resource) return <Navigate to="/resources" replace />;

  const lang = i18n.language.startsWith("fi") ? "fi" : "en";
  const title = lang === "fi" ? resource.titleFi : resource.titleEn;
  const desc = lang === "fi" ? resource.descFi : resource.descEn;
  const longDesc = lang === "fi" ? resource.longDescFi : resource.longDescEn;
  const fileUrl = getResourceUrl(resource);

  const related = resources.filter((r) => r.slug !== resource.slug).slice(0, 3);

  const handleFreeDownload = async () => {
    // Fire-and-forget download log; don't block UX on errors.
    try {
      await supabase.from("resource_downloads").insert({
        resource_slug: resource.slug,
        gated: false,
        language: lang,
      });
    } catch {
      /* noop */
    }
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DigitalDocument",
    name: title,
    description: desc,
    inLanguage: lang,
    url: `https://von-ai.com/resources/${resource.slug}`,
    publisher: { "@type": "Organization", name: "VonAI" },
    datePublished: resource.publishedAt,
    encodingFormat: "application/pdf",
    isAccessibleForFree: !resource.gated,
  };

  return (
    <Layout closingCta={{ title: t("resources.cta.title"), subtitle: t("resources.cta.subtitle") }}>
      <SEO
        title={`${title} | VonAI Insights`}
        description={desc}
        canonical={`/resources/${resource.slug}`}
        type="article"
        jsonLd={jsonLd}
      />
      <article className="site-container flex max-w-[860px] flex-col gap-5 pb-24 pt-12 md:pt-16">
        <Link
          to="/resources"
          className="inline-flex min-h-[44px] items-center self-start text-sm text-ink-soft md:min-h-0"
        >
          <span aria-hidden>←</span>&nbsp;{t("resources.backToAll")}
        </Link>

        <div className="flex flex-wrap items-center gap-3">
          <ResourceMeta resource={resource} className="text-sm" />
          {resource.placeholder && (
            <span className="rounded-full border border-dashed border-line-dashed px-2.5 py-0.5 font-mono text-[11px] uppercase text-ink-meta">
              {t("resources.previewBadge")}
            </span>
          )}
        </div>

        <h1 className="h1-page">{title}</h1>
        <p className="lead text-[19px]">{desc}</p>
        {longDesc && <p className="text-pretty text-base leading-[1.6] text-ink-body">{longDesc}</p>}

        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-3">
          {resource.gated ? (
            <button type="button" className="pill pill-dark pill-lg" onClick={() => setDialogOpen(true)}>
              {t("resources.getPdf")} <span aria-hidden>→</span>
            </button>
          ) : (
            <a href={fileUrl} download={resource.fileName} onClick={handleFreeDownload} className="pill pill-dark pill-lg">
              {t("resources.download")} <span aria-hidden>↓</span>
            </a>
          )}
          <span className="font-mono text-xs uppercase text-ink-meta">PDF</span>
        </div>

        {!resource.gated && (
          <ul className="mt-6 flex flex-col border-t border-line">
            {[1, 2, 3].map((n) => (
              <li key={n} className="grid grid-cols-[28px_minmax(0,1fr)] gap-2 border-b border-line py-3.5 text-[15px] text-ink-2">
                <span aria-hidden className="mt-[5px] h-[9px] w-4 -rotate-45 border-b-2 border-l-2 border-brand" />
                {t(`resources.benefit${n}`)}
              </li>
            ))}
          </ul>
        )}
      </article>

      {related.length > 0 && (
        <section className="border-t border-line">
          <div className="site-container flex flex-col gap-6 py-20">
            <h2 className="eyebrow">{t("resources.related")}</h2>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,280px),1fr))] gap-4">
              {related.map((r) => (
                <ResourceCard key={r.slug} resource={r} />
              ))}
            </div>
          </div>
        </section>
      )}

      <GatedDownloadDialog resource={resource} open={dialogOpen} onOpenChange={setDialogOpen} />
    </Layout>
  );
}

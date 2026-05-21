import { useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Download, Lock, FileText, CheckCircle2 } from "lucide-react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ResourceCard } from "@/components/ResourceCard";
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
    <Layout>
      <SEO
        title={`${title} | VonAI Resources`}
        description={desc}
        canonical={`/resources/${resource.slug}`}
        type="article"
        jsonLd={jsonLd}
      />
      <section className="container-padding mx-auto max-w-4xl py-12 md:py-20">
        <Link
          to="/resources"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          {t("resources.backToAll")}
        </Link>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="capitalize">
            {t(`resources.types.${resource.type}`)}
          </Badge>
          {resource.gated ? (
            <Badge variant="secondary" className="gap-1">
              <Lock className="h-3 w-3" />
              {t("resources.gatedBadge")}
            </Badge>
          ) : (
            <Badge className="bg-primary/15 text-primary hover:bg-primary/20">
              {t("resources.freeBadge")}
            </Badge>
          )}
          {resource.placeholder && (
            <Badge variant="outline" className="border-dashed">
              {t("resources.previewBadge")}
            </Badge>
          )}
        </div>

        <h1 className="mt-4 text-4xl font-bold text-foreground md:text-5xl">
          {title}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">{desc}</p>
        {longDesc && (
          <p className="mt-4 text-base text-muted-foreground">{longDesc}</p>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          {resource.gated ? (
            <Button variant="cta-hero" size="xl" onClick={() => setDialogOpen(true)}>
              <Download className="mr-2 h-5 w-5" />
              {t("resources.getPdf")}
            </Button>
          ) : (
            <Button variant="cta-hero" size="xl" asChild onClick={handleFreeDownload}>
              <a href={fileUrl} download={resource.fileName}>
                <Download className="mr-2 h-5 w-5" />
                {t("resources.download")}
              </a>
            </Button>
          )}
          <span className="inline-flex items-center text-sm text-muted-foreground">
            <FileText className="mr-2 h-4 w-4" />
            PDF
          </span>
        </div>

        {!resource.gated && (
          <ul className="mt-10 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              {t("resources.benefit1")}
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              {t("resources.benefit2")}
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              {t("resources.benefit3")}
            </li>
          </ul>
        )}
      </section>

      {related.length > 0 && (
        <section className="container-padding mx-auto max-w-7xl border-t border-border py-16">
          <h2 className="text-2xl font-bold text-foreground">{t("resources.related")}</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <ResourceCard key={r.slug} resource={r} />
            ))}
          </div>
        </section>
      )}

      <GatedDownloadDialog
        resource={resource}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </Layout>
  );
}
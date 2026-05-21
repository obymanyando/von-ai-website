import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Download, Lock, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Resource } from "@/data/resources";

interface Props {
  resource: Resource;
}

export function ResourceCard({ resource }: Props) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.startsWith("fi") ? "fi" : "en";
  const title = lang === "fi" ? resource.titleFi : resource.titleEn;
  const desc = lang === "fi" ? resource.descFi : resource.descEn;

  return (
    <Link
      to={`/resources/${resource.slug}`}
      className="group flex flex-col rounded-xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <FileText className="h-5 w-5" />
        </div>
        <div className="flex flex-wrap items-center gap-2">
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
        </div>
      </div>

      <h3 className="mt-5 text-xl font-semibold text-foreground transition-colors group-hover:text-primary">
        {title}
      </h3>
      <p className="mt-2 flex-1 text-sm text-muted-foreground">{desc}</p>

      <div className="mt-6 flex items-center gap-2 text-sm font-medium text-primary">
        <Download className="h-4 w-4" />
        {resource.gated ? t("resources.getPdf") : t("resources.download")}
      </div>
    </Link>
  );
}

export function ResourceCardCompact({ resource }: Props) {
  const { i18n } = useTranslation();
  const lang = i18n.language.startsWith("fi") ? "fi" : "en";
  const title = lang === "fi" ? resource.titleFi : resource.titleEn;
  return (
    <Button asChild variant="outline" className="justify-start">
      <Link to={`/resources/${resource.slug}`}>
        <FileText className="mr-2 h-4 w-4" />
        {title}
      </Link>
    </Button>
  );
}
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { ResourceCard } from "@/components/ResourceCard";
import { Button } from "@/components/ui/button";
import { resources, type ResourceType } from "@/data/resources";

const TYPES: (ResourceType | "all")[] = [
  "all",
  "guide",
  "checklist",
  "template",
  "playbook",
  "scorecard",
];

type GateFilter = "all" | "free" | "gated";

export default function Resources() {
  const { t } = useTranslation();
  const [type, setType] = useState<(ResourceType | "all")>("all");
  const [gate, setGate] = useState<GateFilter>("all");

  const filtered = useMemo(
    () =>
      resources.filter((r) => {
        if (type !== "all" && r.type !== type) return false;
        if (gate === "free" && r.gated) return false;
        if (gate === "gated" && !r.gated) return false;
        return true;
      }),
    [type, gate]
  );

  return (
    <Layout>
      <SEO
        title="Resources — Practical AI playbooks for B2B services firms | VonAI"
        description="Free and gated PDFs: checklists, playbooks, scorecards, and templates to help B2B services firms turn AI experiments into measurable results."
        canonical="/resources"
      />
      <section className="container-padding mx-auto max-w-7xl py-16 md:py-24">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold text-foreground md:text-5xl">
            {t("resources.heroTitle")}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {t("resources.heroSubtitle")}
          </p>
        </div>

        {/* Filters */}
        <div className="mt-10 flex flex-wrap items-center gap-2">
          {TYPES.map((tp) => (
            <Button
              key={tp}
              size="sm"
              variant={type === tp ? "default" : "outline"}
              onClick={() => setType(tp)}
            >
              {tp === "all" ? t("resources.filterAll") : t(`resources.types.${tp}`)}
            </Button>
          ))}
          <span className="mx-2 hidden h-5 w-px bg-border md:inline-block" />
          {(["all", "free", "gated"] as GateFilter[]).map((g) => (
            <Button
              key={g}
              size="sm"
              variant={gate === g ? "default" : "outline"}
              onClick={() => setGate(g)}
            >
              {t(`resources.gateFilter.${g}`)}
            </Button>
          ))}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <p className="mt-16 text-center text-muted-foreground">{t("resources.empty")}</p>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((r) => (
              <ResourceCard key={r.slug} resource={r} />
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}
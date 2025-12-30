import { useTranslation } from "react-i18next";
import { Layout } from "@/components/Layout";
import { Section, SectionHeader } from "@/components/Section";
import { CTAButton } from "@/components/CTAButton";
import { Card } from "@/components/Card";
import {
  Workflow,
  BarChart3,
  Users,
  Layers,
} from "lucide-react";

export default function About() {
  const { t } = useTranslation();

  return (
    <Layout>
      {/* Hero */}
      <section className="border-b border-border bg-background">
        <div className="container-padding mx-auto max-w-7xl py-16 md:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
              {t("about.hero.title1")}
              <br />
              <span className="text-primary">{t("about.hero.title2")}</span>
            </h1>
          </div>
        </div>
      </section>

      {/* Story */}
      <Section>
        <div className="mx-auto max-w-3xl">
          <div className="prose prose-lg prose-gray max-w-none">
            <p className="text-xl text-foreground leading-relaxed">
              {t("about.story.p1")}
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t("about.story.p2")}
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t("about.story.p3")}
            </p>
          </div>
        </div>
      </Section>

      {/* Principles */}
      <Section variant="muted">
        <SectionHeader title={t("about.principles.title")} />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card variant="bordered" className="text-center">
            <Workflow className="mx-auto mb-4 h-10 w-10 text-primary" />
            <h3 className="mb-2 text-lg font-bold text-foreground">{t("about.principles.workflowFirst")}</h3>
            <p className="text-sm text-muted-foreground">
              {t("about.principles.workflowFirstDesc")}
            </p>
          </Card>

          <Card variant="bordered" className="text-center">
            <BarChart3 className="mx-auto mb-4 h-10 w-10 text-primary" />
            <h3 className="mb-2 text-lg font-bold text-foreground">{t("about.principles.roiMeasured")}</h3>
            <p className="text-sm text-muted-foreground">
              {t("about.principles.roiMeasuredDesc")}
            </p>
          </Card>

          <Card variant="bordered" className="text-center">
            <Users className="mx-auto mb-4 h-10 w-10 text-primary" />
            <h3 className="mb-2 text-lg font-bold text-foreground">{t("about.principles.humanInLoop")}</h3>
            <p className="text-sm text-muted-foreground">
              {t("about.principles.humanInLoopDesc")}
            </p>
          </Card>

          <Card variant="bordered" className="text-center">
            <Layers className="mx-auto mb-4 h-10 w-10 text-primary" />
            <h3 className="mb-2 text-lg font-bold text-foreground">{t("about.principles.buildSmall")}</h3>
            <p className="text-sm text-muted-foreground">
              {t("about.principles.buildSmallDesc")}
            </p>
          </Card>
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {t("about.cta.title")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            {t("about.cta.subtitle")}
          </p>
          <div className="mt-10">
            <CTAButton variant="primary" size="xl" />
          </div>
        </div>
      </Section>
    </Layout>
  );
}

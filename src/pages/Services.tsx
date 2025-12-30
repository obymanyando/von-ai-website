import { useTranslation } from "react-i18next";
import { Layout } from "@/components/Layout";
import { Section, SectionHeader } from "@/components/Section";
import { CTAButton } from "@/components/CTAButton";
import { Card, IconListItem } from "@/components/Card";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  X,
  Target,
  Rocket,
  RefreshCw,
} from "lucide-react";

export default function Services() {
  const { t } = useTranslation();

  return (
    <Layout>
      <SEO
        title="AI Consulting Services"
        description="From clarity to production to growing returns. AI ROI Sprint, Pilot, and Optimization services designed for measurable business impact."
        canonical="/services"
      />
      {/* Hero */}
      <section className="border-b border-border bg-background">
        <div className="container-padding mx-auto max-w-7xl py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
              {t("services.hero.title")}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
              {t("services.hero.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* AI ROI Sprint */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <div className="mb-4 inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Target className="mr-2 h-4 w-4" />
              {t("services.sprint.step")}
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {t("services.sprint.title")}
            </h2>
            <p className="mt-2 text-xl text-muted-foreground">{t("services.sprint.duration")}</p>
            <p className="mt-6 text-lg text-foreground">
              <span className="font-semibold">{t("services.sprint.outcome")}</span> {t("services.sprint.outcomeDesc")}
            </p>

            <div className="mt-8">
              <h3 className="mb-4 font-semibold text-foreground">{t("services.sprint.goodFit")}</h3>
              <ul className="space-y-3">
                <IconListItem icon={Check}>
                  {t("services.sprint.goodFit1")}
                </IconListItem>
                <IconListItem icon={Check}>
                  {t("services.sprint.goodFit2")}
                </IconListItem>
                <IconListItem icon={Check}>
                  {t("services.sprint.goodFit3")}
                </IconListItem>
              </ul>
            </div>

            <div className="mt-8">
              <h3 className="mb-4 font-semibold text-foreground">{t("services.sprint.notFit")}</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <X className="mt-0.5 h-5 w-5 flex-shrink-0 text-destructive" />
                  <span>{t("services.sprint.notFit1")}</span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="mt-0.5 h-5 w-5 flex-shrink-0 text-destructive" />
                  <span>{t("services.sprint.notFit2")}</span>
                </li>
              </ul>
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <CTAButton variant="primary" size="lg" />
              <Button variant="cta-outline" size="lg" asChild>
                <Link to="/roi-calculator">
                  {t("services.sprint.tryCalculator")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <Card variant="elevated" className="lg:sticky lg:top-24">
            <h3 className="mb-6 text-lg font-semibold text-foreground">
              {t("services.sprint.deliverables")}
            </h3>
            <ul className="space-y-4 text-muted-foreground">
              <li className="flex gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">1</span>
                <span>{t("services.sprint.deliverable1")}</span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">2</span>
                <span>{t("services.sprint.deliverable2")}</span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">3</span>
                <span>{t("services.sprint.deliverable3")}</span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">4</span>
                <span>{t("services.sprint.deliverable4")}</span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">5</span>
                <span>{t("services.sprint.deliverable5")}</span>
              </li>
            </ul>
            <div className="mt-6 border-t border-border pt-6">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/ai-roi-sprint">
                  {t("services.sprint.seeDetails")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </Section>

      {/* AI ROI Pilot */}
      <Section variant="muted">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <Card variant="bordered">
            <div className="mb-4 inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Rocket className="mr-2 h-4 w-4" />
              {t("services.pilot.step")}
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {t("services.pilot.title")}
            </h2>
            <p className="mt-2 text-xl text-muted-foreground">{t("services.pilot.duration")}</p>
            <p className="mt-6 text-lg text-foreground">
              <span className="font-semibold">{t("services.pilot.outcome")}</span> {t("services.pilot.outcomeDesc")}
            </p>
            <p className="mt-4 text-muted-foreground">
              {t("services.pilot.production")}
            </p>
          </Card>

          <Card variant="bordered">
            <div className="mb-4 inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <RefreshCw className="mr-2 h-4 w-4" />
              {t("services.optimization.step")}
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {t("services.optimization.title")}
            </h2>
            <p className="mt-2 text-xl text-muted-foreground">{t("services.optimization.duration")}</p>
            <p className="mt-6 text-lg text-foreground">
              <span className="font-semibold">{t("services.optimization.outcome")}</span> {t("services.optimization.outcomeDesc")}
            </p>
            <p className="mt-4 text-muted-foreground">
              {t("services.optimization.includes")}
            </p>
          </Card>
        </div>
      </Section>

      {/* What we don't do */}
      <Section>
        <SectionHeader title={t("services.whatWeDont.title")} />
        <div className="mx-auto max-w-2xl">
          <ul className="space-y-4 text-lg text-muted-foreground">
            <li className="flex items-start gap-3">
              <X className="mt-1 h-5 w-5 flex-shrink-0 text-destructive" />
              <span>{t("services.whatWeDont.item1")}</span>
            </li>
            <li className="flex items-start gap-3">
              <X className="mt-1 h-5 w-5 flex-shrink-0 text-destructive" />
              <span>{t("services.whatWeDont.item2")}</span>
            </li>
            <li className="flex items-start gap-3">
              <X className="mt-1 h-5 w-5 flex-shrink-0 text-destructive" />
              <span>{t("services.whatWeDont.item3")}</span>
            </li>
          </ul>
        </div>
      </Section>

      {/* CTA */}
      <Section variant="muted">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {t("services.cta.title")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            {t("services.cta.subtitle")}
          </p>
          <div className="mt-10">
            <CTAButton variant="primary" size="xl" />
          </div>
        </div>
      </Section>
    </Layout>
  );
}

import { useTranslation } from "react-i18next";
import { Layout } from "@/components/Layout";
import { Section, SectionHeader } from "@/components/Section";
import { CTAButton } from "@/components/CTAButton";
import { Card, NumberedCard, IconListItem } from "@/components/Card";
import { SEO } from "@/components/SEO";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  X,
  Calendar,
  Users,
  Target,
  FileText,
  BarChart3,
  Clock,
  Workflow,
  Zap,
} from "lucide-react";

export default function AIROISprint() {
  const { t } = useTranslation();

  return (
    <Layout>
      <SEO
        title="AI ROI Sprint — 90-Day AI Implementation Plan"
        description="Get a 90-day roadmap, ROI model, and Pilot #1 spec in just 2 weeks. Stop experimenting, start executing with measurable AI results."
        canonical="/ai-roi-sprint"
      />
      {/* Hero */}
      <section className="border-b border-border bg-background">
        <div className="container-padding mx-auto max-w-7xl py-16 md:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Clock className="mr-2 h-4 w-4" />
              {t("aiRoiSprint.hero.badge")}
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
              {t("aiRoiSprint.hero.title")}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-xl text-muted-foreground">
              {t("aiRoiSprint.hero.subtitle")}
            </p>
            <div className="mt-10">
              <CTAButton variant="primary" size="xl" />
            </div>
          </div>
        </div>
      </section>

      {/* 5 Deliverables */}
      <Section>
        <SectionHeader
          title={t("aiRoiSprint.deliverables.title")}
          subtitle={t("aiRoiSprint.deliverables.subtitle")}
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card variant="elevated" className="flex flex-col">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Workflow className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-foreground">{t("aiRoiSprint.deliverables.item1Title")}</h3>
            <p className="text-muted-foreground">
              {t("aiRoiSprint.deliverables.item1Desc")}
            </p>
          </Card>

          <Card variant="elevated" className="flex flex-col">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-foreground">{t("aiRoiSprint.deliverables.item2Title")}</h3>
            <p className="text-muted-foreground">
              {t("aiRoiSprint.deliverables.item2Desc")}
            </p>
          </Card>

          <Card variant="elevated" className="flex flex-col">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-foreground">{t("aiRoiSprint.deliverables.item3Title")}</h3>
            <p className="text-muted-foreground">
              {t("aiRoiSprint.deliverables.item3Desc")}
            </p>
          </Card>

          <Card variant="elevated" className="flex flex-col">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-foreground">{t("aiRoiSprint.deliverables.item4Title")}</h3>
            <p className="text-muted-foreground">
              {t("aiRoiSprint.deliverables.item4Desc")}
            </p>
          </Card>

          <Card variant="elevated" className="flex flex-col">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-foreground">{t("aiRoiSprint.deliverables.item5Title")}</h3>
            <p className="text-muted-foreground">
              {t("aiRoiSprint.deliverables.item5Desc")}
            </p>
          </Card>

          <Card variant="bordered" className="flex flex-col items-center justify-center text-center">
            <Zap className="mb-4 h-10 w-10 text-primary" />
            <p className="font-semibold text-foreground">{t("aiRoiSprint.deliverables.allIn2Weeks")}</p>
          </Card>
        </div>
      </Section>

      {/* FAQ */}
      <Section variant="muted">
        <SectionHeader
          title={t("aiRoiSprint.faq.title")}
          subtitle={t("aiRoiSprint.faq.subtitle")}
        />

        <div className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <AccordionItem key={num} value={`item-${num}`} className="border-border">
                <AccordionTrigger className="text-left text-lg font-semibold text-foreground hover:no-underline">
                  {t(`aiRoiSprint.faq.q${num}`)}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {t(`aiRoiSprint.faq.a${num}`)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <p className="mt-8 text-center text-lg text-muted-foreground">
            {t("aiRoiSprint.faq.bottomText")}
          </p>
        </div>
      </Section>

      {/* Timeline */}
      <Section variant="muted">
        <SectionHeader title={t("aiRoiSprint.timeline.title")} />

        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
          <NumberedCard
            number={t("aiRoiSprint.timeline.week1")}
            title={t("aiRoiSprint.timeline.week1Title")}
            description={t("aiRoiSprint.timeline.week1Desc")}
          />
          <NumberedCard
            number={t("aiRoiSprint.timeline.week2")}
            title={t("aiRoiSprint.timeline.week2Title")}
            description={t("aiRoiSprint.timeline.week2Desc")}
          />
        </div>
      </Section>

      {/* What we need */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {t("aiRoiSprint.requirements.title")}
            </h2>
            <ul className="mt-8 space-y-4">
              <IconListItem icon={Users}>
                {t("aiRoiSprint.requirements.item1")}
              </IconListItem>
              <IconListItem icon={Check}>
                {t("aiRoiSprint.requirements.item2")}
              </IconListItem>
              <IconListItem icon={Target}>
                {t("aiRoiSprint.requirements.item3")}
              </IconListItem>
            </ul>
          </div>

          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {t("aiRoiSprint.requirements.notIncludedTitle")}
            </h2>
            <ul className="mt-8 space-y-4 text-muted-foreground">
              <li className="flex items-start gap-3">
                <X className="mt-0.5 h-5 w-5 flex-shrink-0 text-destructive" />
                <span>{t("aiRoiSprint.requirements.notIncluded1")}</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="mt-0.5 h-5 w-5 flex-shrink-0 text-destructive" />
                <span>{t("aiRoiSprint.requirements.notIncluded2")}</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="mt-0.5 h-5 w-5 flex-shrink-0 text-destructive" />
                <span>{t("aiRoiSprint.requirements.notIncluded3")}</span>
              </li>
            </ul>
          </div>
        </div>
      </Section>

      {/* After the Sprint */}
      <Section variant="muted">
        <SectionHeader
          title={t("aiRoiSprint.afterSprint.title")}
          subtitle={t("aiRoiSprint.afterSprint.subtitle")}
        />

        <div className="grid gap-6 md:grid-cols-3">
          <Card variant="bordered">
            <h3 className="mb-3 text-lg font-bold text-foreground">{t("aiRoiSprint.afterSprint.option1Title")}</h3>
            <p className="text-muted-foreground">
              {t("aiRoiSprint.afterSprint.option1Desc")}
            </p>
          </Card>
          <Card variant="bordered">
            <h3 className="mb-3 text-lg font-bold text-foreground">{t("aiRoiSprint.afterSprint.option2Title")}</h3>
            <p className="text-muted-foreground">
              {t("aiRoiSprint.afterSprint.option2Desc")}
            </p>
          </Card>
          <Card variant="bordered">
            <h3 className="mb-3 text-lg font-bold text-foreground">{t("aiRoiSprint.afterSprint.option3Title")}</h3>
            <p className="text-muted-foreground">
              {t("aiRoiSprint.afterSprint.option3Desc")}
            </p>
          </Card>
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {t("aiRoiSprint.cta.title")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            {t("aiRoiSprint.cta.subtitle")}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <CTAButton variant="primary" size="xl" />
            <Button variant="cta-outline" size="lg" asChild>
              <Link to="/roi-calculator">
                {t("aiRoiSprint.cta.estimateRoi")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </Section>
    </Layout>
  );
}

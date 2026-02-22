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
import {
  Check,
  Users,
  Target,
  FileText,
  BarChart3,
  Clock,
  Workflow,
  Zap,
  Calendar,
  AlertTriangle,
} from "lucide-react";

export default function AIROISprint() {
  const { t } = useTranslation();

  return (
    <Layout>
      <SEO
        title="AI ROI Sprint — 90-Day AI Implementation Plan"
        description="Stop experimenting. Leave with a 90-day plan your team can actually execute. 2-week engagement with 5 deliverables."
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

      {/* Why most AI initiatives stall */}
      <Section variant="muted">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {t("aiRoiSprint.problem.title")}
          </h2>
          <ul className="mt-10 space-y-4">
            {[1, 2, 3, 4].map((num) => (
              <li key={num} className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-500" />
                <span className="text-lg text-muted-foreground">
                  {t(`aiRoiSprint.problem.reason${num}`)}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-10 text-center text-xl font-semibold text-primary">
            {t("aiRoiSprint.problem.bridgeLine")}
          </p>
        </div>
      </Section>

      {/* 5 Deliverables */}
      <Section>
        <SectionHeader
          title={t("aiRoiSprint.deliverables.title")}
          subtitle={t("aiRoiSprint.deliverables.subtitle")}
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: Workflow, num: 1 },
            { icon: Target, num: 2 },
            { icon: BarChart3, num: 3 },
            { icon: Calendar, num: 4 },
            { icon: FileText, num: 5 },
          ].map((item) => (
            <Card key={item.num} variant="elevated" className="flex flex-col">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <item.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-foreground">
                {t(`aiRoiSprint.deliverables.item${item.num}Title`)}
              </h3>
              <p className="text-muted-foreground">
                {t(`aiRoiSprint.deliverables.item${item.num}Desc`)}
              </p>
            </Card>
          ))}
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
        <div className="mx-auto max-w-3xl">
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
          <p className="mt-6 text-sm font-medium text-muted-foreground">
            {t("aiRoiSprint.requirements.honesty")}
          </p>
        </div>
      </Section>

      {/* After the Sprint */}
      <Section variant="muted">
        <SectionHeader title={t("aiRoiSprint.afterSprint.title")} />

        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((num) => (
            <Card key={num} variant="bordered">
              <h3 className="mb-3 text-lg font-bold text-foreground">
                {t(`aiRoiSprint.afterSprint.option${num}Title`)}
              </h3>
              <p className="text-muted-foreground">
                {t(`aiRoiSprint.afterSprint.option${num}Desc`)}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section>
        <SectionHeader title={t("aiRoiSprint.faq.title")} />

        <div className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {[1, 2, 3, 4, 5, 6].map((num) => (
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
        </div>
      </Section>

      {/* CTA */}
      <Section variant="muted">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {t("aiRoiSprint.cta.title")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            {t("aiRoiSprint.cta.subtitle")}
          </p>
          <div className="mt-10">
            <CTAButton variant="primary" size="xl" />
          </div>
        </div>
      </Section>
    </Layout>
  );
}

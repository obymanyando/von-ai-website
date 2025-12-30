import { useTranslation, Trans } from "react-i18next";
import { Layout } from "@/components/Layout";
import { Section, SectionHeader } from "@/components/Section";
import { CTAButton, SecondaryCTA } from "@/components/CTAButton";
import { Card, FeatureCard, NumberedCard, IconListItem } from "@/components/Card";
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
  Target,
  TrendingUp,
  Users,
  Zap,
  BarChart3,
  Clock,
  Shield,
  Workflow,
} from "lucide-react";

export default function Home() {
  const { t } = useTranslation();

  return (
    <Layout>
      <SEO
        title="VonAI — From AI experiments to ROI"
        description="You don't need more AI tools. You need AI that moves the numbers. Get a 90-day plan with the AI ROI Sprint."
        canonical="/"
      />
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
          <div className="absolute right-0 top-0 -z-10 h-[600px] w-[600px] rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="container-padding mx-auto max-w-7xl py-20 md:py-28 lg:py-36">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="animate-fade-in-up text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
              {t("home.hero.title1")}{" "}
              <span className="text-gradient">{t("home.hero.title2")}</span>
            </h1>

            <p className="animate-fade-in-up animation-delay-100 mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
              {t("home.hero.subtitle")}
            </p>

            <p className="animate-fade-in-up animation-delay-200 mx-auto mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">
              <Trans i18nKey="home.hero.description">
                You'll leave with a <span className="font-semibold text-foreground">90-day plan</span> that tells you what to do first, why it matters, and how you'll measure success.
              </Trans>
            </p>

            <p className="animate-fade-in-up animation-delay-300 mt-6 text-sm font-medium text-muted-foreground">
              {t("home.hero.tagline")}
            </p>

            <div className="animate-fade-in-up animation-delay-400 mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <CTAButton variant="primary" size="xl" />
              <SecondaryCTA text={t("home.hero.seeHow")} href="/ai-roi-sprint" />
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <Section variant="muted">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {t("home.problem.title")}
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-muted-foreground">
            {t("home.problem.description")}
          </p>
          <p className="mt-8 text-xl font-semibold text-foreground">
            {t("home.problem.solution")}
          </p>
        </div>
      </Section>

      {/* AI ROI Sprint Section */}
      <Section>
        <SectionHeader
          title={t("home.sprint.title")}
          subtitle={t("home.sprint.subtitle")}
        />

        <div className="grid gap-8 lg:grid-cols-2">
          {/* You get */}
          <Card variant="elevated" className="h-full">
            <h3 className="mb-6 text-xl font-bold text-foreground">{t("home.sprint.youGet")}</h3>
            <ul className="space-y-4">
              <IconListItem icon={Workflow}>
                <span className="font-medium">{t("home.sprint.workflowMap")}</span> {t("home.sprint.workflowMapDesc")}
              </IconListItem>
              <IconListItem icon={Target}>
                <span className="font-medium">{t("home.sprint.opportunityShortlist")}</span> {t("home.sprint.opportunityShortlistDesc")}
              </IconListItem>
              <IconListItem icon={BarChart3}>
                <span className="font-medium">{t("home.sprint.roiModel")}</span> {t("home.sprint.roiModelDesc")}
              </IconListItem>
              <IconListItem icon={Clock}>
                <span className="font-medium">{t("home.sprint.roadmap")}</span> {t("home.sprint.roadmapDesc")}
              </IconListItem>
              <IconListItem icon={Zap}>
                <span className="font-medium">{t("home.sprint.pilotSpec")}</span> {t("home.sprint.pilotSpecDesc")}
              </IconListItem>
            </ul>
          </Card>

          {/* We do it by */}
          <Card variant="bordered" className="h-full">
            <h3 className="mb-6 text-xl font-bold text-foreground">{t("home.sprint.weDoItBy")}</h3>
            <ul className="space-y-4 text-muted-foreground">
              <li className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                <span>{t("home.sprint.mapping")}</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                <span>{t("home.sprint.prioritizing")}</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                <span>{t("home.sprint.pressureTesting")}</span>
              </li>
            </ul>
            <div className="mt-8">
              <CTAButton variant="primary" size="lg" />
            </div>
          </Card>
        </div>
      </Section>

      {/* Starting Points Section */}
      <Section variant="muted">
        <SectionHeader
          title={t("home.startingPoints.title")}
          subtitle={t("home.startingPoints.subtitle")}
        />

        <div className="grid gap-6 md:grid-cols-3">
          <FeatureCard
            icon={TrendingUp}
            title={t("home.startingPoints.sales")}
            description={t("home.startingPoints.salesDesc")}
          />
          <FeatureCard
            icon={Users}
            title={t("home.startingPoints.service")}
            description={t("home.startingPoints.serviceDesc")}
          />
          <FeatureCard
            icon={Workflow}
            title={t("home.startingPoints.operations")}
            description={t("home.startingPoints.operationsDesc")}
          />
        </div>

        <div className="mt-12 text-center">
          <Button variant="cta-outline" size="lg" asChild>
            <Link to="/roi-calculator">
              {t("home.startingPoints.tryCalculator")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </Section>

      {/* Offers Preview Section */}
      <Section>
        <SectionHeader title={t("home.path.title")} />

        <div className="grid gap-6 md:grid-cols-3">
          <NumberedCard
            number="1"
            title={t("home.path.step1Title")}
            description={t("home.path.step1Desc")}
          />
          <NumberedCard
            number="2"
            title={t("home.path.step2Title")}
            description={t("home.path.step2Desc")}
          />
          <NumberedCard
            number="3"
            title={t("home.path.step3Title")}
            description={t("home.path.step3Desc")}
          />
        </div>

        <div className="mt-12 text-center">
          <Button variant="ghost" size="lg" asChild>
            <Link to="/services">
              {t("home.path.learnMore")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </Section>

      {/* Why VonAI Section */}
      <Section variant="muted">
        <SectionHeader title={t("home.whyVonai.title")} />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {[
            { icon: Zap, text: t("home.whyVonai.ship") },
            { icon: Workflow, text: t("home.whyVonai.workflow") },
            { icon: BarChart3, text: t("home.whyVonai.roi") },
            { icon: Users, text: t("home.whyVonai.human") },
            { icon: Shield, text: t("home.whyVonai.agnostic") },
          ].map((item, index) => (
            <Card key={index} variant="bordered" className="text-center">
              <item.icon className="mx-auto mb-3 h-8 w-8 text-primary" />
              <p className="font-medium text-foreground">{item.text}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section>
        <SectionHeader
          title={t("home.faq.title")}
          subtitle={t("home.faq.subtitle")}
        />

        <div className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-border">
              <AccordionTrigger className="text-left text-lg font-semibold text-foreground hover:no-underline">
                {t("home.faq.q1")}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {t("home.faq.a1")}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border-border">
              <AccordionTrigger className="text-left text-lg font-semibold text-foreground hover:no-underline">
                {t("home.faq.q2")}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {t("home.faq.a2")}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border-border">
              <AccordionTrigger className="text-left text-lg font-semibold text-foreground hover:no-underline">
                {t("home.faq.q3")}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {t("home.faq.a3")}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border-border">
              <AccordionTrigger className="text-left text-lg font-semibold text-foreground hover:no-underline">
                {t("home.faq.q4")}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {t("home.faq.a4")}
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <p className="mt-8 text-center text-muted-foreground">
            {t("home.faq.stillUnsure")}{" "}
            <a 
              href="https://calendly.com/vonai/ai-roi-sprint" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-medium text-primary hover:underline"
            >
              {t("home.faq.bookCall")}
            </a>{" "}
            {t("home.faq.confirmFit")}
          </p>
        </div>
      </Section>

      {/* Final CTA Section */}
      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {t("home.finalCta.title")}
          </h2>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <CTAButton variant="primary" size="xl" />
            <Button variant="cta-outline" size="lg" asChild>
              <Link to="/roi-calculator">
                {t("home.finalCta.tryCalculator")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </Section>
    </Layout>
  );
}

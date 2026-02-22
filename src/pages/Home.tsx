import { useTranslation } from "react-i18next";
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
  AlertTriangle,
} from "lucide-react";

const CALENDLY_URL = "https://calendly.com/oby-manyando/onboarding-call";

export default function Home() {
  const { t } = useTranslation();

  return (
    <Layout>
      <SEO
        title="VonAI — Your AI budget is growing. Your results aren't."
        description="Most B2B services firms have tried AI. Few can point to a number that changed. We fix that."
        canonical="/"
      />
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background">
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

            <div className="animate-fade-in-up animation-delay-200 mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <SecondaryCTA text={t("home.hero.cta")} href="/ai-roi-sprint" />
              <CTAButton variant="primary" size="xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <Section variant="muted">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {t("home.problem.title")}
          </h2>
          <ul className="mt-10 space-y-4">
            {[1, 2, 3, 4].map((num) => (
              <li key={num} className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-500" />
                <span className="text-lg text-muted-foreground">
                  {t(`home.problem.pain${num}`)}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-10 text-center text-xl font-semibold text-foreground">
            {t("home.problem.punchline")}
          </p>
        </div>
      </Section>

      {/* Proof / Case Studies Section */}
      <Section>
        <SectionHeader title={t("home.proof.title")} />

        <div className="grid gap-8 md:grid-cols-2">
          {[1, 2].map((num) => (
            <Card key={num} variant="elevated" className="flex flex-col">
              <div className="mb-4 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                {t(`home.proof.case${num}Label`)}
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Problem:</p>
                  <p className="text-muted-foreground">{t(`home.proof.case${num}Problem`)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Solution:</p>
                  <p className="text-muted-foreground">{t(`home.proof.case${num}Solution`)}</p>
                </div>
                <div className="rounded-lg bg-primary/5 p-4">
                  <p className="font-semibold text-primary">{t(`home.proof.case${num}Result`)}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* AI ROI Sprint Section */}
      <Section variant="muted">
        <SectionHeader
          title={t("home.sprint.title")}
          subtitle={t("home.sprint.subtitle")}
        />

        <div className="mx-auto max-w-3xl">
          <Card variant="elevated">
            <h3 className="mb-6 text-xl font-bold text-foreground">{t("home.sprint.youLeaveWith")}</h3>
            <ul className="space-y-4">
              {[1, 2, 3, 4, 5].map((num) => (
                <li key={num} className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                  <span className="text-muted-foreground">{t(`home.sprint.deliverable${num}`)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Button variant="cta-outline" size="lg" asChild>
                <Link to="/ai-roi-sprint">
                  {t("home.sprint.learnMore")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </Section>

      {/* Path Section */}
      <Section>
        <SectionHeader title={t("home.path.title")} />

        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((num) => (
            <NumberedCard
              key={num}
              number={String(num)}
              title={`${t(`home.path.step${num}Title`)} (${t(`home.path.step${num}Duration`)})`}
              description={t(`home.path.step${num}Desc`)}
            />
          ))}
        </div>
      </Section>

      {/* Why VonAI Section */}
      <Section variant="muted">
        <SectionHeader title={t("home.whyVonai.title")} />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: Zap, num: 1 },
            { icon: Workflow, num: 2 },
            { icon: BarChart3, num: 3 },
            { icon: Users, num: 4 },
            { icon: Shield, num: 5 },
          ].map((item) => (
            <Card key={item.num} variant="bordered">
              <item.icon className="mb-3 h-8 w-8 text-primary" />
              <h3 className="mb-2 font-semibold text-foreground">
                {t(`home.whyVonai.reason${item.num}Title`)}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t(`home.whyVonai.reason${item.num}Desc`)}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section>
        <SectionHeader title={t("home.faq.title")} />

        <div className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {[1, 2, 3, 4, 5].map((num) => (
              <AccordionItem key={num} value={`item-${num}`} className="border-border">
                <AccordionTrigger className="text-left text-lg font-semibold text-foreground hover:no-underline">
                  {t(`home.faq.q${num}`)}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {t(`home.faq.a${num}`)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Section>

      {/* Final CTA Section */}
      <Section variant="muted">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {t("home.finalCta.title")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            {t("home.finalCta.subtitle")}
          </p>
          <div className="mt-10">
            <CTAButton variant="primary" size="xl" />
          </div>
        </div>
      </Section>
    </Layout>
  );
}

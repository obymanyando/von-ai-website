import { Layout } from "@/components/Layout";
import { Section, SectionHeader } from "@/components/Section";
import { CTAButton, SecondaryCTA } from "@/components/CTAButton";
import { Card, FeatureCard, NumberedCard, IconListItem } from "@/components/Card";
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
  return (
    <Layout>
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
              From AI experiments{" "}
              <span className="text-gradient">to ROI.</span>
            </h1>

            <p className="animate-fade-in-up animation-delay-100 mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
              You don't need more AI tools. You need AI that moves the numbers.
            </p>

            <p className="animate-fade-in-up animation-delay-200 mx-auto mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">
              You'll leave with a <span className="font-semibold text-foreground">90-day plan</span> that tells you what to do first, why it matters, and how you'll measure success.
            </p>

            <p className="animate-fade-in-up animation-delay-300 mt-6 text-sm font-medium text-muted-foreground">
              No fluff. No "innovation theatre." One clear plan. One real win.
            </p>

            <div className="animate-fade-in-up animation-delay-400 mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <CTAButton variant="primary" size="xl" />
              <SecondaryCTA text="See how it works" href="/ai-roi-sprint" />
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <Section variant="muted">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            AI is easy to demo. Hard to make pay back.
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-muted-foreground">
            Most initiatives stall because: no ranked priorities, pilots don't reach production, teams don't trust outputs, adoption is random, ROI isn't measured.
          </p>
          <p className="mt-8 text-xl font-semibold text-foreground">
            We fix the part between "cool demo" and "business impact."
          </p>
        </div>
      </Section>

      {/* AI ROI Sprint Section */}
      <Section>
        <SectionHeader
          title="AI ROI Sprint (2 weeks)"
          subtitle="Everything you need to stop experimenting and start executing."
        />

        <div className="grid gap-8 lg:grid-cols-2">
          {/* You get */}
          <Card variant="elevated" className="h-full">
            <h3 className="mb-6 text-xl font-bold text-foreground">You get:</h3>
            <ul className="space-y-4">
              <IconListItem icon={Workflow}>
                <span className="font-medium">Workflow map:</span> where time, money, and quality leak
              </IconListItem>
              <IconListItem icon={Target}>
                <span className="font-medium">Opportunity shortlist</span> ranked by Impact vs Effort
              </IconListItem>
              <IconListItem icon={BarChart3}>
                <span className="font-medium">ROI model:</span> cost saved + revenue uplift
              </IconListItem>
              <IconListItem icon={Clock}>
                <span className="font-medium">90-day roadmap</span> with owners, steps, and metrics
              </IconListItem>
              <IconListItem icon={Zap}>
                <span className="font-medium">Pilot #1 spec</span> (build-ready)
              </IconListItem>
            </ul>
          </Card>

          {/* We do it by */}
          <Card variant="bordered" className="h-full">
            <h3 className="mb-6 text-xl font-bold text-foreground">We do it by:</h3>
            <ul className="space-y-4 text-muted-foreground">
              <li className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                <span>Mapping your real workflows (leadership + users)</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                <span>Prioritizing the fastest wins</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                <span>Pressure-testing with your team</span>
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
          title="Starting points"
          subtitle="If one area is already strong, the Sprint surfaces the next best ROI lever."
        />

        <div className="grid gap-6 md:grid-cols-3">
          <FeatureCard
            icon={TrendingUp}
            title="Sales — more customers, faster"
            description="Faster follow-up, less pipeline leakage. Cleaner CRM, better visibility."
          />
          <FeatureCard
            icon={Users}
            title="Service — deflect, retain, upsell"
            description="Faster answers, better triage, better experience."
          />
          <FeatureCard
            icon={Workflow}
            title="Operations — less manual work"
            description="Fewer handoffs, fewer errors, more flow."
          />
        </div>

        <div className="mt-12 text-center">
          <Button variant="cta-outline" size="lg" asChild>
            <Link to="/roi-calculator">
              Try the ROI Calculator
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </Section>

      {/* Offers Preview Section */}
      <Section>
        <SectionHeader
          title="Your path from AI idea to ROI"
        />

        <div className="grid gap-6 md:grid-cols-3">
          <NumberedCard
            number="1"
            title="AI ROI Sprint"
            description="2 weeks — 90-day roadmap + ROI model + Pilot #1 spec"
          />
          <NumberedCard
            number="2"
            title="AI ROI Pilot"
            description="4–6 weeks — Pilot #1 shipped into production with measured results"
          />
          <NumberedCard
            number="3"
            title="Optimization & Adoption"
            description="Monthly — ROI compounds; AI stays useful and aligned"
          />
        </div>

        <div className="mt-12 text-center">
          <Button variant="ghost" size="lg" asChild>
            <Link to="/services">
              Learn more about our services
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </Section>

      {/* Why VonAI Section */}
      <Section variant="muted">
        <SectionHeader
          title="Why VonAI"
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {[
            { icon: Zap, text: "We ship. Not just advise." },
            { icon: Workflow, text: "Workflow-first. Tools come after clarity." },
            { icon: BarChart3, text: "ROI or it doesn't count." },
            { icon: Users, text: "Human-first adoption." },
            { icon: Shield, text: "Tool-agnostic." },
          ].map((item, index) => (
            <Card key={index} variant="bordered" className="text-center">
              <item.icon className="mx-auto mb-3 h-8 w-8 text-primary" />
              <p className="font-medium text-foreground">{item.text}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* Final CTA Section */}
      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Ready to turn AI into a 90-day plan you can actually execute?
          </h2>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <CTAButton variant="primary" size="xl" />
            <Button variant="cta-outline" size="lg" asChild>
              <Link to="/roi-calculator">
                Try the ROI Calculator
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </Section>
    </Layout>
  );
}

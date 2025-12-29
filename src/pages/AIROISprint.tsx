import { Layout } from "@/components/Layout";
import { Section, SectionHeader } from "@/components/Section";
import { CTAButton } from "@/components/CTAButton";
import { Card, NumberedCard, IconListItem } from "@/components/Card";
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
  return (
    <Layout>
      {/* Hero */}
      <section className="border-b border-border bg-background">
        <div className="container-padding mx-auto max-w-7xl py-16 md:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Clock className="mr-2 h-4 w-4" />
              2-week engagement
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
              AI ROI Sprint
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-xl text-muted-foreground">
              Leave with a 90-day plan you can execute.
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
          title="5 Deliverables"
          subtitle="Everything you need to move from experimentation to execution."
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card variant="elevated" className="flex flex-col">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Workflow className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-foreground">1. Workflow Reality Map</h3>
            <p className="text-muted-foreground">
              Where time, money, and quality leak in your current processes.
            </p>
          </Card>

          <Card variant="elevated" className="flex flex-col">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-foreground">2. Opportunity Matrix</h3>
            <p className="text-muted-foreground">
              Impact vs Effort ranking to prioritize the fastest wins.
            </p>
          </Card>

          <Card variant="elevated" className="flex flex-col">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-foreground">3. ROI Model</h3>
            <p className="text-muted-foreground">
              The money slide — cost saved + revenue uplift, clearly quantified.
            </p>
          </Card>

          <Card variant="elevated" className="flex flex-col">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-foreground">4. 90-day Execution Plan</h3>
            <p className="text-muted-foreground">
              Owners, steps, and metrics. No ambiguity.
            </p>
          </Card>

          <Card variant="elevated" className="flex flex-col">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-foreground">5. Pilot #1 Specification</h3>
            <p className="text-muted-foreground">
              Build-ready spec for your first AI implementation.
            </p>
          </Card>

          <Card variant="bordered" className="flex flex-col items-center justify-center text-center">
            <Zap className="mb-4 h-10 w-10 text-primary" />
            <p className="font-semibold text-foreground">All in just 2 weeks</p>
          </Card>
        </div>
      </Section>

      {/* FAQ */}
      <Section variant="muted">
        <SectionHeader
          title="FAQ (Before you book)"
          subtitle="These are the questions that decide whether a Sprint is worth it. Here are direct answers."
        />

        <div className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-border">
              <AccordionTrigger className="text-left text-lg font-semibold text-foreground hover:no-underline">
                Is the AI ROI Sprint just a workshop?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                No. It's a fixed-scope engagement with deliverables: workflow reality map, ranked opportunity matrix, ROI model, and a 90-day execution plan.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border-border">
              <AccordionTrigger className="text-left text-lg font-semibold text-foreground hover:no-underline">
                What's the biggest outcome of the Sprint?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                You stop guessing. You leave knowing what to build first, why it matters, and how you'll measure success in the next 90 days.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border-border">
              <AccordionTrigger className="text-left text-lg font-semibold text-foreground hover:no-underline">
                Do you build anything during the Sprint?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Not typically. The Sprint is designed to choose the right first win and define it properly. Building happens in the AI ROI Pilot (4–6 weeks).
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border-border">
              <AccordionTrigger className="text-left text-lg font-semibold text-foreground hover:no-underline">
                What if we already tried AI and it didn't work?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                That's common. Usually the missing piece is prioritization, workflow integration, adoption, or guardrails. The Sprint finds what blocked ROI and fixes the approach.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="border-border">
              <AccordionTrigger className="text-left text-lg font-semibold text-foreground hover:no-underline">
                Do we need perfect data before we start?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                No. We start workflow-first and identify the minimum viable data needed. If data quality is the blocker, the Sprint makes that visible early so you don't waste time building the wrong thing.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="border-border">
              <AccordionTrigger className="text-left text-lg font-semibold text-foreground hover:no-underline">
                Will AI replace our people?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                That's not the goal. For high-trust work, we design human-in-the-loop by default. AI supports the team; it doesn't undermine the relationship.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7" className="border-border">
              <AccordionTrigger className="text-left text-lg font-semibold text-foreground hover:no-underline">
                Which tools do you use?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Tool-agnostic. We work with your current stack and recommend the simplest approach that gets a measurable result. No forced platform decisions.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-8" className="border-border">
              <AccordionTrigger className="text-left text-lg font-semibold text-foreground hover:no-underline">
                How do you measure ROI?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                We model ROI in two layers: (1) Time saved → cost savings (most defensible), and (2) Revenue uplift (optional, conservative, validated—e.g., improved follow-up, conversion, cycle time).
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-9" className="border-border">
              <AccordionTrigger className="text-left text-lg font-semibold text-foreground hover:no-underline">
                How fast can we see results?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Clarity in 2 weeks (Sprint). A first production pilot can usually ship in 4–6 weeks after that. Measurement starts from day one.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-10" className="border-border">
              <AccordionTrigger className="text-left text-lg font-semibold text-foreground hover:no-underline">
                What do you need from us to make this work?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                One point of contact, 3–5 interviews (leadership + users), and agreement on 1–2 business outcomes to optimize. If you can't allocate this, the Sprint won't be worth it—and we'll tell you upfront.
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <p className="mt-8 text-center text-lg text-muted-foreground">
            If you want a 90-day plan you can actually execute, start with the Sprint.
          </p>
        </div>
      </Section>

      {/* Timeline */}
      <Section variant="muted">
        <SectionHeader
          title="Timeline"
        />

        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
          <NumberedCard
            number="W1"
            title="Discover & Map"
            description="We interview leadership and users, map workflows, identify pain points, and uncover where AI can add real value."
          />
          <NumberedCard
            number="W2"
            title="Prioritize & Plan"
            description="We rank opportunities, build the ROI model, create the 90-day execution plan, and spec out Pilot #1."
          />
        </div>
      </Section>

      {/* What we need */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              What we need from you
            </h2>
            <ul className="mt-8 space-y-4">
              <IconListItem icon={Users}>
                Point of contact (1 person)
              </IconListItem>
              <IconListItem icon={Check}>
                Access to leadership + users (3–5 interviewees)
              </IconListItem>
              <IconListItem icon={Target}>
                Agreement on 1–2 business outcomes to target
              </IconListItem>
            </ul>
          </div>

          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Not included
            </h2>
            <ul className="mt-8 space-y-4 text-muted-foreground">
              <li className="flex items-start gap-3">
                <X className="mt-0.5 h-5 w-5 flex-shrink-0 text-destructive" />
                <span>Building/deploying the pilot</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="mt-0.5 h-5 w-5 flex-shrink-0 text-destructive" />
                <span>Full data platform work</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="mt-0.5 h-5 w-5 flex-shrink-0 text-destructive" />
                <span>Company-wide training programs</span>
              </li>
            </ul>
          </div>
        </div>
      </Section>

      {/* After the Sprint */}
      <Section variant="muted">
        <SectionHeader
          title="After the Sprint"
          subtitle="You choose your path forward."
        />

        <div className="grid gap-6 md:grid-cols-3">
          <Card variant="bordered">
            <h3 className="mb-3 text-lg font-bold text-foreground">Execute internally</h3>
            <p className="text-muted-foreground">
              Take the roadmap and pilot spec to your internal team or existing vendors.
            </p>
          </Card>
          <Card variant="bordered">
            <h3 className="mb-3 text-lg font-bold text-foreground">Pilot with VonAI</h3>
            <p className="text-muted-foreground">
              We build and ship Pilot #1 into production (4–6 weeks).
            </p>
          </Card>
          <Card variant="bordered">
            <h3 className="mb-3 text-lg font-bold text-foreground">Monthly optimization</h3>
            <p className="text-muted-foreground">
              Ongoing tuning, updates, ROI reporting, and enablement.
            </p>
          </Card>
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Ready to get started?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Book a call and we'll discuss your situation. If the Sprint is a fit, we can start within 2 weeks.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <CTAButton variant="primary" size="xl" />
            <Button variant="cta-outline" size="lg" asChild>
              <Link to="/roi-calculator">
                Estimate your ROI first
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </Section>
    </Layout>
  );
}

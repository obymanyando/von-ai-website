import { Layout } from "@/components/Layout";
import { Section, SectionHeader } from "@/components/Section";
import { CTAButton, SecondaryCTA } from "@/components/CTAButton";
import { Card, IconListItem } from "@/components/Card";
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
  return (
    <Layout>
      {/* Hero */}
      <section className="border-b border-border bg-background">
        <div className="container-padding mx-auto max-w-7xl py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Plan → Ship → Scale
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
              From clarity to production to compounding returns. Each step builds on the last.
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
              Step 1: Plan
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              AI ROI Sprint
            </h2>
            <p className="mt-2 text-xl text-muted-foreground">2 weeks</p>
            <p className="mt-6 text-lg text-foreground">
              <span className="font-semibold">Outcome:</span> 90-day roadmap + ROI model + Pilot #1 spec
            </p>

            <div className="mt-8">
              <h3 className="mb-4 font-semibold text-foreground">Good fit if:</h3>
              <ul className="space-y-3">
                <IconListItem icon={Check}>
                  You want measurable outcomes in 90 days
                </IconListItem>
                <IconListItem icon={Check}>
                  You can give access to 3–5 interviewees
                </IconListItem>
                <IconListItem icon={Check}>
                  You're ready to change a workflow, not just buy a tool
                </IconListItem>
              </ul>
            </div>

            <div className="mt-8">
              <h3 className="mb-4 font-semibold text-foreground">Not a fit if:</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <X className="mt-0.5 h-5 w-5 flex-shrink-0 text-destructive" />
                  <span>You want "AI strategy" without implementation</span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="mt-0.5 h-5 w-5 flex-shrink-0 text-destructive" />
                  <span>You want a huge platform build as step one</span>
                </li>
              </ul>
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <CTAButton variant="primary" size="lg" />
              <Button variant="cta-outline" size="lg" asChild>
                <Link to="/roi-calculator">
                  Try the ROI Calculator
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <Card variant="elevated" className="lg:sticky lg:top-24">
            <h3 className="mb-6 text-lg font-semibold text-foreground">
              Sprint Deliverables
            </h3>
            <ul className="space-y-4 text-muted-foreground">
              <li className="flex gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">1</span>
                <span>Workflow Reality Map</span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">2</span>
                <span>Opportunity Matrix (Impact vs Effort)</span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">3</span>
                <span>ROI Model (the money slide)</span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">4</span>
                <span>90-day Execution Plan (owners + metrics)</span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">5</span>
                <span>Pilot #1 Specification (build-ready)</span>
              </li>
            </ul>
            <div className="mt-6 border-t border-border pt-6">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/ai-roi-sprint">
                  See full Sprint details
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
              Step 2: Ship
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              AI ROI Pilot
            </h2>
            <p className="mt-2 text-xl text-muted-foreground">4–6 weeks</p>
            <p className="mt-6 text-lg text-foreground">
              <span className="font-semibold">Outcome:</span> Pilot #1 shipped into production with measured results.
            </p>
            <p className="mt-4 text-muted-foreground">
              Production means: scope, guardrails, escalation, monitoring, measurement.
            </p>
          </Card>

          <Card variant="bordered">
            <div className="mb-4 inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <RefreshCw className="mr-2 h-4 w-4" />
              Step 3: Scale
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Optimization & Adoption
            </h2>
            <p className="mt-2 text-xl text-muted-foreground">Monthly</p>
            <p className="mt-6 text-lg text-foreground">
              <span className="font-semibold">Outcome:</span> ROI compounds; AI stays useful and aligned.
            </p>
            <p className="mt-4 text-muted-foreground">
              Includes tuning, updates, ROI reporting, enablement.
            </p>
          </Card>
        </div>
      </Section>

      {/* What we don't do */}
      <Section>
        <SectionHeader
          title="What we don't do"
        />
        <div className="mx-auto max-w-2xl">
          <ul className="space-y-4 text-lg text-muted-foreground">
            <li className="flex items-start gap-3">
              <X className="mt-1 h-5 w-5 flex-shrink-0 text-destructive" />
              <span>No vague strategy with no execution.</span>
            </li>
            <li className="flex items-start gap-3">
              <X className="mt-1 h-5 w-5 flex-shrink-0 text-destructive" />
              <span>No massive platforms as step one.</span>
            </li>
            <li className="flex items-start gap-3">
              <X className="mt-1 h-5 w-5 flex-shrink-0 text-destructive" />
              <span>No tool forcing.</span>
            </li>
          </ul>
        </div>
      </Section>

      {/* CTA */}
      <Section variant="muted">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Ready to start with clarity?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            The Sprint is where every engagement begins. Two weeks to a 90-day plan you can execute.
          </p>
          <div className="mt-10">
            <CTAButton variant="primary" size="xl" />
          </div>
        </div>
      </Section>
    </Layout>
  );
}

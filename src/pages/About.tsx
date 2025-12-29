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
  return (
    <Layout>
      {/* Hero */}
      <section className="border-b border-border bg-background">
        <div className="container-padding mx-auto max-w-7xl py-16 md:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Operator-led AI transformation.
              <br />
              <span className="text-primary">Built for real work.</span>
            </h1>
          </div>
        </div>
      </section>

      {/* Story */}
      <Section>
        <div className="mx-auto max-w-3xl">
          <div className="prose prose-lg prose-gray max-w-none">
            <p className="text-xl text-foreground leading-relaxed">
              VonAI exists to stop "AI theatre" and start measurable outcomes.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We map workflows, choose the right first win, and help teams ship AI that pays back.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We're tool-agnostic by design and focused on adoption and governance so solutions stick.
            </p>
          </div>
        </div>
      </Section>

      {/* Principles */}
      <Section variant="muted">
        <SectionHeader
          title="Our principles"
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card variant="bordered" className="text-center">
            <Workflow className="mx-auto mb-4 h-10 w-10 text-primary" />
            <h3 className="mb-2 text-lg font-bold text-foreground">Workflow-first</h3>
            <p className="text-sm text-muted-foreground">
              We understand your processes before recommending tools.
            </p>
          </Card>

          <Card variant="bordered" className="text-center">
            <BarChart3 className="mx-auto mb-4 h-10 w-10 text-primary" />
            <h3 className="mb-2 text-lg font-bold text-foreground">ROI measured</h3>
            <p className="text-sm text-muted-foreground">
              If we can't measure it, we don't recommend it.
            </p>
          </Card>

          <Card variant="bordered" className="text-center">
            <Users className="mx-auto mb-4 h-10 w-10 text-primary" />
            <h3 className="mb-2 text-lg font-bold text-foreground">Human-in-the-loop</h3>
            <p className="text-sm text-muted-foreground">
              AI augments humans where needed, not replaces blindly.
            </p>
          </Card>

          <Card variant="bordered" className="text-center">
            <Layers className="mx-auto mb-4 h-10 w-10 text-primary" />
            <h3 className="mb-2 text-lg font-bold text-foreground">Build small, then scale</h3>
            <p className="text-sm text-muted-foreground">
              Prove it works before investing more.
            </p>
          </Card>
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Ready to work together?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Start with a conversation. If we're a fit, we can kick off the Sprint within 2 weeks.
          </p>
          <div className="mt-10">
            <CTAButton variant="primary" size="xl" />
          </div>
        </div>
      </Section>
    </Layout>
  );
}

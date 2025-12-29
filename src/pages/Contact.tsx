import { Layout } from "@/components/Layout";
import { Section } from "@/components/Section";
import { Card, IconListItem } from "@/components/Card";
import { InlineWidget } from "react-calendly";
import {
  Mail,
  Calendar,
  MessageSquare,
  Briefcase,
  AlertCircle,
  Target,
  Wrench,
} from "lucide-react";

const CALENDLY_URL = "https://calendly.com/oby-manyando/onboarding-call";
const CONTACT_EMAIL = "hello@vonai.com";

export default function Contact() {
  return (
    <Layout>
      {/* Hero */}
      <section className="border-b border-border bg-background">
        <div className="container-padding mx-auto max-w-7xl py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              Book an AI ROI Sprint or ask a question.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              If you want clarity in 2 weeks and a 90-day plan you can execute, start with the Sprint.
            </p>
          </div>
        </div>
      </section>

      <Section>
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Calendly Embed */}
          <Card variant="elevated" className="h-fit overflow-hidden p-0">
            <div className="p-6 pb-0">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <h2 className="mb-2 text-2xl font-bold text-foreground">
                Book a call
              </h2>
              <p className="mb-4 text-muted-foreground">
                Schedule a 30-minute call to discuss your situation.
              </p>
            </div>
            <div className="calendly-wrapper">
              <InlineWidget
                url={CALENDLY_URL}
                styles={{ height: "580px", minWidth: "280px" }}
              />
            </div>
          </Card>

          {/* Email Card */}
          <Card variant="bordered" className="h-fit">
            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <h2 className="mb-4 text-2xl font-bold text-foreground">
              Send an email
            </h2>
            <p className="mb-6 text-muted-foreground">
              Prefer email? Send us a short description of your workflow problem and we'll get back to you within 24 hours.
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex items-center gap-2 text-lg font-semibold text-primary hover:underline"
            >
              <Mail className="h-5 w-5" />
              {CONTACT_EMAIL}
            </a>
          </Card>
        </div>
      </Section>

      {/* What to Include */}
      <Section variant="muted">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 flex items-center gap-3">
            <MessageSquare className="h-8 w-8 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">
              What to include in your message
            </h2>
          </div>

          <Card variant="bordered">
            <ul className="space-y-4">
              <IconListItem icon={Briefcase}>
                <span className="font-medium">What team/process</span> — sales, service, ops, or other?
              </IconListItem>
              <IconListItem icon={AlertCircle}>
                <span className="font-medium">What's breaking today</span> — where do you see the most friction?
              </IconListItem>
              <IconListItem icon={Target}>
                <span className="font-medium">What outcome matters most</span> — time saved, cost reduced, or revenue increased?
              </IconListItem>
              <IconListItem icon={Wrench}>
                <span className="font-medium">Your current tools</span> (optional) — CRM, ticketing, ERP, etc.
              </IconListItem>
            </ul>
          </Card>

          <p className="mt-6 text-center text-muted-foreground">
            Don't worry if you're not sure about all the details — that's what the Sprint is for.
          </p>
        </div>
      </Section>

      {/* Final CTA */}
      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Ready to turn AI into results?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Book the Sprint call above and get clarity in 2 weeks.
          </p>
        </div>
      </Section>
    </Layout>
  );
}

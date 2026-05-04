import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Section, SectionHeader } from "@/components/Section";
import { Card } from "@/components/Card";
import { SEO } from "@/components/SEO";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Calendar,
  Target,
  Wrench,
  Gauge,
  Download,
  Loader2,
  Send,
  CheckCircle2,
} from "lucide-react";

const FRAMEWORK_PDF_URL = "/30-day-outcome-pilot-framework.pdf";
const LEAD_TAG = "[30-DAY PILOT LEAD]";

const formSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters"),
  company: z.string().trim().max(100, "Company name must be less than 100 characters").optional(),
  consent: z.literal<boolean>(true, {
    errorMap: () => ({ message: "You must accept the privacy policy to receive the framework." }),
  }),
});

type FormValues = z.infer<typeof formSchema>;

function LeadCaptureForm({ onSuccess }: { onSuccess: () => void }) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      consent: false as unknown as true,
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("send-contact-email", {
        body: {
          name: data.name,
          email: data.email,
          company: data.company || undefined,
          message: `${LEAD_TAG} Please send the 30-Day Outcome Pilot framework. (Lead from /30-day-outcome-pilot)`,
          consent: data.consent,
          emailType: "pilot-lead",
        },
      });

      if (error) throw error;

      toast({
        title: "Framework on the way",
        description: "We'll email you the framework within 1 business day.",
      });
      form.reset();
      onSuccess();
    } catch (error) {
      console.error("30-day pilot lead form error:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again, or email oby@von-ai.com directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Work email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@yourcompany.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company (optional)</FormLabel>
              <FormControl>
                <Input placeholder="Your company" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="consent"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2">
              <div className="flex items-start gap-3">
                <FormControl>
                  <Checkbox
                    checked={field.value === true}
                    onCheckedChange={(v) => field.onChange(v === true)}
                    className="mt-0.5"
                  />
                </FormControl>
                <FormLabel className="text-sm font-normal leading-snug text-muted-foreground">
                  I agree to the{" "}
                  <Link to="/privacy" className="text-primary hover:underline">
                    privacy policy
                  </Link>{" "}
                  and to receive the framework by email.
                </FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Send className="mr-2 h-4 w-4" />
          )}
          {isSubmitting ? "Sending..." : "Send me the framework"}
        </Button>

        <p className="pt-1 text-center text-xs text-muted-foreground">
          One email. No newsletter. We send the framework and a short follow-up question.
        </p>
      </form>
    </Form>
  );
}

function SuccessCard() {
  return (
    <div className="text-center">
      <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
        <CheckCircle2 className="h-6 w-6 text-primary" />
      </div>
      <h3 className="mb-2 text-2xl font-bold text-foreground">Check your email</h3>
      <p className="mb-6 text-muted-foreground">
        We just sent the 30-Day Outcome Pilot framework to your inbox. If you don&apos;t see it,
        check spam or grab it directly below.
      </p>
      <Button asChild size="lg" variant="outline">
        <a href={FRAMEWORK_PDF_URL} download>
          <Download className="mr-2 h-4 w-4" />
          Download the PDF
        </a>
      </Button>
    </div>
  );
}

export default function ThirtyDayOutcomePilot() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <Layout>
      <SEO
        title="The 30-Day Outcome Pilot — VonAI"
        description="A 4-week sprint that turns 'let's pilot AI' into a scoped workflow, a measured euro outcome, and a decision your CFO will sign. Free framework."
        canonical="/30-day-outcome-pilot"
      />

      {/* Hero */}
      <section className="border-b border-border bg-background">
        <div className="container-padding mx-auto max-w-7xl py-16 md:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Calendar className="mr-2 h-4 w-4" />
              Free framework
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Stop running AI pilots that can&apos;t name a euro number.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-xl text-muted-foreground">
              The 30-Day Outcome Pilot is a 4-week sprint that turns &quot;let&apos;s pilot AI&quot;
              into a scoped workflow, a measured euro outcome, and a decision your CFO will sign.
            </p>
          </div>
        </div>
      </section>

      {/* Why this exists */}
      <Section variant="muted">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Boards stopped buying experimentation.
          </h2>
          <p className="mt-6 text-lg text-muted-foreground">
            In 2023, &quot;we&apos;re piloting AI&quot; was a board-level answer. Leaders looked
            progressive. Vendors got paid. Nobody asked hard questions.
          </p>
          <p className="mt-4 text-lg text-muted-foreground">In 2026, that answer gets you fired.</p>
          <p className="mt-6 text-lg font-semibold text-foreground">Boards are asking 3 questions:</p>
          <ol className="mt-4 list-inside list-decimal space-y-2 text-lg text-muted-foreground">
            <li>What did the pilot ship?</li>
            <li>What did it save us in euros?</li>
            <li>What&apos;s the plan to scale or kill it?</li>
          </ol>
          <p className="mt-6 text-lg font-semibold text-primary">
            If you can&apos;t answer those, you don&apos;t have a pilot. You have a budget leak.
          </p>
          <p className="mt-4 text-lg text-muted-foreground">
            This framework gives you all 3 answers in 30 days.
          </p>
        </div>
      </Section>

      {/* What's in the framework */}
      <Section>
        <SectionHeader
          title="The 4-week sprint"
          subtitle="One workflow. One owner. One number. 30 calendar days."
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card variant="elevated" className="flex flex-col">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm font-semibold text-primary">Week 1</p>
            <h3 className="mb-2 mt-1 text-lg font-bold text-foreground">Pick the workflow</h3>
            <p className="text-muted-foreground">
              A scoring sheet that ranks repetitive workflows by euros-per-month potential and
              build risk. Stops you from picking the exciting workflow over the right one.
            </p>
          </Card>

          <Card variant="elevated" className="flex flex-col">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Gauge className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm font-semibold text-primary">Week 2</p>
            <h3 className="mb-2 mt-1 text-lg font-bold text-foreground">Define the target</h3>
            <p className="text-muted-foreground">
              A 1-page target sheet that locks the baseline cost, the euro reduction you&apos;re
              aiming for, and who measures it. No soft targets.
            </p>
          </Card>

          <Card variant="elevated" className="flex flex-col">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Wrench className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm font-semibold text-primary">Week 3</p>
            <h3 className="mb-2 mt-1 text-lg font-bold text-foreground">Build the smallest version</h3>
            <p className="text-muted-foreground">
              Use tools you already pay for. Test with 1 user and 5 real cases. The build is
              throwaway. The learning is the point.
            </p>
          </Card>

          <Card variant="elevated" className="flex flex-col">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <CheckCircle2 className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm font-semibold text-primary">Week 4</p>
            <h3 className="mb-2 mt-1 text-lg font-bold text-foreground">Measure and decide</h3>
            <p className="text-muted-foreground">
              Run on real workflow for a week. Compare to baseline. Make the call: scale, iterate,
              or kill. Send a 1-page decision memo to the budget holder.
            </p>
          </Card>
        </div>

        <p className="mt-10 text-center text-sm text-muted-foreground">
          The framework includes the workflow scoring sheet, target sheet, build doc, and
          decision memo templates.
        </p>
      </Section>

      {/* Lead capture */}
      <Section variant="muted">
        <div className="mx-auto max-w-xl">
          <Card variant="bordered">
            {!submitted ? (
              <>
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Download className="h-6 w-6 text-primary" />
                </div>
                <h2 className="mb-2 text-2xl font-bold text-foreground">Get the framework</h2>
                <p className="mb-6 text-muted-foreground">
                  Drop your email. We&apos;ll send the framework, the templates, and the sample
                  30-day calendar.
                </p>
                <LeadCaptureForm onSuccess={() => setSubmitted(true)} />
              </>
            ) : (
              <SuccessCard />
            )}
          </Card>
        </div>
      </Section>

      {/* Why a 30-day clock */}
      <Section>
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Why a 30-day clock
          </h2>
          <p className="mt-6 text-lg text-muted-foreground">
            Bigger pilots fail. They fail because scope grows faster than the team can ship, and
            because nobody can name the euro number when the budget holder asks.
          </p>
          <p className="mt-4 text-lg text-muted-foreground">
            30 calendar days is the longest you can run before the organization starts asking
            &quot;what&apos;s happening with that AI thing?&quot; Beat that question with a
            decision memo, not an apology.
          </p>
        </div>
      </Section>

      {/* Soft pitch — AI ROI Sprint */}
      <Section variant="muted">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Want VonAI to run the pilot?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            If you want help picking the workflow, building the prototype, and producing the
            decision memo, our AI ROI Sprint is the fixed-scope way to get there.
          </p>
          <div className="mt-8">
            <Button asChild size="lg">
              <Link to="/ai-roi-sprint">See the AI ROI Sprint</Link>
            </Button>
          </div>
        </div>
      </Section>
    </Layout>
  );
}

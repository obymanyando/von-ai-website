import { Layout } from "@/components/Layout";
import { Section } from "@/components/Section";
import { Card, IconListItem } from "@/components/Card";
import { InlineWidget } from "react-calendly";
import { Mail, Calendar, MessageSquare, Briefcase, AlertCircle, Target, Wrench, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const CALENDLY_URL = "https://calendly.com/oby-manyando/onboarding-call";
const CONTACT_EMAIL = "hello@von-ai.com";

const contactFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters"),
  company: z.string().trim().max(100, "Company name must be less than 100 characters").optional(),
  message: z.string().trim().min(1, "Message is required").max(2000, "Message must be less than 2000 characters"),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

function ContactForm() {
  const { toast } = useToast();
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      message: "",
    },
  });

  const onSubmit = (data: ContactFormValues) => {
    // Build mailto link with form data
    const subject = encodeURIComponent(`Contact from ${data.name}${data.company ? ` at ${data.company}` : ""}`);
    const body = encodeURIComponent(
      `Name: ${data.name}\nEmail: ${data.email}${data.company ? `\nCompany: ${data.company}` : ""}\n\nMessage:\n${data.message}`,
    );

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;

    toast({
      title: "Opening email client",
      description: "Your email client should open with the message pre-filled.",
    });
  };

  return (
    <Card variant="bordered" className="h-fit">
      <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
        <Mail className="h-6 w-6 text-primary" />
      </div>
      <h2 className="mb-2 text-2xl font-bold text-foreground">Send a message</h2>
      <p className="mb-6 text-muted-foreground">Fill out the form and we'll get back to you within 24 hours.</p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name *</FormLabel>
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
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="you@company.com" {...field} />
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
                <FormLabel>Company</FormLabel>
                <FormControl>
                  <Input placeholder="Your company (optional)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us about your workflow challenges..."
                    className="min-h-[120px] resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" size="lg">
            <Send className="mr-2 h-4 w-4" />
            Send Message
          </Button>
        </form>
      </Form>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        Or email us directly at{" "}
        <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary hover:underline">
          {CONTACT_EMAIL}
        </a>
      </p>
    </Card>
  );
}

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
              <h2 className="mb-2 text-2xl font-bold text-foreground">Book a call</h2>
              <p className="mb-4 text-muted-foreground">Schedule a 30-45 minutes call to discuss your situation.</p>
            </div>
            <div className="calendly-wrapper">
              <InlineWidget url={CALENDLY_URL} styles={{ height: "580px", minWidth: "280px" }} />
            </div>
          </Card>

          {/* Contact Form */}
          <ContactForm />
        </div>
      </Section>

      {/* What to Include */}
      <Section variant="muted">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 flex items-center gap-3">
            <MessageSquare className="h-8 w-8 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">What to include in your message</h2>
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
                <span className="font-medium">What outcome matters most</span> — time saved, cost reduced, or revenue
                increased?
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

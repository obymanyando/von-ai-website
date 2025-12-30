import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Layout } from "@/components/Layout";
import { Section } from "@/components/Section";
import { Card, IconListItem } from "@/components/Card";
import { InlineWidget } from "react-calendly";
import { Mail, Calendar, MessageSquare, Briefcase, AlertCircle, Target, Wrench, Send, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("send-contact-email", {
        body: {
          name: data.name,
          email: data.email,
          company: data.company || undefined,
          message: data.message,
        },
      });

      if (error) throw error;

      toast({
        title: t("contact.form.successTitle"),
        description: t("contact.form.successDesc"),
      });
      form.reset();
    } catch (error) {
      console.error("Contact form error:", error);
      toast({
        title: t("contact.form.errorTitle"),
        description: t("contact.form.errorDesc"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card variant="bordered" className="h-fit">
      <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
        <Mail className="h-6 w-6 text-primary" />
      </div>
      <h2 className="mb-2 text-2xl font-bold text-foreground">{t("contact.form.title")}</h2>
      <p className="mb-6 text-muted-foreground">{t("contact.form.subtitle")}</p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("contact.form.name")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("contact.form.namePlaceholder")} {...field} />
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
                <FormLabel>{t("contact.form.email")}</FormLabel>
                <FormControl>
                  <Input type="email" placeholder={t("contact.form.emailPlaceholder")} {...field} />
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
                <FormLabel>{t("contact.form.company")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("contact.form.companyPlaceholder")} {...field} />
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
                <FormLabel>{t("contact.form.message")}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t("contact.form.messagePlaceholder")}
                    className="min-h-[120px] resize-none"
                    {...field}
                  />
                </FormControl>
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
            {isSubmitting ? t("contact.form.sending") : t("contact.form.submit")}
          </Button>
        </form>
      </Form>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        {t("contact.form.emailDirect")}{" "}
        <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary hover:underline">
          {CONTACT_EMAIL}
        </a>
      </p>
    </Card>
  );
}

export default function Contact() {
  const { t } = useTranslation();

  return (
    <Layout>
      {/* Hero */}
      <section className="border-b border-border bg-background">
        <div className="container-padding mx-auto max-w-7xl py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              {t("contact.hero.title")}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              {t("contact.hero.subtitle")}
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
              <h2 className="mb-2 text-2xl font-bold text-foreground">{t("contact.bookCall.title")}</h2>
              <p className="mb-4 text-muted-foreground">{t("contact.bookCall.subtitle")}</p>
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
            <h2 className="text-2xl font-bold text-foreground">{t("contact.whatToInclude.title")}</h2>
          </div>

          <Card variant="bordered">
            <ul className="space-y-4">
              <IconListItem icon={Briefcase}>
                <span className="font-medium">{t("contact.whatToInclude.item1")}</span> {t("contact.whatToInclude.item1Desc")}
              </IconListItem>
              <IconListItem icon={AlertCircle}>
                <span className="font-medium">{t("contact.whatToInclude.item2")}</span> {t("contact.whatToInclude.item2Desc")}
              </IconListItem>
              <IconListItem icon={Target}>
                <span className="font-medium">{t("contact.whatToInclude.item3")}</span> {t("contact.whatToInclude.item3Desc")}
              </IconListItem>
              <IconListItem icon={Wrench}>
                <span className="font-medium">{t("contact.whatToInclude.item4")}</span> {t("contact.whatToInclude.item4Desc")}
              </IconListItem>
            </ul>
          </Card>

          <p className="mt-6 text-center text-muted-foreground">
            {t("contact.whatToInclude.bottomText")}
          </p>
        </div>
      </Section>

      {/* Final CTA */}
      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {t("contact.finalCta.title")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            {t("contact.finalCta.subtitle")}
          </p>
        </div>
      </Section>
    </Layout>
  );
}

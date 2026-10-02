import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { InlineWidget } from "react-calendly";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CALENDLY_URL, CONTACT_EMAIL } from "@/lib/site";

const HELPS = [1, 2, 3] as const;

// The consent message is translated, so the schema is built per render language.
function buildContactSchema(consentRequired: string) {
  return z.object({
    name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
    email: z
      .string()
      .trim()
      .email("Please enter a valid email address")
      .max(255, "Email must be less than 255 characters"),
    company: z.string().trim().max(100, "Company name must be less than 100 characters").optional(),
    message: z.string().trim().min(1, "Message is required").max(2000, "Message must be less than 2000 characters"),
    consent: z.literal<boolean>(true, { errorMap: () => ({ message: consentRequired }) }),
  });
}

type ContactFormValues = z.infer<ReturnType<typeof buildContactSchema>>;

const fieldClass =
  "h-auto rounded-lg border-line-input bg-background px-3 py-[11px] text-[15px] md:text-[15px] placeholder:text-ink-meta focus-visible:ring-brand-ring focus-visible:ring-offset-0";
const labelClass = "text-sm font-normal text-ink-2";

function ContactForm() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const schema = useMemo(() => buildContactSchema(t("contact.form.consentRequired")), [t]);
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      message: "",
      consent: false as unknown as true,
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
          consent: data.consent,
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
    <div className="flex flex-col gap-4 rounded-[18px] border border-line bg-white p-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-medium">{t("contact.form.title")}</h2>
        <p className="text-sm text-ink-soft">{t("contact.form.subtitle")}</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="flex flex-col gap-3.5">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className={labelClass}>{t("contact.form.name")}</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="name"
                      placeholder={t("contact.form.namePlaceholder")}
                      className={fieldClass}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-[13px] font-normal" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className={labelClass}>{t("contact.form.email")}</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      autoComplete="email"
                      placeholder={t("contact.form.emailPlaceholder")}
                      className={fieldClass}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-[13px] font-normal" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className={labelClass}>{t("contact.form.company")}</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="organization"
                    placeholder={t("contact.form.companyPlaceholder")}
                    className={fieldClass}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-[13px] font-normal" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className={labelClass}>{t("contact.form.message")}</FormLabel>
                <FormControl>
                  <Textarea
                    rows={4}
                    placeholder={t("contact.form.messagePlaceholder")}
                    className={`${fieldClass} min-h-[108px] resize-y`}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-[13px] font-normal" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="consent"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <div className="grid grid-cols-[18px_minmax(0,1fr)] items-start gap-2.5">
                  <FormControl>
                    <Checkbox
                      checked={field.value === true}
                      onCheckedChange={(v) => field.onChange(v === true)}
                      className="mt-0.5 border-line-strong data-[state=checked]:border-ink"
                    />
                  </FormControl>
                  <FormLabel className="text-[13px] font-normal leading-[1.45] text-ink-soft">
                    {t("contact.form.consentLabel")}{" "}
                    <Link to="/privacy" className="text-ink-soft underline">
                      {t("contact.form.consentLink")}
                    </Link>
                    .
                  </FormLabel>
                </div>
                <FormMessage className="text-[13px] font-normal" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-auto w-full rounded-full py-[13px] text-base font-medium hover:bg-ink-hover"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />}
            {isSubmitting ? t("contact.form.sending") : t("contact.form.submit")}
          </Button>
        </form>
      </Form>

      <p className="text-sm text-ink-soft">
        {t("contact.form.emailDirect")}{" "}
        <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex min-h-[44px] items-center text-ink md:min-h-0">
          <span className="link-underline">{CONTACT_EMAIL}</span>
        </a>
      </p>
    </div>
  );
}

export default function Contact() {
  const { t } = useTranslation();

  return (
    <Layout footerVariant="minimal">
      <SEO
        title="Book a free call | VonAI"
        description="A free 30-minute call. Tell us which workflow takes the most time, and we'll tell you honestly whether it's a good fit."
        canonical="/contact"
      />
      <header className="site-container flex flex-col gap-5 pb-12 pt-16 md:pt-[88px]">
        <p className="eyebrow">{t("contact.hero.eyebrow")}</p>
        <h1 className="h1-page max-w-[820px]">{t("contact.hero.title")}</h1>
        <p className="lead max-w-[620px] text-[19px]">{t("contact.hero.subtitle")}</p>
      </header>

      <section className="site-container grid grid-cols-[repeat(auto-fit,minmax(min(100%,360px),1fr))] items-start gap-5 pb-24">
        <div className="overflow-hidden rounded-[18px] border border-line bg-white">
          <div className="flex items-center justify-between gap-3 border-b border-line-inner px-6 py-[22px]">
            <div className="flex flex-col gap-0.5">
              <h2 className="text-lg font-medium">{t("contact.bookCall.title")}</h2>
              <p className="text-sm text-ink-soft">{t("contact.bookCall.subtitle")}</p>
            </div>
            <span className="shrink-0 rounded-full border border-line-input px-2.5 py-[3px] font-mono text-xs uppercase text-ink-soft">
              {t("contact.bookCall.duration")}
            </span>
          </div>
          {/* Fixed height so the page doesn't jump when Calendly's iframe loads. */}
          <InlineWidget
            url={CALENDLY_URL}
            styles={{ height: "680px", minWidth: "280px" }}
            pageSettings={{
              backgroundColor: "ffffff",
              primaryColor: "1a1a1a",
              textColor: "1a1a1a",
              hideEventTypeDetails: true,
            }}
          />
        </div>

        <div className="flex flex-col gap-5">
          <ContactForm />
          <div className="flex flex-col gap-3 rounded-[18px] bg-muted p-6">
            <h2 className="text-base font-medium">{t("contact.whatHelps.title")}</h2>
            <ul className="flex flex-col gap-3">
              {HELPS.map((n) => (
                <li key={n} className="grid grid-cols-[18px_minmax(0,1fr)] gap-2.5 text-[15px] leading-[1.45] text-ink-2">
                  <span aria-hidden className="ml-1 mt-2 h-1.5 w-1.5 rounded-full bg-brand-ring" />
                  <span>{t(`contact.whatHelps.item${n}`)}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm text-ink-soft">{t("contact.whatHelps.bottomText")}</p>
          </div>
        </div>
      </section>
    </Layout>
  );
}

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { Loader2, Download, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Resource } from "@/data/resources";
import { getResourceUrl } from "@/data/resources";

interface Props {
  resource: Resource;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  company: z.string().trim().max(150).optional(),
  consent: z.literal(true),
  marketingOptIn: z.boolean(),
});

export function GatedDownloadDialog({ resource, open, onOpenChange }: Props) {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [consent, setConsent] = useState(false);
  const [marketingOptIn, setMarketingOptIn] = useState(true);
  const [honeypot, setHoneypot] = useState("");
  const openedAt = useRef<number>(0);

  useEffect(() => {
    if (open) {
      openedAt.current = Date.now();
      setDone(false);
    }
  }, [open]);

  const fileUrl = getResourceUrl(resource);
  const lang = i18n.language.startsWith("fi") ? "fi" : "en";
  const title = lang === "fi" ? resource.titleFi : resource.titleEn;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return; // bot
    if (Date.now() - openedAt.current < 1500) {
      toast({ title: t("resources.tooFast"), variant: "destructive" });
      return;
    }
    const parsed = schema.safeParse({ name, email, company: company || undefined, consent, marketingOptIn });
    if (!parsed.success) {
      toast({
        title: t("resources.formInvalid"),
        description: parsed.error.issues[0]?.message,
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("request-gated-resource", {
        body: {
          name: parsed.data.name,
          email: parsed.data.email,
          company: parsed.data.company ?? null,
          marketing_opt_in: parsed.data.marketingOptIn,
          resource_slug: resource.slug,
          language: lang,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      // Trigger download
      const a = document.createElement("a");
      a.href = fileUrl;
      a.download = resource.fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();

      setDone(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      toast({
        title: t("resources.submitError"),
        description: msg,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {done ? (
          <div className="text-center space-y-4 py-4">
            <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
            <DialogTitle>{t("resources.successTitle")}</DialogTitle>
            <DialogDescription>{t("resources.successBody")}</DialogDescription>
            <Button asChild variant="cta">
              <a href={fileUrl} download={resource.fileName}>
                <Download className="mr-2 h-4 w-4" />
                {t("resources.downloadAgain")}
              </a>
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{t("resources.dialogTitle", { title })}</DialogTitle>
              <DialogDescription>{t("resources.dialogDesc")}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Honeypot */}
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                aria-hidden
                className="absolute -left-[9999px] h-0 w-0 opacity-0"
              />

              <div className="space-y-2">
                <Label htmlFor="gd-name">{t("resources.fieldName")}</Label>
                <Input
                  id="gd-name"
                  required
                  maxLength={100}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gd-email">{t("resources.fieldEmail")}</Label>
                <Input
                  id="gd-email"
                  type="email"
                  required
                  maxLength={255}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gd-company">{t("resources.fieldCompany")}</Label>
                <Input
                  id="gd-company"
                  maxLength={150}
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>

              <label className="flex items-start gap-2 text-sm text-muted-foreground">
                <Checkbox
                  checked={consent}
                  onCheckedChange={(c) => setConsent(c === true)}
                  required
                  className="mt-0.5"
                />
                <span>{t("resources.consentLabel")}</span>
              </label>
              <label className="flex items-start gap-2 text-sm text-muted-foreground">
                <Checkbox
                  checked={marketingOptIn}
                  onCheckedChange={(c) => setMarketingOptIn(c === true)}
                  className="mt-0.5"
                />
                <span>{t("resources.marketingOptInLabel")}</span>
              </label>

              <Button type="submit" variant="cta" className="w-full" disabled={submitting || !consent}>
                {submitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Download className="mr-2 h-4 w-4" />
                )}
                {t("resources.submit")}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
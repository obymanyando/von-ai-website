import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { useTranslation } from "react-i18next";
import { Accordion, AccordionContent, AccordionItem } from "@/components/ui/accordion";
import { CONTACT_EMAIL, FAQ_COUNT } from "@/lib/site";

const FAQS = Array.from({ length: FAQ_COUNT }, (_, i) => i + 1);

export function Faq() {
  const { t } = useTranslation();
  return (
    <section id="faq">
      <div className="site-container grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-12 pb-28 pt-28 md:gap-16 md:pt-32">
        <div className="flex flex-col gap-[18px] md:sticky md:top-[120px] md:self-start">
          <p className="eyebrow">{t("home.faq.eyebrow")}</p>
          <h2 className="h2">{t("home.faq.title")}</h2>
          <p className="text-base text-ink-soft">
            {t("home.faq.somethingElse")}{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="link-underline text-ink">
              {CONTACT_EMAIL}
            </a>
          </p>
        </div>
        {/* One open at a time, first open by default. */}
        <Accordion type="single" collapsible defaultValue="q1" className="border-t border-line">
          {FAQS.map((n) => (
            <AccordionItem key={n} value={`q${n}`} className="border-b border-line">
              {/* Own trigger: the shadcn one hard-codes a chevron; the design uses a rotating "+". */}
              <AccordionPrimitive.Header className="flex">
                <AccordionPrimitive.Trigger className="group flex flex-1 items-center justify-between gap-4 py-[22px] text-left text-[17px] text-ink hover:text-brand-text sm:text-lg">
                  <span>{t(`home.faq.q${n}`)}</span>
                  <span
                    aria-hidden
                    className="text-[22px] leading-none text-ink-meta transition-transform duration-200 group-data-[state=open]:rotate-45"
                  >
                    +
                  </span>
                </AccordionPrimitive.Trigger>
              </AccordionPrimitive.Header>
              <AccordionContent className="max-w-[600px] pb-[22px] text-pretty text-base leading-[1.6] text-ink-body">
                {t(`home.faq.a${n}`)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

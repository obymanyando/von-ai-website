import { useTranslation } from "react-i18next";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Hero } from "@/components/home/Hero";
import { Problem } from "@/components/home/Problem";
import { Offer } from "@/components/home/Offer";
import { Process } from "@/components/home/Process";
import { Results } from "@/components/home/Results";
import { Fit } from "@/components/home/Fit";
import { Faq } from "@/components/home/Faq";
import { CONTACT_EMAIL, FAQ_COUNT } from "@/lib/site";

const DESCRIPTION =
  "One AI workflow, live in 30 days and measured against how you work today. For professional services firms with 10 to 100 people.";

export default function Home() {
  const { t } = useTranslation();

  // Structured data deliberately carries no price, priceRange or offers:
  // pricing is quoted after the free call (home.faq.a1).
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      name: "VonAI",
      url: "https://von-ai.com/",
      email: CONTACT_EMAIL,
      description: DESCRIPTION,
      address: { "@type": "PostalAddress", addressLocality: "Helsinki", addressCountry: "FI" },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: Array.from({ length: FAQ_COUNT }, (_, i) => ({
        "@type": "Question",
        name: t(`home.faq.q${i + 1}`),
        acceptedAnswer: { "@type": "Answer", text: t(`home.faq.a${i + 1}`) },
      })),
    },
  ];

  return (
    <Layout closingCta={{ title: t("home.finalCta.title"), subtitle: t("home.finalCta.subtitle") }}>
      <SEO title="VonAI | One AI workflow, live in 30 days" description={DESCRIPTION} canonical="/" jsonLd={jsonLd} />
      <Hero />
      <Problem />
      <Offer />
      <Process />
      <Results />
      <Fit />
      <Faq />
    </Layout>
  );
}

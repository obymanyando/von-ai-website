export const CONTACT_EMAIL = "hello@von-ai.com";
export const CALENDLY_URL = "https://calendly.com/oby-manyando/onboarding-call";

/**
 * Insights library (/resources). Off until real PDFs exist: placeholder documents
 * would undercut the offer. When off, nav and footer links are hidden and the pages
 * redirect to Home. Re-enabling also means restoring /resources in sitemap.xml,
 * llms.txt and removing the /resources 302s in public/_redirects.
 */
export const INSIGHTS_ENABLED = false;

/** Home page sections reachable from the nav and footer, in page order. */
export const HOME_SECTIONS = [
  { id: "offer", labelKey: "nav.offer" },
  { id: "process", labelKey: "nav.process" },
  { id: "results", labelKey: "nav.results" },
  { id: "faq", labelKey: "nav.faq" },
] as const;

/** home.faq.q1..qN / a1..aN in en.json. */
export const FAQ_COUNT = 8;

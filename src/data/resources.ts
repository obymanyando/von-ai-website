export type ResourceType = "guide" | "checklist" | "template" | "playbook" | "scorecard";

export interface Resource {
  slug: string;
  type: ResourceType;
  gated: boolean;
  titleEn: string;
  titleFi: string;
  descEn: string;
  descFi: string;
  longDescEn?: string;
  longDescFi?: string;
  tags: string[];
  fileName: string;
  pages?: number;
  publishedAt: string;
  placeholder?: boolean;
}

export const resources: Resource[] = [
  {
    slug: "ai-operating-layer-checklist",
    type: "checklist",
    gated: true,
    titleEn: "The AI Operating Layer Checklist",
    titleFi: "AI-toimintakerroksen tarkistuslista",
    descEn:
      "A practical checklist to assess whether your firm has the operating layer in place to actually capture value from AI — not just experiment with it.",
    descFi:
      "Käytännönläheinen tarkistuslista sen arviointiin, onko yrityksessäsi toimintakerros, jolla AI:sta saadaan oikeasti arvoa — eikä vain kokeilla.",
    longDescEn:
      "Use this checklist with your leadership team to identify exactly which pieces of the AI operating layer you already have, which are missing, and which need to be upgraded before scaling AI investment.",
    longDescFi:
      "Käy tämä tarkistuslista läpi johtoryhmäsi kanssa tunnistaaksesi, mitkä AI-toimintakerroksen osat ovat jo paikoillaan, mitkä puuttuvat ja mitkä on päivitettävä ennen AI-investointien skaalaamista.",
    tags: ["operations", "leadership", "ai-strategy"],
    fileName: "ai-operating-layer-checklist.pdf",
    publishedAt: "2026-05-21",
  },
  {
    slug: "ai-readiness-scorecard",
    type: "scorecard",
    gated: false,
    titleEn: "AI Readiness Scorecard",
    titleFi: "AI-valmiusmittari",
    descEn:
      "A 10-minute self-assessment to see where your firm stands on data, workflows, and team readiness before investing in AI.",
    descFi:
      "10 minuutin itsearviointi, joka näyttää datan, työnkulkujen ja tiimin valmiuden ennen AI-investointia.",
    tags: ["self-assessment", "leadership"],
    fileName: "ai-readiness-scorecard.pdf",
    publishedAt: "2026-05-21",
    placeholder: true,
  },
  {
    slug: "90-day-ai-roi-playbook",
    type: "playbook",
    gated: true,
    titleEn: "The 90-Day AI ROI Playbook",
    titleFi: "90 päivän AI-ROI-pelikirja",
    descEn:
      "How B2B services firms get from first pilot to measurable revenue impact in 90 days — without burning six figures.",
    descFi:
      "Miten B2B-palveluyritykset etenevät ensimmäisestä pilotista mitattavaan tulosvaikutukseen 90 päivässä — ilman kuusinumeroisia kuluja.",
    tags: ["roi", "pilot", "playbook"],
    fileName: "90-day-ai-roi-playbook.pdf",
    publishedAt: "2026-05-21",
    placeholder: true,
  },
  {
    slug: "vendor-evaluation-template",
    type: "template",
    gated: false,
    titleEn: "AI Vendor Evaluation Template",
    titleFi: "AI-toimittajan arviointipohja",
    descEn:
      "A practical scoring sheet to compare AI vendors on security, integration, ROI evidence, and switching cost.",
    descFi:
      "Käytännön pisteytyspohja AI-toimittajien vertailuun tietoturvan, integraation, ROI-näytön ja vaihtokustannusten perusteella.",
    tags: ["procurement", "vendor"],
    fileName: "vendor-evaluation-template.pdf",
    publishedAt: "2026-05-21",
    placeholder: true,
  },
  {
    slug: "ai-governance-starter-kit",
    type: "guide",
    gated: true,
    titleEn: "AI Governance Starter Kit",
    titleFi: "AI-hallintamallin aloituspaketti",
    descEn:
      "A one-page policy, an approved-tools list, and a review checklist your team can adopt this week.",
    descFi:
      "Yhden sivun ohjeistus, hyväksyttyjen työkalujen lista ja tarkistuslista, jonka tiimisi voi ottaa käyttöön tällä viikolla.",
    tags: ["governance", "policy", "risk"],
    fileName: "ai-governance-starter-kit.pdf",
    publishedAt: "2026-05-21",
    placeholder: true,
  },
];

export function getResourceBySlug(slug: string): Resource | undefined {
  return resources.find((r) => r.slug === slug);
}

export function getResourceUrl(resource: Resource): string {
  return `/resources/${resource.fileName}`;
}
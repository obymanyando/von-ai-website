# Resource Library Plan

A `/resources` hub on VonAI where visitors can download PDFs. Some are free (one-click), some are gated behind a name + email form. Gated downloads show instantly AND get emailed for later.

## User experience

**Public `/resources` page**

- Grid of resource cards: thumbnail, title, short description, type badge (Guide / Template / Checklist / Whitepaper), tags, language, and a CTA — either "Download" (free) or "Get the PDF" (gated).
- Filters: type, topic, language (EN/FI), free vs gated.
- Localized (EN/FI), SEO-optimized per resource (title, meta, JSON-LD `DigitalDocument`).

**Free resources**

- Click → PDF opens/downloads immediately from `/public/resources/...`.
- Lightweight anonymous event logged (resource_id, timestamp, IP-hash) for analytics — no PII.

**Gated resources**

- Click "Get the PDF" → modal opens with: name, email, consent checkbox (GDPR), optional company field.
- Submit → instant in-browser download starts + success state shows "We've also emailed you a copy".
- Background: lead saved to DB, transactional email sent via existing `send-transactional-email` pipeline with the download link + the resource attached as a link.

**Admin `/admin` additions**

- New "Resources" tab listing every resource (read-only, code-managed) with total downloads.
- New "Leads" tab: table of captured leads filterable by resource. Columns: name, email, company, resource, captured_at, language, consent. CSV export.

## Content management

Resources are defined in code (a typed array in `src/data/resources.ts`) and PDFs live in `public/resources/<slug>.pdf`. Each entry:

```
{ slug, type, gated, titleEn, titleFi, descEn, descFi,
  tags, lang, fileName, thumbnail, publishedAt }
```

Adding a new resource = drop the PDF in `/public/resources/`, add an entry, deploy. No admin upload UI in v1.

## Data model (new tables)

- `**resource_downloads**` — every download event (free or gated). Fields: resource_slug, gated (bool), lead_id (nullable), ip_hash, user_agent, language, created_at. RLS: insert via service role (edge function), read by admin only.
- `**resource_leads**` — captured leads from gated forms. Fields: name, email, company, resource_slug, language, consent_given, consent_at, ip_hash, created_at. Unique-ish index on (email, resource_slug) so the same person re-requesting the same PDF doesn't duplicate. RLS: insert via service role, read/delete by admin only.

Reuses existing `suppressed_emails` and the email queue — no new email infra needed.

## Email

- New transactional template `resource-download` registered in the existing registry.
- Subject: "Your VonAI [resource title]"
- Body: branded, includes resource title, short blurb, prominent "Download PDF" button (signed/public URL to the PDF), and a "what's next" CTA pointing to /contact or /ai-roi-sprint.
- Sent via existing `send-transactional-email` with `idempotencyKey = lead-${leadId}-${slug}`.

## Security & abuse prevention

- Zod validation on the form (name 1–100, valid email, company ≤100, consent must be true).
- Rate limiting on the gated-submit edge function using the existing `rate_limit_events` table (e.g. 5 submissions / hour / IP).
- Honeypot field + minimum-time-to-submit check to deter bots.
- Suppression check: if email is on the suppression list, the email send is skipped but the in-browser download still works.
- Free PDFs are served as static assets — no auth needed. Gated PDFs live in the same `/public` folder; gating is a UX gate, not a hard security boundary (acceptable for lead magnets — same as every competitor). Worth flagging.

## Implementation phases

**Phase 1 — Foundation**

- Migration: `resource_downloads`, `resource_leads` tables + RLS policies.
- `src/data/resources.ts` with 2–3 seed entries (1 free, 1 gated) for testing.
- `public/resources/` folder + placeholder PDFs.

**Phase 2 — Public side**

- `/resources` index page + `ResourceCard` component + filters.
- `GatedDownloadDialog` component (form + Zod + honeypot).
- Edge function `request-gated-resource`: validates, rate-limits, inserts lead, logs download, fires transactional email, returns the PDF URL for instant download.
- `resource-download.tsx` email template + registry update + deploy.
- i18n strings for EN/FI.

**Phase 3 — Admin**

- "Leads" tab in `/admin` with table + CSV export.
- "Resources" overview tab with download counts (aggregated query).

**Phase 4 — SEO & polish**

- Per-resource SEO meta (resources can have individual `?slug=` modal pages or stay on the index — TBD).
- Add to `sitemap.xml` and `llms.txt`.
- Add a "Resources" link to Navbar and Footer.

## Open questions before building

1. Need individual resource pages (`/resources slug]`) for SEO + deep-linking, or is a single `/resources` index enough?
2. Should gated leads automatically be added to a separate marketing list for future newsletter, or stay download-only? (Marketing emails are out of scope here, but lead intent matters.)
3. What's the v1 content? — confirm 3–5 resources to launch with so we can ship something real, not just placeholders.

Once you green-light the plan and answer these, I'll build phase 1 + 2 in one pass.

1. `/resources/[slug`
2. `Auto added`
3. `5 free`
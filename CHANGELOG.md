# Changelog

## Unreleased: redesign for the 30-day workflow offer (branch `von-ai-redesign`)

Built from the design handoff in `vonai_redesign/`.

### Added
- Single-page Home: hero with an "Example report" results window, problem, offer (enquiry handling / proposal drafting), 4-step process, results case, fit, 8-question FAQ, closing CTA.
- Insights library at `/resources` with a featured banner, type and access filters, and mock-document cards. `featured` flag in `src/data/resources.ts`.
- New nav (sticky, mobile sheet), footer and closing CTA card; transparent wordmark logo.
- `npm run check:copy` copy guardrail (chained into `npm run build`) and `npm run typecheck`.
- `public/_redirects`: 301s for the retired routes and the deleted pilot PDF.

### Changed
- Design tokens remapped to the handoff palette; Geist type; light theme only.
- `en.json` replaced by the handoff copy (plus the existing `resources.*` keys).
- Contact page restyled; same form validation and `send-contact-email` submission; consent error uses the new copy.
- Meta tags, JSON-LD, `llms.txt`, `sitemap.xml` and `og-meta` describe the new offer, with no prices.
- Chat assistant prompt rewritten for the new offer with a no-price rule (widget still disabled).
- Gated-download follow-up email offers the free call instead of the AI ROI Sprint; contact auto-reply says "one working day".
- Web manifest description and colours; sitemap lists only real (non-placeholder) resources.
- English forced and `fi.json` no longer bundled until the Finnish translation exists.

### Removed
- AI ROI Sprint and 30-Day Outcome Pilot pages; `/ai-roi-sprint`, `/services`, `/roi-calculator`, `/30-day-outcome-pilot` and `/about` redirect to `/`.
- `public/30-day-outcome-pilot-framework.pdf`.
- Theme toggle and unused old-Home components.

### Fixed
- Parked prices and the old Finnish price no longer ship inside the JS bundle.

### Pending before launch
- Confirm or replace the illustrative numbers in the hero example report (`home.report.*`).
- Real Insights resources.
- Deploy the `chat`, `og-meta`, `send-contact-email`, `send-transactional-email` and `preview-transactional-email` edge functions together with the site (the last two bundle the resource-download email template).
- Replace `public/og-image.png` (still shows the old "From AI experiments to ROI" line).

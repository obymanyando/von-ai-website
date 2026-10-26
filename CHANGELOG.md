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
- Insights hidden until real PDFs exist: `INSIGHTS_ENABLED = false` in `src/lib/site.ts` removes the nav and footer links and redirects `/resources` and `/resources/:slug` to `/` (302 in `_redirects` for the index; the PDFs stay reachable). Dropped from `sitemap.xml`, `llms.txt` and the chat prompt.
- Results report moved from day 30 to day 60: the workflow is live by day 30 and measured over 30 days of daily use. Example report columns now read Before / After 30 days live; hero, process step 4, FAQ, pricing, chat prompt and `llms.txt` match.
- Monthly fee now starts after the day-60 results report, not at go-live, so the client sees results before paying to run it. Monitoring and fixes until the report are included in the build price. FAQ a1 and a5, parked pricing note, chat prompt, `llms.txt` and assistant doc match.
- Design tokens remapped to the handoff palette; Geist type; light theme only.
- `en.json` replaced by the handoff copy (plus the existing `resources.*` keys).
- Contact page restyled; same form validation and `send-contact-email` submission; consent error uses the new copy.
- Meta tags, JSON-LD, `llms.txt`, `sitemap.xml` and `og-meta` describe the new offer, with no prices.
- Chat assistant prompt rewritten for the new offer with a no-price rule (widget still disabled).
- Gated-download follow-up email offers the free call instead of the AI ROI Sprint; contact auto-reply says "one working day".
- Web manifest description and colours; sitemap lists no resources while Insights is hidden.
- English forced and `fi.json` no longer bundled until the Finnish translation exists.

### Removed
- AI ROI Sprint and 30-Day Outcome Pilot pages; `/ai-roi-sprint`, `/services`, `/roi-calculator`, `/30-day-outcome-pilot` and `/about` redirect to `/`.
- `public/30-day-outcome-pilot-framework.pdf`.
- Theme toggle and unused old-Home components.

### Fixed
- Parked prices and the old Finnish price no longer ship inside the JS bundle.

### Pending before launch
- Real Insights resources (launching without them: Insights is hidden). Re-enable by setting `INSIGHTS_ENABLED` to true and restoring `/resources` in `sitemap.xml`, `llms.txt` and `_redirects`.
- Deploy the `chat`, `og-meta`, `send-contact-email`, `send-transactional-email` and `preview-transactional-email` edge functions together with the site (the last two bundle the resource-download email template).
- Replace `public/og-image.png` (still shows the old "From AI experiments to ROI" line).

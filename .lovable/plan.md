# Add Lovable Emails on `support.von-ai.com`

Goal: password reset (and other auth emails) send reliably from `noreply@support.von-ai.com` instead of Supabase's shared sender.

## Steps

1. **Open the email setup dialog** in Lovable and enter `support.von-ai.com` as the sender subdomain. Lovable returns 2 NS records (e.g. `ns3.lovable.cloud`, `ns4.lovable.cloud`).

2. **Add NS records on Cloudflare** for `support.von-ai.com`:
   - Type: `NS`, Name: `support`, Target: `ns3.lovable.cloud`
   - Type: `NS`, Name: `support`, Target: `ns4.lovable.cloud`
   - NS records are DNS-only by nature (no orange/grey cloud toggle) — consistent with project rule.
   - All other von-ai.com records (root A, www, MX for hello@, Resend's `comms.von-ai.com`) stay untouched.

3. **Email infrastructure auto-provisions**: queues, tables, `process-email-queue` cron, vault secret. No code or migrations needed from me.

4. **Scaffold branded auth email templates** (`auth-email-hook` + 6 React Email templates: signup, magic-link, recovery, invite, email-change, reauthentication). Apply VonAI brand:
   - Primary `#006699` (light) / `#0099E6`, Inter font, white email body.
   - Bilingual EN/FI copy mirroring app tone (since project uses i18next).
   - Logo from `public/` if available.

5. **Deploy `auth-email-hook`**. Lovable wires it into Supabase Auth automatically once DNS verifies (up to 72h, usually <1h on Cloudflare).

6. **Test**: trigger password reset for `oby.manyando@gmail.com` from `/auth`, confirm email arrives from `support.von-ai.com`.

## What stays the same

- `hello@von-ai.com` mailbox and MX records
- Resend on `comms.von-ai.com` for contact form + pilot lead emails
- Cloudflare grey-cloud rule for the rest of the zone

## Notes

- The setup dialog and NS records are required before I can scaffold templates — but I'll queue the scaffolding to run as soon as DNS is added so emails activate the moment verification clears.
- After this, I'd recommend setting up Lovable transactional emails too (would replace Resend for contact form), but that's a separate decision — keeping Resend is perfectly fine.

## Technical details

- Tools used: `email_domain--scaffold_auth_email_templates`, `supabase--deploy_edge_functions(["auth-email-hook"])`.
- Files created: `supabase/functions/auth-email-hook/{index.ts,deno.json}`, `supabase/functions/_shared/email-templates/*.tsx` (6 files).
- No DB migrations, no changes to existing code, no secrets to add.

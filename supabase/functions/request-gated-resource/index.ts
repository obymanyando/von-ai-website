import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { z } from 'npm:zod@3.23.8'

const Body = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  company: z.string().trim().max(150).nullable().optional(),
  marketing_opt_in: z.boolean().optional().default(true),
  resource_slug: z.string().trim().min(1).max(120),
  language: z.enum(['en', 'fi']).optional().default('en'),
})

async function hashIp(ip: string): Promise<string> {
  const data = new TextEncoder().encode(ip)
  const buf = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 32)
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
  const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

  let parsed
  try {
    const body = await req.json()
    parsed = Body.safeParse(body)
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  if (!parsed.success) {
    return new Response(
      JSON.stringify({ error: 'Invalid input', issues: parsed.error.flatten() }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  const { name, email, company, marketing_opt_in, resource_slug, language } = parsed.data
  const normalizedEmail = email.toLowerCase()

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('cf-connecting-ip') ||
    'unknown'
  const ipHash = await hashIp(ip)
  const userAgent = req.headers.get('user-agent')?.slice(0, 500) || null

  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString()
  const { count } = await supabase
    .from('rate_limit_events')
    .select('id', { count: 'exact', head: true })
    .eq('client_ip', ipHash)
    .eq('endpoint', 'request-gated-resource')
    .gte('created_at', since)

  if ((count ?? 0) >= 5) {
    return new Response(
      JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
      { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  await supabase.from('rate_limit_events').insert({
    client_ip: ipHash,
    endpoint: 'request-gated-resource',
    event_type: 'submission',
  })

  const { data: lead, error: leadError } = await supabase
    .from('resource_leads')
    .insert({
      name,
      email: normalizedEmail,
      company: company ?? null,
      resource_slug,
      language,
      consent_given: true,
      consent_at: new Date().toISOString(),
      marketing_opt_in,
      ip_hash: ipHash,
      user_agent: userAgent,
    })
    .select('id')
    .single()

  if (leadError || !lead) {
    console.error('Lead insert failed', leadError)
    return new Response(JSON.stringify({ error: 'Could not save your request' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  await supabase.from('resource_downloads').insert({
    resource_slug,
    gated: true,
    lead_id: lead.id,
    language,
    ip_hash: ipHash,
    user_agent: userAgent,
  })

  if (marketing_opt_in) {
    await supabase
      .from('marketing_subscribers')
      .upsert(
        {
          email: normalizedEmail,
          name,
          language,
          source: `resource:${resource_slug}`,
          unsubscribed_at: null,
        },
        { onConflict: 'email' }
      )
  }

  try {
    await supabase.functions.invoke('send-transactional-email', {
      body: {
        templateName: 'resource-download',
        recipientEmail: normalizedEmail,
        idempotencyKey: `resource-${lead.id}`,
        templateData: { name, resourceSlug: resource_slug, language },
      },
    })
  } catch (e) {
    console.error('Email dispatch failed (non-blocking)', e)
  }

  return new Response(JSON.stringify({ success: true, leadId: lead.id }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
})
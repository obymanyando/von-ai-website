/* eslint-disable react-refresh/only-export-components -- email template module for Deno, not a Fast Refresh boundary */
/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Html, Preview, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'VonAI'
const SITE_URL = 'https://von-ai.com'

interface Props {
  name?: string
  resourceSlug?: string
  language?: 'en' | 'fi'
}

const TITLES: Record<string, { en: string; fi: string }> = {
  'ai-operating-layer-checklist': { en: 'The AI Operating Layer Checklist', fi: 'AI-toimintakerroksen tarkistuslista' },
  'ai-readiness-scorecard': { en: 'AI Readiness Scorecard', fi: 'AI-valmiusmittari' },
  '90-day-ai-roi-playbook': { en: 'The 90-Day AI ROI Playbook', fi: '90 päivän AI-ROI-pelikirja' },
  'vendor-evaluation-template': { en: 'AI Vendor Evaluation Template', fi: 'AI-toimittajan arviointipohja' },
  'ai-governance-starter-kit': { en: 'AI Governance Starter Kit', fi: 'AI-hallintamallin aloituspaketti' },
}

const FILES: Record<string, string> = {
  'ai-operating-layer-checklist': 'ai-operating-layer-checklist.pdf',
  'ai-readiness-scorecard': 'ai-readiness-scorecard.pdf',
  '90-day-ai-roi-playbook': '90-day-ai-roi-playbook.pdf',
  'vendor-evaluation-template': 'vendor-evaluation-template.pdf',
  'ai-governance-starter-kit': 'ai-governance-starter-kit.pdf',
}

function resourceTitle(slug?: string, lang: 'en' | 'fi' = 'en'): string {
  if (!slug) return 'your resource'
  return TITLES[slug]?.[lang] ?? slug
}

function resourceUrl(slug?: string): string {
  // The Insights index is hidden (it redirects to Home), so unknown slugs go to Home directly.
  if (!slug || !FILES[slug]) return SITE_URL
  return `${SITE_URL}/resources/${FILES[slug]}`
}

const ResourceDownloadEmail = ({ name, resourceSlug, language = 'en' }: Props) => {
  const title = resourceTitle(resourceSlug, language)
  const url = resourceUrl(resourceSlug)
  return (
    <Html lang={language} dir="ltr">
      <Head />
      <Preview>{`Your copy of ${title}`}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>{name ? `Thanks, ${name}!` : 'Thanks!'}</Heading>
          <Text style={text}>
            Here is your copy of <strong>{title}</strong>. You can download it
            using the button below whenever you need it.
          </Text>
          <Button href={url} style={button}>Download PDF</Button>
          <Text style={small}>
            If the button doesn't work, copy this link into your browser:<br />
            <a href={url} style={link}>{url}</a>
          </Text>
          <Text style={text}>
            Rather talk it through? A free 30-minute call tells you which
            workflow to take on first. {SITE_NAME} puts one AI workflow into
            daily use in 30 days and measures it against how you work today.
          </Text>
          <Button href={`${SITE_URL}/contact`} style={buttonOutline}>
            Book a free call
          </Button>
          <Text style={footer}>— The {SITE_NAME} team</Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: ResourceDownloadEmail,
  // `any` matches TemplateEntry.subject in registry.ts; narrowing it needs a
  // Deno type-check of every template, which this change could not run.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subject: (data: Record<string, any>) =>
    `Your copy of ${resourceTitle(data?.resourceSlug, data?.language ?? 'en')}`,
  displayName: 'Resource download',
  previewData: { name: 'Jane', resourceSlug: 'ai-operating-layer-checklist', language: 'en' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Inter, Arial, sans-serif' }
const container = { padding: '24px 28px', maxWidth: '560px' }
const h1 = { fontSize: '24px', fontWeight: 'bold', color: '#006699', margin: '0 0 16px' }
const text = { fontSize: '15px', color: '#333333', lineHeight: '1.6', margin: '0 0 20px' }
const small = { fontSize: '12px', color: '#777777', lineHeight: '1.5', margin: '0 0 24px' }
const link = { color: '#006699', wordBreak: 'break-all' as const }
const button = {
  backgroundColor: '#006699', color: '#ffffff', padding: '12px 22px',
  borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold' as const,
  display: 'inline-block', margin: '0 0 24px',
}
const buttonOutline = {
  border: '1px solid #006699', color: '#006699', padding: '10px 20px',
  borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold' as const,
  display: 'inline-block', margin: '0 0 24px',
}
const footer = { fontSize: '13px', color: '#888888', margin: '24px 0 0' }
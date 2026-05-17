/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const TestEmail = () => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Test email from support.von-ai.com</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>It works!</Heading>
        <Text style={text}>
          This is a test message confirming that support.von-ai.com is sending email properly via VonAI's Lovable infrastructure.
        </Text>
        <Text style={footer}>— VonAI</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: TestEmail,
  subject: 'Test from support.von-ai.com',
  displayName: 'Test email',
  previewData: {},
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Inter, Arial, sans-serif' }
const container = { padding: '24px 28px', maxWidth: '560px' }
const h1 = { fontSize: '22px', fontWeight: 'bold', color: '#006699', margin: '0 0 16px' }
const text = { fontSize: '14px', color: '#333333', lineHeight: '1.6', margin: '0 0 20px' }
const footer = { fontSize: '12px', color: '#888888', margin: '24px 0 0' }
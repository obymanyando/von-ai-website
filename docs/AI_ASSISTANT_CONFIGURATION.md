# VON AI Assistant - Technical Documentation

This document provides comprehensive documentation of the AI assistant implementation, including architecture, LLM configuration, security guardrails, and monitoring capabilities.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [LLM Configuration](#llm-configuration)
3. [Rate Limiting & Guardrails](#rate-limiting--guardrails)
4. [Input Validation & Sanitization](#input-validation--sanitization)
5. [Conversation Persistence](#conversation-persistence)
6. [Frontend Implementation](#frontend-implementation)
7. [Admin Monitoring](#admin-monitoring)
8. [Error Handling](#error-handling)
9. [Security Considerations](#security-considerations)

---

## Architecture Overview

### System Components

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              VON AI Website                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────┐     ┌──────────────────┐     ┌──────────────────────┐ │
│  │  ChatWidget.tsx  │────▶│  Edge Function   │────▶│  Lovable AI Gateway  │ │
│  │  (React Client)  │◀────│  /functions/chat │◀────│  (gemini-2.5-flash)  │ │
│  └──────────────────┘     └────────┬─────────┘     └──────────────────────┘ │
│                                    │                                         │
│                                    ▼                                         │
│                           ┌──────────────────┐                              │
│                           │    Supabase DB   │                              │
│                           │  - conversations │                              │
│                           │  - messages      │                              │
│                           │  - rate_limits   │                              │
│                           └──────────────────┘                              │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Data Flow

1. User sends message via `ChatWidget` component
2. Message is POSTed to the `/functions/v1/chat` edge function
3. Edge function performs:
   - IP extraction for rate limiting
   - Rate limit checks (message & conversation)
   - Input validation & sanitization
   - Conversation creation/retrieval
   - Message persistence
4. Request forwarded to Lovable AI Gateway with streaming enabled
5. Response streamed back to client in real-time
6. Assistant response saved to database on stream completion

---

## LLM Configuration

### Provider Details

| Property | Value |
|----------|-------|
| **Gateway** | Lovable AI Gateway |
| **Endpoint** | `https://ai.gateway.lovable.dev/v1/chat/completions` |
| **Model** | `google/gemini-2.5-flash` |
| **API Key** | `LOVABLE_API_KEY` (auto-provisioned secret) |
| **Response Format** | Server-Sent Events (SSE) streaming |

### System Prompt

The AI assistant is configured with a detailed system prompt that defines:

- **Identity**: VON AI assistant for the company website
- **Service Knowledge**: Complete information about AI ROI Sprint, Pilot, and Optimization services
- **Response Style**: Plain text only (no markdown formatting)
- **Behavioral Guidelines**: Concise, friendly, helpful responses
- **Call-to-Action**: Directs users to book calls or use contact form

```typescript
const VONAI_CONTEXT = `You are the VON AI assistant, a helpful chatbot for VON AI's website...

## About VON AI
VON AI helps businesses implement AI with measurable ROI...

## Our Services
### 1. AI ROI Sprint (2 weeks) - Step 1: Plan
### 2. AI ROI Pilot (4-6 weeks) - Step 2: Ship  
### 3. Optimization & Adoption (Monthly) - Step 3: Scale

## What We Don't Do
## Key Differentiators
## Timeline
## What We Need From Clients
## Contact

Keep responses concise, friendly, and helpful. Do NOT use any markdown formatting...`;
```

### Request Structure

```typescript
{
  model: "google/gemini-2.5-flash",
  messages: [
    { role: "system", content: VONAI_CONTEXT },
    ...userMessages  // Sanitized conversation history
  ],
  stream: true
}
```

---

## Rate Limiting & Guardrails

### Configuration Constants

| Limit | Value | Description |
|-------|-------|-------------|
| `RATE_LIMIT_WINDOW_MS` | 60,000 (1 minute) | Window for message rate limiting |
| `MAX_MESSAGES_PER_WINDOW` | 10 | Maximum messages per IP per minute |
| `CONVERSATION_WINDOW_MS` | 3,600,000 (1 hour) | Window for conversation rate limiting |
| `MAX_CONVERSATIONS_PER_HOUR` | 20 | Maximum new conversations per IP per hour |
| `MAX_MESSAGE_LENGTH` | 2,000 | Maximum characters per message |
| `MAX_MESSAGES_IN_CONTEXT` | 50 | Maximum messages in conversation context |
| `ABUSE_THRESHOLD_PER_HOUR` | 5 | Rate limit hits before abuse flagging |

### Rate Limiting Implementation

#### In-Memory Stores
```typescript
// These reset on function cold start (acceptable tradeoff for edge functions)
const messageRates = new Map<string, number[]>();      // IP -> timestamps
const conversationRates = new Map<string, number[]>(); // IP -> timestamps
const rateLimitHits = new Map<string, number[]>();     // IP -> violation timestamps
```

#### IP Extraction
```typescript
function getClientIP(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
         req.headers.get('x-real-ip') || 
         'unknown';
}
```

#### Sliding Window Algorithm
```typescript
function cleanOldEntries(entries: number[], windowMs: number): number[] {
  const now = Date.now();
  return entries.filter(time => now - time < windowMs);
}

function checkMessageRateLimit(clientIP: string): { allowed: boolean; remaining: number } {
  const entries = cleanOldEntries(messageRates.get(clientIP) || [], RATE_LIMIT_WINDOW_MS);
  
  if (entries.length >= MAX_MESSAGES_PER_WINDOW) {
    return { allowed: false, remaining: 0 };
  }
  
  entries.push(Date.now());
  messageRates.set(clientIP, entries);
  return { allowed: true, remaining: MAX_MESSAGES_PER_WINDOW - entries.length };
}
```

### Rate Limit Responses

| Scenario | HTTP Status | Retry-After | Message |
|----------|-------------|-------------|---------|
| Message limit exceeded | 429 | 60 seconds | "Too many messages. Please wait a moment..." |
| Conversation limit exceeded | 429 | 3600 seconds | "Too many conversations created..." |
| AI Gateway rate limit | 429 | - | "Rate limit exceeded. Please try again..." |
| AI Gateway payment required | 402 | - | "Service temporarily unavailable." |

---

## Input Validation & Sanitization

### Message Content Validation

```typescript
function validateMessage(content: string): { valid: boolean; error?: string; sanitized?: string } {
  // Check for existence
  if (!content || typeof content !== 'string') {
    return { valid: false, error: 'Message content is required' };
  }
  
  // Trim whitespace
  const trimmed = content.trim();
  
  // Check for empty after trim
  if (trimmed.length === 0) {
    return { valid: false, error: 'Message cannot be empty' };
  }
  
  // Enforce length limit
  if (trimmed.length > MAX_MESSAGE_LENGTH) {
    return { valid: false, error: `Message exceeds maximum length of ${MAX_MESSAGE_LENGTH} characters` };
  }
  
  return { valid: true, sanitized: trimmed };
}
```

### Messages Array Validation

```typescript
function validateMessages(messages: unknown): ValidationResult {
  // Type check
  if (!Array.isArray(messages)) {
    return { valid: false, error: 'Messages must be an array' };
  }
  
  // Minimum messages
  if (messages.length === 0) {
    return { valid: false, error: 'At least one message is required' };
  }
  
  // Maximum context size
  if (messages.length > MAX_MESSAGES_IN_CONTEXT) {
    return { valid: false, error: `Too many messages in context (max: ${MAX_MESSAGES_IN_CONTEXT})` };
  }
  
  // Validate each message
  for (const msg of messages) {
    // Structure validation
    if (!msg || typeof msg !== 'object') {
      return { valid: false, error: 'Invalid message format' };
    }
    
    // Role validation (whitelist approach)
    if (!role || !['user', 'assistant', 'system'].includes(role)) {
      return { valid: false, error: 'Invalid message role' };
    }
    
    // Content validation
    const contentValidation = validateMessage(content);
    if (!contentValidation.valid) {
      return { valid: false, error: contentValidation.error };
    }
    
    sanitized.push({ role, content: contentValidation.sanitized });
  }
  
  return { valid: true, sanitized };
}
```

---

## Conversation Persistence

### Database Schema

```sql
-- Conversations table
CREATE TABLE public.chat_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Messages table
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL,  -- 'user' | 'assistant'
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Rate limit events table (for monitoring)
CREATE TABLE public.rate_limit_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_ip TEXT NOT NULL,
  event_type TEXT NOT NULL,  -- 'message_limit' | 'conversation_limit'
  endpoint TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
```

### Row Level Security (RLS)

```sql
-- Conversations: Anyone can create (anonymous chat)
CREATE POLICY "Anyone can create conversations" 
  ON public.chat_conversations FOR INSERT 
  WITH CHECK (true);

-- Messages: Anonymous insert via service role only
CREATE POLICY "Service role can insert messages" 
  ON public.chat_messages FOR INSERT 
  WITH CHECK (true);

-- Admin-only read access for monitoring
CREATE POLICY "Admins can view conversations"
  ON public.chat_conversations FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view messages"
  ON public.chat_messages FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));
```

### Persistence Flow

1. **New Conversation**: Created when first message sent (if no `conversationId`)
2. **User Message**: Saved immediately after validation
3. **Assistant Response**: Saved after stream completes (full response collected)
4. **Timestamp Update**: Conversation `updated_at` refreshed after each exchange

---

## Frontend Implementation

### Component: `ChatWidget.tsx`

#### State Management
```typescript
const [isOpen, setIsOpen] = useState(false);
const [messages, setMessages] = useState<Message[]>([]);
const [input, setInput] = useState("");
const [isLoading, setIsLoading] = useState(false);
const [conversationId, setConversationId] = useState<string | null>(null);
```

#### Streaming Implementation
```typescript
async function streamChat({ messages, conversationId, onDelta, onDone, onError }) {
  const resp = await fetch(CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ messages, conversationId }),
  });

  // SSE parsing with line-by-line processing
  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let textBuffer = "";

  while (!streamDone) {
    const { done, value } = await reader.read();
    textBuffer += decoder.decode(value, { stream: true });
    
    // Parse SSE lines, extract delta content
    // Call onDelta for each token
  }
  
  onDone(newConversationId);
}
```

#### Quick Replies
```typescript
const QUICK_REPLIES = [
  "What is the AI ROI Sprint?",
  "How do I get started?",
  "What does it cost?",
  "How long does it take?",
];
```

#### UI Features
- Floating chat button (bottom-right corner)
- Expandable chat window (380x500px)
- User/Assistant message bubbles with avatars
- "Checking knowledge..." loading indicator with bouncing dots
- Enter key to send, disabled state while loading

---

## Admin Monitoring

### Rate Limit Monitoring Dashboard

Located in the Admin page (`/admin`), the "Rate Limit Monitoring" tab displays:

| Column | Description |
|--------|-------------|
| **IP Address** | Client IP that triggered the event |
| **Event Type** | `message_limit` or `conversation_limit` |
| **Endpoint** | The endpoint hit (`/chat`) |
| **Timestamp** | When the event occurred |
| **Status** | Potential abuser badge (3+ violations) |

### Abuse Detection

```typescript
function trackRateLimitHit(clientIP: string): { isAbuse: boolean; hitCount: number } {
  const hits = cleanOldEntries(rateLimitHits.get(clientIP) || [], CONVERSATION_WINDOW_MS);
  hits.push(Date.now());
  
  return {
    isAbuse: hits.length >= ABUSE_THRESHOLD_PER_HOUR,  // 5+ hits
    hitCount: hits.length
  };
}
```

### Console Logging

```typescript
// Rate limit exceeded
console.log(`Rate limit exceeded for IP: ${clientIP} (${hitCount} violations this hour)`);

// Abuse alert (5+ violations)
console.warn(`🚨 ABUSE ALERT: IP ${clientIP} has hit rate limits ${hitCount} times in the last hour`);
```

---

## Error Handling

### Edge Function Error Responses

| Error Type | Status Code | Response |
|------------|-------------|----------|
| Rate limit (messages) | 429 | `{ error: "Too many messages..." }` |
| Rate limit (conversations) | 429 | `{ error: "Too many conversations..." }` |
| Validation error | 400 | `{ error: "[specific validation error]" }` |
| AI Gateway rate limit | 429 | `{ error: "Rate limit exceeded..." }` |
| AI Gateway payment | 402 | `{ error: "Service temporarily unavailable." }` |
| General error | 500 | `{ error: "[error message]" }` |

### Frontend Error Display

```typescript
onError: (error) => {
  setMessages((prev) => [
    ...prev,
    { role: "assistant", content: `Sorry, something went wrong: ${error}` },
  ]);
  setIsLoading(false);
}
```

---

## Security Considerations

### Implemented Protections

| Protection | Implementation |
|------------|----------------|
| **IP-Based Rate Limiting** | Prevents message flooding (10/min, 20 conv/hour) |
| **Input Sanitization** | Trims whitespace, validates content type |
| **Length Limits** | 2,000 chars/message, 50 messages/context |
| **Role Validation** | Whitelist: `user`, `assistant`, `system` only |
| **Service Role DB Access** | Edge function uses service role for writes |
| **API Key Protection** | `LOVABLE_API_KEY` stored as secret, never exposed |
| **No Public Read Access** | Conversations only readable by admins |
| **Abuse Detection** | Flags IPs with 5+ rate limit hits per hour |
| **Audit Logging** | Rate limit events persisted for review |

### Known Limitations

| Limitation | Mitigation |
|------------|------------|
| In-memory rate limits reset on cold start | Acceptable for edge function architecture; DB-backed option available if needed |
| No user authentication | Rate limiting + abuse detection compensate |
| IP-based limiting can affect shared networks | High limits (10/min) reduce false positives |

### Future Enhancements (Optional)

- [ ] Captcha for suspected abuse patterns
- [ ] Content moderation/filtering
- [ ] Persistent rate limiting via Redis/DB
- [ ] Geographic blocking for high-abuse regions
- [ ] Webhook alerts for abuse patterns

---

## Configuration Files

### Edge Function Config (`supabase/config.toml`)

```toml
[functions.chat]
verify_jwt = false  # Allows anonymous access (rate-limited)
```

### Environment Variables

| Variable | Purpose | Source |
|----------|---------|--------|
| `LOVABLE_API_KEY` | Lovable AI Gateway authentication | Auto-provisioned secret |
| `SUPABASE_URL` | Database connection | Auto-configured |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin DB access in edge function | Auto-configured |
| `VITE_SUPABASE_URL` | Client-side API base URL | Auto-configured |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Client-side API auth | Auto-configured |

---

## Summary

The VON AI Assistant is a production-ready chatbot implementation featuring:

- **Streaming AI responses** via Lovable AI Gateway (Gemini 2.5 Flash)
- **Robust rate limiting** to prevent abuse without requiring authentication
- **Comprehensive input validation** to ensure data integrity
- **Full conversation persistence** for admin review
- **Admin monitoring dashboard** for rate limit events and abuse detection
- **Graceful error handling** with user-friendly messages

The system balances accessibility (no login required) with security through multiple layers of protection.

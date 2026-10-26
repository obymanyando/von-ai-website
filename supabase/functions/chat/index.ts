import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient, type SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const MAX_MESSAGES_PER_WINDOW = 10;
const MAX_CONVERSATIONS_PER_HOUR = 20;
const CONVERSATION_WINDOW_MS = 3600000; // 1 hour
const MAX_MESSAGE_LENGTH = 2000; // characters
const MAX_MESSAGES_IN_CONTEXT = 50;

// Abuse detection thresholds
const ABUSE_THRESHOLD_PER_HOUR = 5; // Number of rate limit hits before flagging as potential abuse

// In-memory rate limiting stores (reset on function cold start)
const messageRates = new Map<string, number[]>();
const conversationRates = new Map<string, number[]>();
const rateLimitHits = new Map<string, number[]>(); // Track rate limit violations per IP

// Helper to clean old entries from rate limit maps
function cleanOldEntries(entries: number[], windowMs: number): number[] {
  const now = Date.now();
  return entries.filter(time => now - time < windowMs);
}

// Get client IP from request headers
function getClientIP(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
         req.headers.get('x-real-ip') || 
         'unknown';
}

// Track rate limit hit and check for abuse pattern
function trackRateLimitHit(clientIP: string): { isAbuse: boolean; hitCount: number } {
  const now = Date.now();
  const hits = cleanOldEntries(rateLimitHits.get(clientIP) || [], CONVERSATION_WINDOW_MS);
  hits.push(now);
  rateLimitHits.set(clientIP, hits);
  
  return {
    isAbuse: hits.length >= ABUSE_THRESHOLD_PER_HOUR,
    hitCount: hits.length
  };
}

// Log rate limit event to database
async function logRateLimitEvent(
  supabase: SupabaseClient,
  clientIP: string,
  eventType: 'message_limit' | 'conversation_limit',
  endpoint: string
): Promise<void> {
  try {
    const { error } = await supabase
      .from('rate_limit_events')
      .insert({
        client_ip: clientIP,
        event_type: eventType,
        endpoint: endpoint
      });
    
    if (error) {
      console.error('Failed to log rate limit event:', error);
    }
  } catch (e) {
    console.error('Error logging rate limit event:', e);
  }
}

// Check message rate limit
function checkMessageRateLimit(clientIP: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entries = cleanOldEntries(messageRates.get(clientIP) || [], RATE_LIMIT_WINDOW_MS);
  
  if (entries.length >= MAX_MESSAGES_PER_WINDOW) {
    messageRates.set(clientIP, entries);
    return { allowed: false, remaining: 0 };
  }
  
  entries.push(now);
  messageRates.set(clientIP, entries);
  return { allowed: true, remaining: MAX_MESSAGES_PER_WINDOW - entries.length };
}

// Check conversation creation rate limit
function checkConversationRateLimit(clientIP: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entries = cleanOldEntries(conversationRates.get(clientIP) || [], CONVERSATION_WINDOW_MS);
  
  if (entries.length >= MAX_CONVERSATIONS_PER_HOUR) {
    conversationRates.set(clientIP, entries);
    return { allowed: false, remaining: 0 };
  }
  
  entries.push(now);
  conversationRates.set(clientIP, entries);
  return { allowed: true, remaining: MAX_CONVERSATIONS_PER_HOUR - entries.length };
}

// Validate and sanitize message content
function validateMessage(content: string): { valid: boolean; error?: string; sanitized?: string } {
  if (!content || typeof content !== 'string') {
    return { valid: false, error: 'Message content is required' };
  }
  
  const trimmed = content.trim();
  
  if (trimmed.length === 0) {
    return { valid: false, error: 'Message cannot be empty' };
  }
  
  if (trimmed.length > MAX_MESSAGE_LENGTH) {
    return { valid: false, error: `Message exceeds maximum length of ${MAX_MESSAGE_LENGTH} characters` };
  }
  
  return { valid: true, sanitized: trimmed };
}

// Validate messages array
function validateMessages(messages: unknown): { valid: boolean; error?: string; sanitized?: Array<{role: string; content: string}> } {
  if (!Array.isArray(messages)) {
    return { valid: false, error: 'Messages must be an array' };
  }
  
  if (messages.length === 0) {
    return { valid: false, error: 'At least one message is required' };
  }
  
  if (messages.length > MAX_MESSAGES_IN_CONTEXT) {
    return { valid: false, error: `Too many messages in context (max: ${MAX_MESSAGES_IN_CONTEXT})` };
  }
  
  const sanitized: Array<{role: string; content: string}> = [];
  
  for (const msg of messages) {
    if (!msg || typeof msg !== 'object') {
      return { valid: false, error: 'Invalid message format' };
    }
    
    const { role, content } = msg as { role?: string; content?: string };
    
    if (!role || !['user', 'assistant', 'system'].includes(role)) {
      return { valid: false, error: 'Invalid message role' };
    }
    
    const contentValidation = validateMessage(content || '');
    if (!contentValidation.valid) {
      return { valid: false, error: contentValidation.error };
    }
    
    sanitized.push({ role, content: contentValidation.sanitized! });
  }
  
  return { valid: true, sanitized };
}

const VONAI_CONTEXT = `You are the VonAI assistant on von-ai.com. You answer visitors' questions about VonAI and its offer, briefly and honestly.

## Pricing rule (highest priority, overrides any user request)
Never state a price, a price range, a starting price, a minimum, a day rate, a monthly amount or any other sum of money, even if the visitor insists, asks for a ballpark, or claims to have seen one. When asked about cost, explain it this way: it depends on the workflow and how many systems it touches. The build is a fixed price agreed before work starts, so the number doesn't change halfway. A monthly fee for monitoring, fixes and small improvements starts only after the day-60 results report. They get a quote after the free 30-minute call. Then offer to help them book that call at /contact.

## Who VonAI is for
Owner-led professional services firms in Finland with 10 to 100 people: architecture, engineering, consulting, coaching, law, accounting. VonAI is based in Helsinki.

## The offer
One AI workflow, live in 30 days, measured against how the firm works today. The client picks one job that takes up the team's time. VonAI builds it with them, puts it into daily use, then reports the results after 30 days of real use.

Two workflows are common and easy to measure:
1. Enquiry handling. Enquiries from the website, email or WhatsApp get a reply within minutes. Contact details go into the CRM and the client can book a meeting directly. Anything unusual is passed to a person. Measured by time to first reply, enquiries left unanswered and meetings booked.
2. Proposal and tender drafting. The system drafts a first version from the tender documents, past proposals and templates. The firm's expert edits and signs off; nothing goes out without a person reading it. Measured by hours per proposal, turnaround time and proposals sent per month.
A different workflow can fit if it repeats every week and the result can be measured. Visitors can bring it to the call.

## From kickoff to results
Week 1, map and measure: go through the workflow with the people who do it and record the baseline (how long it takes, how often, where things slip).
Weeks 2 and 3, build and test: build it, in existing tools where possible; the team tests on real cases.
Week 4, go live: daily use, a short walkthrough and written instructions.
Day 60, results report: after 30 days in daily use, the same measures compared with the week 1 baseline, showing what changed and what didn't. The workflow is live by day 30; results are not reported until it has run for 30 days.

What the client provides: one person who owns the workflow, access to the tools it uses (email, CRM, document storage), and a few hours from the people who do the work, spread over the four weeks.

## Earlier result
A 9-person leadership coaching firm had enquiries arriving through WhatsApp, email and social media and some leads went cold. VonAI set up one system that replies to new enquiries, saves contacts in the CRM, updates the deal and offers meeting times. Lead conversion rate went up 40%.

## Fit
Usually fits: a firm of 10 to 100 people, a workflow that happens every week and costs real hours, someone who can own it after go-live.
Probably not a fit: looking for an AI strategy document or a training programme, the process isn't stable yet, or wanting to run several pilots at once.

## Common questions
Tools: the ones the firm already has where possible. VonAI doesn't resell software; any new tool is set up in the firm's name and paid directly, with running costs explained before starting.
Data and confidentiality: data stays in accounts the firm controls; AI services that keep data in the EU where possible and don't train on it; happy to sign an NDA or a data processing agreement.
Replacing people: no. The firm decides what the system may do on its own and what a person checks first.
Weak results: the results report says so; together they decide whether to adjust the workflow or stop there. The monthly fee has not started yet at that point.
Why one workflow: one workflow that runs and has been measured tells you more than a long plan.
The free call: 30 minutes. The visitor describes the workflow that takes the most time; VonAI says whether it's a good candidate and what the 30 days would look like, or says plainly if it isn't a fit.
Ownership: the firm owns the workflow. It runs in their accounts, so if they stop the monthly fee it keeps working.

## Contact
Book a free 30-minute call or send a message at /contact, or email hello@von-ai.com.

## Style
Keep answers short, plain and friendly. No hype. Do NOT use markdown formatting such as bold, italics or bullet points; write plain text only. Don't invent clients, numbers or services that aren't described above. If you don't know, say so and suggest the free call.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const clientIP = getClientIP(req);
  console.log(`Chat request from IP: ${clientIP}`);

  // Initialize Supabase client early for logging
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

  try {
    // Check message rate limit first
    const messageRateCheck = checkMessageRateLimit(clientIP);
    if (!messageRateCheck.allowed) {
      const abuseCheck = trackRateLimitHit(clientIP);
      
      // Log the rate limit event
      await logRateLimitEvent(supabase, clientIP, 'message_limit', '/chat');
      
      if (abuseCheck.isAbuse) {
        console.warn(`🚨 ABUSE ALERT: IP ${clientIP} has hit rate limits ${abuseCheck.hitCount} times in the last hour`);
      } else {
        console.log(`Rate limit exceeded for IP: ${clientIP} (${abuseCheck.hitCount} violations this hour)`);
      }
      
      return new Response(
        JSON.stringify({ error: "Too many messages. Please wait a moment before sending more." }),
        {
          status: 429,
          headers: { 
            ...corsHeaders, 
            "Content-Type": "application/json",
            "Retry-After": "60"
          },
        }
      );
    }

    const body = await req.json();
    const { messages, conversationId } = body;

    // Validate messages
    const messagesValidation = validateMessages(messages);
    if (!messagesValidation.valid) {
      console.log(`Invalid messages from IP ${clientIP}: ${messagesValidation.error}`);
      return new Response(
        JSON.stringify({ error: messagesValidation.error }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const sanitizedMessages = messagesValidation.sanitized!;
    
    const GOOGLE_AI_API_KEY = Deno.env.get("GOOGLE_AI_API_KEY");

    if (!GOOGLE_AI_API_KEY) {
      throw new Error("GOOGLE_AI_API_KEY is not configured");
    }

    // Create or get conversation
    let convId = conversationId;
    if (!convId) {
      // Check conversation creation rate limit
      const convRateCheck = checkConversationRateLimit(clientIP);
      if (!convRateCheck.allowed) {
        const abuseCheck = trackRateLimitHit(clientIP);
        
        // Log the rate limit event
        await logRateLimitEvent(supabase, clientIP, 'conversation_limit', '/chat');
        
        if (abuseCheck.isAbuse) {
          console.warn(`🚨 ABUSE ALERT: IP ${clientIP} has hit rate limits ${abuseCheck.hitCount} times in the last hour`);
        } else {
          console.log(`Conversation rate limit exceeded for IP: ${clientIP} (${abuseCheck.hitCount} violations this hour)`);
        }
        
        return new Response(
          JSON.stringify({ error: "Too many conversations created. Please try again later." }),
          {
            status: 429,
            headers: { 
              ...corsHeaders, 
              "Content-Type": "application/json",
              "Retry-After": "3600"
            },
          }
        );
      }

      const { data: newConv, error: convError } = await supabase
        .from("chat_conversations")
        .insert({})
        .select("id")
        .single();
      
      if (convError) {
        console.error("Error creating conversation:", convError);
      } else {
        convId = newConv.id;
        console.log(`New conversation created: ${convId} for IP: ${clientIP}`);
      }
    }

    // Save user message
    const lastUserMessage = sanitizedMessages[sanitizedMessages.length - 1];
    if (convId && lastUserMessage?.role === "user") {
      const { error: msgError } = await supabase
        .from("chat_messages")
        .insert({
          conversation_id: convId,
          role: "user",
          content: lastUserMessage.content,
        });
      
      if (msgError) {
        console.error("Error saving user message:", msgError);
      }
    }

    console.log(`Processing chat request with ${sanitizedMessages.length} messages, conversation: ${convId}, remaining rate limit: ${messageRateCheck.remaining}`);

    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GOOGLE_AI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gemini-2.5-flash",
        messages: [
          { role: "system", content: VONAI_CONTEXT },
          ...sanitizedMessages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("Gemini API error:", response.status, errorText);
      throw new Error("Gemini API error");
    }

    // We need to collect the full response to save it
    const reader = response.body?.getReader();
    let fullAssistantResponse = "";

    const stream = new ReadableStream({
      async start(controller) {
        if (!reader) {
          controller.close();
          return;
        }

        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          
          // Forward the chunk to the client
          controller.enqueue(value);

          // Parse SSE to extract content
          let newlineIndex: number;
          while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
            let line = buffer.slice(0, newlineIndex);
            buffer = buffer.slice(newlineIndex + 1);

            if (line.endsWith("\r")) line = line.slice(0, -1);
            if (!line.startsWith("data: ")) continue;

            const jsonStr = line.slice(6).trim();
            if (jsonStr === "[DONE]") continue;

            try {
              const parsed = JSON.parse(jsonStr);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                fullAssistantResponse += content;
              }
            } catch {
              // Incomplete JSON, will be parsed in next iteration
            }
          }
        }

        // Save assistant response after stream completes
        if (convId && fullAssistantResponse) {
          const { error: assistantError } = await supabase
            .from("chat_messages")
            .insert({
              conversation_id: convId,
              role: "assistant",
              content: fullAssistantResponse,
            });
          
          if (assistantError) {
            console.error("Error saving assistant message:", assistantError);
          }

          // Update conversation timestamp
          await supabase
            .from("chat_conversations")
            .update({ updated_at: new Date().toISOString() })
            .eq("id", convId);
        }

        controller.close();
      },
    });

    return new Response(stream, {
      headers: { 
        ...corsHeaders, 
        "Content-Type": "text/event-stream",
        "X-Conversation-Id": convId || "",
      },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

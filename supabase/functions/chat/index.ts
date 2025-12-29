import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const VONAI_CONTEXT = `You are the VON AI assistant, a helpful chatbot for VON AI's website. You help visitors understand VON AI's services and answer their questions.

## About VON AI
VON AI helps businesses implement AI with measurable ROI. We focus on practical, workflow-integrated AI solutions—not vague strategy or massive platform builds.

## Our Services

### 1. AI ROI Sprint (2 weeks) - Step 1: Plan
The starting point for every engagement. You leave with:
- Workflow Reality Map: Shows where time, money, and quality leak
- Opportunity Matrix: Impact vs Effort ranking for fastest wins
- ROI Model: Cost saved + revenue uplift, clearly quantified
- 90-day Execution Plan: Owners, steps, and metrics
- Pilot #1 Specification: Build-ready spec for first AI implementation

Good fit if:
- You want measurable outcomes in 90 days
- You can give access to 3-5 interviewees
- You're ready to change a workflow, not just buy a tool

Not a fit if:
- You want "AI strategy" without implementation
- You want a huge platform build as step one

### 2. AI ROI Pilot (4-6 weeks) - Step 2: Ship
We build and ship Pilot #1 into production with:
- Proper scope and guardrails
- Escalation paths
- Monitoring and measurement

### 3. Optimization & Adoption (Monthly) - Step 3: Scale
Ongoing support including:
- Tuning and updates
- ROI reporting
- Team enablement

## What We Don't Do
- No vague strategy without execution
- No massive platforms as step one
- No tool forcing (we're tool-agnostic)

## Key Differentiators
- Workflow-first approach (not tool-first)
- Focus on measurable ROI from day one
- Human-in-the-loop by default for high-trust work
- Start workflow-first, identify minimum viable data needed
- ROI measured in two layers: (1) Time saved → cost savings, (2) Revenue uplift

## Timeline
- Clarity in 2 weeks (Sprint)
- First production pilot in 4-6 weeks after Sprint
- Measurement starts from day one

## What We Need From Clients
- One point of contact
- Access to 3-5 interviewees (leadership + users)
- Agreement on 1-2 business outcomes to target

## Contact
Visitors can book a call or use the contact form at /contact. The ROI Calculator at /roi-calculator helps estimate potential savings.

Keep responses concise, friendly, and helpful. If visitors want to proceed, direct them to book a call or use the contact form.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, conversationId } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Create or get conversation
    let convId = conversationId;
    if (!convId) {
      const { data: newConv, error: convError } = await supabase
        .from("chat_conversations")
        .insert({})
        .select("id")
        .single();
      
      if (convError) {
        console.error("Error creating conversation:", convError);
      } else {
        convId = newConv.id;
      }
    }

    // Save user message
    const lastUserMessage = messages[messages.length - 1];
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

    console.log("Processing chat request with", messages.length, "messages, conversation:", convId);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: VONAI_CONTEXT },
          ...messages,
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
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    // We need to collect the full response to save it
    const reader = response.body?.getReader();
    const encoder = new TextEncoder();
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

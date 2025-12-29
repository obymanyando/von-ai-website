import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Processing chat request with", messages.length, "messages");

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

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
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

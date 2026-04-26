import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  name: string;
  email: string;
  company?: string;
  message: string;
  consent?: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, company, message, consent }: ContactEmailRequest = await req.json();

    if (consent !== true) {
      return new Response(
        JSON.stringify({ error: "Consent to the privacy policy is required." }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("Processing contact submission from:", name, email);

    // Save to database
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    const { error: dbError } = await supabase
      .from("contact_submissions")
      .insert({
        name,
        email,
        company,
        message,
        consent_given: true,
        consent_at: new Date().toISOString(),
      });

    if (dbError) {
      console.error("Database error:", dbError);
    } else {
      console.log("Submission saved to database");
    }

    // Send notification email to VonAI
    const notificationRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "VON AI Contact <hello@comms.von-ai.com>",
        to: ["hello@von-ai.com"],
        subject: `New Contact Form Submission from ${name}`,
        html: `
          <h1>New Contact Form Submission</h1>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${company ? `<p><strong>Company:</strong> ${company}</p>` : ""}
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, "<br>")}</p>
        `,
        reply_to: email,
      }),
    });

    if (!notificationRes.ok) {
      const error = await notificationRes.text();
      console.error("Resend API error (notification):", error);
      throw new Error(`Failed to send notification email: ${error}`);
    }

    console.log("Notification email sent successfully");

    // Send confirmation email to the user
    const confirmationRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "VON AI <hello@comms.von-ai.com>",
        to: [email],
        subject: "We received your message - VON AI",
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #1a1a1a; font-size: 24px; margin-bottom: 20px;">Thank you for reaching out, ${name}!</h1>
            <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6;">
              We've received your message and will get back to you within 24 hours.
            </p>
            <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6;">
              In the meantime, feel free to book a call directly on our <a href="https://von-ai.com/contact" style="color: #2563eb;">contact page</a>.
            </p>
            <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 30px 0;" />
            <p style="color: #888; font-size: 14px;">
              Best regards,<br/>
              The VON AI Team
            </p>
          </div>
        `,
      }),
    });

    if (!confirmationRes.ok) {
      const error = await confirmationRes.text();
      console.error("Resend API error (confirmation):", error);
      // Don't throw here - notification was sent, just log the error
    } else {
      console.log("Confirmation email sent successfully");
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);

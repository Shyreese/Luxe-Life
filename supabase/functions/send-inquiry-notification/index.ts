import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

serve(async (req) => {
  // Handle CORS preflight requests if called from your frontend
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  try {
    const payload = await req.json();
    // When triggered by a Supabase Database Webhook, the inserted row lives under 'record'
    const inquiry = payload.record;

    if (!inquiry) {
      throw new Error("No inquiry record found in the webhook payload.");
    }

    // Call Resend's API to email your team
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "auth@mail.luxelp.com", // <-- Replace with your exact verified subdomain address
        to: "info@luxelp.com",     // <-- Replace with where you want to receive notifications
        subject: `New Property Inquiry from ${inquiry.full_name || "Guest"}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
            <h2 style="color: #111; border-bottom: 2px solid #f4f4f4; padding-bottom: 10px;">New Inquiry Received</h2>
            <p style="font-size: 16px; color: #333;">You have received a new submission from your website inquiry form:</p>
            
            <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
              <tr>
                <td style="padding: 8px; font-weight: bold; color: #555; width: 30%;">Full Name:</td>
                <td style="padding: 8px; color: #222;">${inquiry.full_name || "N/A"}</td>
              </tr>
              <tr style="background-color: #f9f9f9;">
                <td style="padding: 8px; font-weight: bold; color: #555;">Email:</td>
                <td style="padding: 8px; color: #222;">${inquiry.email || "N/A"}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; color: #555;">Phone:</td>
                <td style="padding: 8px; color: #222;">${inquiry.phone || "N/A"}</td>
              </tr>
              <tr style="background-color: #f9f9f9;">
                <td style="padding: 8px; font-weight: bold; color: #555;">Move-in Date:</td>
                <td style="padding: 8px; color: #222;">${inquiry.move_in || "N/A"}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; color: #555;">Length:</td>
                <td style="padding: 8px; color: #222;">${inquiry.length || "N/A"}</td>
              </tr>
              <tr style="background-color: #f9f9f9;">
                <td style="padding: 8px; font-weight: bold; color: #555;">Message:</td>
                <td style="padding: 8px; color: #222;">${inquiry.message || "N/A"}</td>
              </tr>
            </table>

            <p style="font-size: 12px; color: #888; margin-top: 30px; text-align: center;">
              This notification was automatically sent by your Supabase Edge Function & Resend integration.
            </p>
          </div>
        `,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(`Resend API Error: ${JSON.stringify(data)}`);
    }

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
});
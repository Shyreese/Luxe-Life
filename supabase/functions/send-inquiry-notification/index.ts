import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

type JsonRecord = Record<string, unknown>;

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const INQUIRY_WEBHOOK_SECRET = Deno.env.get("INQUIRY_WEBHOOK_SECRET");

function jsonResponse(body: JsonRecord, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function escapeHtml(value: unknown) {
  const text = value === null || value === undefined || value === "" ? "N/A" : String(value);
  return text.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}

serve(async (req) => {
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed." }, 405);
  }
  if (!INQUIRY_WEBHOOK_SECRET) {
    console.error("INQUIRY_WEBHOOK_SECRET is not configured.");
    return jsonResponse({ error: "Inquiry webhook is not configured." }, 500);
  }
  if (req.headers.get("x-webhook-secret") !== INQUIRY_WEBHOOK_SECRET) {
    return jsonResponse({ error: "Unauthorized." }, 401);
  }
  if (!RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not configured.");
    return jsonResponse({ error: "Inquiry email is not configured." }, 500);
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return jsonResponse({ error: "Invalid webhook JSON." }, 400);
  }

  if (
    !isRecord(payload) ||
    payload.type !== "INSERT" ||
    payload.schema !== "public" ||
    payload.table !== "inquiries" ||
    !isRecord(payload.record)
  ) {
    return jsonResponse({ error: "Expected an inquiry insert webhook payload." }, 400);
  }

  const inquiry = payload.record;
  const submitter = String(inquiry.full_name || "Guest").replace(/[\r\n]/g, " ").slice(0, 120);
  const rows: [string, unknown][] = [
    ["Booking for", inquiry.booking_for],
    ["Contact name", inquiry.full_name],
    ["Contact email", inquiry.email],
    ["Contact phone", inquiry.phone],
    ["Preferred move-in", inquiry.move_in],
    ["Length of stay", inquiry.length],
    ["Guest name", inquiry.guest_name],
    ["Guest email", inquiry.guest_email],
    ["Guest phone", inquiry.guest_phone],
    ["Company or organization", inquiry.guest_org],
    ["Message", inquiry.message],
  ];
  const htmlRows = rows.map(([label, value], index) => `
    <tr style="background-color:${index % 2 ? "#f9f9f9" : "#ffffff"}">
      <td style="padding:8px;font-weight:bold;color:#555;width:30%;vertical-align:top">${escapeHtml(label)}</td>
      <td style="padding:8px;color:#222;white-space:pre-wrap">${escapeHtml(value)}</td>
    </tr>
  `).join("");

  let response: Response;
  try {
    response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "auth@mail.luxelp.com",
        to: "info@luxelp.com",
        subject: `New Property Inquiry from ${submitter}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #eaeaea;border-radius:8px">
            <h2 style="color:#111;border-bottom:2px solid #f4f4f4;padding-bottom:10px">New Inquiry Received</h2>
            <p style="font-size:16px;color:#333">A new inquiry was submitted through the website.</p>
            <table style="width:100%;border-collapse:collapse;margin-top:15px">${htmlRows}</table>
          </div>
        `,
      }),
    });
  } catch (error) {
    console.error("Could not reach the email provider.", error);
    return jsonResponse({ error: "Could not reach the email provider." }, 502);
  }

  if (!response.ok) {
    const providerMessage = await response.text();
    console.error("The email provider rejected the inquiry notification.", providerMessage);
    return jsonResponse({ error: "The email provider rejected the notification." }, 502);
  }

  return jsonResponse({ success: true }, 200);
});

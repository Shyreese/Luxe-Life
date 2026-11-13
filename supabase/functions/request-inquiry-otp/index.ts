import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function jsonResponse(body: Record<string, string>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (request: Request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed." }, 405);
  }

  let email: string;
  try {
    const body: unknown = await request.json();
    if (
      typeof body !== "object" ||
      body === null ||
      !("email" in body) ||
      typeof body.email !== "string"
    ) {
      return jsonResponse({ error: "Enter a valid email address." }, 400);
    }
    email = body.email.trim().toLowerCase();
  } catch {
    return jsonResponse({ error: "Enter a valid email address." }, 400);
  }

  if (
    email.length > 320 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    return jsonResponse({ error: "Enter a valid email address." }, 400);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    console.error("Missing Supabase function environment configuration.");
    return jsonResponse({ error: "Sign-in is temporarily unavailable. Please try again." }, 500);
  }

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const auth = createClient(supabaseUrl, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  try {
    const escapedEmail = email.replace(/[\\%_]/g, "\\$&");
    const { data: inquiry, error: inquiryError } = await admin
      .from("inquiries")
      .select("id")
      .ilike("email", escapedEmail)
      .limit(1)
      .maybeSingle();

    if (inquiryError) throw inquiryError;

    if (!inquiry) {
      console.info("OTP request did not match an inquiry.");
      return jsonResponse({
        message: "If the email matches an inquiry, a sign-in code will be sent.",
      });
    }

    const { error: createError } = await admin.auth.admin.createUser({
      email,
      email_confirm: false,
    });

    if (createError && createError.code !== "email_exists") {
      throw createError;
    }

    const { error: otpError } = await auth.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false },
    });
    if (otpError) throw otpError;

    console.info("OTP request accepted for a matching inquiry.");
    return jsonResponse({
      message: "If the email matches an inquiry, a sign-in code will be sent.",
    });
  } catch (error) {
    console.error("Unable to request inquiry sign-in OTP:", error);
    return jsonResponse({ error: "Sign-in is temporarily unavailable. Please try again." }, 500);
  }
});

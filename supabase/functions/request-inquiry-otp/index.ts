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
  let adminLogin = false;
  try {
    const body: unknown = await request.json();
    if (
      typeof body !== "object" ||
      body === null ||
      !("email" in body) ||
      typeof body.email !== "string" ||
      ("admin_login" in body && typeof body.admin_login !== "boolean")
    ) {
      return jsonResponse({ error: "Enter a valid email address." }, 400);
    }
    email = body.email.trim().toLowerCase();
    adminLogin = "admin_login" in body && body.admin_login === true;
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
    const { data: residentAdmin, error: residentAdminError } = await admin
      .from("resident_admins")
      .select("email")
      .eq("email", email)
      .maybeSingle();
    if (residentAdminError) throw residentAdminError;

    if (adminLogin) {
      if (!residentAdmin) {
        console.info("Admin OTP request did not match an administrator.");
        return jsonResponse({ error: "Unable to send an administrator sign-in code." }, 403);
      }
    } else {
      const escapedEmail = email.replace(/[\\%_]/g, "\\$&");
      const [
        { data: resident, error: residentError },
        { data: inquiry, error: inquiryError },
      ] = await Promise.all([
        admin
          .from("residents")
          .select("id")
          .eq("email", email)
          .limit(1)
          .maybeSingle(),
        admin
          .from("inquiries")
          .select("id")
          .ilike("email", escapedEmail)
          .limit(1)
          .maybeSingle(),
      ]);

      if (residentError) throw residentError;
      if (inquiryError) throw inquiryError;

      if (!resident && !inquiry) {
        console.info("OTP request did not match an inquiry or resident.");
        return jsonResponse({
          message: "If the email is authorized, a sign-in code will be sent.",
        });
      }
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

    console.info(
      adminLogin
        ? "OTP request accepted for an administrator."
        : "OTP request accepted for an inquiry or resident.",
    );
    return jsonResponse({
      message: "If the email is authorized, a sign-in code will be sent.",
    });
  } catch (error) {
    console.error("Unable to request inquiry sign-in OTP:", error);
    return jsonResponse({ error: "Sign-in is temporarily unavailable. Please try again." }, 500);
  }
});

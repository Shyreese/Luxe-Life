import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { supabase } from "../utils/supabase";

type Step = "email" | "code";

async function getRequestFailureMessage(error: Error) {
  const context = "context" in error ? error.context : null;
  if (context instanceof Response) {
    if (context.status === 403) {
      return "Administrator access was not recognized.";
    }
    if (context.status >= 500) {
      return `The sign-in service failed`;
    }
    return `The sign-in request failed`;
  }
  return "Could not reach the sign-in service. Check your connection and try again.";
}

export default function AdminSignIn() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const codeRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (step === "code") codeRef.current?.focus();
  }, [step]);

  async function sendCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setNotice("");

    try {
      const { error: requestError } = await supabase.functions.invoke("request-inquiry-otp", {
        body: { email: email.trim().toLowerCase(), admin_login: true },
      });
      if (requestError) {
        setError(await getRequestFailureMessage(requestError));
        return;
      }
      setStep("code");
      setCode("");
      setNotice(`If this email has administrator access, a code was sent to ${email.trim()}.`);
    } catch {
      setError("We could not send a sign-in code. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function verifyCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!/^\d{6}$/.test(code)) {
      setError("Enter the six digit code from your email.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token: code,
        type: "email",
      });
      if (verifyError) {
        setError("That code is invalid or expired. Request a new one and try again.");
        setCode("");
        return;
      }
      navigate("/admin", { replace: true });
    } catch {
      setError("We could not verify your code. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function resendCode() {
    setLoading(true);
    setError("");
    setNotice("");
    try {
      const { error: requestError } = await supabase.functions.invoke("request-inquiry-otp", {
        body: { email: email.trim().toLowerCase(), admin_login: true },
      });
      if (requestError) {
        setError(await getRequestFailureMessage(requestError));
        return;
      }
      setCode("");
      setNotice(`If this email has administrator access, a new code was sent to ${email.trim()}.`);
      codeRef.current?.focus();
    } catch {
      setError("We could not resend a code. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-5 py-12">
      <section className="w-full max-w-md rounded-2xl bg-white p-6 shadow-sm md:p-9">
        <p className="text-sm font-semibold text-terracotta">LuxeLife Properties</p>
        <h1 className="mt-2 text-3xl font-bold text-ink">Administrator sign in</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-body">
          {step === "email"
            ? "Enter the email address that has been granted administrator access."
            : "Enter the six digit code sent to your administrator email."}
        </p>

        {error && <p role="alert" className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>}
        {notice && <p role="status" className="mt-5 rounded-lg bg-sage/30 p-3 text-sm text-ink">{notice}</p>}

        {step === "email" ? (
          <form onSubmit={sendCode} className="mt-6 space-y-4">
            <label htmlFor="admin-email" className="block text-sm font-medium text-ink">
              Administrator email
              <input
                id="admin-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-1 min-h-12 w-full rounded-xl border border-tan px-4 py-3 text-[15px] text-ink focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="min-h-12 w-full rounded-full bg-terracotta px-5 py-3 font-semibold text-white hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Sending code..." : "Send sign-in code"}
            </button>
          </form>
        ) : (
          <form onSubmit={verifyCode} className="mt-6 space-y-4">
            <label htmlFor="admin-code" className="block text-sm font-medium text-ink">
              Six digit code
              <input
                ref={codeRef}
                id="admin-code"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]{6}"
                maxLength={6}
                required
                value={code}
                onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
                className="mt-1 min-h-12 w-full rounded-xl border border-tan px-4 py-3 text-[15px] tracking-[0.3em] text-ink focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="min-h-12 w-full rounded-full bg-terracotta px-5 py-3 font-semibold text-white hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Verifying..." : "Sign in"}
            </button>
            <div className="flex flex-wrap justify-between gap-3 text-sm">
              <button type="button" disabled={loading} onClick={() => void resendCode()} className="min-h-11 text-ink underline underline-offset-4">
                Resend code
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => {
                  setStep("email");
                  setCode("");
                  setError("");
                  setNotice("");
                }}
                className="min-h-11 text-ink underline underline-offset-4"
              >
                Use another email
              </button>
            </div>
          </form>
        )}

        <p className="mt-7 border-t border-tan pt-5 text-sm text-body">
          Resident? <Link to="/sign-in" className="font-semibold text-ink underline underline-offset-4">Use resident sign in</Link>
        </p>
      </section>
    </main>
  );
}

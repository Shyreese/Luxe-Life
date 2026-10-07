import { useEffect, useRef, useState } from "react";
import TopNav from "../components/TopNav";
import { useNavigate } from "react-router";
import Footer from "../components/Footer";
import { PHONE, SIGN_IN_RULES } from "../data/mockData";

type Step = "email" | "code" | "success";
type EmailError = "required" | "invalid" | "not_found" | null;
type CodeError = "wrong" | "expired" | null;

function Spinner() {
  return (
    <svg
      className="h-5 w-5 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}

export default function SignIn() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<EmailError>(null);
  const [emailLoading, setEmailLoading] = useState(false);

  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [codeError, setCodeError] = useState<CodeError>(null);
  const [codeLoading, setCodeLoading] = useState(false);

  const navigate = useNavigate();
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  // Focus first code box when step changes to code
  useEffect(() => {
    if (step === "code") {
      inputRefs.current[0]?.focus();
    }
  }, [step]);

  function validateEmail(val: string): EmailError {
    if (!val.trim()) return "required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())) return "invalid";
    return null;
  }

  function handleSendCode(e: React.FormEvent) {
    e.preventDefault();
    const err = validateEmail(email);
    if (err) {
      setEmailError(err);
      return;
    }
    setEmailError(null);
    setEmailLoading(true);
    // Demo rule: see SIGN_IN_RULES in src/data/mockData.ts
    setTimeout(() => {
      setEmailLoading(false);
      if (!email.toLowerCase().includes(SIGN_IN_RULES.knownEmailContains)) {
        setEmailError("not_found");
      } else {
        setStep("code");
        setDigits(["", "", "", "", "", ""]);
        setCodeError(null);
      }
    }, 900);
  }

  function handleDigitChange(index: number, value: string) {
    // Support paste of 6 digits into any box
    if (value.length > 1) {
      const cleaned = value.replace(/\D/g, "").slice(0, 6);
      if (cleaned.length > 0) {
        const next = ["", "", "", "", "", ""];
        for (let i = 0; i < 6; i++) {
          next[i] = cleaned[i] ?? "";
        }
        setDigits(next);
        setCodeError(null);
        const focusIndex = Math.min(cleaned.length, 5);
        inputRefs.current[focusIndex]?.focus();
      }
      return;
    }
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);
    setCodeError(null);
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleDigitKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    const code = digits.join("");
    if (code.length < 6) return;
    setCodeLoading(true);
    setTimeout(() => {
      setCodeLoading(false);
      if (code === SIGN_IN_RULES.validCode) {
        setStep("success");
        const dest = email.trim().toLowerCase() === SIGN_IN_RULES.newResidentEmail ? "/confirmed" : "/resident-hub";
        setTimeout(() => {
          navigate(dest);
        }, 800);
      } else if (code === SIGN_IN_RULES.expiredCode) {
        setCodeError("expired");
      } else {
        setCodeError("wrong");
        setDigits(["", "", "", "", "", ""]);
        setTimeout(() => inputRefs.current[0]?.focus(), 0);
      }
    }, 900);
  }

  function handleResend() {
    setDigits(["", "", "", "", "", ""]);
    setCodeError(null);
    setTimeout(() => inputRefs.current[0]?.focus(), 0);
  }

  function handleUseDifferentEmail() {
    setStep("email");
    setEmail("");
    setEmailError(null);
    setDigits(["", "", "", "", "", ""]);
    setCodeError(null);
  }

  const codeComplete = digits.every((d) => d !== "");

  const inputBase =
    "w-full rounded-xl border bg-white px-4 py-3 text-[15px] text-ink placeholder:text-muted focus:ring-2 focus:ring-navy/30 transition-colors";
  const inputNormal = `${inputBase} border-tan focus:border-navy`;
  const inputError = `${inputBase} border-red-400 focus:border-red-500 focus:ring-red-200`;

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <title>Sign in to your resident portal | LuxeLife Properties</title>
      <meta
        name="description"
        content="Sign in to your LuxeLife resident portal to access your lease agreement, move in details, and Resident Hub."
      />
      <meta name="robots" content="noindex, nofollow" />

      <TopNav active="Sign in" />

      <main id="main" tabIndex={-1} className="flex-1 px-4 py-12 md:py-20">
        <div className="mx-auto w-full max-w-[440px]">

          {/* ── Step 1: Email ──────────────────────────────────────── */}
          {step === "email" && (
            <div className="rounded-2xl bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] md:p-8">
              <h1 className="text-[1.625rem] font-bold leading-tight tracking-tight text-ink md:text-[1.875rem]">
                Sign in to your resident portal
              </h1>
              <p className="mt-3 text-[15px] leading-relaxed text-body">
                Enter the email you used on your inquiry. We will send you a 6 digit code.
              </p>

              <form onSubmit={handleSendCode} className="mt-7" noValidate>
                <div>
                  <label
                    htmlFor="si-email"
                    className="mb-1.5 block text-[13px] font-medium text-ink"
                  >
                    Email
                  </label>
                  <input
                    id="si-email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError(null);
                    }}
                    aria-describedby={emailError ? "si-email-error" : undefined}
                    aria-invalid={emailError && emailError !== "not_found" ? true : undefined}
                    className={
                      emailError && emailError !== "not_found" ? inputError : inputNormal
                    }
                  />

                  {emailError === "required" && (
                    <p id="si-email-error" role="alert" className="mt-2 text-[13px] text-red-600">
                      Please enter your email.
                    </p>
                  )}
                  {emailError === "invalid" && (
                    <p id="si-email-error" role="alert" className="mt-2 text-[13px] text-red-600">
                      Please enter a valid email.
                    </p>
                  )}
                  {emailError === "not_found" && (
                    <div id="si-email-error" role="alert" className="mt-3 rounded-xl border border-tan bg-cream p-4">
                      <p className="text-[14px] text-ink">
                        We could not find a resident with this email.
                      </p>
                      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                        <a
                          href="/inquiry"
                          className="flex min-h-[44px] items-center justify-center rounded-full bg-sage px-5 py-2.5 text-[14px] font-semibold text-ink transition-opacity hover:opacity-90"
                        >
                          Send an inquiry
                        </a>
                        <a
                          href={PHONE.tel}
                          className="flex min-h-[44px] items-center justify-center rounded-full border border-tan bg-white px-5 py-2.5 text-[14px] font-semibold text-ink transition-colors hover:bg-cream"
                        >
                          Contact your host
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={emailLoading}
                  className="mt-5 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-sage px-8 py-3 text-[15px] font-semibold text-ink transition-opacity hover:opacity-90 disabled:opacity-60"
                >
                  {emailLoading && <Spinner />}
                  {emailLoading ? "Sending code" : "Send my code"}
                </button>
              </form>

              <p className="mt-4 flex items-center justify-center gap-1.5 text-[12px] text-muted-strong">
                <svg viewBox="0 0 14 14" className="h-3.5 w-3.5 shrink-0" fill="none" aria-hidden="true">
                  <rect x="2" y="6" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
                  <path d="M4.5 6V4a2.5 2.5 0 015 0v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
                Your lease and details are private to you.
              </p>

              <p className="mt-4 text-center text-[13px] text-muted-strong">
                Not a resident yet?{" "}
                <a href="/#homes" className="font-medium text-ink underline underline-offset-2 hover:opacity-80">
                  See available homes
                </a>
              </p>
            </div>
          )}

          {/* ── Step 2: Code ───────────────────────────────────────── */}
          {step === "code" && (
            <div className="rounded-2xl bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] md:p-8">
              <h1 className="text-[1.625rem] font-bold leading-tight tracking-tight text-ink md:text-[1.875rem]">
                Check your email
              </h1>
              <p className="mt-3 text-[15px] leading-relaxed text-body">
                We sent a code to{" "}
                <span className="font-medium text-ink">{email}</span>. It expires in 10 minutes.
              </p>

              <form onSubmit={handleSignIn} className="mt-7" noValidate>
                {/* Six digit boxes */}
                <div>
                  <label htmlFor="si-code-1" className="mb-3 block text-[13px] font-medium text-ink">
                    Your 6 digit code
                  </label>
                  <div
                    className="flex gap-2"
                    role="group"
                    aria-label="6 digit verification code"
                  >
                    {digits.map((d, i) => (
                      <input
                        key={i}
                        id={`si-code-${i + 1}`}
                        ref={(el) => { inputRefs.current[i] = el; }}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={6}
                        value={d}
                        aria-label={`Digit ${i + 1}`}
                        onChange={(e) => handleDigitChange(i, e.target.value)}
                        onKeyDown={(e) => handleDigitKeyDown(i, e)}
                        onFocus={(e) => e.target.select()}
                        className={`h-12 w-full rounded-xl border text-center text-[20px] font-semibold text-ink focus:ring-2 transition-colors ${
                          codeError
                            ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-200"
                            : d
                            ? "border-navy bg-white focus:border-navy focus:ring-navy/30"
                            : "border-tan bg-white focus:border-navy focus:ring-navy/30"
                        }`}
                        autoComplete="one-time-code"
                      />
                    ))}
                  </div>

                  {codeError === "wrong" && (
                    <p role="alert" className="mt-2 text-[13px] text-red-600">
                      That code did not match. Try again.
                    </p>
                  )}
                  {codeError === "expired" && (
                    <p role="alert" className="mt-2 text-[13px] text-red-600">
                      This code expired. Tap Resend code.
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={codeLoading || !codeComplete}
                  className="mt-5 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-sage px-8 py-3 text-[15px] font-semibold text-ink transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {codeLoading && <Spinner />}
                  {codeLoading ? "Signing you in" : "Sign in"}
                </button>
              </form>

              <div className="mt-5 flex flex-col items-center gap-3 text-[13px] text-muted-strong sm:flex-row sm:justify-center">
                <button
                  type="button"
                  onClick={handleResend}
                  className="min-h-[44px] font-medium text-ink underline underline-offset-2 hover:opacity-80"
                >
                  Resend code
                </button>
                <button
                  type="button"
                  onClick={handleUseDifferentEmail}
                  className="min-h-[44px] font-medium text-ink underline underline-offset-2 hover:opacity-80"
                >
                  Use a different email
                </button>
              </div>
            </div>
          )}

          {/* ── Success ────────────────────────────────────────────── */}
          {step === "success" && (
            <div className="rounded-2xl bg-white p-6 text-center shadow-[0_1px_3px_rgba(0,0,0,0.06)] md:p-8">
              <svg
                viewBox="0 0 48 48"
                className="mx-auto h-12 w-12"
                fill="none"
                aria-hidden="true"
              >
                <circle cx="24" cy="24" r="22" stroke="#94B3AA" strokeWidth="2.5" />
                <path
                  d="M15 24l6 6 12-12"
                  stroke="#94B3AA"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <h1 className="mt-4 text-[1.5rem] font-bold text-ink">
                Signing you in
              </h1>
              <p className="mt-2 text-[15px] text-body">Taking you to your Resident Hub now.</p>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}

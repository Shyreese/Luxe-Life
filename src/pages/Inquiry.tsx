import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { formatIsoDate, PRICING, PRICING_NOTES } from "../data/mockData";
import { CheckBullet } from "../components/icons";
import TopNav from "../components/TopNav";
import Footer from "../components/Footer";
import inquiryHero from "../assets/inquiry-hero.webp";
import AccentBar from "../components/AccentBar";
import { supabase } from "../utils/supabase"; 

/* ---------- small shared bits ---------- */

function ChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
      <path
        d="M15 6l-6 6 6 6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}


// Shared input styling across the form. White field on the tan section.
const inputCls =
  "w-full rounded-xl border border-transparent bg-white px-4 py-3 text-[15px] text-ink placeholder:text-[#737373] focus:border-navy focus:ring-1 focus:ring-navy";

function Radio({
  selected,
  label,
  onSelect,
}: {
  selected: boolean;
  label: string;
  onSelect: () => void;
}) {
  return (
    <label
      className={`flex w-full cursor-pointer items-center gap-3 rounded-xl bg-white px-5 py-3.5 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink ${
        selected ? "border-2 border-ink" : "border-2 border-transparent"
      }`}
    >
      <input
        type="radio"
        name="bookingFor"
        className="sr-only"
        checked={selected}
        onChange={onSelect}
      />
      <span
        className={`flex h-5 w-5 flex-none items-center justify-center rounded-full border ${
          selected ? "border-ink" : "border-[#A1A1A1]"
        }`}
      >
        {selected && <span className="h-2.5 w-2.5 rounded-full bg-ink" />}
      </span>
      <span className="text-[15px] text-ink">{label}</span>
    </label>
  );
}

function FieldLabel({
  htmlFor,
  children,
  required,
  optional,
}: {
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
  optional?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-[14px] font-medium text-[#404040]">
      {children}
      {required && <span className="text-terracotta-dark"> *</span>}
      {optional && <span className="font-normal text-muted-tan"> (optional)</span>}
    </label>
  );
}

const LENGTH_OPTIONS = [
  "30 to 60 days",
  "60 to 90 days",
  "90 to 180 days",
  "180 days or more",
];

function todayIso() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

function lengthFromDates(moveIn: string, moveOut: string) {
  const days = Math.round((Date.parse(moveOut) - Date.parse(moveIn)) / 86_400_000);
  if (!Number.isFinite(days) || days <= 0) return "";
  if (days <= 60) return LENGTH_OPTIONS[0];
  if (days <= 90) return LENGTH_OPTIONS[1];
  if (days <= 180) return LENGTH_OPTIONS[2];
  return LENGTH_OPTIONS[3];
}

const NEXT_STEPS = [
  "We reply within a day.",
  "Confirmation sent to your email.",
  "No payment is taken at any point in this step.",
];

export default function Inquiry() {
  const [bookingFor, setBookingFor] = useState<"self" | "someone">("self");
  const forSomeone = bookingFor === "someone";
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const today = todayIso();
  const prefillMoveIn = params.get("moveIn") ?? "";
  const prefillMoveOut = params.get("moveOut") ?? "";
  const prefillLength = lengthFromDates(prefillMoveIn, prefillMoveOut);

  return (
    <div className="min-h-full bg-white">
      <title>Send an inquiry | LuxeLife Properties</title>
      <meta name="robots" content="noindex, nofollow" />
      <meta name="description" content="Send an inquiry for The Sacramento Condo, a furnished monthly rental in Sacramento. No payment is required to inquire." />
      <TopNav active="Properties" />
      <main id="main" tabIndex={-1}>

      {/* Hero, under a black 40% overlay that keeps the headline readable. */}
      <section className="relative overflow-hidden">
        <img width={2000} height={799} src={inquiryHero} alt="" aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        <div className="absolute inset-0 bg-black/40" aria-hidden="true" />
        <div className="relative mx-auto max-w-[1280px] px-5 py-14 md:px-10 md:py-20">
          <AccentBar tone="light" />
          <h1 className="max-w-3xl text-[40px] font-bold leading-[1.08] tracking-[-1px] text-white md:text-[56px]">
            Send an inquiry for a furnished monthly stay in Sacramento or Oakland
          </h1>
          <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-white">
            All stays begin with an inquiry. We reply personally, usually within a day.
          </p>
          <a
            href="/sacramento-condo"
            className="mt-5 inline-flex items-center gap-2 text-[15px] text-white transition-colors hover:text-white"
          >
            <ChevronLeft />
            Back to The Sacramento Condo
          </a>

          <hr className="my-8 border-white/30" />

          <ul className="flex flex-col gap-4 md:flex-row md:gap-12">
            {[
              "No payment is required to inquire.",
              "No card and no obligation.",
              "We reply personally, usually within a day.",
            ].map((t) => (
              <li key={t} className="flex items-start gap-3 text-[15px] text-white">
                <CheckBullet className="text-white" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Form section */}
      <section className="bg-tan">
        <form
    onSubmit={async (e) => {
      e.preventDefault();
      const data = new FormData(e.currentTarget);
      
      const payload = {
        booking_for: bookingFor,
        full_name: String(data.get("fullName") ?? ""),
        email: String(data.get("email") ?? "").trim().toLowerCase(),
        phone: String(data.get("phone") ?? ""),
        move_in: String(data.get("moveIn") ?? ""),
        length: String(data.get("length") ?? ""),
        guest_name: forSomeone ? String(data.get("guestName") ?? "") : null,
        guest_email: forSomeone ? String(data.get("guestEmail") ?? "").trim().toLowerCase() : null,
        guest_phone: forSomeone ? String(data.get("guestPhone") ?? "") : null,
        guest_org: forSomeone ? String(data.get("guestOrg") ?? "") : null,
        message: String(data.get("message") ?? ""),
      };

      // Insert data securely into Supabase
      const { error } = await supabase.from("inquiries").insert([payload]);

      if (error) {
        alert("Failed to submit inquiry: " + error.message);
        return;
      }

      // Continue to the confirmation page with the server-generated ID
      navigate("/inquiry-received", {
        state: {
          stayFor: bookingFor === "self" ? "Yourself" : "Someone else",
          moveIn: formatIsoDate(String(data.get("moveIn") ?? "")),
          length: String(data.get("length") ?? ""),
        },
      });
    }}
    className="mx-auto grid max-w-[1280px] gap-x-16 gap-y-10 px-5 py-16 md:grid-cols-[minmax(0,1fr)_380px] md:grid-rows-[auto_auto] md:px-10 md:py-20"
  >
          {/* Left column: details + fields + message */}
          <div className="md:col-start-1 md:row-start-1">
            <AccentBar />
            <h2 className="text-[26px] font-semibold text-ink">Your details</h2>

            <p className="mt-6 text-[14px] font-medium text-[#404040]">Who is this stay for?</p>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <Radio
                selected={!forSomeone}
                label="I am booking for myself"
                onSelect={() => setBookingFor("self")}
              />
              <Radio
                selected={forSomeone}
                label="I am booking for someone else"
                onSelect={() => setBookingFor("someone")}
              />
            </div>

            <div className="mt-7 grid gap-x-6 gap-y-5 sm:grid-cols-2">
              <div>
                <FieldLabel htmlFor="fullName" required>
                  Full name
                </FieldLabel>
                <input id="fullName" name="fullName" type="text" required placeholder="Your name" className={inputCls} />
              </div>
              <div>
                <FieldLabel htmlFor="email" required>
                  Email
                </FieldLabel>
                <input id="email" name="email" type="email" required placeholder="you@example.com" className={inputCls} />
              </div>
            </div>

            <div className="mt-5">
              <FieldLabel htmlFor="phone" optional>
                Phone number
              </FieldLabel>
              <input id="phone" name="phone" type="tel" placeholder="(916) 555 0000" className={inputCls} />
            </div>

            <div className="mt-5 grid gap-x-6 gap-y-5 sm:grid-cols-2">
              <div>
                <FieldLabel htmlFor="moveIn" required>
                  Preferred move in date
                </FieldLabel>
                <input
                  id="moveIn"
                  name="moveIn"
                  type="date"
                  required
                  min={today}
                  defaultValue={prefillMoveIn >= today ? prefillMoveIn : ""}
                  className={`${inputCls} text-[#525252]`}
                />
              </div>
              <div>
                <FieldLabel htmlFor="length" required>
                  Length of stay
                </FieldLabel>
                <select id="length" name="length" required defaultValue={prefillLength} className={`${inputCls} text-[#525252]`}>
                  <option value="" disabled>
                    Select length of stay
                  </option>
                  {LENGTH_OPTIONS.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Guest details card, revealed only when booking for someone else.
                Sits below Length of stay and above Message. */}
            {forSomeone && (
              <div className="mt-6 rounded-2xl bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)] md:p-7">
                <h3 className="text-[18px] font-semibold text-ink">Guest details</h3>
                <p className="mt-1 text-[14px] text-muted">
                  Tell us who will be staying so we can welcome them.
                </p>
                <div className="mt-5 grid gap-x-6 gap-y-5 sm:grid-cols-2">
                  <div>
                    <FieldLabel htmlFor="guestName" required>
                      Guest full name
                    </FieldLabel>
                    <input id="guestName" name="guestName" type="text" required placeholder="Guest name" className={inputCls} />
                  </div>
                  <div>
                    <FieldLabel htmlFor="guestEmail" optional>
                      Guest email
                    </FieldLabel>
                    <input id="guestEmail" name="guestEmail" type="email" placeholder="guest@example.com" className={inputCls} />
                  </div>
                  <div>
                    <FieldLabel htmlFor="guestPhone" optional>
                      Guest phone number
                    </FieldLabel>
                    <input id="guestPhone" name="guestPhone" type="tel" placeholder="(916) 555 0000" className={inputCls} />
                  </div>
                  <div>
                    <FieldLabel htmlFor="guestOrg" optional>
                      Company or organization
                    </FieldLabel>
                    <input id="guestOrg" name="guestOrg" type="text" placeholder="Your organization" className={inputCls} />
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6">
              <FieldLabel htmlFor="message" optional>
                Message
              </FieldLabel>
              <textarea
                id="message"
                name="message"
                rows={5}
                placeholder="Anything we should know, such as arrival time or parking needs."
                className={`${inputCls} resize-none`}
              />
            </div>
          </div>

          {/* Summary card. Right of the form on desktop; below Message and above
              the Send inquiry button on mobile. */}
          <aside className="self-start rounded-2xl bg-white p-7 shadow-[0_1px_2px_rgba(0,0,0,0.04)] md:col-start-2 md:row-start-1 md:p-8">
            <h2 className="text-[20px] font-semibold text-ink">Your request summary</h2>
            <hr className="my-5 border-[#E5E5E5]" />
            <dl className="space-y-3 text-[15px]">
              <div className="flex justify-between gap-4">
                <dt className="text-[#737373]">Property</dt>
                <dd className="text-right font-medium text-ink">The Sacramento Condo</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#737373]">Move in</dt>
                <dd className="text-right text-[#737373]">Not selected yet</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#737373]">Length</dt>
                <dd className="text-right text-[#737373]">Not selected yet</dd>
              </div>
            </dl>

            <hr className="my-5 border-[#E5E5E5]" />
            <p className="text-[24px] font-semibold text-ink">{PRICING.from}</p>
            <div className="mt-1 text-[14px] leading-[22px] text-[#737373]">
              {PRICING_NOTES.map((n) => (
                <p key={n}>{n}</p>
              ))}
            </div>

            <hr className="my-5 border-[#E5E5E5]" />
            <h3 className="text-[15px] font-semibold text-ink">What happens next</h3>
            <ul className="mt-3 space-y-3">
              {NEXT_STEPS.map((t) => (
                <li key={t} className="flex items-start gap-3 text-[15px] text-[#525252]">
                  <CheckBullet />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </aside>

          {/* Send inquiry + fine print */}
          <div className="md:col-start-1 md:row-start-2">
            <button
              type="submit"
              className="flex min-h-[44px] w-full items-center justify-center rounded-full bg-sage px-8 py-3 text-[15px] font-semibold text-ink transition-opacity hover:opacity-90 sm:w-auto"
            >
              Send inquiry
            </button>
            <p className="mt-4 text-[13px] text-muted-tan">
              By submitting you agree to our{" "}
              {/* Page not built yet. Intern to create. */}
              <a href="#" className="underline underline-offset-2 hover:text-ink">
                Terms
              </a>{" "}
              and{" "}
              {/* Page not built yet. Intern to create. */}
              <a href="#" className="underline underline-offset-2 hover:text-ink">
                Privacy policy
              </a>
              .
            </p>
          </div>
        </form>
      </section>

      

      </main>

      <Footer />
    </div>
  );
}

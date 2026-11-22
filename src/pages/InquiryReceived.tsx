import { useLocation } from "react-router";
import { CheckBullet } from "../components/icons";
import TopNav from "../components/TopNav";
import Footer from "../components/Footer";
import { INQUIRY_SUMMARY, PRICING, PRICING_NOTES, MANAGER } from "../data/mockData";
import requestIcon from "../assets/ir-request-icon.png";
import summaryLivingRoom from "../imports/_M0A6154.webp";
import primaryBedroom from "../imports/_M0A6104.webp";



const UNLOCKS = [
  "You can review and sign your lease online.",
  "You receive your door codes and a full property walkthrough.",
  `You can message ${MANAGER.firstName}, your property manager, at any time.`,
];

type SubmittedInquiry = {
  requestId?: string;
  stayFor?: string;
  moveIn?: string;
  length?: string;
  returnToResidentHub?: boolean;
};

export default function InquiryReceived() {
  const submitted = (useLocation().state ?? {}) as SubmittedInquiry;
  const summary = {
    property: INQUIRY_SUMMARY.property,
    stayFor: submitted.stayFor || INQUIRY_SUMMARY.stayFor,
    moveIn: submitted.moveIn || INQUIRY_SUMMARY.moveIn,
    length: submitted.length || INQUIRY_SUMMARY.length,
  };
  return (
    <div className="min-h-full bg-white">
      <title>We received your inquiry | LuxeLife Properties</title>
      <meta name="description" content="Thanks for your inquiry about The Sacramento Condo. Your property manager replies personally, usually within a day." />
      <meta name="robots" content="noindex, nofollow" />
      <TopNav active="Properties" />
      <main id="main" tabIndex={-1}>

      {/* Confirmation section */}
      <section className="bg-tan">
        {/* Scoped grid: stacks in mobile order by default, splits into 60/40
            two columns at the 1440 breakpoint. Uses a real media query so the
            layout does not depend on generated utility classes. */}
        <style>{`
          .ir-grid > * + * { margin-top: 40px; }
          @media (min-width: 1440px) {
            .ir-grid {
              display: grid;
              grid-template-columns: 60fr 40fr;
              gap: 48px;
              align-items: start;
            }
            .ir-grid > * + * { margin-top: 0; }
          }
        `}</style>
        <div className="ir-grid mx-auto max-w-[1280px] px-5 py-16 md:px-10 md:py-20">
          {/* Column 1, 60% width */}
          <div>
            {/* Request illustration */}
            <img width={128} height={128} src={requestIcon} alt="" style={{ width: 64, height: 64, objectFit: "contain", display: "block" }} />

            <p className="mt-8 text-[13px] font-semibold text-muted-tan">
              Request sent
            </p>
            <h1 className="mt-3 max-w-2xl text-[40px] font-bold leading-[1.08] tracking-[-1px] text-ink md:text-[52px]">
              We have received your inquiry for The Sacramento Condo
            </h1>
            {submitted.requestId && (
              <p className="mt-4 text-[15px] text-muted-tan">Request ID {submitted.requestId}</p>
            )}
            <p className="mt-5 max-w-md text-[17px] leading-relaxed text-[#525252]">
              {MANAGER.firstName} typically replies within a day. Your inquiry is pending review, and we will contact you by email.
            </p>

            {/* What happens next card */}
            <div className="mt-10 rounded-2xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]" style={{ padding: "2rem" }}>
              <h2 className="text-[24px] font-semibold text-ink">What happens next</h2>
              <ol className="mt-5 space-y-4">
                {[
                  `${MANAGER.firstName} reviews your request, usually within a day.`,
                  "If approved, you get an email to review and sign your lease.",
                  "After signing, you get an email to sign in to your resident portal.",
                ].map((step, i) => (
                  <li key={step} className="flex items-start gap-3 text-[15px] text-[#525252]">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-tan text-[13px] font-semibold text-ink">
                      {i + 1}
                    </span>
                    <span className="pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
              {submitted.returnToResidentHub ? (
                <p className="mt-6 text-[13px] text-[#737373]">
                  <a href="/resident-hub" className="font-medium text-ink underline underline-offset-2 hover:opacity-80">
                    View this pending inquiry in your Resident Hub
                  </a>
                </p>
              ) : (
                <p className="mt-6 text-[13px] text-[#737373]">
                  Already a resident?{" "}
                  <a href="/sign-in" className="font-medium text-ink underline underline-offset-2 hover:opacity-80">
                    Sign in
                  </a>
                </p>
              )}
            </div>

            {/* What you get once you move in card */}
            <div className="mt-6 rounded-2xl" style={{ backgroundColor: "#F5F5F5", padding: "2rem" }}>
              <h2 className="text-[18px] font-semibold text-ink">What you get once you move in</h2>
              <ul className="mt-5 space-y-4">
                {UNLOCKS.map((t) => (
                  <li key={t} className="flex items-start gap-3 text-[15px] text-[#525252]">
                    <CheckBullet />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Your request summary card */}
          <aside
            className="rounded-2xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
            style={{ padding: "2rem", alignSelf: "start" }}
          >
            <h2 className="text-[20px] font-semibold text-ink">Your request summary</h2>

            {/* Property photo. Belongs to this page only. */}
            <img width={2000} height={1333}
              src={summaryLivingRoom}
              alt="Living room, kitchen, and loft at The Sacramento Condo."
              className="mt-5 aspect-[16/10] w-full rounded-xl object-cover object-[55%_55%]"
            />

            <dl className="mt-6 space-y-3 text-[15px]">
              <div className="flex justify-between gap-4">
                <dt className="text-[#737373]">Property</dt>
                <dd className="text-right font-medium text-ink">{summary.property}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#737373]">Stay for</dt>
                <dd className="text-right font-medium text-ink">{summary.stayFor}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#737373]">Move in</dt>
                <dd className="text-right font-medium text-ink">{summary.moveIn}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#737373]">Length</dt>
                <dd className="text-right font-medium text-ink">{summary.length}</dd>
              </div>
            </dl>

            <hr className="my-5 border-[#E5E5E5]" />
            <p className="text-[24px] font-semibold text-ink">{PRICING.from}</p>
            <div className="mt-1 text-[14px] leading-[22px] text-[#737373]">
              {PRICING_NOTES.map((n) => (
                <p key={n}>{n}</p>
              ))}
            </div>

          </aside>
        </div>
      </section>

      {/* Full bleed bedroom photo band. Belongs to this page only. Heights set
          via a scoped class so they do not depend on generated utilities. */}
      <style>{`
        .ir-band { aspect-ratio: 4 / 3; }
        @media (min-width: 768px) { .ir-band { aspect-ratio: 16 / 9; } }
        @media (min-width: 1440px) { .ir-band { aspect-ratio: auto; height: 360px; } }
      `}</style>
      <img width={2000} height={1333}
        src={primaryBedroom}
        alt="Primary bedroom with green accent wall at The Sacramento Condo."
        loading="lazy"
        className="ir-band w-full object-cover object-[60%_60%]"
      />

      </main>

      <Footer />
    </div>
  );
}

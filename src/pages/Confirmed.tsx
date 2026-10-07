import { CheckIcon } from "../components/icons";
import TopNav from "../components/TopNav";
import Footer from "../components/Footer";
import AccentBar from "../components/AccentBar";
import { CONFIRMED_STAY, MANAGER_MAILTO, PRICING, PRICING_NOTES, MANAGER } from "../data/mockData";
import cfIcon from "../assets/cf-icon.png";
import cfStayPhoto from "../imports/_M0A6154.webp";
import cfBand from "../assets/second-bedroom.webp";

export default function Confirmed() {
  return (
    <div className="min-h-full bg-white">
      <title>Your stay is confirmed | LuxeLife Properties</title>
      <meta name="description" content="Your lease is signed and your move in date is set at The Sacramento Condo. Complete your walkthrough to get ready." />
      <meta name="robots" content="noindex, nofollow" />
      <TopNav signedIn />
      <main id="main" tabIndex={-1}>

      {/* Scoped rules so layout, padding, and heights do not depend on
          generated utility classes. Two column 62/38 grid at the 1440
          breakpoint; single column below it in the built mobile order. */}
      <style>{`
        .cf-grid > * + * { margin-top: 40px; }
        .cf-btn { width: 100%; }
        @media (min-width: 1440px) {
          .cf-grid {
            display: grid;
            grid-template-columns: 62fr 38fr;
            gap: 56px;
            align-items: start;
          }
          .cf-grid > * + * { margin-top: 0; }
          .cf-btn { width: auto; }
        }
      `}</style>

      <section className="bg-tan">
        <div className="cf-grid mx-auto max-w-[1280px] px-5 py-16 md:px-10 md:py-20">
          {/* Left column */}
          <div>
            <AccentBar />

            {/* Shield illustration */}
            <img width={128} height={128} src={cfIcon} alt="" style={{ width: 48, height: 48, objectFit: "contain", display: "block" }} />

            <p className="mt-8 text-[13px] font-semibold text-muted-tan">
              You are confirmed
            </p>
            <h1 className="mt-3 max-w-2xl text-[40px] font-bold leading-[1.1] tracking-[-1px] text-ink md:text-[52px]">
              Welcome home. Your stay at The Sacramento Condo is confirmed.
            </h1>
            <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-[#525252]">
              Your lease is signed and your move in date is set. Complete the walkthrough below to
              get your door codes and everything you need for day one.
            </p>

            {/* Complete your move in walkthrough card, terracotta border */}
            <div
              className="mt-10 rounded-2xl bg-white"
              style={{ padding: "2rem", border: "1px solid #A07262" }}
            >
              <p className="text-[13px] font-semibold text-[#737373]">
                Next step
              </p>
              <h2 className="mt-3 text-[24px] font-semibold text-ink">
                Complete your move in walkthrough
              </h2>
              <p className="mt-3 max-w-md text-[16px] leading-relaxed text-[#737373]">
                These are five quick steps covering access, utilities, rules, and what to expect on
                day one.
              </p>
              <a
                href="/walkthrough"
                className="cf-btn mt-6 inline-flex min-h-[44px] items-center justify-center rounded-full bg-sage px-8 py-3 text-[15px] font-semibold text-ink transition-opacity hover:opacity-90"
              >
                Start walkthrough
              </a>
              <p className="mt-5 text-[14px] text-[#737373]">
                This takes about five minutes and you can pause and go back at any time.
              </p>
            </div>

            <div className="mt-6">
              <a
                href="/resident-hub"
                className="text-[15px] text-[#555555] underline underline-offset-4 hover:text-ink"
              >
                Skip for now and go to your Resident Hub.
              </a>
            </div>
          </div>

          {/* Right column: two stacked cards */}
          <div className="flex flex-col gap-6">
            {/* Your confirmed stay */}
            <aside
              className="rounded-2xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
              style={{ padding: "2rem", alignSelf: "start" }}
            >
              <h2 className="text-[20px] font-semibold text-ink">Your confirmed stay</h2>

              {/* Property photo */}
              <img width={2000} height={1333} src={cfStayPhoto} alt="Living room, kitchen, and loft at The Sacramento Condo." style={{ marginTop: "1.25rem", width: "100%", aspectRatio: "16/10", objectFit: "cover", borderRadius: "0.75rem", display: "block" }} />

              <dl className="mt-6 space-y-3 text-[15px]">
                {CONFIRMED_STAY.map((r) => (
                  <div key={r.label} className="flex justify-between gap-4">
                    <dt className="text-[#737373]">{r.label}</dt>
                    <dd className="text-right font-medium text-ink">{r.value}</dd>
                  </div>
                ))}
                <div className="flex justify-between gap-4">
                  <dt className="text-[#737373]">Lease signed</dt>
                  <dd className="flex items-center gap-2 text-right font-medium text-ink">
                    <CheckIcon className="h-4 w-4 text-ink/40" />
                    Complete
                  </dd>
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

            {/* Your property manager */}
            <aside
              className="rounded-2xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
              style={{ padding: "2rem", alignSelf: "start" }}
            >
              <h2 className="text-[20px] font-semibold text-ink">Your property manager</h2>
              <div className="mt-5 flex items-start gap-4">
                {/* Avatar */}
                <div
                  role="img"
                  aria-label={`${MANAGER.name}, property manager.`}
                  className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-terracotta text-[17px] font-semibold text-white"
                >
                  AF
                </div>
                <div>
                  <p className="text-[16px] font-semibold text-ink">{MANAGER.name}</p>
                  <p className="mt-1 text-[15px] leading-relaxed text-[#525252]">
                    Reach out any time with questions about your stay.
                  </p>
                </div>
              </div>
              <a
                href={MANAGER_MAILTO}
                className="cf-btn mt-6 inline-flex min-h-[44px] items-center justify-center rounded-full bg-sage px-8 py-3 text-[15px] font-semibold text-ink transition-opacity hover:opacity-90"
              >
                Message {MANAGER.firstName}
              </a>
            </aside>
          </div>
        </div>
      </section>

      {/* Full bleed bedroom photo band */}
      <style>{`
        .cf-band { height: 260px; }
        @media (min-width: 768px) { .cf-band { height: 360px; } }
      `}</style>
      <img width={2000} height={1333} src={cfBand} alt="Second bedroom with bed, artwork, and large windows at The Sacramento Condo." className="cf-band w-full object-cover" style={{ display: "block", objectPosition: "55% 55%" }} />

      </main>

      <Footer />
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import TopNav from "../components/TopNav";
import { MANAGER_MAILTO, PRICING, PRICING_NOTES, MANAGER, PROPERTY_ADDRESS, PROPERTY_MANAGER_PHOTO } from "../data/mockData";
import { CheckBullet, CloseIcon, PlusIcon } from "../components/icons";
import Footer from "../components/Footer";
import PropertyGallery from "../components/PropertyGallery";

import roofStrip from "../assets/p-roofstrip.webp";
import stepsStrip from "../assets/p-steps.png";
import entry6079 from "../imports/_M0A6079.webp";
import entryBanner from "../assets/sacramento-entry-banner.webp";
import earlyAccessBg from "../assets/early-access-bg.webp";
import AccentBar from "../components/AccentBar";

/* ---------- small shared icons ---------- */

function Check({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} fill="none" aria-hidden="true">
      <path d="M4 10.5l4 4 8-9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Star({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill={filled ? "var(--color-star)" : "none"} aria-hidden="true">
      <path
        d="M10 1.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L10 15l-5.3 2.6 1-5.8L1.5 7.7l5.9-.9L10 1.5z"
        stroke={filled ? "var(--color-star)" : "#a1a1a1"}
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ---------- content data ---------- */

const ORIGIN = typeof window === "undefined" ? "" : window.location.origin;

const NAV_SECTIONS = [
  { id: "top", label: "Top" },
  { id: "included", label: "Included" },
  { id: "location", label: "Location" },
  { id: "how-it-works", label: "How it works" },
  { id: "your-host", label: "Your host" },
  { id: "reviews", label: "Reviews" },
  { id: "faq", label: "FAQ" },
  { id: "similar", label: "Similar" },
];

// Maps section DOM ids (in page order) to pill ids.
// "hero" is the actual hero section element; "top" is the outer page anchor.
const OBSERVED_SECTIONS = [
  { sectionId: "hero", pillId: "top" },
  { sectionId: "included", pillId: "included" },
  { sectionId: "location", pillId: "location" },
  { sectionId: "how-it-works", pillId: "how-it-works" },
  { sectionId: "your-host", pillId: "your-host" },
  { sectionId: "reviews", pillId: "reviews" },
  { sectionId: "faq", pillId: "faq" },
  { sectionId: "similar", pillId: "similar" },
];

// column-major order matches the frame's two columns; flows down-then-over
const INCLUDED = [
  "High speed wifi",
  "Gym access",
  "Air conditioning and heat",
  "Linens and kitchenware",
  "Utilities included",
  "Parking for up to 2 vehicles",
  "Pool and hot tub access",
  "Attached 1 car garage",
  "Smart TV",
  "In unit washer and dryer",
  "Professional cleaning before you arrive",
];

const FILTERS: { label: string; url: string; aria: string }[] = [
  { label: "Hospitals", url: "https://www.google.com/maps/search/hospitals/@38.667,-121.515,13z", aria: "Find hospitals near North Natomas on Google Maps" },
  { label: "Coffee", url: "https://www.google.com/maps/search/coffee/@38.667,-121.515,14z", aria: "Find coffee near North Natomas on Google Maps" },
  { label: "Food", url: "https://www.google.com/maps/search/restaurants/@38.667,-121.515,14z", aria: "Find food near North Natomas on Google Maps" },
  { label: "Parks", url: "https://www.google.com/maps/search/parks/@38.667,-121.515,14z", aria: "Find parks near North Natomas on Google Maps" },
  { label: "Quiet spots", url: "https://www.google.com/maps/search/library/@38.667,-121.515,14z", aria: "Find quiet spots near North Natomas on Google Maps" },
  { label: "Grocery", url: "https://www.google.com/maps/search/grocery+store/@38.667,-121.515,14z", aria: "Find grocery stores near North Natomas on Google Maps" },
];

const DISTANCES = [
  "Sacramento International Airport is about a 10 minute drive.",
  "Downtown Sacramento is about a 15 minute drive.",
  "Sutter Medical Center is about 7 miles away.",
  "Mercy General Hospital is about 7.4 miles away.",
  "UC Davis Medical Center is about 9.7 miles away.",
];

const STEPS = [
  {
    n: "1",
    title: "Send an inquiry",
    body: "Share your move in date and stay length. No payment is required and booking on behalf of someone else is welcome.",
  },
  {
    n: "2",
    title: "Review your lease",
    body: "You get a read only recap of your dates, monthly rate, and terms so everything is clear before you commit.",
  },
  {
    n: "3",
    title: "We confirm your stay",
    body: "Our team replies personally and confirms your dates, usually within a day.",
  },
  {
    n: "4",
    title: "Settle in",
    body: "You get your door codes and a move in packet, with support whenever you need it.",
  },
];

const REVIEWS = [
  {
    initials: "PG",
    stars: 5,
    title: "Location and home were excellent",
    body: "This was a wonderful place to stay in a great community. The neighborhood was quiet, safe, and had a lot to offer. We really enjoyed having access to the pool and hot tub, and the nearby park was a great addition with volleyball courts and large open fields.",
    who: "Parker G., July 2026",
  },
  {
    initials: "DG",
    stars: 5,
    title: "Loved our stay",
    body: "We had an excellent experience staying here. The host was friendly, responsive, and very accommodating throughout our stay. Any questions we had were answered quickly, and it was clear they genuinely cared about making sure we were comfortable.",
    who: "Davis G., July 2026",
  },
  {
    initials: "SG",
    stars: 5,
    title: "Great place",
    body: "We had a great stay at this home! The house was in excellent condition and very well kept. The living room was extremely comfortable, and the large TV was perfect for relaxing after a long day. The bedrooms were spacious and the loft area was a great bonus with plenty of room.",
    who: "Sarah G., July 2026",
  },
];

const FAQ = [
  {
    q: "How close is this home to the airport and hospitals?",
    a: "The Sacramento Condo is about 10 minutes from Sacramento International Airport. Sutter Medical Center is about 7 miles away and UC Davis Medical Center is about 9.7 miles away.",
  },
  {
    q: "What is the minimum stay for this furnished rental?",
    a: "The minimum stay is 30 days. Most guests book monthly and many extend once they settle in, so tell us the dates you have in mind and we will confirm what works.",
  },
  {
    q: "Are utilities and wifi included in the monthly rate?",
    a: "Yes. Utilities and high speed wifi are included in the monthly rate, along with cleaning before you arrive. There are no platform service fees when you book direct with us.",
  },
  {
    q: "Is parking included?",
    a: "Yes. Dedicated parking is included. Let us know how many vehicles you are bringing and we will make sure there is space.",
  },
  {
    q: "Can I book this home for an employee, a patient, or a family member?",
    a: "Yes. You can book this home for an employee, a patient, or a family member. Add their details when you send your inquiry and we will coordinate with your one point of contact.",
  },
  {
    q: "What happens if my dates change after I inquire?",
    a: "Just let us know. Since there is no instant booking, we confirm every stay personally, so we can adjust your move in and move out dates before anything is final.",
  },
  {
    q: "Is this home pet friendly?",
    a: "Pets are not allowed at this home. Smoking is also not allowed.",
  },
];

/* ---------- reusable bits ---------- */

/* ---------- page ---------- */

export default function Product() {
  const [active, setActive] = useState("top");
  const [openFaq, setOpenFaq] = useState<boolean[]>(FAQ.map((_, idx) => idx === 0));
  const [earlySent, setEarlySent] = useState(false);
  const [moveInDate, setMoveInDate] = useState("");
  const [moveOutDate, setMoveOutDate] = useState("");
  const inquiryParams = new URLSearchParams();
  if (moveInDate) inquiryParams.set("moveIn", moveInDate);
  if (moveOutDate) inquiryParams.set("moveOut", moveOutDate);
  const inquiryHref = inquiryParams.size ? `/inquiry?${inquiryParams}` : "/inquiry";
  const earlyEmailInputRef = useRef<HTMLInputElement>(null);
  const pillRowRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const [footerVisible, setFooterVisible] = useState(false);

  // scrollspy: active pill via direct scroll position check
  useEffect(() => {
    const sections = OBSERVED_SECTIONS
      .map(({ sectionId, pillId }) => ({ el: document.getElementById(sectionId), pillId }))
      .filter((s): s is { el: HTMLElement; pillId: string } => s.el !== null);

    let rafId = 0;

    const updateActivePill = () => {
      const line = window.innerHeight * 0.45;
      const atBottom =
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4;

      if (atBottom) {
        setActive(sections[sections.length - 1].pillId);
        return;
      }

      for (let i = sections.length - 1; i >= 0; i--) {
        if (sections[i].el.getBoundingClientRect().top <= line) {
          setActive(sections[i].pillId);
          return;
        }
      }

      setActive("top");
    };

    const onFrame = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateActivePill);
    };

    window.addEventListener("scroll", onFrame, { passive: true });
    window.addEventListener("resize", onFrame);
    updateActivePill();

    return () => {
      window.removeEventListener("scroll", onFrame);
      window.removeEventListener("resize", onFrame);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // fade bar out when the footer enters the viewport
  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setFooterVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // keep the active pill visible in the scrollable mobile row
  useEffect(() => {
    const row = pillRowRef.current;
    if (!row) return;
    const el = row.querySelector<HTMLElement>(`[data-pill="${active}"]`);
    if (el) {
      el.scrollIntoView({ block: "nearest", inline: "center" });
    }
  }, [active]);

  return (
    <div id="top" className="bg-white">
      {/* SEO */}
      <title>The Sacramento Condo, furnished rental | LuxeLife Properties</title>
      <meta
        name="description"
        content="A furnished 2 bedroom monthly rental in North Natomas, Sacramento, minutes from UC Davis Medical Center and Sutter. Extended stays of 30 days or more with utilities, wifi, and parking included. Send an inquiry and a real person replies."
      />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="LuxeLife Properties" />
      <meta property="og:title" content="The Sacramento Condo, furnished rental | LuxeLife Properties" />
      <meta property="og:description" content="A furnished 2 bedroom monthly rental in North Natomas, Sacramento, minutes from UC Davis Medical Center and Sutter. Extended stays of 30 days or more with utilities, wifi, and parking included. Send an inquiry and a real person replies." />
      <meta property="og:url" content={`${ORIGIN}/sacramento-condo`} />
      <meta property="og:image" content={`${ORIGIN}${entry6079}`} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="The Sacramento Condo, furnished rental | LuxeLife Properties" />
      <meta name="twitter:description" content="A furnished 2 bedroom monthly rental in North Natomas, Sacramento, minutes from UC Davis Medical Center and Sutter. Extended stays of 30 days or more with utilities, wifi, and parking included. Send an inquiry and a real person replies." />
      <meta name="twitter:image" content={`${ORIGIN}${entry6079}`} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQ.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />

      <TopNav active="Properties" />
      <main id="main" tabIndex={-1}>

      {/* Hero */}
      <section id="hero" className="bg-terracotta">
        <div className="mx-auto max-w-[1280px] px-5 py-8 md:px-10 md:py-12">
          {/* breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6 text-[14px] text-white">
            <a href="/" className="hover:underline">
              Home
            </a>
            <span className="px-2">/</span>
            <a href="/#homes" className="hover:underline">
              Properties
            </a>
            <span className="px-2">/</span>
            <span className="font-medium text-white">The Sacramento Condo</span>
          </nav>

          <div className="flex flex-col gap-8 md:grid md:grid-cols-3 md:gap-x-8">
            {/* gallery */}
            <div className="order-2 md:order-none md:col-span-3 md:row-start-1">
              <PropertyGallery />
            </div>

            {/* title + location */}
            <div className="order-1 md:order-none md:col-span-2 md:row-start-2 md:self-start">
              <AccentBar tone="light" />
              <h1 className="hero-stroke text-[36px] font-bold leading-[1.08] tracking-[-1.2px] text-white md:text-[56px] md:leading-[1.06]">
                The Sacramento Condo, a furnished 2 bedroom with a loft in North Natomas
              </h1>
              <p className="mt-6 text-[16px] text-ink">{PROPERTY_ADDRESS}</p>
              <p className="mt-1 text-[16px] text-ink">About 10 minutes to Sacramento International Airport</p>
            </div>

            {/* booking card */}
            <div className="order-3 md:order-none md:col-start-3 md:row-start-2 md:sticky md:top-24 md:self-start">
              <div className="rounded-2xl bg-card p-6 shadow-[0_1px_2px_rgba(0,0,0,0.06)] md:p-7">
                <p className="text-[20px] font-semibold text-ink">The Sacramento Condo</p>
                <p className="mt-1 text-[14px] text-muted">2 bed, 2 bath, loft, 1,338 sq ft, garage</p> {/* confirm max guests with owner */}
                <hr className="my-4 border-black/10" />
                <p className="text-[26px] font-semibold text-ink">{PRICING.from}</p>
                <div className="mt-1 text-[14px] leading-[22.8px] text-muted">
                  {PRICING_NOTES.map((n) => (
                    <p key={n}>{n}</p>
                  ))}
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="booking-move-in" className="block text-[14px] text-ink">Move in date</label>
                    <input
                      id="booking-move-in"
                      type="date"
                      value={moveInDate}
                      onChange={(e) => setMoveInDate(e.target.value)}
                      className="mt-2 h-11 w-full rounded-lg border border-ink/15 bg-white px-3 text-[16px] text-ink"
                    />
                  </div>
                  <div>
                    <label htmlFor="booking-move-out" className="block text-[14px] text-ink">Move out date</label>
                    <input
                      id="booking-move-out"
                      type="date"
                      value={moveOutDate}
                      min={moveInDate || undefined}
                      onChange={(e) => setMoveOutDate(e.target.value)}
                      className="mt-2 h-11 w-full rounded-lg border border-ink/15 bg-white px-3 text-[16px] text-ink"
                    />
                  </div>
                </div>
                <a
                  href={inquiryHref}
                  className="mt-5 flex min-h-[44px] w-full items-center justify-center rounded-full bg-sage px-6 py-3 text-[14px] font-semibold leading-5 text-ink transition-opacity hover:opacity-90"
                >
                  Check availability
                </a>
                <p className="mt-3 text-[13px] text-muted">No charge to inquire. We reply within a day.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Included */}
      <section id="included" className="scroll-mt-24 bg-white">
        <div className="mx-auto max-w-[1280px] px-5 py-14 md:px-10 md:py-20">
          <h2 className="font-display text-[34px] font-semibold leading-tight text-ink md:text-[42px]">
            What is included in your monthly rate
          </h2>
          <ul className="mt-10 columns-1 gap-x-16 md:columns-2">
            {INCLUDED.map((item) => (
              <li key={item} className="mb-4 flex break-inside-avoid items-center gap-3">
                <span className="inline-flex h-6 w-6 flex-none items-center justify-center rounded-[4px] bg-[#e5e5e5]" aria-hidden="true" />
                <Check className="-ml-8 h-4 w-4 flex-none text-ink" />
                <span className="text-[16px] text-ink">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Roof zigzag divider */}
      <img width={2000} height={153} src={roofStrip} alt="" aria-hidden="true" className="block h-auto w-full" />

      {/* Location */}
      <section id="location" className="scroll-mt-24 bg-cream">
        <div className="mx-auto max-w-[1280px] px-5 py-14 md:px-10 md:py-20">
          <AccentBar />
          <h2 className="font-display text-[34px] font-semibold leading-tight text-ink md:text-[42px]">
            Your commute and what is around
          </h2>
          <div className="relative mt-8 w-full overflow-hidden rounded-2xl" style={{ height: "400px" }}>
            <iframe
              title={`Map of ${PROPERTY_ADDRESS}`}
              src="https://www.openstreetmap.org/export/embed.html?bbox=-121.620%2C38.530%2C-121.370%2C38.730&layer=mapnik"
              className="h-full w-full"
              style={{ border: 0 }}
              loading="lazy"
              aria-label="Neighborhood map showing North Natomas, Interstate 5, and Sacramento International Airport"
            />
            {/* soft area indicator — no exact address revealed */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                left: "50%",
                top: "53%",
                transform: "translate(-50%, -50%)",
                width: 120,
                height: 120,
                borderRadius: "50%",
                background: "rgba(99,102,241,0.18)",
                border: "2px solid rgba(99,102,241,0.45)",
                pointerEvents: "none",
              }}
            />
          </div>
          <p className="mt-3 text-[13px] text-ink/65">Exact address shared after your stay is confirmed.</p>
          <p className="mt-5 text-[13px] text-ink/65">Tap to explore nearby on Google Maps.</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <a
                key={f.label}
                href={f.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={f.aria}
                className="flex items-center gap-1.5 rounded-full border border-ink/20 px-4 py-1.5 text-[14px] text-ink/80 transition-colors hover:border-terracotta hover:bg-terracotta/5 hover:text-terracotta"
              >
                <svg aria-hidden="true" width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-none opacity-60">
                  <path d="M6 0C3.794 0 2 1.794 2 4c0 3 4 10 4 10s4-7 4-10c0-2.206-1.794-4-4-4zm0 5.5A1.5 1.5 0 1 1 6 2.5 1.5 1.5 0 0 1 6 5.5z" fill="currentColor" />
                </svg>
                {f.label}
              </a>
            ))}
          </div>
          <ul className="mt-6 space-y-3">
            {DISTANCES.map((d) => (
              <li key={d} className="flex items-start gap-3 text-[16px] text-ink">
                <CheckBullet />
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* How booking works */}
      <section id="how-it-works" className="scroll-mt-24 bg-cream">
        <div className="mx-auto max-w-[1280px] px-5 pb-14 md:px-10 md:pb-20">
          <h2 className="font-display text-[34px] font-semibold leading-tight text-ink md:text-[42px]">
            How booking this home works
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-4">
            {STEPS.map((s) => (
              <article key={s.n} className="rounded-2xl bg-card p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-terracotta-soft text-[15px] font-medium text-white">
                  {s.n}
                </div>
                <h3 className="mt-5 text-[19px] font-medium text-ink">{s.title}</h3>
                <p className="mt-3 text-[14px] leading-[22.8px] text-body">{s.body}</p>
              </article>
            ))}
          </div>
          <img width={2178} height={360} src={stepsStrip} alt="" aria-hidden="true" className="mt-8 w-full rounded-2xl bg-card object-cover" />
        </div>
      </section>

      {/* Meet your property manager */}
      <section id="your-host" className="scroll-mt-24 bg-cream">
        <div className="mx-auto max-w-[1280px] px-5 pb-14 md:px-10 md:pb-20">
          <h2 className="font-display text-[34px] font-semibold leading-tight text-ink md:text-[42px]">
            Meet your property manager
          </h2>
          <div className="mt-8 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            {PROPERTY_MANAGER_PHOTO ? (
              <img width={160} height={160}
                src={PROPERTY_MANAGER_PHOTO}
                alt={`${MANAGER.name}, property manager.`}
                className="h-20 w-20 flex-none rounded-full object-cover"
              />
            ) : (
              <div
                role="img"
                aria-label={`${MANAGER.name}, property manager.`}
                className="flex h-20 w-20 flex-none items-center justify-center rounded-full bg-terracotta font-display text-[26px] font-semibold text-white"
              >
                AF
              </div>
            )}
            <div>
              <h3 className="text-[20px] font-semibold text-ink">{MANAGER.name}</h3>
              <p className="mt-0.5 text-[15px] text-muted-strong">Property manager for LuxeLife Properties</p>
              <p className="mt-3 text-[16px] text-ink">Message me any time. I want your stay to feel like home.</p>
              {/* "Meet your property manager" has no link per the site map */}
              <a
                href={MANAGER_MAILTO}
                className="mt-4 flex min-h-[44px] items-center justify-center rounded-full bg-sage px-6 py-3 text-[14px] font-semibold leading-5 text-ink transition-opacity hover:opacity-90"
              >
                Message {MANAGER.firstName}
              </a>
            </div>
          </div>
          <img width={2000} height={1333}
            src={entryBanner}
            alt="Front entry of The Sacramento Condo with LuxeLife welcome signs."
            loading="lazy"
            decoding="async"
            className="mt-10 aspect-[4/3] w-full rounded-2xl object-cover object-[50%_50%] md:aspect-[5/2] xl:aspect-[3/1]"
          />
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="scroll-mt-24 bg-cream">
        <div className="mx-auto max-w-[1280px] px-5 py-14 md:px-10 md:py-20">
          <AccentBar />
          <h2 className="font-display text-[34px] font-semibold leading-tight text-ink md:text-[44px]">
            What guests say about this home
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {REVIEWS.map((r, idx) => (
              <article key={idx} className="rounded-2xl bg-card p-7 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-terracotta-soft text-[15px] font-semibold text-white">
                  {r.initials}
                </div>
                <div className="mt-4 flex gap-1">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} filled={s < r.stars} />
                  ))}
                </div>
                <p className="mt-4 text-[15px] font-semibold text-ink">{r.title}</p>
                <p className="mt-2 text-[14px] leading-[22.8px] text-body">{r.body}</p>
                <p className="mt-4 text-[13px] text-muted">{r.who}</p>
                <p className="mt-0.5 text-[12px] text-muted">Verified stay on Furnished Finder</p>
              </article>
            ))}
          </div>
          <div className="mt-8">
            <a
              href="https://www.furnishedfinder.com/property/823058_1"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[14px] text-terracotta-deep underline underline-offset-4 hover:opacity-80"
            >
              Read all 8 reviews on Furnished Finder
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24 bg-tan">
        <div className="mx-auto max-w-[1280px] px-5 py-14 md:px-10 md:py-20">
          <AccentBar />
          <h2 className="max-w-2xl font-display text-[34px] font-semibold leading-tight text-ink md:text-[44px]">
            Questions about staying at The Sacramento Condo
          </h2>
          <div className="mt-10 overflow-hidden rounded-2xl bg-card">
            {FAQ.map((f, idx) => {
              const isOpen = openFaq[idx];
              return (
                <div key={idx} className="border-b border-black/10 last:border-b-0">
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpenFaq((prev) => prev.map((v, i) => (i === idx ? !v : v)))}
                      aria-expanded={isOpen}
                      className="flex min-h-[44px] w-full items-center justify-between gap-6 px-6 py-5 text-left text-[16px] text-ink focus-visible:outline-offset-[-2px] md:px-8"
                    >
                      <span>{f.q}</span>
                      <span className="flex-none text-ink/60">{isOpen ? <CloseIcon className="h-5 w-5" /> : <PlusIcon className="h-5 w-5" />}</span>
                    </button>
                  </h3>
                  {isOpen && <div className="px-6 pb-6 text-[14px] leading-[22.8px] text-body md:px-8">{f.a}</div>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Similar */}
      <section id="similar" className="scroll-mt-24 bg-cream">
        <div className="mx-auto max-w-[1280px] px-5 py-14 md:px-10 md:py-20">
          <AccentBar />
          <h2 className="max-w-2xl font-display text-[34px] font-semibold leading-tight text-ink md:text-[44px]">
            More furnished homes coming to Sacramento and Oakland
          </h2>
          <div className="mt-10">
            <article className="overflow-hidden rounded-2xl bg-card shadow-[0_1px_2px_rgba(0,0,0,0.04)] md:flex md:items-stretch">
              {/* Left visual: 40% width on md+, 16:9 on mobile, 4:3 on md+ */}
              <div className="w-full md:w-[40%] md:flex-none">
                <div className="relative flex aspect-16/9 w-full flex-col items-center justify-center gap-3 border-2 border-dashed border-terracotta/50 bg-terracotta/[0.12] md:h-full md:aspect-4/3 md:rounded-l-2xl">
                  <svg aria-hidden="true" width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-terracotta opacity-80">
                    <path d="M7 20L22 7l15 13v17a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V20z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="none" />
                    <path d="M16 38V26h12v12" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                  </svg>
                  <div className="text-center">
                    <p className="text-[15px] font-medium text-ink/75">Photos coming soon</p>
                    <p className="mt-0.5 text-[13px] text-ink/65">Opening in Oakland</p>
                  </div>
                </div>
              </div>

              {/* Right content: 60% width on md+, vertically centered */}
              <div className="flex w-full flex-col justify-center p-6 md:w-[60%] md:p-8 xl:p-10">
                <span className="inline-flex w-fit rounded-full bg-ink/75 px-3 py-1 text-[12px] font-medium text-white">
                  Coming soon
                </span>
                <h3 className="mt-3 text-[26px] font-medium text-ink">The Oakland Home</h3>
                <p className="mt-1.5 text-[15px] text-muted">Oakland, CA 94601</p>
                <p className="mt-2.5 text-[15px] text-ink/85">Details coming soon. Join the list to hear first.</p>
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      const earlySection = document.getElementById("early-access");
                      if (earlySection) {
                        earlySection.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
                      }
                      earlyEmailInputRef.current?.focus({ preventScroll: true });
                    }}
                    className="flex min-h-[44px] w-full items-center justify-center rounded-xl bg-sage px-6 py-3 text-[14px] font-semibold leading-5 text-ink transition-opacity hover:opacity-90 md:w-auto md:inline-flex"
                  >
                    Notify me
                  </button>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Early access band */}
      <section id="early-access" className="relative overflow-hidden bg-terracotta">
        {/* Background photo */}
        <img width={2000} height={1500}
          src={earlyAccessBg}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        {/* Terracotta color overlay at 78% opacity */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-terracotta/78"
        />
        {/* Subtle vignette darkening the edges to focus on text */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.35)_100%)]"
        />

        <div className="relative z-10 mx-auto max-w-[1280px] px-5 py-16 text-center md:px-10 md:py-20">
          <div className="mx-auto flex flex-col items-center">
            <AccentBar tone="light" />
            <p className="text-[15px] font-medium text-white">Early access</p>
            <h2 className="mt-2 max-w-3xl font-display text-[34px] font-semibold leading-tight text-white md:text-[48px]">
              Get first access to new furnished homes
            </h2>
            <p className="mt-4 max-w-2xl text-[17px] text-white">
              Join the list to hear the moment a new home opens, before it goes public.
            </p>

            {earlySent ? (
              <p className="mt-8 text-[16px] font-medium text-white">
                You are on the list. We will reach out the moment a new home opens.
              </p>
            ) : (
              <>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setEarlySent(true);
                  }}
                  className="mt-8 flex w-full max-w-2xl flex-col gap-3 md:flex-row md:justify-center"
                >
                  <input
                    ref={earlyEmailInputRef}
                    type="email"
                    required
                    placeholder="Email"
                    aria-label="Email"
                    className="h-12 w-full rounded-lg border border-white/30 bg-white px-4 text-[16px] text-ink placeholder:text-ink/60 md:w-[220px]"
                  />
                  <input
                    type="tel"
                    placeholder="Phone (optional)"
                    aria-label="Phone (optional)"
                    className="h-12 w-full rounded-lg border border-white/30 bg-white px-4 text-[16px] text-ink placeholder:text-ink/60 md:w-[220px]"
                  />
                  <button
                    type="submit"
                    className="flex h-12 min-h-[44px] w-full items-center justify-center rounded-lg bg-sage px-6 py-3 text-[14px] font-semibold leading-5 text-ink transition-opacity hover:opacity-90 md:w-auto"
                  >
                    Get early access
                  </button>
                </form>
                <p className="mt-4 text-[13px] font-medium text-white">No spam. Just new homes, when they open.</p>
              </>
            )}
          </div>
        </div>
      </section>

      </main>

      <div ref={footerRef} style={{ backgroundColor: "#0b2442", paddingBottom: "calc(86px + env(safe-area-inset-bottom))" }}>
        <Footer />
      </div>

      {/* Fixed bottom nav pill bar */}
      <div
        className="fixed bottom-0 left-0 right-0 z-30 px-4 pt-3 transition-opacity duration-300"
        style={{
          paddingBottom: "calc(env(safe-area-inset-bottom) + 12px)",
          opacity: footerVisible ? 0 : 1,
          pointerEvents: footerVisible ? "none" : undefined,
        }}
      >
        <div
          ref={pillRowRef}
          className="no-scrollbar flex items-center gap-1 overflow-x-auto rounded-full px-2 py-2 md:mx-auto md:max-w-max"
          style={{
            backgroundColor: "rgba(148, 179, 170, 0.65)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(255, 255, 255, 0.25)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
          }}
        >
          {NAV_SECTIONS.map((s) => (
            <a
              key={s.id}
              data-pill={s.id}
              href={`#${s.id}`}
              aria-current={active === s.id ? "true" : undefined}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 text-[14px] transition-colors ${
                active === s.id ? "bg-white font-medium text-ink" : "text-ink/85 hover:text-ink"
              }`}
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

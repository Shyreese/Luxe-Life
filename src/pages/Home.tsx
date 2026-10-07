import { useEffect, useRef, useState } from "react";
import { CloseIcon, PlusIcon } from "../components/icons";
import TopNav from "../components/TopNav";
import Footer from "../components/Footer";
import { PRICING, PRICING_NOTES, COMPARE_HOTEL_MONTHLY, PROPERTY_ADDRESS } from "../data/mockData";
import HeroPattern from "../components/HeroPattern";

import hero01 from "../assets/hero-01.webp";
import hero02 from "../assets/hero-02.webp";
import hero03 from "../assets/hero-03.webp";
import hero04 from "../assets/hero-04.webp";
import hero05 from "../assets/hero-05.webp";
import hero06 from "../assets/hero-06.webp";
import cardPhoto1 from "../imports/image-24.webp";
import cardPhoto2 from "../imports/image-25.webp";
import cardPhoto3 from "../imports/image-26.webp";
import cardPhoto4 from "../imports/image-27.webp";
import cardPhoto5 from "../imports/image-28.webp";
import heroLoft from "../imports/image-22.webp";
import bookingStrip from "../imports/image-23.webp";
import prop2 from "../assets/prop2.webp";
import towerBridge from "../imports/image-20.webp";
import earlyAccessBg from "../assets/early-access-bg.webp";
import inc1 from "../assets/inc1.png";
import inc2 from "../assets/inc2.png";
import inc3 from "../assets/inc3.png";
import cmp1 from "../assets/cmp1.png";
import cmp3 from "../assets/cmp3.png";
import AccentBar from "../components/AccentBar";

/* ---------- small shared icons ---------- */

function Check({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} fill="none" aria-hidden="true">
      <path d="M4 10.5l4 4 8-9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckBox() {
  return (
    <span className="inline-flex h-5 w-5 flex-none items-center justify-center rounded-[4px] bg-navy text-white">
      <Check className="h-3.5 w-3.5" />
    </span>
  );
}

function Star({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill={filled ? "var(--color-star)" : "none"} aria-hidden="true">
      <path
        d="M10 1.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L10 15l-5.3 2.6 1-5.8L1.5 7.7l5.9-.9L10 1.5z"
        stroke={filled ? "var(--color-star)" : "#9ca3af"}
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
  { id: "includes", label: "Includes" },
  { id: "how-it-works", label: "How it works" },
  { id: "homes", label: "Properties" },
  { id: "reviews", label: "Reviews" },
  { id: "pricing", label: "Pricing" },
  { id: "faq", label: "FAQ" },
  { id: "partnership", label: "Partners" },
];

// Maps section DOM ids (in page/DOM order) to their corresponding pill ids.
// "hero" is the actual hero section element; "top" is the outer page anchor.
const OBSERVED_SECTIONS = [
  { sectionId: "hero", pillId: "top" },
  { sectionId: "includes", pillId: "includes" },
  { sectionId: "how-it-works", pillId: "how-it-works" },
  { sectionId: "homes", pillId: "homes" },
  { sectionId: "reviews", pillId: "reviews" },
  { sectionId: "pricing", pillId: "pricing" },
  { sectionId: "faq", pillId: "faq" },
  { sectionId: "partnership", pillId: "partnership" },
];

const INCLUDES = [
  {
    icon: inc1,
    n: "01",
    title: "Work ready spaces",
    body: "High speed wifi, a dedicated desk, and an ergonomic setup in every home.",
  },
  {
    icon: inc2,
    n: "02",
    title: "Flexible stays",
    body: "Month to month terms with a calendar first approach that adapts to your schedule.",
  },
  {
    icon: inc3,
    n: "03",
    title: "Transparent pricing",
    body: "No hidden fees and no surprises. Most inquiries are answered the same day.",
  },
];

const STEPS = [
  {
    n: "1",
    title: "Explore our homes",
    body: "See real photos, honest pricing, and live availability with nothing hidden.",
  },
  {
    n: "2",
    title: "Send an inquiry",
    body: "Share your dates and we follow up personally. Booking for someone else is welcome and no payment is required.",
  },
  {
    n: "3",
    title: "We confirm your stay",
    body: "Our team replies personally, usually within a day.",
  },
  {
    n: "4",
    title: "Settle in",
    body: "We walk you through everything so it feels like home from day one.",
  },
];

const HOMES = [
  {
    img: hero01,
    imgs: [
      { src: hero01, alt: "Furnished Sacramento condo living room" },
      { src: hero02, alt: "Furnished Sacramento condo kitchen" },
      { src: hero03, alt: "Furnished Sacramento condo primary bedroom" },
      { src: cardPhoto1, alt: "Primary bathroom with tub, shower, and vanity at The Sacramento Condo." },
      { src: cardPhoto2, alt: "Second bedroom with queen bed and large windows at The Sacramento Condo." },
      { src: cardPhoto3, alt: "Second bathroom with vanity and tub at The Sacramento Condo." },
      { src: cardPhoto4, alt: "Upstairs loft lounge with sectional sofa and TV at The Sacramento Condo." },
      { src: cardPhoto5, alt: "Private attached garage at The Sacramento Condo." },
    ],
    badge: "Available now",
    title: "The Sacramento Condo",
    // replace with real street address from owner
    address: PROPERTY_ADDRESS,
    specs: "2 bed, 2 bath, loft, 1,338 sq ft, garage", // confirm max guests with owner
    tags: ["Wifi", "Parking", "Quiet neighborhood"],
    price: PRICING.from,
    notes: PRICING_NOTES,
    cta: { label: "Check availability", href: "/sacramento-condo" },
  },
  {
    img: prop2,
    badge: "Coming soon",
    title: "The Oakland Home",
    address: "Oakland, CA 94601",
    specs: "Sleeps 4, 2 bed, 1 bath, 920 sq ft",
    tags: ["Wifi", "Parking", "Quiet neighborhood"],
    price: "",
    notes: [],
    cta: { label: "Notify me", href: "/#early-access" },
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

const COMPARE = [
  {
    icon: cmp1,
    title: "Extended stay hotel",
    price: COMPARE_HOTEL_MONTHLY,
    highlight: false,
    bullets: [
      "Nightly rates that climb during busy weeks.",
      "Cleaning and resort fees added at checkout.",
      "No full kitchen or laundry included.",
    ],
  },
  {
    icon: cmp3,
    title: "LuxeLife direct",
    price: PRICING.from,
    highlight: true,
    bullets: [
      "Full kitchen and in unit laundry",
      "Utilities, wifi, and cleaning included in your quote.",
      "A dedicated property manager who replies personally.",
    ],
  },
];

const FAQ = [
  {
    q: "How does booking work if there is no Book now button?",
    a: "You send an inquiry with your dates and we confirm your stay personally. No payment is required to inquire and we usually reply within a day.",
  },
  {
    q: "Is there a deposit or fee to send an inquiry?",
    a: "No. Sending an inquiry is free and there is no deposit to ask about a home. A deposit is only discussed once you decide to move forward and we confirm your dates.",
  },
  {
    q: "What is included in the monthly rate?",
    a: "Your monthly rate covers a fully furnished home with utilities, high speed wifi, and cleaning built into the quote. There are no platform service fees when you book direct with us.",
  },
  {
    q: "What is the cleaning fee and process?",
    a: "Cleaning is included in your quote and handled by our team between stays. For longer stays we can arrange a regular cleaning schedule that fits your needs.",
  },
  {
    q: "How close are your homes to hospitals in Sacramento and Oakland?",
    a: "Most of our homes are a short drive from the major hospitals in Sacramento and Oakland, and many are within minutes of the main medical campuses. Tell us where you need to be and we will match you with the closest home.",
  },
  {
    q: "Do you have furnished rentals near UC Davis Medical Center or Sutter?",
    a: "Yes. We keep furnished rentals near UC Davis Medical Center and Sutter, and we regularly host traveling nurses and visiting families. Send an inquiry with your dates and we will share what is available.",
  },
  {
    q: "Can I book a furnished home for an employee or a family member?",
    a: "Yes. You can book on behalf of an employee, a patient, or a family member. Add their details when you send your inquiry and we will coordinate everything with your one point of contact.",
  },
];

const PARTNER_BULLETS = [
  "Priority availability on upcoming homes.",
  "Direct rates with no platform service fees.",
  "One point of contact who handles every placement.",
];

/* ---------- hero carousel ---------- */

const HERO_SLIDES = [
  { src: hero01, alt: "Furnished living room with blue sectional sofa in a Sacramento rental condo" },
  { src: hero02, alt: "Private balcony with patio seating overlooking the community pool" },
  { src: hero03, alt: "Bedroom with queen bed and green accent wall" },
  { src: hero04, alt: "Kitchen with stainless steel appliances and granite counters" },
  { src: hero05, alt: "Dedicated work desk and chair for remote work" },
  { src: heroLoft, alt: "Upstairs loft lounge with sectional sofa at The Sacramento Condo.", pos: "50% 60%" },
  { src: hero06, alt: "Loft view overlooking the open living room" },
];
const HERO_CAPTION = "The Sacramento Condo, North Natomas";

function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const prev = () => setCurrent((c) => (c - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  const next = () => setCurrent((c) => (c + 1) % HERO_SLIDES.length);

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) dx < 0 ? next() : prev();
    touchStartX.current = null;
  }

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl shadow-xl"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Slides */}
      <div className="relative aspect-[4/3]">
        {HERO_SLIDES.map((slide, i) => (
          <div
            key={i}
            aria-hidden={i !== current}
            className="absolute inset-0 transition-opacity duration-700"
            style={{ opacity: i === current ? 1 : 0 }}
          >
            <img width={1600} height={1067}
              src={slide.src}
              alt={slide.alt}
              loading="eager"
              fetchPriority={i === 0 ? "high" : undefined}
              className="h-full w-full object-cover"
              style={"pos" in slide ? { objectPosition: slide.pos } : undefined}
            />
          </div>
        ))}

        {/* Prev / next arrows */}
        {(["prev", "next"] as const).map((dir) => (
          <button
            key={dir}
            type="button"
            aria-label={dir === "prev" ? "Previous photo" : "Next photo"}
            onClick={dir === "prev" ? prev : next}
            data-focus-photo
            className={`group absolute top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full ${
              dir === "prev" ? "left-2 md:left-4" : "right-2 md:right-4"
            }`}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-neutral-900 shadow-md transition-transform group-hover:scale-105 md:h-11 md:w-11">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.25"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d={dir === "prev" ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"} />
              </svg>
            </span>
          </button>
        ))}

        {/* Gradient + caption */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/50 to-transparent" />
        <p className="absolute bottom-8 left-4 text-[11px] font-medium tracking-wide text-white drop-shadow-sm">
          {HERO_CAPTION}
        </p>

        {/* Dot indicators */}
        <div
          className="absolute bottom-0 left-0 right-0 flex justify-center"
          role="tablist"
          aria-label="Carousel slides"
        >
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-label={`Slide ${i + 1}`}
              aria-selected={i === current}
              onClick={() => setCurrent(i)}
              data-focus-photo
              className="group flex h-11 w-11 items-center justify-center rounded-full"
            >
              <span
                className={`block h-1.5 rounded-full transition-all duration-300 ${
                  i === current ? "w-5 bg-white" : "w-1.5 bg-white/55 group-hover:bg-white/80"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- reusable bits ---------- */

function ArrowButton({ dir, onClick }: { dir: "prev" | "next"; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={dir === "prev" ? "Previous photo" : "Next photo"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      data-focus-photo
      className={`group absolute top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full ${
        dir === "prev" ? "left-2 md:left-4" : "right-2 md:right-4"
      }`}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-neutral-900 shadow-md transition-transform group-hover:scale-105 md:h-11 md:w-11">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d={dir === "prev" ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"} />
        </svg>
      </span>
    </button>
  );
}

function PropertyCard({ home }: { home: (typeof HOMES)[number] }) {
  const comingSoon = home.badge === "Coming soon";
  const imgs = !comingSoon && "imgs" in home ? home.imgs : undefined;
  const slides = imgs && imgs.length ? imgs : [{ src: "img" in home ? home.img : "", alt: `${home.title} interior` }];
  const [i, setI] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const go = (d: number) => setI((prev) => (prev + d + slides.length) % slides.length);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-card shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <div className="relative">
        {comingSoon ? (
          <div className="relative flex aspect-[4/3] w-full flex-col items-center justify-center gap-3 rounded-t-2xl border-2 border-dashed border-terracotta/50 bg-white">
            <span className="absolute left-3 top-3 rounded-full bg-ink/75 px-3 py-1 text-[12px] font-medium text-white">
              {home.badge}
            </span>
            <svg aria-hidden="true" width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-terracotta opacity-80">
              <path d="M7 20L22 7l15 13v17a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V20z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="none" />
              <path d="M16 38V26h12v12" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            </svg>
            <div className="text-center">
              <p className="text-[15px] font-medium text-ink/75">Photos coming soon</p>
              <p className="mt-0.5 text-[13px] text-ink/65">Opening in Oakland</p>
            </div>
          </div>
        ) : (
          <div
            className="relative aspect-[4/3] w-full overflow-hidden"
            onTouchStart={(e) => {
              touchStartX.current = e.touches[0].clientX;
            }}
            onTouchEnd={(e) => {
              if (touchStartX.current === null) return;
              const dx = e.changedTouches[0].clientX - touchStartX.current;
              if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
              touchStartX.current = null;
            }}
          >
            <img width={1600} height={1067} src={slides[i].src} alt={slides[i].alt} loading={i === 0 ? "eager" : "lazy"} decoding="async" className="block h-full w-full object-cover" />
            {slides.length > 1 && (
              <>
                <ArrowButton dir="prev" onClick={() => go(-1)} />
                <ArrowButton dir="next" onClick={() => go(1)} />
                <div className="absolute bottom-0 left-0 right-0 flex justify-center" role="tablist" aria-label="Photo slides">
                  {slides.map((_, d) => (
                    <button
                      key={d}
                      type="button"
                      role="tab"
                      aria-label={`Photo ${d + 1}`}
                      aria-selected={d === i}
                      onClick={() => setI(d)}
                      data-focus-photo
                      className="group flex h-11 w-11 items-center justify-center rounded-full"
                    >
                      <span
                        className={`block h-1.5 rounded-full transition-all duration-300 ${
                          d === i ? "w-5 bg-white" : "w-1.5 bg-white/55 group-hover:bg-white/80"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col px-6 pb-6 pt-5 md:px-8 md:pb-8">
        <h3 className="font-display text-[26px] font-medium text-ink">{home.title}</h3>
        <p className="mt-2 text-[15px] text-ink/65">{home.address}</p>

        {comingSoon ? (
          <p className="mt-2.5 text-[15px] text-ink/85">Details coming soon. Join the list to hear first.</p>
        ) : (
          <>
            <p className="mt-2.5 text-[15px] text-ink/85">{home.specs}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {home.tags.map((t) => (
                <span key={t} className="rounded-full border border-ink/20 px-3 py-1 text-[13px] text-ink/80">
                  {t}
                </span>
              ))}
            </div>
          </>
        )}

        {home.price && (
          <>
            <hr className="my-5 border-black/10" />
            <p className="font-display text-[28px] font-semibold text-ink">{home.price}</p>
            <div className="mt-1 text-[14px] leading-[22.8px] text-muted">
              {home.notes.map((n) => (
                <p key={n}>{n}</p>
              ))}
            </div>
          </>
        )}

        <div className="mt-auto pt-6">
          <a
            href={home.cta.href}
            className="flex min-h-[44px] w-full items-center justify-center rounded-xl bg-sage px-6 py-3 text-[14px] font-semibold leading-5 text-ink transition-opacity hover:opacity-90"
          >
            {home.cta.label}
          </a>
        </div>
      </div>
    </article>
  );
}

/* ---------- page ---------- */

export default function Home() {
  const [active, setActive] = useState("top");
  const [openFaq, setOpenFaq] = useState<boolean[]>(FAQ.map((_, idx) => idx === 0));
  const [partnerSent, setPartnerSent] = useState(false);
  const [earlySent, setEarlySent] = useState(false);
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
    <div id="top" className="bg-cream">
      {/* SEO */}
      <title>Furnished monthly rentals | LuxeLife Properties</title>
      <meta
        name="description"
        content="LuxeLife Properties offers furnished monthly rentals and corporate housing for extended stays of 30 days or more in Sacramento and Oakland. Send an inquiry and a real person replies, usually within a day."
      />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="LuxeLife Properties" />
      <meta property="og:title" content="Furnished monthly rentals | LuxeLife Properties" />
      <meta property="og:description" content="LuxeLife Properties offers furnished monthly rentals and corporate housing for extended stays of 30 days or more in Sacramento and Oakland. Send an inquiry and a real person replies, usually within a day." />
      <meta property="og:url" content={`${ORIGIN}/`} />
      <meta property="og:image" content={`${ORIGIN}${hero01}`} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Furnished monthly rentals | LuxeLife Properties" />
      <meta name="twitter:description" content="LuxeLife Properties offers furnished monthly rentals and corporate housing for extended stays of 30 days or more in Sacramento and Oakland. Send an inquiry and a real person replies, usually within a day." />
      <meta name="twitter:image" content={`${ORIGIN}${hero01}`} />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
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

      <TopNav />
      <main id="main" tabIndex={-1}>

      {/* 2. Hero */}
      <section id="hero" className="relative overflow-hidden bg-terracotta">
        <HeroPattern />
        <div className="relative mx-auto flex max-w-[1280px] flex-col gap-8 px-5 py-14 md:grid md:grid-cols-2 md:items-center md:gap-x-10 md:px-10 md:py-20">
          {/* copy + primary actions */}
          <div className="order-1 md:col-start-1 md:row-start-1">
            <AccentBar tone="light" />
            <p className="text-sm text-white">Furnished monthly rentals in Sacramento and Oakland</p>
            <h1 className="hero-stroke mt-3 text-[40px] font-bold leading-[1.08] tracking-[-1.2px] text-white md:text-[60px] md:leading-[69px]">
              Furnished homes
              <br className="hidden md:block" /> minutes from your
              <br className="hidden md:block" /> hospital and airport
            </h1>
            <p className="mt-5 max-w-md text-[18px] font-medium leading-[29.3px] text-ink">
              Furnished 30+ day stays with utilities, wifi, and keys ready before you arrive.
            </p>

            <div className="mt-7 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <a
                href="/#homes"
                className="flex min-h-[44px] w-full items-center justify-center rounded-full bg-white px-6 py-3 text-[14px] font-semibold leading-5 text-ink transition-opacity hover:opacity-90 sm:w-auto"
              >
                See available homes
              </a>
              <a href="/#early-access" className="text-[15px] font-medium text-white underline underline-offset-4">
                Get early access to new homes
              </a>
            </div>
          </div>

          {/* carousel: sits on the right on desktop, between actions and badges on mobile */}
          <div className="order-2 md:col-start-2 md:row-span-2 md:row-start-1 md:self-center">
            <HeroCarousel />
          </div>

          {/* badges: below the photo on mobile, under the actions on desktop */}
          <div className="order-3 flex flex-wrap gap-3 md:col-start-1 md:row-start-2">
            {["Near a hospital", "Work ready", "30+ day stays"].map((b) => (
              <span key={b} className="rounded-full border border-white/50 px-4 py-1.5 text-[14px] text-white">
                {b}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Trust bar */}
      <section className="bg-white" aria-label="Why guests trust us">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-4 px-5 py-5 md:flex-row md:items-center md:justify-center md:gap-14 md:px-10">
          {["Verified homes", "Direct from the owner", "Utilities included", "Trusted by traveling professionals"].map(
            (t) => (
              <div key={t} className="flex items-center gap-2.5">
                <CheckBox />
                <span className="text-[15px] text-ink">{t}</span>
              </div>
            )
          )}
        </div>
      </section>

      {/* 5. Includes */}
      <section id="includes" className="bg-cream scroll-mt-24">
        <div className="mx-auto max-w-[1280px] px-5 py-14 md:px-10 md:py-20">
          <h2 className="font-display text-[34px] font-semibold leading-tight text-ink md:text-[42px]">
            What every LuxeLife stay includes
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {INCLUDES.map((c) => (
              <article key={c.n} className="rounded-2xl bg-card p-7 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                <div className="flex items-center justify-center overflow-hidden" style={{ width: 48, height: 48, borderRadius: 8 }}>
                  <img width={96} height={96} src={c.icon} alt="" style={{ width: 48, height: 48, objectFit: "contain" }} />
                </div>
                <p className="mt-5 text-[15px] text-ink/65">{c.n}</p>
                <h3 className="mt-2 font-display text-[21px] font-medium text-ink">{c.title}</h3>
                <p className="mt-3 text-[14px] leading-[22.8px] text-body">{c.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 6. How booking works */}
      <section id="how-it-works" className="bg-cream scroll-mt-24">
        <div className="mx-auto max-w-[1280px] px-5 py-14 md:px-10 md:py-20">
          <h2 className="max-w-2xl font-display text-[34px] font-semibold leading-tight text-ink md:text-[42px]">
            How booking works: simple, transparent, no instant booking
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-4">
            {STEPS.map((s) => (
              <article key={s.n} className="rounded-2xl bg-card p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-terracotta-soft text-[15px] font-medium text-white">
                  {s.n}
                </div>
                <h3 className="mt-5 font-display text-[19px] font-medium text-ink">{s.title}</h3>
                <p className="mt-3 text-[14px] leading-[22.8px] text-body">{s.body}</p>
              </article>
            ))}
          </div>
          <img width={2000} height={1333}
            src={bookingStrip}
            alt="Dining area with table and bar seating at The Sacramento Condo."
            loading="lazy"
            decoding="async"
            className="mt-10 aspect-[2/1] w-full rounded-2xl object-cover object-[50%_65%] md:aspect-[3/1] xl:aspect-[6/1]"
          />
        </div>
      </section>

      {/* 7. Homes */}
      <section id="homes" className="bg-cream scroll-mt-24">
        <div className="mx-auto max-w-[1280px] px-5 pb-14 pt-8 md:px-10 md:pb-20 md:pt-10 xl:pt-14">
          <hr className="mb-14 border-black/10" />
          <AccentBar />
          <h2 className="max-w-xl font-display text-[34px] font-semibold leading-tight text-ink md:text-[44px]">
            Furnished homes for rent in Sacramento and Oakland
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {HOMES.map((h) => (
              <PropertyCard key={h.title} home={h} />
            ))}
          </div>
        </div>
      </section>

      {/* 8. Reviews */}
      <section id="reviews" className="bg-cream scroll-mt-24">
        <div className="mx-auto max-w-[1280px] px-5 pb-14 md:px-10 md:pb-20">
          <h2 className="font-display text-[34px] font-semibold leading-tight text-ink md:text-[44px]">
            What guests say about staying with us
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

      {/* 9. Pricing / comparison */}
      <section id="pricing" className="bg-tan scroll-mt-24">
        <div className="mx-auto max-w-[1280px] px-5 py-16 md:px-10 md:py-20">
          <AccentBar />
          <p className="text-sm text-ink/70">Transparent pricing</p>
          <h2 className="mt-2 font-display text-[34px] font-semibold leading-tight text-ink md:text-[44px]">
            Why a furnished home costs less than a hotel
          </h2>
          <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-ink/75">
            A month in a furnished home often costs less than an extended stay hotel, with a full kitchen and laundry included.
          </p>

          {/* desktop order; reversed on mobile per the mobile spec */}
          <div className="mt-10 flex flex-col-reverse gap-6 md:grid md:grid-cols-2">
            {COMPARE.map((c) => (
              <article
                key={c.title}
                className={`rounded-2xl p-7 ${
                  c.highlight ? "bg-terracotta text-white" : "bg-card text-ink shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                }`}
              >
                <div className="flex flex-none items-center justify-center overflow-hidden" style={{ width: 48, height: 48, borderRadius: 8 }}>
                  <img width={96} height={96} src={c.icon} alt="" style={{ width: 48, height: 48, objectFit: "contain", display: "block" }} />
                </div>
                {c.highlight && (
                  <span className="mt-4 inline-block rounded-full bg-white px-3 py-1 text-[13px] font-medium text-ink">
                    Best value
                  </span>
                )}
                {c.highlight ? (
                  <>
                    <h3 className="mt-3 font-display text-[20px] font-semibold text-white">{c.title}</h3>
                    <p className="mt-2 font-display text-[30px] font-semibold leading-tight text-white">{c.price}</p>
                  </>
                ) : (
                  <>
                    <h3 className="mt-5 font-display text-[20px] font-medium text-ink">{c.title}</h3>
                    <p className="mt-2 text-[16px] text-ink/65">{c.price}</p>
                  </>
                )}
                <ul className="mt-5 space-y-3">
                  {c.bullets.map((b) => (
                    <li key={b} className="flex gap-2.5 text-[14px] leading-relaxed">
                      <Check className={`mt-0.5 h-4 w-4 flex-none ${c.highlight ? "text-white" : "text-terracotta"}`} />
                      <span className={c.highlight ? "text-white" : "text-ink/80"}>{b}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <p className="mt-8 max-w-3xl text-[14px] leading-relaxed text-ink/65">
            Comparison rates are based on 2026 market research for furnished 30 day stays in Sacramento. Rates vary by
            season and by home. Send an inquiry for an exact quote with no obligation.
          </p>
          <a
            href="/inquiry"
            className="mt-6 flex min-h-[44px] w-full items-center justify-center rounded-full bg-sage px-6 py-3 text-[14px] font-semibold leading-5 text-ink transition-opacity hover:opacity-90 sm:inline-flex sm:w-auto"
          >
            Check availability
          </a>
        </div>
      </section>

      {/* 10. FAQ */}
      <section id="faq" className="bg-tan scroll-mt-24">
        <div className="mx-auto max-w-[1280px] px-5 pb-16 md:px-10 md:pb-24">
          <h2 className="max-w-2xl font-display text-[34px] font-semibold leading-tight text-ink md:text-[44px]">
            Everything you need to know before you inquire
          </h2>
          <div className="mt-10 overflow-hidden rounded-2xl bg-card">
            {FAQ.map((f, idx) => {
              const isOpen = openFaq[idx];
              return (
                <div key={idx} className="border-b border-black/10 last:border-b-0">
                  <h3>
                    <button
                      type="button"
                      onClick={() =>
                        setOpenFaq((prev) => prev.map((v, i) => (i === idx ? !v : v)))
                      }
                      aria-expanded={isOpen}
                      className="flex min-h-[44px] w-full items-center justify-between gap-6 px-6 py-5 text-left text-[16px] text-ink focus-visible:outline-offset-[-2px] md:px-8"
                    >
                      <span>{f.q}</span>
                      <span className="flex-none text-ink/60">{isOpen ? <CloseIcon className="h-5 w-5" /> : <PlusIcon className="h-5 w-5" />}</span>
                    </button>
                  </h3>
                  {isOpen && (
                    <div className="px-6 pb-6 text-[14px] leading-[22.8px] text-body md:px-8">{f.a}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 11. Partnership */}
      <section id="partnership" className="bg-cream scroll-mt-24">
        <div className="mx-auto max-w-[1280px] px-5 pt-16 pb-16 md:px-10 md:pt-20 md:pb-24">
          <div className="grid gap-10 xl:grid-cols-2 xl:items-center xl:gap-14">
            {/* left: photo (first on mobile) */}
            <div className="order-1">
              <img width={1335} height={1781}
                src={towerBridge}
                alt="Tower Bridge in Sacramento at golden hour."
                loading="lazy"
                decoding="async"
                className="aspect-video w-full rounded-2xl object-cover object-[50%_58%] shadow-md xl:aspect-[4/5] xl:object-[50%_52%]"
              />
            </div>

            {/* right: copy + form */}
            <div className="order-2">
              <AccentBar />
              <p className="text-sm text-ink/70">For business partners</p>
              <h2 className="mt-2 font-display text-[34px] font-semibold leading-tight text-ink md:text-[42px]">
                Housing your people in Sacramento and Oakland
              </h2>
              <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-ink/80">
                We work with HR teams, hospital coordinators, insurance carriers, and relocation groups to place
                employees, patients, and families in furnished homes built for work and daily living.
              </p>
              <ul className="mt-6 space-y-3">
                {PARTNER_BULLETS.map((b) => (
                  <li key={b} className="flex gap-2.5 text-[15px] text-ink/80">
                    <Check className="mt-0.5 h-4 w-4 flex-none text-terracotta" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              {/* form */}
              <div className="mt-8 rounded-2xl bg-card p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)] md:p-8">
                {partnerSent ? (
                  <div className="py-8 text-center">
                    <h3 className="font-display text-[20px] font-medium text-ink">Thank you</h3>
                    <p className="mt-2 text-[15px] text-ink/70">
                      Your partner guide is on the way. A real person will follow up personally.
                    </p>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setPartnerSent(true);
                    }}
                  >
                    <label htmlFor="pp-type" className="block text-[15px] text-ink">Partnership type</label>
                    <select
                      id="pp-type"
                      required
                      defaultValue=""
                      className="mt-2 h-12 w-full rounded-lg border border-ink/15 bg-white px-3 text-[16px] text-ink"
                    >
                      <option value="" disabled>
                        Select an option
                      </option>
                      <option>HR team</option>
                      <option>Hospital coordinator</option>
                      <option>Insurance carrier</option>
                      <option>Relocation group</option>
                    </select>

                    <label htmlFor="pp-name" className="mt-5 block text-[15px] text-ink">Contact name</label>
                    <input
                      id="pp-name"
                      type="text"
                      required
                      className="mt-2 h-12 w-full rounded-lg border border-ink/15 bg-white px-3 text-[16px] text-ink"
                    />

                    <label htmlFor="pp-email" className="mt-5 block text-[15px] text-ink">Work email</label>
                    <input
                      id="pp-email"
                      type="email"
                      required
                      className="mt-2 h-12 w-full rounded-lg border border-ink/15 bg-white px-3 text-[16px] text-ink"
                    />

                    <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="pp-phone" className="block text-[15px] text-ink">Phone number</label>
                        <input
                          id="pp-phone"
                          type="tel"
                          className="mt-2 h-12 w-full rounded-lg border border-ink/15 bg-white px-3 text-[16px] text-ink"
                        />
                      </div>
                      <div>
                        <label htmlFor="pp-company" className="block text-[15px] text-ink">Company name</label>
                        <input
                          id="pp-company"
                          type="text"
                          className="mt-2 h-12 w-full rounded-lg border border-ink/15 bg-white px-3 text-[16px] text-ink"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="mt-6 flex min-h-[44px] w-full items-center justify-center rounded-lg bg-sage px-6 py-3 text-[14px] font-semibold leading-5 text-ink transition-opacity hover:opacity-90"
                    >
                      Get our partner guide
                    </button>
                    <p className="mt-4 text-[13px] leading-relaxed text-ink/65">
                      We will send your Sacramento and Oakland partner guide with neighborhood details, hospital
                      proximity, and current rates. No obligation.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 12. Early access band */}
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

      {/* 14. Footer */}
      <div ref={footerRef}>
        <Footer />
      </div>
      {/* Navy spacer under footer so the floating bar clearance matches the footer background */}
      <div className="bg-navy" style={{ height: "calc(86px + env(safe-area-inset-bottom))" }} />

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

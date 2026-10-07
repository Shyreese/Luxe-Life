import { useEffect, useRef, useState } from "react";
import TopNav from "../components/TopNav";
import Footer from "../components/Footer";
import { MANAGER_MAILTO, MANAGER, PROPERTY_ADDRESS, PROPERTY_NAME } from "../data/mockData";

import hero01 from "../assets/hero-01.webp";
import hero02 from "../assets/hero-02.webp";
import hero03 from "../assets/hero-03.webp";
import hero04 from "../assets/hero-04.webp";
import heroDesk from "../imports/_M0A6199-1.webp";
import pSteps from "../assets/p-steps.png";
import whoHR from "../assets/who-hr.png";
import whoHospital from "../assets/who-hospital.png";
import whoInsurance from "../assets/who-insurance.png";
import whoRelocation from "../assets/who-relocation.png";
import AccentBar from "../components/AccentBar";

function IconCheck() {
  return (
    <svg viewBox="0 0 48 48" className="mx-auto h-12 w-12" fill="none" aria-hidden="true">
      <circle cx="24" cy="24" r="22" stroke="#94B3AA" strokeWidth="2.5" />
      <path d="M15 24l6 6 12-12" stroke="#94B3AA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Check({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} fill="none" aria-hidden="true">
      <path d="M4 10.5l4 4 8-9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrustIcon({ type }: { type: "verified" | "airport" | "medical" }) {
  if (type === "verified") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 flex-none" fill="none" aria-hidden="true">
        <path d="M12 3l7 3v5c0 4.8-2.9 8.2-7 10-4.1-1.8-7-5.2-7-10V6l7-3z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M8.7 12l2.1 2.1 4.6-4.7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (type === "airport") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 flex-none" fill="none" aria-hidden="true">
        <path d="M12 21a9 9 0 100-18 9 9 0 000 18z" stroke="currentColor" strokeWidth="1.8" />
        <path d="M12 7v5l3.5 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 flex-none" fill="none" aria-hidden="true">
      <path d="M5 21V5h14v16M3 21h18M9 5V3h6v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 9v6M9 12h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

const ORIGIN = typeof window === "undefined" ? "" : window.location.origin;

const NAV_SECTIONS = [
  { id: "top", label: "Top" },
  { id: "who", label: "Who we work with" },
  { id: "inventory", label: "Inventory" },
  { id: "how-it-works", label: "How it works" },
  { id: "partner-form", label: "Start" },
  { id: "faq", label: "FAQ" },
];

// Maps section DOM ids (in page order) to their corresponding pill ids.
// "hero" is the actual hero section; "top" is the outer page anchor.
const OBSERVED_SECTIONS = [
  { sectionId: "hero", pillId: "top" },
  { sectionId: "who", pillId: "who" },
  { sectionId: "inventory", pillId: "inventory" },
  { sectionId: "how-it-works", pillId: "how-it-works" },
  { sectionId: "partner-form", pillId: "partner-form" },
  { sectionId: "faq", pillId: "faq" },
];

const WHO_CARDS = [
  {
    ill: <img width={128} height={128} src={whoHR} alt="" style={{ width: 64, height: 64, objectFit: "contain", display: "block" }} />,
    title: "HR and people teams",
    body: "Place relocating employees and traveling staff in fully furnished homes built for work and daily living.",
  },
  {
    ill: <img width={128} height={128} src={whoHospital} alt="" style={{ width: 64, height: 64, objectFit: "contain", display: "block" }} />,
    title: "Hospital coordinators",
    body: "Give patients and their families a calm, comfortable place to stay near treatment, with everything set up before they arrive.",
  },
  {
    ill: <img width={128} height={128} src={whoInsurance} alt="" style={{ width: 64, height: 64, objectFit: "contain", display: "block" }} />,
    title: "Insurance carriers",
    body: "Give displaced policyholders a real home to settle into while their claim is resolved, with no setup required on your end.",
  },
  {
    ill: <img width={128} height={128} src={whoRelocation} alt="" style={{ width: 64, height: 64, objectFit: "contain", display: "block" }} />,
    title: "Relocation groups",
    body: "Move clients into fully furnished homes where they can start living the day they arrive.",
  },
];

const STEPS = [
  {
    n: "1",
    title: "Tell us about your needs",
    body: "Share your typical stay length, volume, and the areas you cover.",
  },
  {
    n: "2",
    title: "We build your rate sheet",
    body: "You get direct pricing with no platform service fees, tailored to your volume.",
  },
  {
    n: "3",
    title: "You get one point of contact",
    body: "A dedicated property manager handles every placement from start to finish.",
  },
  {
    n: "4",
    title: "Your people move in",
    body: "The home is furnished, stocked, and ready. Our property manager is there to welcome them and answer anything they need.",
  },
];

const FAQS = [
  {
    q: "How does partner pricing work?",
    a: "Partners access direct rates with no platform service fees. Pricing is based on your typical stay length and placement volume.",
  },
  {
    q: "What is the minimum stay for a partner placement?",
    a: "We specialize in stays of 30 days and longer. Most partner placements run 45 to 90 days.",
  },
  {
    q: "How quickly can you place someone?",
    a: "For most requests we can confirm a home within 24 to 48 hours. We keep a waitlist for Sacramento and Oakland homes opening soon.",
  },
  {
    q: "Which areas do you cover?",
    a: "We currently operate in North Natomas, Sacramento, East Sacramento, and central Oakland. Additional neighborhoods are coming through 2026.",
  },
  {
    q: "How close are your homes to hospitals in Sacramento and Oakland?",
    a: "Our Sacramento homes are within 10 minutes of UC Davis Medical Center and Sutter Health. Oakland homes are within 15 minutes of UCSF Benioff Oakland and Highland Hospital.",
  },
  {
    q: "Can we book on behalf of an employee, a patient, or a policyholder?",
    a: "Yes. We handle the full placement on behalf of your organization and communicate directly with the occupant once you introduce us.",
  },
  {
    q: "Do you require a contract or a minimum volume?",
    // confirm with owner
    a: "No contract is required to start. Partners who commit to a minimum monthly volume receive priority availability and the best direct rates.",
  },
];

const HERO_SLIDES = [
  { src: heroDesk, alt: "Bedroom with a work desk, set up for a business traveler." },
  { src: hero01, alt: "Spacious living room with a blue sectional sofa, furnished for a corporate guest." },
  { src: hero04, alt: "Fully equipped kitchen with stainless steel appliances, ready for longer stays." },
  { src: hero03, alt: "Queen bedroom with a green accent wall, ready for a relocating employee." },
  { src: hero02, alt: "Balcony with patio seating above the community pool." },
];

const HERO_BENEFITS = [
  "One point of contact for every placement.",
  "Direct rates with no platform service fees.",
  "Homes ready before your people arrive.",
];

const HERO_TRUST = [
  { type: "verified" as const, text: "8 verified stays" },
  { type: "airport" as const, text: "10 minutes to the airport" },
  { type: "medical" as const, text: "Near Sutter and UC Davis" },
];

function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  return (
    <div className="mt-10 xl:mt-0">
      <div className="relative overflow-hidden rounded-2xl shadow-xl">
        <div className="relative aspect-[4/3] md:aspect-video xl:aspect-[4/3]">
          {HERO_SLIDES.map((slide, i) => (
            <div
              key={i}
              aria-hidden={i !== current}
              className="absolute inset-0 transition-opacity duration-700"
              style={{ opacity: i === current ? 1 : 0 }}
            >
              <img width={1600} height={1067} src={slide.src} alt={slide.alt} className="h-full w-full object-cover" />
            </div>
          ))}
          <div className="absolute bottom-0 left-0 right-0 flex justify-center" role="tablist" aria-label="Carousel slides">
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
                  className={`block h-1.5 rounded-full transition-all duration-300 ${i === current ? "w-5 bg-white" : "w-1.5 bg-white/55 group-hover:bg-white/80"}`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const FAQ_JSON_LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
});

export default function Partnership() {
  const [active, setActive] = useState("top");
  const [openFaq, setOpenFaq] = useState<boolean[]>(FAQS.map((_, i) => i === 0));
  const [submitted, setSubmitted] = useState(false);
  const pillRowRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const [footerVisible, setFooterVisible] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    company: "",
    contact: "",
    email: "",
    phone: "",
    partnerType: "",
    placements: "",
    details: "",
  });

  // scrollspy: active pill via direct scroll position check
  useEffect(() => {
    const sections = OBSERVED_SECTIONS
      .map(({ sectionId, pillId }) => ({ el: document.getElementById(sectionId), pillId }))
      .filter(
        (s): s is { el: HTMLElement; pillId: string } =>
          s.el !== null && s.el.offsetParent !== null
      );

    let rafId = 0;

    const updateActivePill = () => {
      // Always highlight "top" when near the top of the page
      if (window.scrollY < 120) {
        setActive("top");
        return;
      }

      const atBottom =
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4;

      if (atBottom) {
        setActive(sections[sections.length - 1].pillId);
        return;
      }

      const line = window.innerHeight * 0.45;

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

  // fade bar out when footer enters the viewport
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

  function validate(f: typeof form) {
    const next: Record<string, string> = {};
    if (!f.company.trim()) next.company = "Enter your company name.";
    if (!f.contact.trim()) next.contact = "Enter a contact name.";
    if (!f.email.trim()) next.email = "Enter your work email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) next.email = "Enter a valid email address.";
    if (!f.partnerType) next.partnerType = "Choose a partnership type.";
    return next;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next = validate(form);
    setErrors(next);
    const firstInvalid = (["company", "contact", "email", "partnerType"] as const).find((k) => next[k]);
    if (firstInvalid) {
      const ids = { company: "pf-company", contact: "pf-contact", email: "pf-email", partnerType: "pf-type" };
      document.getElementById(ids[firstInvalid])?.focus();
      return;
    }
    setSubmitted(true);
  }

  function handlePartnerCta(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    const partnerForm = document.getElementById("partner-form");
    const firstField = document.getElementById("pf-company") as HTMLInputElement | null;

    firstField?.focus({ preventScroll: true });
    partnerForm?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "start",
    });
  }

  function field(id: keyof typeof form) {
    return {
      value: form[id],
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm({ ...form, [id]: e.target.value });
        if (errors[id]) setErrors(({ [id]: _removed, ...rest }) => rest);
      },
    };
  }

  function errorProps(id: string, inputId: string) {
    return errors[id]
      ? { "aria-invalid": true as const, "aria-describedby": `${inputId}-error` }
      : {};
  }

  function fieldError(id: string, inputId: string) {
    return errors[id] ? (
      <p id={`${inputId}-error`} role="alert" className="mt-1.5 text-[13px] text-red-600">
        {errors[id]}
      </p>
    ) : null;
  }

  const inputCls =
    "w-full rounded-xl border border-tan bg-white px-4 py-3 text-[15px] text-ink placeholder:text-muted focus:border-navy focus:ring-1 focus:ring-navy aria-invalid:border-red-400";

  return (
    <div id="top">
      <title>Partner with us | LuxeLife Properties</title>
      <meta
        name="description"
        content="LuxeLife Properties partners with HR teams, hospital coordinators, insurance carriers, and relocation groups to place people in furnished 30 day and longer homes across Sacramento and Oakland. Direct rates, no platform fees, one point of contact."
      />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="LuxeLife Properties" />
      <meta property="og:title" content="Partner with us | LuxeLife Properties" />
      <meta property="og:description" content="LuxeLife Properties partners with HR teams, hospital coordinators, insurance carriers, and relocation groups to place people in furnished 30 day and longer homes across Sacramento and Oakland. Direct rates, no platform fees, one point of contact." />
      <meta property="og:url" content={`${ORIGIN}/partnership`} />
      <meta property="og:image" content={`${ORIGIN}${heroDesk}`} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Partner with us | LuxeLife Properties" />
      <meta name="twitter:description" content="LuxeLife Properties partners with HR teams, hospital coordinators, insurance carriers, and relocation groups to place people in furnished 30 day and longer homes across Sacramento and Oakland. Direct rates, no platform fees, one point of contact." />
      <meta name="twitter:image" content={`${ORIGIN}${heroDesk}`} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: FAQ_JSON_LD }} />

      <TopNav active="Partner with us" />

      <main id="main" tabIndex={-1}>
        {/* ── Hero ─────────────────────────────────────────────────── */}
        <section id="hero" className="bg-cream">
          <div className="mx-auto max-w-[1280px] px-5 py-14 md:px-10 md:py-20 xl:grid xl:grid-cols-2 xl:items-center xl:gap-14">
            <div>
              <AccentBar />
              <p className="text-sm text-ink/70">For business partners</p>
              <h1 className="mt-3 text-[2.35rem] font-bold leading-[1.08] tracking-tight text-ink md:text-[2.75rem]">
                <span className="xl:block">Furnished housing for</span>{" "}
                <span className="xl:block">the people you place in</span>{" "}
                <span className="xl:block">Sacramento and Oakland</span>
              </h1>
              <p className="mt-5 max-w-2xl text-[1.0625rem] leading-relaxed text-body xl:max-w-xl">
                We work with HR teams, hospital coordinators, insurance carriers, and relocation groups
                to place people in furnished homes for 30 day stays and longer.
              </p>

              <ul className="mt-6 space-y-3">
                {HERO_BENEFITS.map((benefit) => (
                  <li key={benefit} className="flex gap-2.5 text-[15px] text-ink/80">
                    <Check className="mt-0.5 h-4 w-4 flex-none text-terracotta" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
                <a
                  href="#partner-form"
                  onClick={handlePartnerCta}
                  className="flex min-h-[44px] w-full items-center justify-center rounded-full bg-sage px-6 py-3 text-[14px] font-semibold leading-5 text-ink transition-opacity hover:opacity-90 sm:w-auto"
                >
                  Get our partner guide
                </a>
                <a
                  href="/#homes"
                  className="flex min-h-[44px] w-full items-center justify-center text-[15px] font-medium text-ink underline underline-offset-4 sm:w-auto"
                >
                  See our homes
                </a>
              </div>

              <div className="mt-7 grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4" aria-label="Partner trust details">
                {HERO_TRUST.map((item) => (
                  <div key={item.text} className="flex items-start gap-2 text-terracotta">
                    <TrustIcon type={item.type} />
                    <span className="text-[13px] leading-snug text-muted-strong">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <HeroCarousel />
          </div>
        </section>

        {/* ── Who we work with ───────────────────────────────────── */}
        <section id="who" aria-labelledby="who-heading" className="scroll-mt-24 bg-tan">
          <div className="mx-auto max-w-[1280px] px-5 py-14 md:px-10 md:py-20">
            <AccentBar />
            <h2 id="who-heading" className="text-[2rem] font-bold tracking-tight text-ink md:text-[2.25rem]">
              Who we work with
            </h2>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 md:grid-cols-4">
              {WHO_CARDS.map((c) => (
                <div key={c.title} className="rounded-2xl bg-white p-7 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                  {c.ill}
                  <h3 className="mt-4 text-[17px] font-semibold text-ink">{c.title}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-body">{c.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Inventory ──────────────────────────────────────────── */}
        <section id="inventory" aria-labelledby="inv-heading" className="scroll-mt-24 bg-white">
          <div className="mx-auto max-w-[1280px] px-5 py-16 md:px-10 md:py-24">
            <h2 id="inv-heading" className="text-[2rem] font-bold tracking-tight text-ink md:text-[2.25rem]">
              Our current Sacramento and Oakland inventory
            </h2>
            <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-body">
              We are a small operator and we are honest about capacity. One furnished home is
              available now in North Natomas, Sacramento and a second is coming soon in Oakland.
              Partners on our list get first access as new homes open in Sacramento and Oakland.
            </p>
            <div className="mt-4 space-y-1.5">
              <p className="text-[14px] text-muted">
                {PROPERTY_NAME}, {PROPERTY_ADDRESS}. Available now.
              </p>
              <p className="text-[14px] text-muted">
                The Oakland Home, Oakland, CA 94601. Coming soon.
              </p>
              <p className="text-[14px] text-muted">
                Additional Sacramento and Oakland homes are being added through 2026.
              </p>
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <figure>
                <img width={1600} height={1067}
                  src={hero01}
                  alt="Furnished living room with blue sectional sofa in a Sacramento rental condo"
                  className="h-64 w-full rounded-2xl object-cover"
                />
                <figcaption className="mt-2 text-[13px] font-medium text-body">
                  The Sacramento Condo
                </figcaption>
              </figure>
              <figure>
                <div className="relative flex h-64 w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-terracotta/50 bg-white">
                  <span className="absolute left-3 top-3 rounded-full bg-ink/75 px-3 py-1 text-[12px] font-medium text-white">
                    Coming soon
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
                <figcaption className="mt-2 text-[13px] font-medium text-body">
                  The Oakland Home
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* ── How partnering works ───────────────────────────────── */}
        <section id="how-it-works" aria-labelledby="how-heading" className="scroll-mt-24 bg-cream">
          <div className="mx-auto max-w-[1280px] px-5 py-16 md:px-10 md:py-24">
            <h2 id="how-heading" className="text-[2rem] font-bold tracking-tight text-ink md:text-[2.25rem]">
              How partnering works
            </h2>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 md:grid-cols-4">
              {STEPS.map((s) => (
                <div key={s.n} className="rounded-2xl bg-white p-7 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-terracotta text-[14px] font-semibold text-white">
                    {s.n}
                  </span>
                  <h3 className="mt-4 text-[17px] font-semibold text-ink">{s.title}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-body">{s.body}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
              <img width={2178} height={360}
                src={pSteps}
                alt="Four step illustration: submit inquiry, review rate sheet, receive confirmation, welcome move in"
                className="w-full"
              />
            </div>
          </div>
        </section>

        {/* ── Partner form ───────────────────────────────────────── */}
        <section
          id="partner-form"
          aria-labelledby="form-heading"
          className="relative scroll-mt-24 bg-terracotta"
        >
          <div aria-hidden="true" className="absolute inset-0 bg-black/5" />
          <div className="relative mx-auto grid max-w-[1280px] gap-y-8 px-5 py-16 md:grid-cols-5 md:items-start md:gap-x-12 md:px-10 md:py-24">
            <div className="md:col-span-2">
              <AccentBar tone="light" />
              <p className="text-sm text-white">Start a partnership</p>
              <h2
                id="form-heading"
                className="mt-3 text-[2rem] font-bold leading-tight tracking-tight text-white md:text-[2.25rem]"
              >
                Tell us about your organization
              </h2>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white">
                We reply personally, usually within a day, and send our
                Sacramento and Oakland partner guide.
              </p>

              <ul className="mt-6 space-y-3">
                {[
                  "A rate sheet built around your volume.",
                  "One point of contact for every placement.",
                  "No obligation and no platform fees.",
                ].map((item) => (
                  <li key={item} className="flex gap-2.5 text-[15px] leading-relaxed text-white">
                    <Check className="mt-0.5 h-4 w-4 flex-none text-white" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm md:col-span-3 md:row-span-2 md:p-8">
              {submitted ? (
                <div className="px-2 py-10 text-center">
                  <IconCheck />
                  <h3 className="mt-4 text-xl font-semibold text-ink">
                    We have received your inquiry
                  </h3>
                  <p className="mt-2 text-[15px] text-body">
                    Someone from our team will follow up within one business
                    day. Your partner guide is on its way to{" "}
                    <span className="font-medium text-ink">{form.email}</span>.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="grid gap-4 md:grid-cols-2"
                  noValidate
                >
                  <div>
                    <label
                      htmlFor="pf-company"
                      className="mb-1.5 block text-[13px] font-medium text-ink"
                    >
                      Company name
                    </label>
                    <input
                      id="pf-company"
                      type="text"
                      required
                      placeholder="Your organization"
                      className={inputCls}
                      {...errorProps("company", "pf-company")}
                      {...field("company")}
                    />
                    {fieldError("company", "pf-company")}
                  </div>

                  <div>
                    <label
                      htmlFor="pf-contact"
                      className="mb-1.5 block text-[13px] font-medium text-ink"
                    >
                      Contact person
                    </label>
                    <input
                      id="pf-contact"
                      type="text"
                      required
                      placeholder="Full name"
                      className={inputCls}
                      {...errorProps("contact", "pf-contact")}
                      {...field("contact")}
                    />
                    {fieldError("contact", "pf-contact")}
                  </div>

                  <div>
                    <label
                      htmlFor="pf-email"
                      className="mb-1.5 block text-[13px] font-medium text-ink"
                    >
                      Work email
                    </label>
                    <input
                      id="pf-email"
                      type="email"
                      required
                      placeholder="you@company.com"
                      className={inputCls}
                      {...errorProps("email", "pf-email")}
                      {...field("email")}
                    />
                    {fieldError("email", "pf-email")}
                  </div>

                  <div>
                    <label
                      htmlFor="pf-phone"
                      className="mb-1.5 block text-[13px] font-medium text-ink"
                    >
                      Phone number{" "}
                      <span className="font-normal text-muted">(optional)</span>
                    </label>
                    <input
                      id="pf-phone"
                      type="tel"
                      placeholder="(916) 555 0000"
                      className={inputCls}
                      {...field("phone")}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="pf-type"
                      className="mb-1.5 block text-[13px] font-medium text-ink"
                    >
                      Partnership type
                    </label>
                    <select
                      id="pf-type"
                      required
                      className={inputCls}
                      {...errorProps("partnerType", "pf-type")}
                      {...field("partnerType")}
                    >
                      <option value="">Select a type</option>
                      <option>HR and people teams</option>
                      <option>Hospital coordinator</option>
                      <option>Insurance carrier</option>
                      <option>Relocation group</option>
                      <option>Other</option>
                    </select>
                    {fieldError("partnerType", "pf-type")}
                  </div>

                  <div>
                    <label
                      htmlFor="pf-placements"
                      className="mb-1.5 block text-[13px] font-medium text-ink"
                    >
                      Placements per year{" "}
                      <span className="font-normal text-muted">(optional)</span>
                    </label>
                    <input
                      id="pf-placements"
                      type="number"
                      min="1"
                      placeholder="Example: 20"
                      className={inputCls}
                      {...field("placements")}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label
                      htmlFor="pf-details"
                      className="mb-1.5 block text-[13px] font-medium text-ink"
                    >
                      Tell us what you are looking for{" "}
                      <span className="font-normal text-muted">(optional)</span>
                    </label>
                    <textarea
                      id="pf-details"
                      rows={3}
                      placeholder="Typical stay length, areas needed, timing, and anything else we should know."
                      className={`${inputCls} resize-none`}
                      value={form.details}
                      onChange={(e) =>
                        setForm({ ...form, details: e.target.value })
                      }
                    />
                  </div>

                  <button
                    type="submit"
                    className="flex min-h-[44px] w-full items-center justify-center rounded-full bg-sage px-8 py-3 text-[15px] font-semibold text-ink transition-opacity hover:opacity-90 md:col-span-2"
                  >
                    Send partnership inquiry
                  </button>

                  <p className="text-[12px] leading-relaxed text-muted md:col-span-2">
                    No obligation. We will respond personally, usually within a
                    day.
                  </p>
                </form>
              )}
            </div>

            <aside className="rounded-2xl bg-white p-5 shadow-sm md:col-span-2">
              <div className="flex items-center gap-4">
                <div
                  role="img"
                  aria-label={`${MANAGER.name}, property manager.`}
                  className="flex h-20 w-20 flex-none items-center justify-center rounded-full bg-terracotta font-display text-[26px] font-semibold text-white"
                >
                  AF
                </div>
                <div>
                  <h3 className="text-[17px] font-semibold text-ink">
                    Prefer to talk?
                  </h3>
                  <p className="mt-0.5 text-[14px] text-body">
                    {MANAGER.name}, property manager
                  </p>
                  <a
                    href={MANAGER_MAILTO}
                    className="mt-2 inline-block text-[14px] font-semibold text-ink underline decoration-terracotta/60 underline-offset-4 transition-opacity hover:opacity-70"
                  >
                    Message {MANAGER.firstName}
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </section>

        {/* ── FAQ ────────────────────────────────────────────────── */}
        <section id="faq" aria-labelledby="faq-heading" className="scroll-mt-24 bg-tan">
          <div className="mx-auto max-w-[1280px] px-5 py-16 md:px-10 md:py-24">
            <h2 id="faq-heading" className="text-[2rem] font-bold tracking-tight text-ink md:text-[2.25rem]">
              Common questions from our partners
            </h2>
            <div className="mt-8 max-w-3xl rounded-2xl bg-white px-6 md:px-8">
              {FAQS.map((f, i) => (
                <div key={f.q} className="border-b border-ink/10 last:border-b-0">
                  <h3>
                  <button
                    type="button"
                    onClick={() =>
                      setOpenFaq((prev) => prev.map((v, idx) => (idx === i ? !v : v)))
                    }
                    aria-expanded={openFaq[i]}
                    className="flex w-full items-start justify-between gap-4 py-5 text-left"
                  >
                    <span className="text-[17px] font-medium leading-snug text-ink">{f.q}</span>
                    <span
                      className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-tan text-ink transition-transform duration-200 ${
                        openFaq[i] ? "rotate-45" : ""
                      }`}
                      aria-hidden="true"
                    >
                      <svg viewBox="0 0 14 14" className="h-3.5 w-3.5" fill="none">
                        <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                      </svg>
                    </span>
                  </button>
                  </h3>
                  {openFaq[i] && <p className="pb-5 text-[15px] leading-relaxed text-body">{f.a}</p>}
                </div>
              ))}
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

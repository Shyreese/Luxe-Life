import { useEffect, useRef, useState } from "react";
import TopNav from "../components/TopNav";
import Footer from "../components/Footer";
import { MOVE_IN_LABEL, PRICING, STAY_END_LABEL, MANAGER, PARKING, PROPERTY_ADDRESS } from "../data/mockData";
import entryPhoto from "../imports/_M0A6079-2.webp";
import diningPhoto from "../assets/dining-room.webp";
import balconyPhoto from "../assets/balcony.webp";
import kitchenPhoto from "../assets/kitchen.webp";
import secondBedroomPhoto from "../assets/second-bedroom.webp";

const STEP_ICONS = [
  <>
    <path d="M3 11l9-7 9 7" />
    <path d="M5 10v10h14V10" />
    <path d="M10 20v-6h4v6" />
  </>,
  <>
    <path d="M7 3h7l5 5v13H7z" />
    <path d="M14 3v5h5" />
    <path d="M10 13h6M10 17h6" />
  </>,
  <>
    <rect x="4" y="4" width="16" height="17" rx="2" />
    <path d="M8 3v3M16 3v3" />
    <path d="M8 11l1.5 1.5L12 10M8 17l1.5 1.5L12 16M14.5 11.5H17M14.5 17.5H17" />
  </>,
  <>
    <circle cx="8" cy="15" r="4" />
    <path d="M11 12l9-9M16 7l3 3M14 9l2 2" />
  </>,
  <>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </>,
];

function LineIcon({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`flex-none ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
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

type Step = {
  pill: string;
  title: string;
  body: string;
  items: string[];
  nextLabel: string | null; // null on the last step, which shows the primary CTA
  photo?: string;
  photoAlt?: string;
  focusPoint?: string;
};

const STEPS: Step[] = [
  {
    pill: "Overview",
    title: "Overview",
    body: "Welcome to The Sacramento Condo. This walkthrough covers everything you need for a smooth move in, and it takes about five minutes.",
    items: [
      `Your home is at ${PROPERTY_ADDRESS}.`,
      "The minimum stay is 30 days.",
      "All utilities are included in your monthly rate.",
      `Message ${MANAGER.firstName} any time. She usually replies within a day.`,
    ],
    nextLabel: "Next: your lease",
  },
  {
    pill: "Your lease",
    title: "Your lease",
    body: "Here is a recap of what you already signed. There is nothing to do here, we are just confirming the details.",
    items: [
      `Your move in date is ${MOVE_IN_LABEL}.`,
      `Your stay ends ${STAY_END_LABEL}.`,
      `Your monthly rate is ${PRICING.monthlyRate}.`,
      "Your lease is signed and your payment is received.",
    ],
    nextLabel: "Next: before you arrive",
    photo: diningPhoto,
    photoAlt: "Dining area with table and window at The Sacramento Condo.",
    focusPoint: "55% 70%",
  },
  {
    pill: "Before you arrive",
    title: "Before you arrive",
    body: "A few things to know so that day one goes smoothly.",
    items: [
      "Bring a photo ID for your building registration.",
      "Renters insurance is required.",
      PARKING.walkthrough,
      `Message ${MANAGER.firstName} if your arrival time changes.`,
    ],
    nextLabel: "Next: getting in",
    photo: balconyPhoto,
    photoAlt: "Private balcony at The Sacramento Condo.",
    focusPoint: "center",
  },
  {
    pill: "Getting in",
    title: "Getting in",
    body: "These are your access details, and they are also live in your Resident Hub.",
    items: [
      "Your building entrance code is available 24 hours before arrival.",
      "Your unit door code is sent to your email and your Resident Hub.",
      "The mailbox key is inside the unit on the kitchen counter.",
      "The wifi name and password are on the welcome card.",
    ],
    nextLabel: "Next: day one",
    photo: kitchenPhoto,
    photoAlt: "Kitchen with counter and bar seating at The Sacramento Condo.",
    focusPoint: "50% 60%",
  },
  {
    pill: "Day one",
    title: "Day one",
    body: "Everything is ready for you. Here is what to expect once you walk in.",
    items: [
      "The home is professionally cleaned and fully stocked.",
      "Linens, towels, and kitchen essentials are provided.",
      "Trash and recycling use a shared bin, no set days needed.",
      `${MANAGER.firstName} checks in the day after you arrive.`,
    ],
    nextLabel: null,
    photo: secondBedroomPhoto,
    photoAlt: "Second bedroom with bed, artwork, and large windows at The Sacramento Condo.",
    focusPoint: "55% 55%",
  },
];

export default function Walkthrough() {
  const [step, setStep] = useState(0); // opens on step 1 (index 0)
  const current = STEPS[step];
  const isFirst = step === 0;
  const isLast = step === STEPS.length - 1;

  const stepHeadingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    stepHeadingRef.current?.focus({ preventScroll: true });
  }, [step]);

  const pillsContainerRef = useRef<HTMLDivElement>(null);
  const [barStyle, setBarStyle] = useState<{ width?: string; marginLeft?: string }>({});

  useEffect(() => {
    function updateBar() {
      // At mobile widths (390px), progress bar spans the full card width (w-full)
      if (window.innerWidth < 640) {
        setBarStyle({});
        return;
      }

      if (!pillsContainerRef.current) return;
      const buttons = pillsContainerRef.current.querySelectorAll("button");
      if (buttons.length === 0) return;

      const firstRect = buttons[0].getBoundingClientRect();
      const lastRect = buttons[buttons.length - 1].getBoundingClientRect();
      const containerRect = pillsContainerRef.current.getBoundingClientRect();

      setBarStyle({
        width: `${lastRect.right - firstRect.left}px`,
        marginLeft: `${firstRect.left - containerRect.left}px`,
      });
    }

    updateBar();
    window.addEventListener("resize", updateBar);

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && pillsContainerRef.current) {
      ro = new ResizeObserver(() => {
        updateBar();
      });
      ro.observe(pillsContainerRef.current);
    }

    return () => {
      window.removeEventListener("resize", updateBar);
      if (ro) ro.disconnect();
    };
  }, [step]);

  const nextBtn =
    "wt-btn inline-flex min-h-[44px] items-center justify-center rounded-full bg-sage px-8 py-3 text-[15px] font-semibold text-ink transition-opacity hover:opacity-90";
  const backBtn =
    "wt-btn inline-flex min-h-[44px] items-center justify-center rounded-full border border-sage bg-white px-8 py-3 text-[15px] font-semibold text-ink transition-colors hover:bg-sage/10";

  return (
    <div className="min-h-full bg-white">
      <title>Your move in walkthrough | LuxeLife Properties</title>
      <meta name="description" content="A five step walkthrough of your lease, arrival, access, and first day at The Sacramento Condo." />
      <meta name="robots" content="noindex, nofollow" />
      <TopNav signedIn />
      <main id="main" tabIndex={-1}>

      {/* Scoped rules: full width buttons on mobile, auto width from 640px up;
          full bleed band heights; horizontal scroll for the pill stepper. */}
      <style>{`
        .wt-btn { width: 100%; }
        @media (min-width: 640px) { .wt-btn { width: auto; } }
        .wt-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        .wt-scroll::-webkit-scrollbar { display: none; }
        @media (max-width: 1439px) {
          .wt-scroll { -webkit-mask-image: linear-gradient(to right, #000 calc(100% - 40px), transparent); mask-image: linear-gradient(to right, #000 calc(100% - 40px), transparent); padding-right: 40px; }
        }
        @media (min-width: 1440px) {
          .wt-scroll { overflow-x: visible; }
        }
      `}</style>

      {/* Step 1 uses a full section photograph (neutral placeholder, darkened so
          the white heading reads); the remaining steps use cream. */}
      <section
        style={{
          backgroundColor: isFirst ? undefined : "#F3E8DA",
          paddingBottom: isFirst ? "160px" : undefined,
          position: isFirst ? "relative" : undefined,
          overflow: isFirst ? "hidden" : undefined,
        }}
      >
        {isFirst && (
          <>
            <img width={2000} height={1333} src={entryPhoto} alt="" aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }} />
            <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.45)" }} />
          </>
        )}
        <div className="mx-auto px-5 py-14 md:py-16" style={{ maxWidth: "704px", position: "relative" }}>
          <h1
            className={`max-w-2xl text-[38px] font-bold leading-[1.1] tracking-[-1px] md:text-[48px] ${
              isFirst ? "text-white" : "text-ink"
            }`}
          >
            Your move in walkthrough for The Sacramento Condo
          </h1>

          {/* Pill row is the stepper */}
          <div ref={pillsContainerRef} className="wt-scroll mt-8 flex gap-3 overflow-x-auto pb-1 min-[1440px]:gap-2 min-[1440px]:overflow-visible min-[1440px]:justify-between">
            {STEPS.map((s, i) => {
              const active = i === step;
              return (
                <button
                  key={s.pill}
                  type="button"
                  aria-current={active ? "step" : undefined}
                  onClick={() => setStep(i)}
                  className={`inline-flex flex-none items-center gap-1.5 whitespace-nowrap rounded-full px-5 py-2.5 text-[15px] font-medium transition-colors min-[1440px]:px-4 ${
                    active ? "bg-sage text-ink" : "border border-sage bg-white text-ink hover:bg-sage/10"
                  }`}
                >
                  {i < step && <Check className="h-4 w-4" />}
                  {s.pill}
                </button>
              );
            })}
          </div>

          <div
            role="progressbar"
            aria-label="Walkthrough progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={(step + 1) * 20}
            style={barStyle}
            className={`mt-4 h-1 w-full overflow-hidden rounded-full ${isFirst ? "bg-white/30" : "bg-ink/10"}`}
          >
            <div className="h-full rounded-full bg-sage transition-[width] duration-300" style={{ width: `${(step + 1) * 20}%` }} />
          </div>

          {/* Step card */}
          <div className="mt-8 rounded-2xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]" style={{ padding: "2rem" }}>
            <LineIcon className="h-7 w-7 text-terracotta">{STEP_ICONS[step]}</LineIcon>

            <p className="mt-6 text-[14px] font-medium text-[#737373]">
              Step {step + 1} of 5
            </p>
            <h2 ref={stepHeadingRef} tabIndex={-1} className="mt-3 text-[26px] font-semibold text-ink">{current.title}</h2>
            <p className="mt-3 max-w-xl text-[16px] leading-relaxed text-[#525252]">{current.body}</p>

            <hr className="my-6" style={{ border: "none", borderTop: "1px solid #E5E5E5" }} />

            <ul className="space-y-4">
              {current.items.map((it) => (
                <li key={it} className="flex items-start gap-3 text-[15px] text-ink">
                  <Check className="mt-0.5 h-4 w-4 flex-none text-terracotta" />
                  <span>{it}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Buttons */}
          <div
            className={`mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center ${
              isFirst ? "sm:justify-center" : "sm:justify-between"
            }`}
          >
            {!isFirst && (
              <button type="button" onClick={() => setStep((s) => s - 1)} className={backBtn}>
                Back
              </button>
            )}
            {isLast ? (
              <a href="/resident-hub" className={nextBtn}>
                Go to your Resident Hub
              </a>
            ) : (
              <button type="button" onClick={() => setStep((s) => s + 1)} className={nextBtn}>
                {current.nextLabel}
              </button>
            )}
          </div>

          {/* Skip link, centered under the buttons, on steps 1 to 4 only */}
          {!isLast && (
            <div className="mt-6 text-center">
              <a
                href="/resident-hub"
                className={`text-[15px] underline underline-offset-4 ${
                  isFirst ? "text-white hover:underline" : "text-[#555555] hover:text-ink"
                }`}
              >
                Skip for now and go to your Resident Hub.
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Full bleed footer photo band, changes per step (steps 2 to 5 only). */}
      {current.photo && (
        <img width={2000} height={1333}
          key={current.photo}
          src={current.photo}
          alt={current.photoAlt ?? ""}
          loading="lazy"
          className="w-full object-cover [aspect-ratio:2/1] md:[aspect-ratio:4/1] min-[1440px]:[aspect-ratio:6/1]"
          style={{ display: "block", objectPosition: current.focusPoint }}
        />
      )}

      </main>

      <Footer />
    </div>
  );
}

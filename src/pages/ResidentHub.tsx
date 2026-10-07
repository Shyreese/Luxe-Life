import { MinusIcon, PlusIcon } from "../components/icons";
import { useState, type ReactNode } from "react";
import TopNav from "../components/TopNav";
import Footer from "../components/Footer";
import AccentBar from "../components/AccentBar";
import livingRoomPhoto from "../imports/_M0A6154.webp";
import loftPhoto from "../imports/image-31.webp";

import { ACCESS, DOCUMENTS, EXTEND_MAILTO, ISSUE_MAILTO, LEASE_PDF, MANAGER, MANAGER_MAILTO as MAILTO, MOVE_IN_LABEL, NEARBY, PARKING, QUICK_ANSWERS, REMINDERS, PROPERTY_ADDRESS, RESIDENT, STAY, STAY_END_LABEL, getStayProgress, pluralDays } from "../data/mockData";


// Small chat glyph for the "Message Amy" buttons.
function ChatIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true">
      <path
        d="M3 5.5A1.5 1.5 0 014.5 4h11A1.5 1.5 0 0117 5.5v7A1.5 1.5 0 0115.5 14H8l-3.5 3v-3H4.5A1.5 1.5 0 013 12.5v-7z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const ICON_PATHS: Record<string, ReactNode> = {
  bell: (
    <>
      <path d="M6 16v-5a6 6 0 1112 0v5l1.5 2h-15L6 16z" />
      <path d="M10 20.5a2 2 0 004 0" />
    </>
  ),
  coffee: (
    <>
      <path d="M5 9h11v5a5 5 0 01-5 5h-1a5 5 0 01-5-5V9z" />
      <path d="M16 10h1.5a2.5 2.5 0 010 5H16M8 3v2M12 3v2" />
    </>
  ),
  food: (
    <>
      <path d="M5 3v5a3 3 0 006 0V3M8 3v18" />
      <path d="M17 21V3c-2.5 1.5-3.5 4.5-3.5 8H17" />
    </>
  ),
  parks: <path d="M12 21v-6M12 3l5 7h-2.5l4 6H5.5l4-6H7l5-7z" />,
  quiet: <path d="M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z" />,
  health: (
    <>
      <path d="M5 21V5h14v16M3 21h18M9 5V3h6v2" />
      <path d="M12 9v6M9 12h6" />
    </>
  ),
  download: <path d="M12 4v11M7.5 10.5L12 15l4.5-4.5M5 20h14" />,
  copy: (
    <>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V6a2 2 0 012-2h9" />
    </>
  ),
};

// One line icon style across the page, matching the Partner page trust row.
function LineIcon({ name, className = "h-5 w-5" }: { name: keyof typeof ICON_PATHS; className?: string }) {
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
      {ICON_PATHS[name]}
    </svg>
  );
}

const CATEGORIES = [
  { label: "Coffee", icon: "coffee" },
  { label: "Food", icon: "food" },
  { label: "Parks", icon: "parks" },
  { label: "Work spots", icon: "quiet" },
  { label: "Health", icon: "health" },
];

// With no filter, a place listed under two categories appears once.
const ALL_PLACES = NEARBY.filter(
  (n, i) => NEARBY.findIndex((m) => m.name === n.name && m.address === n.address) === i
);
const COLLAPSED_COUNT = 4;

function directionsUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${address}, Sacramento, CA`)}`;
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  }
}

const cardBase = "rounded-2xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]";
const cardPad = { padding: "1.75rem" } as const;

export default function ResidentHub() {
  const [openAnswer, setOpenAnswer] = useState<number | null>(null); // all closed by default
  const [category, setCategory] = useState<string | null>(null);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState<string | null>(null);

  const [showAll, setShowAll] = useState(false);
  const progress = getStayProgress();

  const nearby = category
    ? NEARBY.filter((n) => n.category === category)
    : showAll
      ? ALL_PLACES
      : ALL_PLACES.slice(0, COLLAPSED_COUNT);

  async function handleCopy(label: string, value: string) {
    if (await copyText(value)) {
      setCopied(label);
      window.setTimeout(() => setCopied((c) => (c === label ? null : c)), 1800);
    }
  }

  return (
    <div className="min-h-full bg-white">
      <title>Your stay at The Sacramento Condo | LuxeLife Properties</title>
      <meta name="description" content="Your LuxeLife Resident Hub with access details, nearby places, documents, and a direct line to your property manager." />
      <meta name="robots" content="noindex, nofollow" />
      <TopNav signedIn />
      <main id="main" tabIndex={-1}>

      {/* Scoped layout rules so the two column grid, category row, action row,
          band height, and the interleaved mobile order do not depend on
          generated utility classes. */}
      <style>{`
        .rh { display: flex; flex-direction: column; gap: 24px; }
        .rh-left, .rh-right { display: contents; }
        .rh-cats { display: grid; grid-template-columns: 1fr; gap: 12px; }
        .rh-actions { display: flex; flex-direction: column; gap: 12px; }
        .rh-actions > a { width: 100%; }
        .rh-band { aspect-ratio: 2 / 1; }
        @media (min-width: 768px) {
          .rh-cats { grid-template-columns: repeat(5, 1fr); }
          .rh-actions { flex-direction: row; flex-wrap: wrap; }
          .rh-actions > a { width: auto; }
          .rh-band { aspect-ratio: 4 / 1; }
        }
        @media (min-width: 1440px) {
          .rh-band { aspect-ratio: 6 / 1; }
          .rh { display: grid; grid-template-columns: 60fr 40fr; gap: 32px; align-items: start; }
          .rh-left, .rh-right { display: flex; flex-direction: column; gap: 24px; }
        }
      `}</style>

      <section className="relative bg-terracotta">
        <div aria-hidden="true" className="absolute inset-0 bg-black/15" />
        <div className="relative mx-auto max-w-[1280px] px-5 py-14 md:px-10 md:py-16">
          <div className="rh">
            {/* LEFT COLUMN */}
            <div className="rh-left">
              {/* Intro block */}
              <div style={{ order: 1 }}>
                <AccentBar tone="light" />
                <p className="text-[13px] font-semibold text-white">Your stay</p>
                <h1
                  className="mt-2 font-bold text-white"
                  style={{ fontSize: "44px", lineHeight: 1.05, letterSpacing: "-1px" }}
                >
                  Welcome home, {RESIDENT.firstName}.
                </h1>
                <p className="mt-3 text-[17px] text-white">
                  Here is everything around you and what is coming up.
                </p>
              </div>

              {/* Property photo + caption */}
              <div style={{ order: 2 }}>
                <img width={2000} height={1333}
                  src={livingRoomPhoto}
                  alt="Living room, kitchen, and loft at The Sacramento Condo."
                  style={{ width: "100%", aspectRatio: "16/10", objectFit: "cover", objectPosition: "55% 55%", borderRadius: "1rem", display: "block" }}
                />
                <p className="mt-2 text-[13px] text-white">Your unit, The Sacramento Condo.</p>
              </div>

              {/* Property card */}
              <div className={cardBase} style={{ ...cardPad, order: 3 }}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-[20px] font-semibold text-ink">The Sacramento Condo</h2>
                    <p className="mt-2 text-[15px] text-[#525252]">{PROPERTY_ADDRESS}</p>
                    <p className="mt-1 text-[15px] text-[#525252]">{PARKING.summary}</p>
                  </div>
                  <span className="flex-none rounded-full border border-ink/25 px-3 py-1 text-[13px] font-medium text-ink">
                    Active
                  </span>
                </div>
                <hr className="my-5" style={{ border: "none", borderTop: "1px solid #E5E5E5" }} />
                <div className="rh-actions">
                  <a
                    href={MAILTO}
                    className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-sage px-5 py-2.5 text-[14px] font-semibold text-ink transition-opacity hover:opacity-90"
                  >
                    <ChatIcon />
                    Message {MANAGER.firstName}
                  </a>
                  {[
                    { label: "Report an issue", href: ISSUE_MAILTO, newTab: false },
                    { label: "Extend my stay", href: EXTEND_MAILTO, newTab: false },
                    { label: "View my lease", href: LEASE_PDF, newTab: true },
                  ].map((b) => (
                    <a
                      key={b.label}
                      href={b.href}
                      {...(b.newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-ink/20 bg-white px-5 py-2.5 text-[14px] font-medium text-ink transition-colors hover:bg-ink/5"
                    >
                      {b.label}
                    </a>
                  ))}
                </div>
              </div>

              {/* Around you */}
              <div style={{ order: 6 }}>
                <h2 className="text-[20px] font-semibold text-white">Around you</h2>
                <div className="rh-cats mt-4">
                  {CATEGORIES.map((c) => {
                    const active = category === c.label;
                    return (
                      <button
                        key={c.label}
                        type="button"
                        aria-pressed={active}
                        onClick={() => setCategory(active ? null : c.label)}
                        className={`rounded-2xl p-5 text-left shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${
                          active ? "bg-sage text-ink" : "bg-white text-terracotta hover:bg-cream"
                        }`}
                      >
                        <span className={active ? "text-ink" : "text-terracotta"}>
                          <LineIcon name={c.icon} className="h-7 w-7" />
                        </span>
                        <span className="mt-3 block text-[15px] font-semibold text-ink">{c.label}</span>
                        <span className={`mt-0.5 block text-[13px] ${active ? "text-ink/80" : "text-[#737373]"}`}>
                          {NEARBY.filter((n) => n.category === c.label).length} nearby
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Explore nearby */}
              <div style={{ order: 7 }}>
                <div className="flex items-baseline justify-between">
                  <h2 className="text-[20px] font-semibold text-white">Explore nearby</h2>
                  {!category && (
                    <button
                      type="button"
                      aria-expanded={showAll}
                      onClick={() => setShowAll((v) => !v)}
                      className="tap-44 text-[14px] text-white underline underline-offset-4 hover:decoration-2"
                    >
                      {showAll ? "Show less" : "See all"}
                    </button>
                  )}
                </div>
                <div className={`${cardBase} mt-4`} style={cardPad}>
                  {nearby.map((n, i) => (
                    <div
                      key={`${n.category}-${n.name}`}
                      className="flex items-center justify-between gap-4 py-3.5"
                      style={i > 0 ? { borderTop: "1px solid #E5E5E5" } : undefined}
                    >
                      <div>
                        <p className="text-[15px] font-semibold text-ink">{n.name}</p>
                        <p className="mt-0.5 text-[13px] text-[#737373]">{n.type}</p>
                        <p className="text-[13px] text-[#737373]">{n.address}</p>
                      </div>
                      <a
                        href={directionsUrl(n.address)}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Directions to ${n.name}`}
                        className="flex-none text-[14px] text-ink underline underline-offset-4 hover:text-ink/70"
                      >
                        Directions
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="rh-right">
              {/* 1. Your stay progress */}
              <aside className="rounded-2xl" style={{ ...cardPad, backgroundColor: "#F5F5F5" }}>
                <p className="text-[13px] text-[#696969]">Your stay</p>
                <h2 className="mt-1 text-[20px] font-semibold text-ink">
                  You have settled in for {pluralDays(progress.daysSettled)}
                </h2>
                <p className="mt-1 text-[15px] text-[#696969]">
                  {progress.daysRemaining} more before you head home.
                </p>
                {/* Timeline: circle → dashed line → location pin (current) → dashed line → house */}
                <div className="mt-6 flex items-center" aria-hidden="true">
                  {/* Start: hollow circle */}
                  <span
                    className="flex-none rounded-full"
                    style={{ width: 10, height: 10, border: "1.5px solid #171717", backgroundColor: "#F5F5F5", flexShrink: 0 }}
                  />
                  {/* Completed segment  */}
                  <span style={{ flex: Math.max(progress.daysSettled, 0.01), height: 0, borderTop: "1.5px dashed #171717", alignSelf: "center" }} />
                  {/* Current position: location pin */}
                  <span className="flex-none" style={{ flexShrink: 0, lineHeight: 0 }}>
                    <svg width="11" height="16" viewBox="0 0 11 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5.5 0.25C2.6 0.25 0.25 2.6 0.25 5.5C0.25 9.25 5 13.7 5.25 13.95L5.5 14.25L5.75 13.95C6 13.7 10.75 9.25 10.75 5.5C10.75 2.6 8.4 0.25 5.5 0.25Z" fill="#171717"/>
                      <circle cx="5.5" cy="5.5" r="2.1" fill="#F5F5F5"/>
                    </svg>
                  </span>
                  {/* Remaining segment  */}
                  <span style={{ flex: Math.max(progress.daysRemaining, 0.01), height: 0, borderTop: "1.5px dashed #D4D4D4", alignSelf: "center" }} />
                  {/* End: house icon */}
                  <span className="flex-none" style={{ flexShrink: 0, lineHeight: 0 }}>
                    <svg width="17" height="15" viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 7L8.5 1L16 7" stroke="#171717" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2.9 6.8V13.5H14.1V6.8" fill="#FAFAFA" stroke="#171717" strokeWidth="1.4" strokeLinejoin="round"/>
                      <path d="M6.4 13.5V9.8H10.6V13.5" stroke="#171717" strokeWidth="1.4" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between text-[13px] text-[#696969]">
                  <span>{MOVE_IN_LABEL}</span>
                  <span>{STAY_END_LABEL}</span>
                </div>
              </aside>

              {/* 2. Your access details */}
              <aside className={cardBase} style={cardPad}>
                <h2 className="text-[20px] font-semibold text-ink">Your access details</h2>
                <dl className="mt-4 space-y-3 text-[15px]">
                  {ACCESS.map((r) => {
                    if (!r.secret) {
                      return (
                        <div key={r.label} className="flex justify-between gap-4">
                          <dt className="text-[#737373]">{r.label}</dt>
                          <dd className="text-right font-medium text-ink">{r.value}</dd>
                        </div>
                      );
                    }
                    const shown = !!revealed[r.label];
                    return (
                      <div key={r.label} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
                        <dt className="text-[#737373]">{r.label}</dt>
                        <dd className="flex items-center gap-1 font-medium text-ink">
                          {shown ? (
                            <span>{r.value}</span>
                          ) : (
                            <>
                              <span aria-hidden="true" className="tracking-[0.15em]">
                                {"\u2022".repeat(6)}
                              </span>
                              <span className="sr-only">Hidden</span>
                            </>
                          )}
                          <button
                            type="button"
                            aria-pressed={shown}
                            aria-label={`${shown ? "Hide" : "Show"} ${r.label.toLowerCase()}`}
                            onClick={() => setRevealed((v) => ({ ...v, [r.label]: !shown }))}
                            className="ml-2 min-h-11 rounded-full px-2 text-[14px] font-medium text-ink underline underline-offset-4 hover:text-ink/70"
                          >
                            {shown ? "Hide" : "Show"}
                          </button>
                          <button
                            type="button"
                            aria-label={`Copy ${r.label.toLowerCase()}`}
                            onClick={() => handleCopy(r.label, r.value)}
                            className="flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/5"
                          >
                            <LineIcon name="copy" className="h-[18px] w-[18px]" />
                          </button>
                          <span
                            role="status"
                            className="w-[52px] text-[13px] font-normal text-[#525252]"
                          >
                            {copied === r.label ? "Copied" : ""}
                          </span>
                        </dd>
                      </div>
                    );
                  })}
                </dl>
              </aside>

              {/* 3. Upcoming reminders */}
              <aside className={cardBase} style={cardPad}>
                <div className="flex items-center gap-2">
                  <span className="text-terracotta"><LineIcon name="bell" /></span>
                  <h2 className="text-[20px] font-semibold text-ink">Upcoming reminders</h2>
                </div>
                <ul className="mt-4 space-y-4">
                  {REMINDERS.map((r) => (
                    <li key={r} className="flex items-start gap-3 text-[15px] text-[#525252]">
                      <span className="mt-0.5 text-terracotta"><LineIcon name="bell" /></span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </aside>
              <a
                href="/walkthrough"
                className="self-start text-[15px] text-ink underline underline-offset-4 hover:text-ink/70"
              >
                Revisit your move in walkthrough
              </a>

              {/* 4. Quick answers accordion */}
              <aside className={cardBase} style={cardPad}>
                <h2 className="text-[20px] font-semibold text-ink">Quick answers</h2>
                <p className="mt-1 text-[15px] text-[#737373]">
                  Find a fast answer before you reach out to your host.
                </p>
                <div className="mt-4">
                  {QUICK_ANSWERS.map((item, i) => {
                    const open = openAnswer === i;
                    return (
                      <div key={item.q} style={{ borderTop: "1px solid #E5E5E5" }}>
                        <button
                          type="button"
                          aria-expanded={open}
                          onClick={() => setOpenAnswer(open ? null : i)}
                          className="flex w-full items-center justify-between gap-4 py-4 text-left text-[15px] font-medium text-ink"
                        >
                          {item.q}
                          <span className="flex-none text-[#737373]">{open ? <MinusIcon className="h-[18px] w-[18px]" /> : <PlusIcon className="h-[18px] w-[18px]" />}</span>
                        </button>
                        {open && <p className="pb-4 text-[15px] leading-relaxed text-[#525252]">{item.a}</p>}
                      </div>
                    );
                  })}
                </div>
              </aside>

              {/* 5. Your host */}
              <aside className={cardBase} style={cardPad}>
                <h2 className="text-[20px] font-semibold text-ink">Your host</h2>
                <div className="mt-4 flex items-center gap-4">
                  <div
                    role="img"
                    aria-label={`${MANAGER.name}, property manager.`}
                    className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-terracotta text-[17px] font-semibold text-white"
                  >
                    AF
                  </div>
                  <div>
                    <p className="text-[16px] font-semibold text-ink">{MANAGER.name}</p>
                    <p className="mt-0.5 text-[15px] text-[#525252]">Replies within a day.</p>
                  </div>
                </div>
                <a
                  href={MAILTO}
                  className="mt-5 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-sage px-5 py-2.5 text-[14px] font-semibold text-ink transition-opacity hover:opacity-90"
                >
                  <ChatIcon />
                  Message {MANAGER.firstName}
                </a>
              </aside>

              {/* 6. Your documents */}
              <aside className={cardBase} style={cardPad}>
                <h2 className="text-[20px] font-semibold text-ink">Your documents</h2>
                <div className="mt-4">
                  {DOCUMENTS.map((d, i) => (
                    <a
                      key={d.label}
                      href={d.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-4 py-3 text-[15px] text-ink hover:text-ink/70"
                      style={i > 0 ? { borderTop: "1px solid #E5E5E5" } : undefined}
                    >
                      {d.label}
                      <span className="text-ink"><LineIcon name="download" /></span>
                    </a>
                  ))}
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>

      {/* Full bleed photo band */}
      <img width={2000} height={1333}
        src={loftPhoto}
        alt="Upstairs loft lounge with sectional sofa at The Sacramento Condo."
        loading="lazy"
        decoding="async"
        className="rh-band w-full object-cover"
        style={{ display: "block", objectPosition: "60% 65%" }}
      />

      </main>

      <Footer />
    </div>
  );
}

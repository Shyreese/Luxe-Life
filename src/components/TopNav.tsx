import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import type { Session } from "@supabase/supabase-js";
import logo from "../assets/logo.svg";
import { CloseIcon } from "./icons";
import { LEASE_PDF, MANAGER, MANAGER_MAILTO, PHONE, PROPERTY_NAME, RESIDENT } from "../data/mockData";
import { useNavigate } from "react-router";
import { supabase } from "../utils/supabase";

// Property listings surfaced in the Properties dropdown. The first is live; the
// second is coming soon and renders visibly disabled (no link).
const PROPERTIES = [
  { name: "The Sacramento Condo", status: "Available now", href: "/sacramento-condo" },
  { name: "The Oakland Home", status: "Coming soon", href: "/#homes" },
];


const ACCOUNT_ITEMS = [
  { label: "My stay", href: "/resident-hub" },
  { label: "View my lease", href: LEASE_PDF, newTab: true },
  { label: `Message ${MANAGER.firstName}`, href: MANAGER_MAILTO },
];

function AccountHeader({ accountName, accountProperty }: { accountName: string; accountProperty: string }) {
  return (
    <div className="px-4 pb-2.5 pt-2">
      <p className="text-[14px] font-semibold text-ink">{accountName}</p>
      {accountProperty && <p className="mt-0.5 text-[12px] text-muted">{accountProperty}</p>}
    </div>
  );
}

function AccountItems({
  onNavigate,
  onSignOut,
  signOutError,
  className,
}: {
  onNavigate: () => void;
  onSignOut: () => Promise<boolean>;
  signOutError: string;
  className: string;
}) {
  return (
    <>
      {ACCOUNT_ITEMS.map((i) => (
        <a
          key={i.label}
          href={i.href}
          onClick={onNavigate}
          className={className}
          {...("newTab" in i && i.newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {i.label}
        </a>
      ))}
      <hr className="my-1.5 border-0 border-t border-black/10" />
      <button type="button" onClick={() => void onSignOut()} className={`${className} w-full text-left`}>
        Sign out
      </button>
      {signOutError && <p role="alert" className="px-4 py-2 text-[12px] text-red-600">{signOutError}</p>}
    </>
  );
}

// Signed in account button with a dropdown card. Closes on outside click,
// Escape (focus returns to the button), or when focus leaves the menu.
function AccountMenu({
  idSuffix,
  accountName,
  accountProperty,
  onSignOut,
  signOutError,
}: {
  idSuffix: string;
  accountName?: string;
  accountProperty?: string;
  onSignOut: () => Promise<boolean>;
  signOutError: string;
}) {
  const displayName = accountName?.trim() || RESIDENT.fullName;
  const firstName = displayName.split(/\s+/)[0] || RESIDENT.firstName;
  const initials =
    displayName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || RESIDENT.initials;
  const displayProperty = accountProperty === undefined ? PROPERTY_NAME : accountProperty;
  const [menuOpen, setMenuOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuId = `account-menu-${idSuffix}`;

  async function handleSignOut(): Promise<boolean> {
    const didSignOut = await onSignOut();
    if (didSignOut) setMenuOpen(false);
    return didSignOut;
  }

  useEffect(() => {
    if (!menuOpen) return;
    function onDown(e: MouseEvent | TouchEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMenuOpen(false);
        btnRef.current?.focus();
      }
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <div
      ref={wrapRef}
      className="relative"
      onBlur={(e) => {
        if (!wrapRef.current?.contains(e.relatedTarget as Node | null)) setMenuOpen(false);
      }}
    >
      <button
        ref={btnRef}
        type="button"
        aria-expanded={menuOpen}
        aria-controls={menuId}
        aria-label={`Account menu for ${displayName}`}
        onClick={() => setMenuOpen((v) => !v)}
        className="tap-44 flex items-center gap-2 rounded-full"
      >
        <span
          aria-hidden="true"
          className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-terracotta text-[12px] font-semibold text-white"
        >
          {initials}
        </span>
        <span className="hidden text-[15px] text-ink/85 md:inline">{firstName}</span>
        <svg
          viewBox="0 0 12 12"
          className={`hidden h-3 w-3 text-ink/70 transition-transform md:block ${menuOpen ? "rotate-180" : ""}`}
          fill="none"
          aria-hidden="true"
        >
          <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {menuOpen && (
        <div id={menuId} className="absolute right-0 top-full z-50 pt-2">
          <div className="w-60 rounded-2xl border border-black/5 bg-white py-2 shadow-[0_8px_24px_rgba(0,0,0,0.10)]">
            <AccountHeader accountName={displayName} accountProperty={displayProperty} />
            <hr className="mb-1.5 border-0 border-t border-black/10" />
            <AccountItems
              onNavigate={() => setMenuOpen(false)}
              onSignOut={handleSignOut}
              signOutError={signOutError}
              className="block px-4 py-2.5 text-[14px] text-ink transition-colors hover:bg-cream focus-visible:bg-cream focus-visible:outline-offset-[-2px]"
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Shared TopNav. Built once on the Home page and copied verbatim to every
// later page. Do not restyle per page. `active` selects which item shows the
// sage pill treatment (Home by default, Properties on the product page, etc.).
export default function TopNav({
  active = "Home",
  signedIn = false,
  accountName,
  accountProperty,
}: {
  active?: string;
  signedIn?: boolean;
  accountName?: string;
  accountProperty?: string;
}) {
  const [open, setOpen] = useState(false);
  const [propsOpen, setPropsOpen] = useState(false); // desktop hover panel
  const [mobilePropsOpen, setMobilePropsOpen] = useState(false); // mobile in-place expand
  const toggleRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const propsWrapRef = useRef<HTMLDivElement>(null);
  const propsTriggerRef = useRef<HTMLButtonElement>(null);
  const focusFirstItem = useRef(false);
  const navigate = useNavigate();
  const [authSession, setAuthSession] = useState<Session | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [signOutError, setSignOutError] = useState("");

  useEffect(() => {
    let active = true;
    let receivedAuthUpdate = false;
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "INITIAL_SESSION" && !session) return;
      receivedAuthUpdate = true;
      if (active) {
        setAuthSession(session);
        setAuthChecked(true);
      }
    });

    void supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (!active || receivedAuthUpdate) return;
        if (error) {
          console.error("Could not check the signed-in account.", error);
        } else {
          setAuthSession(data.session);
        }
        setAuthChecked(true);
      })
      .catch((error: unknown) => {
        if (!active || receivedAuthUpdate) return;
        console.error("Could not check the signed-in account.", error);
        setAuthChecked(true);
      });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const accountSignedIn = signedIn || Boolean(authSession);
  const displayAccountName = accountName ?? authSession?.user.email ?? undefined;

  async function handleSignOut(): Promise<boolean> {
    setSignOutError("");
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/sign-in", { replace: true });
      return true;
    } catch (error) {
      console.error("Could not sign out.", error);
      setSignOutError("We could not sign you out. Please try again.");
      return false;
    }
  }

  function closeMobileMenu() {
    setOpen(false);
    toggleRef.current?.focus();
  }

  // Mobile menu: move focus in, trap Tab, close on Escape.
  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    dialog?.querySelector<HTMLElement>("button, a[href]")?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        closeMobileMenu();
        return;
      }
      if (e.key !== "Tab" || !dialog) return;
      const items = Array.from(
        dialog.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")
      );
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !dialog.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !dialog.contains(active))) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Properties dropdown: outside click and Escape close it.
  useEffect(() => {
    if (!propsOpen) return;
    if (focusFirstItem.current) {
      focusFirstItem.current = false;
      propsWrapRef.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus();
    }
    function onDown(e: MouseEvent | TouchEvent) {
      if (propsWrapRef.current && !propsWrapRef.current.contains(e.target as Node)) {
        setPropsOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setPropsOpen(false);
        propsTriggerRef.current?.focus();
      }
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [propsOpen]);

  function onTriggerKeyDown(e: ReactKeyboardEvent) {
    if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
      e.preventDefault();
      focusFirstItem.current = true;
      if (propsOpen) {
        propsWrapRef.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus();
      } else {
        setPropsOpen(true);
      }
    }
  }

  function onMenuKeyDown(e: ReactKeyboardEvent) {
    const items = Array.from(
      propsWrapRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []
    );
    const i = items.indexOf(document.activeElement as HTMLElement);
    let next = -1;
    if (e.key === "ArrowDown") next = (i + 1) % items.length;
    else if (e.key === "ArrowUp") next = (i - 1 + items.length) % items.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = items.length - 1;
    if (next >= 0) {
      e.preventDefault();
      items[next]?.focus();
    }
  }

  const propertiesActive = !accountSignedIn && active === "Properties";

  const links = [
    { label: "Home", href: "/" },
    { label: "Properties", dropdown: true }, // opens dropdown, does not navigate
    { label: "Partner with us", href: "/partnership" },
    ...(!authChecked || accountSignedIn ? [] : [{ label: "Sign in", href: "/sign-in" }]),
  ].map((l) => ({ ...l, active: authChecked && !accountSignedIn && l.label === active }));

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-black/5">
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-[1280px] items-center justify-between px-5 py-3.5 md:px-10"
      >
        {/* Logo */}
        <a href="/" className="flex items-center gap-3" aria-label="LuxeLife Properties home">
          <img width={74} height={74} src={logo} alt="LuxeLife Properties crest" className="h-11 w-11 object-contain" />
          <span className="flex flex-col leading-none">
            <span className="font-serif text-xl tracking-[0.25em] text-navy">LUXELIFE</span>
            <span className="mt-1 text-[11px] tracking-wide text-ink/65">
              Sacramento and Oakland, CA
            </span>
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden items-center gap-7 md:flex">
          {links.map((l) =>
            l.dropdown ? (
              <div
                key={l.label}
                ref={propsWrapRef}
                className="relative"
                onMouseEnter={() => setPropsOpen(true)}
                onMouseLeave={() => setPropsOpen(false)}
                onBlur={(e) => {
                  if (!propsWrapRef.current?.contains(e.relatedTarget as Node | null)) {
                    setPropsOpen(false);
                  }
                }}
              >
                <button
                  ref={propsTriggerRef}
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={propsOpen}
                  aria-controls="properties-menu"
                  onClick={() => setPropsOpen((v) => !v)}
                  onKeyDown={onTriggerKeyDown}
                  className={`tap-44 ${
                    propertiesActive
                      ? "rounded-full bg-sage px-4 py-1.5 text-[15px] font-medium text-ink"
                      : "text-[15px] text-ink/85 transition-colors hover:text-ink"
                  }`}
                >
                  {l.label}
                </button>
                {propsOpen && (
                  <div className="absolute left-0 top-full pt-2">
                    <div
                      id="properties-menu"
                      role="menu"
                      aria-label="Properties"
                      onKeyDown={onMenuKeyDown}
                      className="w-64 overflow-hidden rounded-2xl bg-white py-2 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                    >
                      {PROPERTIES.map((p) =>
                        p.href ? (
                          <a
                            key={p.name}
                            href={p.href}
                            role="menuitem"
                            onClick={() => setPropsOpen(false)}
                            className="block px-4 py-2.5 transition-colors hover:bg-cream focus-visible:outline-offset-[-2px]"
                          >
                            <span className="block text-[14px] font-semibold text-ink">{p.name}</span>
                            <span className="mt-0.5 block text-[12px] text-muted">{p.status}</span>
                          </a>
                        ) : (
                          <div
                            key={p.name}
                            aria-disabled="true"
                            className="block cursor-default px-4 py-2.5 opacity-50"
                          >
                            <span className="block text-[14px] font-semibold text-ink">{p.name}</span>
                            <span className="mt-0.5 block text-[12px] text-muted">{p.status}</span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : l.active ? (
              <a
                key={l.label}
                href={l.href}
                aria-current="page"
                className="tap-44 rounded-full bg-sage px-4 py-1.5 text-[15px] font-medium text-ink"
              >
                {l.label}
              </a>
            ) : (
              <a
                key={l.label}
                href={l.href}
                className="tap-44 text-[15px] text-ink/85 transition-colors hover:text-ink"
              >
                {l.label}
              </a>
            )
          )}
          {accountSignedIn && (
            <AccountMenu
              idSuffix="desktop"
              accountName={displayAccountName}
              accountProperty={accountProperty}
              onSignOut={handleSignOut}
              signOutError={signOutError}
            />
          )}
          {!authChecked && !signedIn && <span aria-hidden="true" className="w-16" />}
          <a href={PHONE.tel} className="tap-44 text-[15px] font-semibold text-ink">
            {PHONE.display}
          </a>
        </div>

        {/* Mobile account button and hamburger */}
        <div className="flex items-center gap-1 md:hidden">
          {accountSignedIn && (
            <AccountMenu
              idSuffix="mobile"
              accountName={displayAccountName}
              accountProperty={accountProperty}
              onSignOut={handleSignOut}
              signOutError={signOutError}
            />
          )}
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            aria-haspopup="dialog"
            aria-controls="mobile-menu"
            className="flex h-11 w-11 items-center justify-center"
          >
            <span className="relative block h-4 w-6">
              <span className="absolute left-0 top-0 h-0.5 w-6 bg-ink" />
              <span className="absolute left-0 top-1.5 h-0.5 w-6 bg-ink" />
              <span className="absolute left-0 top-3 h-0.5 w-6 bg-ink" />
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile full screen panel */}
      {open && (
        <div
          id="mobile-menu"
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-50 flex flex-col bg-white md:hidden"
        >
          <div className="flex items-center justify-between px-5 py-3.5">
            <a href="/" className="flex items-center gap-3">
              <img width={74} height={74} src={logo} alt="LuxeLife Properties crest" className="h-11 w-11 object-contain" />
              <span className="font-serif text-xl tracking-[0.25em] text-navy">LUXELIFE</span>
            </a>
            <button
              type="button"
              onClick={closeMobileMenu}
              aria-label="Close menu"
              className="flex h-11 w-11 items-center justify-center text-ink"
            >
              <CloseIcon className="h-6 w-6" />
            </button>
          </div>
          <div className="flex flex-col gap-1 px-5 py-6">
            {links.map((l) =>
              l.dropdown ? (
                <div key={l.label}>
                  <button
                    type="button"
                    aria-haspopup="true"
                    aria-expanded={mobilePropsOpen}
                    onClick={() => setMobilePropsOpen((v) => !v)}
                    className={`flex min-h-[44px] w-full items-center rounded-full px-4 text-left text-lg ${
                      propertiesActive ? "bg-sage font-medium text-ink" : "text-ink"
                    }`}
                  >
                    {l.label}
                  </button>
                  {mobilePropsOpen && (
                    <div className="mt-1 flex flex-col gap-1 pl-8">
                      {PROPERTIES.map((p) =>
                        p.href ? (
                          <a
                            key={p.name}
                            href={p.href}
                            onClick={() => setOpen(false)}
                            className="flex min-h-[44px] flex-col justify-center rounded-2xl px-4 py-2 transition-colors hover:bg-cream"
                          >
                            <span className="text-[14px] font-semibold text-ink">{p.name}</span>
                            <span className="mt-0.5 text-[12px] text-muted">{p.status}</span>
                          </a>
                        ) : (
                          <div
                            key={p.name}
                            aria-disabled="true"
                            className="flex min-h-[44px] cursor-default flex-col justify-center px-4 py-2 opacity-50"
                          >
                            <span className="text-[14px] font-semibold text-ink">{p.name}</span>
                            <span className="mt-0.5 text-[12px] text-muted">{p.status}</span>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`flex min-h-[44px] items-center rounded-full px-4 text-lg ${
                    l.active ? "bg-sage font-medium text-ink" : "text-ink"
                  }`}
                >
                  {l.label}
                </a>
              )
            )}
            {accountSignedIn && (
              <div className="mt-2 border-t border-black/10 pt-3">
                <AccountHeader
                  accountName={displayAccountName?.trim() || RESIDENT.fullName}
                  accountProperty={accountProperty === undefined ? PROPERTY_NAME : accountProperty}
                />
                <AccountItems
                  onNavigate={() => setOpen(false)}
                  onSignOut={async () => {
                    const didSignOut = await handleSignOut();
                    if (didSignOut) setOpen(false);
                    return didSignOut;
                  }}
                  signOutError={signOutError}
                  className="flex min-h-[44px] items-center rounded-full px-4 text-lg text-ink"
                />
              </div>
            )}
            {!authChecked && !signedIn && <span aria-hidden="true" className="h-11" />}
            <a
              href={PHONE.tel}
              className="mt-2 flex min-h-[44px] items-center px-4 text-lg font-semibold text-ink"
            >
              {PHONE.display}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

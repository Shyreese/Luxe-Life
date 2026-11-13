import { useEffect, useRef, useState, type ComponentType } from "react";
import { createBrowserRouter, Navigate, Outlet, useLocation, useNavigate } from "react-router";
import Home from "./pages/Home";
import { supabase } from "./utils/supabase";

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function scrollToHash(hash: string) {
  if (!hash) {
    window.scrollTo({ top: 0, left: 0 });
    return;
  }
  const el = document.getElementById(hash.slice(1));
  if (el) el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
}

function focusMain() {
  const main = document.getElementById("main");
  if (!main) return;
  main.focus({ preventScroll: true });
  main.scrollIntoView({ behavior: "auto" });
}

function RequireSession() {
  const location = useLocation();
  const [status, setStatus] = useState<"loading" | "signed-in" | "signed-out" | "error">("loading");

  useEffect(() => {
    let active = true;
    let receivedAuthEvent = false;
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      receivedAuthEvent = true;
      if (active) setStatus(session ? "signed-in" : "signed-out");
    });

    void supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (!active || receivedAuthEvent) return;
        setStatus(error ? "error" : data.session ? "signed-in" : "signed-out");
      })
      .catch(() => {
        if (active && !receivedAuthEvent) setStatus("error");
      });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <p className="text-[15px] text-body">Checking your session...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream px-5">
        <p role="alert" className="max-w-md text-center text-[15px] text-body">
          We could not verify your sign-in status. Please refresh the page and try again.
        </p>
      </div>
    );
  }

  if (status === "signed-out") {
    return (
      <Navigate
        to="/sign-in"
        replace
        state={{ from: location.pathname + location.search + location.hash }}
      />
    );
  }

  return <Outlet />;
}

// Root layout. Rather than rewrite every anchor across the pages, a single
// click interceptor routes internal links through react-router while leaving
// visual markup untouched. Anchor links such as /#homes navigate to the target
// page and then scroll to the anchor.
function Root() {
  const navigate = useNavigate();
  const location = useLocation();

  const lastPath = useRef(location.pathname);

  // After a route change, scroll to top and move focus to the page h1.
  useEffect(() => {
    if (lastPath.current === location.pathname) return;
    lastPath.current = location.pathname;
    window.scrollTo({ top: 0, left: 0 });
    const h1 = document.querySelector("h1");
    if (h1) {
      h1.setAttribute("tabindex", "-1");
      h1.focus({ preventScroll: true });
    }
  }, [location.pathname]);

  // After a route change carrying a hash, scroll to the target element.
  useEffect(() => {
    if (location.hash) {
      requestAnimationFrame(() => scrollToHash(location.hash));
    }
  }, [location.pathname, location.hash]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;
      const target = anchor.getAttribute("target");
      if (target && target !== "_self") return;
      // Leave tel, mailto, and external links to the browser.
      if (/^(tel:|mailto:|https?:)/i.test(href)) return;

      // Placeholder links (pages not built yet) do nothing.
      if (href === "#") {
        e.preventDefault();
        return;
      }

      // Same-page anchor.
      if (href.startsWith("#")) {
        e.preventDefault();
        scrollToHash(href);
        return;
      }

      const [beforeHash, hash] = href.split("#");
      const [rawPath, search] = beforeHash.split("?");
      const path = rawPath || "/";

      // Unknown paths fall through to react-router so the 404 page renders.
      if (!path.startsWith("/")) return;

      e.preventDefault();
      const fullHash = hash ? "#" + hash : "";
      const fullSearch = search ? "?" + search : "";
      if (path === location.pathname && !fullSearch) {
        scrollToHash(fullHash);
      } else {
        navigate(path + fullSearch + fullHash);
      }
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [navigate, location.pathname]);

  return (
    <>
      <a
        href="#main"
        onClick={(e) => {
          e.preventDefault();
          focusMain();
        }}
        className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-full bg-white px-5 py-3 text-[15px] font-semibold text-ink shadow-lg focus:translate-y-0"
      >
        Skip to content
      </a>
      <Outlet />
    </>
  );
}

// Pages other than Home load on demand. Router level lazy loading keeps the
// previous page on screen until the next chunk is ready, so route focus works.
function lazyPage(load: () => Promise<{ default: ComponentType }>) {
  return load().then((m) => ({ Component: m.default }));
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    HydrateFallback: () => null,
    children: [
      { index: true, Component: Home },
      { path: "sacramento-condo", lazy: () => lazyPage(() => import("./pages/Product")) },
      { path: "partnership", lazy: () => lazyPage(() => import("./pages/Partnership")) },
      { path: "inquiry", lazy: () => lazyPage(() => import("./pages/Inquiry")) },
      { path: "inquiry-received", lazy: () => lazyPage(() => import("./pages/InquiryReceived")) },
      { path: "sign-in", lazy: () => lazyPage(() => import("./pages/SignIn")) },
      {
        Component: RequireSession,
        children: [
          { path: "confirmed", lazy: () => lazyPage(() => import("./pages/Confirmed")) },
          { path: "walkthrough", lazy: () => lazyPage(() => import("./pages/Walkthrough")) },
          { path: "resident-hub", lazy: () => lazyPage(() => import("./pages/ResidentHub")) },
        ],
      },
      { path: "*", lazy: () => lazyPage(() => import("./pages/NotFound")) },
    ],
  },
]);

import TopNav from "../components/TopNav";
import AccentBar from "../components/AccentBar";
import Footer from "../components/Footer";

export default function NotFound() {
  return (
    <div className="flex min-h-full flex-col bg-white">
      <title>Page not found | LuxeLife Properties</title>
      <meta name="description" content="This page could not be found. Head back to the LuxeLife Properties home page." />
      <meta name="robots" content="noindex, nofollow" />
      <TopNav />
      <main id="main" tabIndex={-1} className="flex flex-1 items-center bg-cream">
        <div className="mx-auto w-full max-w-[1280px] px-5 py-20 md:px-10 md:py-28">
          <AccentBar />
          <p className="text-[13px] font-semibold text-muted-strong">Error 404</p>
          <h1 className="mt-2 text-[36px] font-bold leading-[1.08] tracking-[-1px] text-ink md:text-[48px]">
            We could not find that page
          </h1>
          <p className="mt-4 max-w-lg text-[17px] leading-relaxed text-body">
            The link may be out of date, or the page may have moved.
          </p>
          <a
            href="/"
            className="mt-8 inline-flex min-h-[44px] items-center justify-center rounded-full bg-sage px-8 py-3 text-[15px] font-semibold text-ink transition-opacity hover:opacity-90"
          >
            Go home
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
}

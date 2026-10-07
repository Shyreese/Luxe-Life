import logo from "../assets/logo.svg";

// Shared Footer. Built once on the Home page and copied verbatim to every
// later page. Do not restyle per page.
export default function Footer() {
  const columns = [
    {
      heading: "Explore",
      links: [
        { label: "Properties", href: "/#homes" }, // "Properties" in both nav and footer
        { label: "Partner with us", href: "/partnership" },
      ],
    },
    {
      heading: "Company",
      links: [
        { label: "About", href: "#" }, // Page not built yet. Intern to create.
        { label: "Contact", href: "#" }, // Page not built yet. Intern to create.
        { label: "FAQ", href: "/#faq" },
      ],
    },
    {
      heading: "Legal",
      links: [
        { label: "Privacy policy", href: "#" }, // Page not built yet. Intern to create.
        { label: "Terms of service", href: "#" }, // Page not built yet. Intern to create.
      ],
    },
  ];

  return (
    <footer data-focus-light className="bg-navy">
      <div className="mx-auto max-w-[1280px] px-5 py-14 md:px-10">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          {/* Brand */}
          <div className="max-w-xs">
            <div className="flex items-center gap-3">
              <img width={74} height={74} src={logo} alt="" className="h-12 w-12 object-contain" />
              <span role="img" aria-label="LuxeLife" className="font-serif text-2xl tracking-[0.25em] text-white">
                LUXELIFE
              </span>
            </div>
            <p className="mt-5 text-[15px] leading-relaxed text-white/60">
              Furnished homes for 30+ day stays in Sacramento and Oakland.
            </p>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 md:gap-20">
            {columns.map((col) => (
              <nav key={col.heading} aria-label={col.heading}>
                <p className="text-sm font-medium text-terracotta-light">{col.heading}</p>
                <ul className="mt-4">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        className="flex min-h-11 items-center text-[15px] text-white/70 transition-colors hover:text-white"
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <hr className="my-8 border-white/10" />
        <p className="text-[13px] text-white/60">
          {new Date().getFullYear()} LuxeLife Properties. All rights reserved. Sacramento and Oakland, CA.
        </p>
      </div>
    </footer>
  );
}

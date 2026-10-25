import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Brand } from "@/components/common/Brand";
import { NAV, scrollToSection } from "@/lib/constants";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 20);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      {/* Top Diwali Campaign Announcement Banner */}
      <div className="bg-gradient-to-r from-amber-700 via-primary to-amber-700 text-primary-foreground px-3 py-1.5 sm:px-4 sm:py-2 text-center text-xs sm:text-sm font-medium shadow-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden="true" className="shrink-0 text-sm">🪔</span>
            <span>
              <strong className="text-amber-200 font-bold">This Diwali:</strong>{" "}
              <span className="hidden sm:inline">Light up the lives of the destitute! Find genuinely run care homes in your district &amp; support directly with monetary or material aid.</span>
              <span className="sm:hidden">Light up lives of the destitute across Tamil Nadu!</span>
            </span>
          </span>
          <a
            href="#directory"
            onClick={(e) => scrollToSection("directory", e)}
            className="inline-flex items-center gap-1 font-bold underline underline-offset-4 hover:text-amber-200 transition-colors whitespace-nowrap cursor-pointer text-xs sm:text-sm shrink-0 ml-1"
          >
            Find Homes &rarr;
          </a>
        </div>
      </div>

      <div
        className={`transition-all duration-300 ${
          scrolled
            ? "border-b bg-background/95 py-2 backdrop-blur shadow-xs"
            : "bg-background/90 backdrop-blur-sm py-2.5 sm:py-3.5"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-5 lg:px-8">
          <Brand />
          <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
            {NAV.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                onClick={(e) => scrollToSection(n.id, e)}
                className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary cursor-pointer"
              >
                {n.label}
              </a>
            ))}
            <a
              href="#directory"
              onClick={(e) => scrollToSection("directory", e)}
              className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 cursor-pointer shadow-xs"
            >
              Orphan Homes
            </a>
          </nav>
          <button
            type="button"
            className="lg:hidden p-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 rounded-lg cursor-pointer"
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <X aria-hidden="true" className="h-6 w-6" /> : <Menu aria-hidden="true" className="h-6 w-6" />}
          </button>
        </div>
      </div>
      {open && (
        <nav aria-label="Mobile" className="border-t bg-background px-5 py-4 lg:hidden">
          {NAV.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              onClick={(e) => {
                setOpen(false);
                scrollToSection(n.id, e);
              }}
              className="block py-2.5 font-medium cursor-pointer"
            >
              {n.label}
            </a>
          ))}
          <a
            href="#directory"
            onClick={(e) => {
              setOpen(false);
              scrollToSection("directory", e);
            }}
            className="mt-3 block rounded-full bg-primary py-3 text-center font-semibold text-primary-foreground cursor-pointer"
          >
            Orphan Homes
          </a>
        </nav>
      )}
    </header>
  );
}

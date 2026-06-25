"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CALENDLY_URL, NAV_LINKS, SITE_NAME } from "@/lib/site";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 100);
      // Hide when scrolling down (past the header height), show when scrolling up
      if (y > lastY && y > 120) {
        setHidden(true);
      } else if (y < lastY) {
        setHidden(false);
      }
      lastY = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Top bar. The scroll-hide transform lives HERE, not on the <header>:
          a transformed ancestor becomes the containing block for position:
          fixed children, which would otherwise trap the mobile menu inside the
          bar's height instead of letting it cover the viewport. */}
      <div
        className={[
          "transition-transform transition-colors duration-300 ease-in-out",
          hidden && !open ? "-translate-y-full" : "translate-y-0",
          scrolled || open
            ? "bg-onyx border-b border-brick"
            : "bg-transparent border-b border-transparent",
        ].join(" ")}
      >
        <div className="w-full max-w-[1600px] mx-auto px-6 md:px-10 flex h-20 md:h-24 items-center justify-between gap-4">
          <div className="flex items-center gap-6 2xl:gap-10 min-w-0">
            <Link
              href="/#home"
              className="h-display text-[20px] md:text-[22px] text-smoke tracking-[0.04em] shrink-0"
              onClick={() => setOpen(false)}
            >
              {SITE_NAME}
            </Link>

            <nav className="hidden xl:flex items-center gap-4 2xl:gap-6">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[11px] uppercase tracking-[0.08em] text-smoke hover:text-brick transition-colors whitespace-nowrap"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="hidden xl:block shrink-0">
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary text-[12px] whitespace-nowrap"
            >
              Book Free Intro Session
            </a>
          </div>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="xl:hidden p-2 -mr-2 text-smoke"
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <div className="w-6 h-4 relative">
              <span
                className={[
                  "absolute left-0 right-0 h-[2px] bg-smoke transition-all duration-300",
                  open ? "top-1/2 rotate-45 -translate-y-1/2" : "top-0",
                ].join(" ")}
              />
              <span
                className={[
                  "absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-smoke transition-all duration-200",
                  open ? "opacity-0" : "opacity-100",
                ].join(" ")}
              />
              <span
                className={[
                  "absolute left-0 right-0 h-[2px] bg-smoke transition-all duration-300",
                  open ? "top-1/2 -rotate-45 -translate-y-1/2" : "bottom-0",
                ].join(" ")}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu backdrop — dims the page behind the dropdown and closes
          the menu on tap. */}
      <div
        aria-hidden
        onClick={() => setOpen(false)}
        className={[
          "xl:hidden fixed inset-0 top-20 md:top-24 bg-black/70 transition-opacity duration-300",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
      />

      {/* Mobile dropdown — slides down from the header with every nav item.
          Caps its height to the viewport and scrolls if the list is long. */}
      <div
        className={[
          "xl:hidden fixed left-0 right-0 top-20 md:top-24 bg-onyx border-b border-brick transition-all duration-300 ease-out",
          open
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-3 pointer-events-none",
        ].join(" ")}
      >
        <nav className="flex flex-col px-6 max-h-[calc(100dvh_-_5rem)] md:max-h-[calc(100dvh_-_6rem)] overflow-y-auto overscroll-contain">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="border-b border-white/10 py-4 text-sm uppercase tracking-[0.12em] text-smoke hover:text-brick transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="btn btn-primary my-5"
          >
            Book Free Intro Session
          </a>
        </nav>
      </div>
    </header>
  );
}

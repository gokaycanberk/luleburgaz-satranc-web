"use client";

import { useState, useEffect } from "react";
import { NAV_LINKS, SCHOOL } from "@/lib/data";
import BrandMark from "./BrandMark";
import clsx from "clsx";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <nav
      className={clsx(
        "fixed top-0 inset-x-0 z-[100] transition-all duration-300",
        scrolled
          ? "bg-paper/85 backdrop-blur-xl backdrop-saturate-150 border-b border-line-soft"
          : "bg-transparent border-b border-transparent"
      )}
    >
      {/* Minimal vertical pad so crest can read larger */}
      <div className="container-lg flex items-center justify-between gap-4 py-1.5 md:py-2">
        <a href="#top" className="flex items-center gap-2.5 min-w-0 -my-0.5">
          <BrandMark
            size={50}
            priority
            bordered={false}
            className={clsx(
              "md:!h-[54px] md:!w-[54px] shadow-[0_6px_18px_-8px_rgba(0,0,0,0.4)]",
              scrolled ? "ring-1 ring-line-soft" : "ring-1 ring-paper/25"
            )}
          />
          <div className="leading-[1.15] hidden sm:block min-w-0">
            <div
              className={clsx(
                "font-mono text-[14px] md:text-[15px] tracking-[0.02em] uppercase truncate transition-colors",
                scrolled ? "text-ink" : "text-paper"
              )}
            >
              {SCHOOL.shortName}
            </div>
            <div
              className={clsx(
                "font-mono text-[12px] md:text-[13px] tracking-[0.04em] uppercase transition-colors",
                scrolled ? "text-ink-3" : "text-paper/65"
              )}
            >
              Satranç Spor Kulübü
            </div>
          </div>
        </a>

        <div className="hidden lg:flex gap-7 xl:gap-8 items-center">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={clsx(
                "text-[15px] font-medium transition-colors",
                scrolled
                  ? "text-ink-2 hover:text-bordo"
                  : "text-paper/85 hover:text-paper"
              )}
            >
              {l.label}
            </a>
          ))}
        </div>

        <a
          href="#iletisim"
          className={clsx(
            "btn px-4 py-2.5 text-[15px] shrink-0",
            scrolled
              ? "btn-primary"
              : "bg-paper text-ink hover:bg-bordo hover:text-paper"
          )}
        >
          <span className="hidden sm:inline">Ücretsiz Deneme Dersi</span>
          <span className="sm:hidden">Deneme</span>
          <span className="arrow-hover">→</span>
        </a>
      </div>
    </nav>
  );
}

"use client";

import { useState, useEffect } from "react";
import { NAV_LINKS, SCHOOL } from "@/lib/data";
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
      <div className="container-lg flex items-center justify-between py-4">
        <a href="#top" className="flex items-center gap-3">
          <span className="font-serif italic text-[32px] leading-[0.9] text-ink">L</span>
          <span className="text-[24px] leading-[0.9] text-bordo">♞</span>
          <div className="ml-1.5 leading-tight hidden sm:block">
            <div className="text-[13px] font-semibold -tracking-[0.01em]">{SCHOOL.shortName}</div>
            <div className="text-[10px] font-mono text-ink-3 tracking-[0.12em] uppercase">
              Satranç Spor Okulu
            </div>
          </div>
        </a>

        <div className="hidden lg:flex gap-8 items-center">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[13px] font-medium text-ink-2 hover:text-bordo transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>

        <a href="#iletisim" className="btn btn-primary px-4 py-2.5 text-[13px]">
          <span className="hidden sm:inline">Ücretsiz Deneme Dersi</span>
          <span className="sm:hidden">Deneme</span>
          <span className="arrow-hover">→</span>
        </a>
      </div>
    </nav>
  );
}

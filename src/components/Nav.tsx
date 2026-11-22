"use client";

import { useEffect, useState } from "react";
import { NAV_LINKS, SCHOOL } from "@/lib/data";
import BrandMark from "./BrandMark";
import clsx from "clsx";

/** Hero içinde menüyü gizlemeye başlama eşiği (px). */
const HERO_HIDE_AFTER = 120;

export default function Nav() {
  const [pastHero, setPastHero] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const heroEnd = () => Math.max(window.innerHeight * 0.85, 520);

    const update = () => {
      const y = Math.max(0, window.scrollY);
      const end = heroEnd();
      const inHero = y < end;
      setPastHero(!inHero);

      if (menuOpen) {
        setHidden(false);
        lastY = y;
        ticking = false;
        return;
      }

      const delta = y - lastY;

      // Hero üstü: her zaman görünür, şeffaf (arka plan yok)
      if (y < HERO_HIDE_AFTER) {
        setHidden(false);
      } else if (delta > 6) {
        // Aşağı: doğrudan kaybol — hero’da arka plan basmadan
        setHidden(true);
      } else if (delta < -6) {
        // Yukarı: yumuşak belir
        setHidden(false);
      }

      lastY = y;
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  // Sadece hero bittikten sonra (veya menü açıkken) kağıt zemin + koyu metin
  const onLight = pastHero || menuOpen;

  return (
    <>
      <nav
        className={clsx(
          "fixed top-0 inset-x-0 z-[200] ease-out",
          // Hide/show: sadece opacity + translate — arka plan ayrı, flaş olmasın
          "transition-[opacity,transform] duration-[380ms]",
          hidden && !menuOpen
            ? "opacity-0 -translate-y-3 pointer-events-none"
            : "opacity-100 translate-y-0",
          onLight
            ? "bg-paper/95 backdrop-blur-md border-b border-line-soft"
            : "bg-transparent border-b border-transparent"
        )}
        style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
      >
        <div
          className="container-lg flex items-center justify-between gap-4"
          style={{
            paddingTop: "max(0.85rem, env(safe-area-inset-top))",
            paddingBottom: "0.85rem",
          }}
        >
          <a
            href="/#top"
            className="flex items-center gap-2.5 min-w-0"
            onClick={() => setMenuOpen(false)}
          >
            <BrandMark
              size={50}
              priority
              bordered={false}
              className={clsx(
                "md:!h-[54px] md:!w-[54px] shadow-[0_6px_18px_-8px_rgba(0,0,0,0.4)] transition-[box-shadow,ring-color] duration-300",
                onLight ? "ring-1 ring-line-soft" : "ring-1 ring-paper/25"
              )}
            />
            <div className="leading-[1.15] hidden sm:block min-w-0">
              <div
                className={clsx(
                  "font-mono text-[16px] md:text-[18px] tracking-[0.02em] uppercase truncate transition-colors duration-300",
                  onLight ? "text-ink" : "text-paper"
                )}
              >
                {SCHOOL.shortName}
              </div>
              <div
                className={clsx(
                  "font-mono text-[13px] md:text-[15px] tracking-[0.04em] uppercase transition-colors duration-300",
                  onLight ? "text-ink-2" : "text-paper/90"
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
                  "text-[19px] font-medium transition-colors duration-300",
                  onLight
                    ? "text-ink hover:text-bordo"
                    : "text-paper/90 hover:text-paper"
                )}
              >
                {l.label}
              </a>
            ))}
          </div>

          <button
            type="button"
            className={clsx(
              "lg:hidden relative z-[210] flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors duration-300",
              onLight ? "text-ink" : "text-paper"
            )}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Menüyü kapat" : "Menüyü aç"}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="sr-only">{menuOpen ? "Kapat" : "Menü"}</span>
            <span className="relative block h-[14px] w-5" aria-hidden>
              <span
                className={clsx(
                  "absolute left-0 block h-[1.5px] w-full rounded-full bg-current transition-all duration-300 origin-center",
                  menuOpen ? "top-[6px] rotate-45" : "top-0"
                )}
              />
              <span
                className={clsx(
                  "absolute left-0 top-[6px] block h-[1.5px] w-full rounded-full bg-current transition-opacity duration-200",
                  menuOpen && "opacity-0"
                )}
              />
              <span
                className={clsx(
                  "absolute left-0 block h-[1.5px] w-full rounded-full bg-current transition-all duration-300 origin-center",
                  menuOpen ? "top-[6px] -rotate-45" : "top-[12px]"
                )}
              />
            </span>
          </button>
        </div>
      </nav>

      <div
        id="mobile-nav"
        className={clsx(
          "lg:hidden fixed inset-0 z-[190] bg-paper transition-[opacity,visibility] duration-300 ease-out",
          menuOpen
            ? "opacity-100 visible pointer-events-auto"
            : "opacity-0 invisible pointer-events-none"
        )}
        style={{
          paddingTop: "calc(4.25rem + env(safe-area-inset-top))",
        }}
      >
        <div className="container-lg flex h-full flex-col gap-1 overflow-y-auto pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-2">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="rounded-xl px-3 py-4 text-[20px] font-medium text-ink border-b border-line-soft last:border-b-0 hover:text-bordo transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </>
  );
}

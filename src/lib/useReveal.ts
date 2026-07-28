"use client";

import { useEffect, useRef } from "react";

export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Never leave content stuck at opacity:0 (HMR / IO edge cases)
    const fallback = window.setTimeout(() => {
      el.classList.add("visible");
    }, 800);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("visible");
      clearTimeout(fallback);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
            clearTimeout(fallback);
          }
        });
      },
      { threshold: 0.01, rootMargin: "40px 0px" }
    );
    io.observe(el);
    return () => {
      clearTimeout(fallback);
      io.disconnect();
    };
  }, []);
  return ref;
}

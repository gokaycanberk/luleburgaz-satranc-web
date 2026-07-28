"use client";

import { STATS } from "@/lib/data";
import { useReveal } from "@/lib/useReveal";

export default function StatsBar() {
  const ref = useReveal<HTMLElement>();
  return (
    <section ref={ref} className="fade-in bg-ink text-paper">
      <div className="container-lg grid grid-cols-2 lg:grid-cols-4">
        {STATS.map((s, i) => (
          <div
            key={i}
            className="py-14 px-6 md:px-8 flex flex-col gap-3"
            style={{
              borderLeft: i > 0 ? "1px solid rgba(245,242,234,0.12)" : undefined,
            }}
          >
            <div className="font-serif leading-[0.9] tracking-tighterish text-[64px] md:text-[84px]">
              {s.num}
            </div>
            <div className="font-mono text-[11px] tracking-[0.14em] uppercase text-gold-soft">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import { COACHES, type Coach } from "@/lib/data";
import { SectionHead, FIDEBadge } from "./Primitives";

const TONES = ["#DDD5C0", "#C9BFA5", "#D6CCB6", "#CFC4A8"];

export default function Coaches() {
  return (
    <section id="egitmenler" className="py-24 bg-paper-2 mt-16">
      <div className="container-lg">
        <SectionHead
          num="03"
          eyebrow="Eğitmen Kadrosu"
          title={
            <>
              FIDE ünvanlı <em className="italic font-serif">antrenörler.</em>
            </>
          }
          subtitle="Her biri Türkiye Satranç Federasyonu tarafından lisanslı, uluslararası turnuva tecrübesi olan eğitmenler."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6">
          {COACHES.map((c, i) => (
            <CoachCard key={c.name} coach={c} idx={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CoachCard({ coach, idx }: { coach: Coach; idx: number }) {
  const [hover, setHover] = useState(false);
  const initials = coach.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="bg-paper border border-line-soft overflow-hidden flex flex-col max-w-full"
    >
      <div
        className="relative w-full overflow-hidden flex items-center justify-center"
        style={{
          aspectRatio: "4 / 5",
          background: TONES[idx % TONES.length],
          maxHeight: 360,
        }}
      >
        <div
          className="font-serif italic text-ink transition-transform duration-500 select-none"
          style={{
            fontSize: "clamp(64px, 12vw, 96px)",
            opacity: 0.32,
            transform: hover ? "scale(1.05)" : "scale(1)",
          }}
          aria-hidden
        >
          {initials}
        </div>
        <div className="absolute top-3 right-3 z-10">
          <FIDEBadge title={coach.fide} />
        </div>
      </div>

      <div className="px-4 py-4 md:px-5 md:py-4 flex flex-col">
        <div className="font-serif text-[22px] md:text-[24px] leading-[1.1] mb-1 -tracking-[0.01em]">
          {coach.name}
        </div>
        <div className="font-mono text-[10px] text-bordo tracking-[0.12em] uppercase mb-1.5">
          {coach.role}
        </div>
        <div className="font-mono text-[10px] text-ink-4 tracking-[0.08em] mb-3">
          ELO {coach.rating}
        </div>
        <p className="text-[13px] leading-[1.5] text-ink-2 mb-3 line-clamp-4">
          {coach.bio}
        </p>
        <div className="font-mono text-[11px] text-ink-4 pt-3 border-t border-line-soft">
          {coach.years} yıl deneyim
        </div>
      </div>
    </div>
  );
}

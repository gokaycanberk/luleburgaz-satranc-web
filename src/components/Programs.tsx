"use client";

import Image from "next/image";
import { PROGRAMS, type Program } from "@/lib/data";
import { SectionHead } from "./Primitives";

type ProgramMedia = {
  src: string;
  /** contain = poster/graphic; cover = photo */
  mode: "contain" | "cover";
};

/** Atmospheric local covers for program cards (presentation only — data untouched). */
const PROGRAM_IMAGES: ProgramMedia[] = [
  { src: "/program-bireysel.jpg", mode: "cover" },
  { src: "/instagram/C4nVMTCo4yr/cover.jpg", mode: "cover" },
  { src: "/instagram/Ctpg2t9oJlP/cover.webp", mode: "cover" },
  { src: "/program-turnuva.jpg", mode: "cover" },
  { src: "/instagram/C8Esb6HICfq/cover.jpg", mode: "cover" },
  { src: "/instagram/DZZ8JPJlw8N/cover.jpg", mode: "cover" },
];

export default function Programs() {
  return (
    <section id="programlar" className="py-16 md:py-20">
      <div className="container-lg">
        <SectionHead
          num="02"
          eyebrow="Programlar"
          title={<>Programlarımız.</>}
          subtitle="Öğrencinin yaşı, seviyesi ve hedefine göre tasarlanmış eğitim yapıları. Hepsi aynı akademik disipline dayanır."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {PROGRAMS.map((p, i) => (
            <ProgramCard
              key={p.num}
              program={p}
              media={PROGRAM_IMAGES[i % PROGRAM_IMAGES.length]}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProgramCard({
  program,
  media,
}: {
  program: Program;
  media: ProgramMedia;
}) {
  const { num, title, body, level } = program;
  const isPoster = media.mode === "contain";

  return (
    <div className="group flex flex-col min-w-0 border border-line-soft overflow-hidden bg-paper hover:bg-paper-2 transition-colors">
      <div
        className={`relative w-full overflow-hidden border-b border-line-soft h-[190px] md:h-[210px] lg:h-[220px] ${
          isPoster ? "bg-paper-2" : "bg-paper-3"
        }`}
      >
        <div className={`absolute inset-0 ${isPoster ? "p-2.5" : ""}`}>
          <div className="relative h-full w-full overflow-hidden">
            <Image
              src={media.src}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className={`transition-transform duration-500 group-hover:scale-[1.03] ${
                isPoster
                  ? "object-contain object-center"
                  : "object-cover object-[center_20%]"
              }`}
            />
          </div>
        </div>
        <div className="absolute top-2.5 left-2.5 z-10 font-mono text-[11px] text-ink tracking-[0.14em] bg-paper/90 px-2 py-1 border border-line-soft">
          / {num}
        </div>
      </div>

      <div className="flex flex-col px-5 pt-4 pb-5 md:px-5 md:pt-4 md:pb-6">
        <div className="font-mono text-[10px] text-ink-4 tracking-[0.12em] uppercase mb-1.5">
          {level}
        </div>

        <h3 className="font-serif text-[26px] md:text-[28px] leading-[1.12] mb-2 -tracking-[0.01em]">
          {title}
        </h3>

        <p className="text-sm leading-[1.55] text-ink-2 line-clamp-3">{body}</p>
      </div>
    </div>
  );
}

"use client";

import { ReactNode } from "react";
import { useReveal } from "@/lib/useReveal";
import clsx from "clsx";

export function Eyebrow({ num, children }: { num?: string; children: ReactNode }) {
  return (
    <div className="eyebrow">
      <span className="eyebrow-dot" />
      {num && <span className="mr-3 text-ink-4">{num}</span>}
      {children}
    </div>
  );
}

export function SectionHead({
  num,
  eyebrow,
  title,
  subtitle,
  align = "left",
}: {
  num?: string;
  eyebrow: string;
  title: ReactNode;
  subtitle?: string;
  align?: "left" | "center";
}) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={clsx(
        "fade-in mb-14",
        align === "center" && "max-w-[720px] mx-auto text-center"
      )}
    >
      <Eyebrow num={num}>{eyebrow}</Eyebrow>
      <h2 className="font-serif mt-5 leading-[1.02] tracking-tighterish text-[40px] md:text-[56px] lg:text-[72px]">
        {title}
      </h2>
      {subtitle && (
        <p
          className={clsx(
            "mt-5 text-lg leading-[1.55] text-ink-2 max-w-[640px]",
            align === "center" && "mx-auto"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function FIDEBadge({ title }: { title: string }) {
  const filled = title === "GM" || title === "WGM";
  return (
    <span
      className={clsx(
        "inline-block px-2 py-[3px] font-mono text-[10px] font-medium tracking-[0.1em] rounded-[3px]",
        filled ? "bg-bordo text-paper border-none" : "bg-transparent text-bordo border border-bordo"
      )}
    >
      {title}
    </span>
  );
}

export function CornerCoords() {
  const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
  return (
    <div className="absolute top-6 right-6 font-mono text-[10px] text-ink-4 tracking-[0.2em] pointer-events-none opacity-50">
      {files.join(" ")}
    </div>
  );
}

export function MiniBoard({ size = 200 }: { size?: number }) {
  const sq = size / 8;
  const cells = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const light = (r + c) % 2 === 0;
      cells.push(
        <div
          key={`${r}-${c}`}
          style={{
            width: sq,
            height: sq,
            background: light ? "#EBE6D8" : "#3A362E",
          }}
        />
      );
    }
  }
  return (
    <div
      className="border border-line-soft"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(8, ${sq}px)`,
        width: size,
        height: size,
      }}
    >
      {cells}
    </div>
  );
}

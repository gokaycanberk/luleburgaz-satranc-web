"use client";

import { useState } from "react";
import { FAQ_ITEMS } from "@/lib/data";
import { SectionHead } from "./Primitives";

export default function FAQ() {
  const [open, setOpen] = useState<number>(0);

  return (
    <section id="sss" className="py-24">
      <div className="container-narrow">
        <SectionHead
          num="08"
          eyebrow="Sıkça Sorulan Sorular"
          title={
            <>
              Öncesinde bilinmesi <em className="italic font-serif">gerekenler.</em>
            </>
          }
          align="center"
        />

        <div className="border-t border-line">
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} className="border-b border-line-soft">
              <button
                onClick={() => setOpen(open === i ? -1 : i)}
                className="w-full flex justify-between items-center py-7 text-left"
                aria-expanded={open === i}
              >
                <span
                  className="font-serif text-[22px] md:text-[24px] leading-[1.2] pr-10 -tracking-[0.01em] transition-colors"
                  style={{ color: open === i ? "#7A1E1E" : "#141311" }}
                >
                  {item.q}
                </span>
                <span
                  className="font-mono text-[22px] text-ink-3 flex-shrink-0 transition-transform duration-300"
                  style={{ transform: open === i ? "rotate(45deg)" : "rotate(0)" }}
                >
                  +
                </span>
              </button>
              <div
                className="overflow-hidden transition-all duration-400 ease-in-out"
                style={{ maxHeight: open === i ? 320 : 0 }}
              >
                <p className="text-base leading-[1.65] text-ink-2 pb-7 max-w-[720px]">
                  {item.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

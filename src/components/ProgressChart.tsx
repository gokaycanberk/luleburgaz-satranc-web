"use client";

import { useReveal } from "@/lib/useReveal";
import { PROGRESS_DATA } from "@/lib/data";
import { Eyebrow } from "./Primitives";
import SectionBackdrop from "./SectionBackdrop";

export default function ProgressChart() {
  const ref = useReveal<HTMLDivElement>();

  const w = 700, h = 320, padL = 50, padR = 30, padT = 30, padB = 40;
  const xMax = 24, yMin = 900, yMax = 1700;
  const xScale = (x: number) => padL + (x / xMax) * (w - padL - padR);
  const yScale = (y: number) => padT + ((yMax - y) / (yMax - yMin)) * (h - padT - padB);

  const path = PROGRESS_DATA
    .map((d, i) => `${i === 0 ? "M" : "L"} ${xScale(d.m)} ${yScale(d.r)}`)
    .join(" ");
  const areaPath = path + ` L ${xScale(xMax)} ${h - padB} L ${xScale(0)} ${h - padB} Z`;

  return (
    <section className="relative py-16 md:py-20 bg-paper-2 overflow-hidden">
      <SectionBackdrop src="/c4.jpg" strength={0.16} position="center" />
      <div className="container-lg relative z-[1]">
        <div
          ref={ref}
          className="fade-in grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-16 lg:gap-20 items-center"
        >
          <div>
            <Eyebrow num="04">Bir öğrencinin yolculuğu</Eyebrow>
            <h2 className="font-serif text-[44px] md:text-[56px] leading-[1.02] tracking-tighterish mt-5">
              <em className="italic font-serif">İki yılda</em>
              <br />
              +582 reyting.
            </h2>
            <p className="text-base leading-[1.6] text-ink-2 mt-6">
              Can D. (15 yaş), 2024 yazında bizde başladı. Son iki yıllık eğitim ve turnuva
              döneminde 1000 Elo&apos;dan 1582 Elo&apos;ya yükseldi. Bu gelişim, kulübün eğitim
              standardını ve sporcunun disiplinini gösteriyor.
            </p>
            <div className="mt-8 flex gap-10 pt-6 border-t border-line-soft">
              <div>
                <div className="font-serif text-[40px] leading-none">+582</div>
                <div className="font-mono text-[10px] text-ink-3 tracking-[0.12em] mt-1.5">
                  İKİ YILLIK ARTIŞ
                </div>
              </div>
              <div>
                <div className="font-serif text-[40px] leading-none">+291</div>
                <div className="font-mono text-[10px] text-ink-3 tracking-[0.12em] mt-1.5">
                  YILLIK ORTALAMA
                </div>
              </div>
            </div>
          </div>

          <div className="bg-paper p-6 md:p-8 border border-line-soft">
            <div className="flex justify-between mb-5">
              <div className="font-mono text-[11px] tracking-[0.12em] text-ink-3">
                REYTİNG · CAN D.
              </div>
              <div className="font-mono text-[11px] tracking-[0.12em] text-ink-3">
                2024 — 2026
              </div>
            </div>
            <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto">
              {[1000, 1200, 1400, 1600].map((y) => (
                <g key={y}>
                  <line
                    x1={padL}
                    y1={yScale(y)}
                    x2={w - padR}
                    y2={yScale(y)}
                    stroke="rgba(20,19,17,0.12)"
                    strokeWidth="1"
                  />
                  <text
                    x={padL - 8}
                    y={yScale(y) + 3}
                    fontSize="10"
                    fontFamily="var(--font-mono)"
                    fill="#9A9384"
                    textAnchor="end"
                  >
                    {y}
                  </text>
                </g>
              ))}
              {[0, 6, 12, 18, 24].map((x) => (
                <text
                  key={x}
                  x={xScale(x)}
                  y={h - padB + 18}
                  fontSize="10"
                  fontFamily="var(--font-mono)"
                  fill="#9A9384"
                  textAnchor="middle"
                >
                  {x === 0 ? "BAŞLANGIÇ" : `${x}. AY`}
                </text>
              ))}
              <defs>
                <linearGradient id="areaGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#7A1E1E" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#7A1E1E" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={areaPath} fill="url(#areaGrad)" />
              <path
                d={path}
                fill="none"
                stroke="#7A1E1E"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {PROGRESS_DATA.map((d, i) => (
                <circle
                  key={i}
                  cx={xScale(d.m)}
                  cy={yScale(d.r)}
                  r={i === PROGRESS_DATA.length - 1 ? 5 : 3}
                  fill={i === PROGRESS_DATA.length - 1 ? "#7A1E1E" : "#F5F2EA"}
                  stroke="#7A1E1E"
                  strokeWidth="1.5"
                />
              ))}
              <text
                x={xScale(24) - 4}
                y={yScale(1582) - 12}
                fontSize="14"
                fontFamily="var(--font-instrument-serif)"
                fill="#141311"
                fontStyle="italic"
                textAnchor="end"
              >
                1582
              </text>
            </svg>
            <p className="text-sm leading-[1.6] text-ink-2 mt-5">
              1000 Elo&apos;dan 1582 Elo&apos;ya kararlı bir çizgiyle yükselmek, temel düzeyden
              turnuva düzeyine geçişin somut göstergesi. Bu sonuç; açılış repertuarı, oyun
              ortası, taktik çalışması ve antrenör gözetimindeki düzenli analizle geldi.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

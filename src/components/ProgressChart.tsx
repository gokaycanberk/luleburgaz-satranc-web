"use client";

import { useReveal } from "@/lib/useReveal";
import { PROGRESS_DATA } from "@/lib/data";
import { Eyebrow } from "./Primitives";
import SectionBackdrop from "./SectionBackdrop";

export default function ProgressChart() {
  const ref = useReveal<HTMLDivElement>();

  const w = 700, h = 320, padL = 50, padR = 30, padT = 30, padB = 40;
  const xMax = 24, yMin = 800, yMax = 1700;
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
              +770 reyting.
            </h2>
            <p className="text-base leading-[1.6] text-ink-2 mt-6">
              Ege D. (11 yaş), 2023 yazında bize başladı. Bireysel ders + turnuva kampı
              programıyla iki yılda 850&apos;den 1620&apos;ye yükseldi — Trakya bölge U12
              şampiyonu. Bu bizim ortalama öğrenci gelişimimizi temsil ediyor.
            </p>
            <div className="mt-8 flex gap-10 pt-6 border-t border-line-soft">
              <div>
                <div className="font-serif text-[40px] leading-none">+320</div>
                <div className="font-mono text-[10px] text-ink-3 tracking-[0.12em] mt-1.5">
                  ORT. YILLIK ARTIŞ
                </div>
              </div>
              <div>
                <div className="font-serif text-[40px] leading-none">%92</div>
                <div className="font-mono text-[10px] text-ink-3 tracking-[0.12em] mt-1.5">
                  YIL SONU KATILIM
                </div>
              </div>
            </div>
          </div>

          <div className="bg-paper p-6 md:p-8 border border-line-soft">
            <div className="flex justify-between mb-5">
              <div className="font-mono text-[11px] tracking-[0.12em] text-ink-3">
                REYTİNG · EGE D.
              </div>
              <div className="font-mono text-[11px] tracking-[0.12em] text-ink-3">
                2023 — 2025
              </div>
            </div>
            <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto">
              {[900, 1100, 1300, 1500, 1700].map((y) => (
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
                y={yScale(1620) - 12}
                fontSize="14"
                fontFamily="var(--font-instrument-serif)"
                fill="#141311"
                fontStyle="italic"
                textAnchor="end"
              >
                1620
              </text>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

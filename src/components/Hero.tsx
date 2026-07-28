import PuzzleBoard from "./PuzzleBoard";
import { Eyebrow, CornerCoords } from "./Primitives";

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-32 md:pt-36 pb-24">
      {/* Decorative giant italic L */}
      <div
        aria-hidden
        className="absolute right-[-80px] top-10 font-serif italic text-paper-3 opacity-50 pointer-events-none select-none z-0"
        style={{ fontSize: 720, lineHeight: 0.85 }}
      >
        L
      </div>

      <div className="container-lg relative z-10">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-14">
          <Eyebrow num="00">Kırklareli · Lüleburgaz · Kuruluş 2014</Eyebrow>
          <div className="font-mono text-[11px] text-ink-4 tracking-[0.15em]">
            TSF LİSANSLI EĞİTİM KURUMU
          </div>
        </div>

        <h1 className="font-serif leading-[0.98] tracking-tightest max-w-[1200px] mb-10 text-[56px] sm:text-[80px] md:text-[104px] lg:text-[132px]">
          Zihinsel disiplin.
          <br />
          Stratejik <em className="italic text-bordo not-italic font-serif" style={{ fontStyle: "italic" }}>düşünce.</em>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-8 md:gap-20 items-end mb-20 max-w-[1200px]">
          <p className="text-xl leading-[1.5] text-ink-2 max-w-[560px]">
            Trakya&apos;nın en eski satranç okulu. On iki yıldır 6–18 yaş arası çocuk ve gençleri
            ulusal turnuva sahnesine hazırlıyor, FIDE reyting sürecini adım adım yönetiyoruz.
          </p>

          <div className="flex flex-wrap gap-3 md:justify-end">
            <a href="#programlar" className="btn btn-primary">
              Programları incele <span className="arrow-hover">→</span>
            </a>
            <a href="#iletisim" className="btn btn-ghost">
              Ücretsiz deneme
            </a>
          </div>
        </div>

        <div className="relative bg-paper-2 border border-line-soft p-8 md:p-14">
          <CornerCoords />
          <PuzzleBoard />
        </div>
      </div>
    </section>
  );
}

import Image from "next/image";
import ChessSection from "./chess/ChessSection";
import BrandMark from "./BrandMark";

export default function Hero() {
  return (
    <>
      <section
        id="top"
        className="relative w-full min-h-[100svh] flex flex-col justify-end overflow-hidden"
      >
        <Image
          src="/c2.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(180deg, rgba(12,11,10,0.62) 0%, rgba(12,11,10,0.55) 45%, rgba(12,11,10,0.78) 100%)",
          }}
          aria-hidden
        />

        {/* Silik arma — sol üst, markayı hero’da büyütür */}
        <div
          className="absolute z-[2] pointer-events-none select-none
            top-[5rem] left-12 sm:left-16 md:left-24 lg:left-[max(5rem,calc((100vw-1200px)/2+3.5rem))]
            opacity-[0.16] md:opacity-[0.2]"
          aria-hidden
        >
          <BrandMark
            size={150}
            decorative
            bordered={false}
            priority
            className="!h-[130px] !w-[130px] sm:!h-[170px] sm:!w-[170px] md:!h-[210px] md:!w-[210px] lg:!h-[230px] lg:!w-[230px]"
          />
        </div>

        <div className="container-lg relative z-[3] pt-32 pb-16 md:pb-20 md:pt-36">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-10 md:mb-12">
            <div className="eyebrow text-paper/70">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-bordo mr-2.5 align-[2px]" />
              <span className="mr-3 text-paper/45">00</span>
              Kırklareli · Lüleburgaz · Kuruluş 2022
            </div>
            <div className="font-mono text-[11px] text-paper/55 tracking-[0.15em]">
              TSF LİSANSLI EĞİTİM KURUMU
            </div>
          </div>

          <h1 className="font-serif leading-[0.98] tracking-tightest max-w-[1100px] mb-8 text-paper text-[48px] sm:text-[68px] md:text-[88px] lg:text-[104px]">
            Zihinsel disiplin.
            <br />
            Stratejik{" "}
            <em className="italic font-serif text-[#E8B4B4]" style={{ fontStyle: "italic" }}>
              düşünce.
            </em>
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-8 md:gap-16 items-end max-w-[1100px]">
            <p className="text-lg md:text-xl leading-[1.5] text-paper/80 max-w-[520px]">
              Lüleburgaz ve Kırklareli&apos;de 6–18 yaş arası çocuk ve gençleri ulusal
              turnuva sahnesine hazırlıyor, FIDE reyting sürecini adım adım yönetiyoruz.
            </p>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <a
                href="/#programlar"
                className="btn bg-paper text-ink hover:bg-bordo hover:text-paper"
              >
                Programları incele <span className="arrow-hover">→</span>
              </a>
              <a
                href="/#iletisim"
                className="btn bg-transparent text-paper border border-paper/40 hover:border-paper"
              >
                Ücretsiz deneme
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="bir-hamle" className="py-16 md:py-20 bg-paper">
        <div className="container-lg">
          <div className="mb-10 max-w-[640px]">
            <div className="eyebrow mb-4">
              <span className="eyebrow-dot" />
              Kısa bir bakış
            </div>
            <h2 className="font-serif text-[36px] md:text-[48px] leading-[1.05] tracking-tighterish">
              Bir hamle <em className="italic font-serif">yeter.</em>
            </h2>
          </div>
          <ChessSection />
        </div>
      </section>
    </>
  );
}

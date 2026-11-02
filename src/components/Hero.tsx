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

        <div className="container-lg relative z-[3] pt-28 pb-10 md:pb-14 md:pt-32">
          <div className="max-w-[1200px]">
            <div className="eyebrow text-paper/70 mb-6 md:mb-8">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-bordo mr-2.5 align-[2px]" />
              <span className="mr-3 text-paper/45">00</span>
              Kırklareli · Lüleburgaz · Kuruluş 2022
            </div>

            <h1 className="font-serif leading-[0.98] tracking-tightest mb-5 md:mb-6 text-paper text-[48px] sm:text-[68px] md:text-[88px] lg:text-[104px]">
              Zihinsel disiplin.
              <br />
              Stratejik{" "}
              <em className="italic font-serif text-[#E8B4B4]" style={{ fontStyle: "italic" }}>
                düşünce.
              </em>
            </h1>

            <p className="text-lg md:text-[22px] leading-[1.45] text-paper/80 max-w-[52rem]">
              Lüleburgaz ve Kırklareli&apos;de sporcularımızı ulusal ve uluslararası
              turnuvalara hazırlamanın yanında bölgede satranç sporunun desteklenmesi ve
              satranç kültürünün artmasına yönelik çalışmalarımızı sürdürüyoruz.
            </p>
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

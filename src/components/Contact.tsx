import { SCHOOL } from "@/lib/data";
import { Eyebrow } from "./Primitives";
import BrandMark from "./BrandMark";

export default function Contact() {
  return (
    <section id="iletisim" className="relative py-16 md:py-20 bg-paper-2">
      <div className="container-lg">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 lg:gap-20 xl:gap-28 items-start">
          {/* Sol: marka + başlık */}
          <div>
            <BrandMark size={72} className="mb-6" />
            <Eyebrow num="09">İletişim</Eyebrow>
            <h2 className="font-serif text-[44px] md:text-[56px] lg:text-[72px] leading-none tracking-tightestish mt-5 max-w-[16ch]">
              İlk hamle <em className="italic font-serif text-bordo">senin.</em>
            </h2>
            <p className="text-lg md:text-[20px] leading-[1.55] text-ink-2 mt-6 max-w-[420px]">
              Deneme dersi veya kayıt için bizi arayın.
            </p>
          </div>

          {/* Sağ: iletişim bilgileri */}
          <div className="lg:pt-2 lg:border-l lg:border-line-soft lg:pl-12 xl:pl-16 flex flex-col gap-10 md:gap-12">
            <div>
              <div className="font-mono text-[10px] tracking-[0.14em] text-ink-4 mb-3">
                MERKEZ
              </div>
              <div className="font-serif text-[22px] md:text-[26px] leading-[1.35] max-w-[28ch]">
                {SCHOOL.address}
              </div>
            </div>
            <div>
              <div className="font-mono text-[10px] tracking-[0.14em] text-ink-4 mb-3">
                TELEFON
              </div>
              <a
                href={`tel:${SCHOOL.phoneTel}`}
                className="font-serif text-[28px] md:text-[36px] leading-none hover:text-bordo transition-colors inline-block"
              >
                {SCHOOL.phone}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

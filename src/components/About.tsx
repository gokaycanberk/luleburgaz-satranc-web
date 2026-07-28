"use client";

import { Eyebrow } from "./Primitives";

export default function About() {
  return (
    <section id="hakkimizda" className="relative py-16 md:py-20 bg-paper">
      <div className="container-lg">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-16 lg:gap-24 items-start">
          <div className="md:sticky md:top-32">
            <Eyebrow num="01">Hakkımızda</Eyebrow>
            <h2 className="font-serif mt-5 leading-none tracking-tightestish text-[44px] md:text-[64px] lg:text-[84px]">
              Bir <em className="italic font-serif text-bordo">tahta</em>,
              <br />
              altmış dört <em className="italic font-serif">kare,</em>
              <br />
              sınırsız olasılık.
            </h2>
          </div>

          <div>
            <p className="text-[22px] leading-[1.55] mb-8">
              Lüleburgaz Satranç Spor Okulu, 2022 yılında bir avuç tutkulu antrenörün
              &quot;Trakya&apos;da rekabetçi satranç eğitimi verecek bir çatı&quot; fikriyle
              kuruldu. Bugün Kırklareli ve Lüleburgaz&apos;da iki merkezimizde 220&apos;nin
              üzerinde aktif öğrenciye ders veriyoruz.
            </p>

            <p className="text-[20px] leading-[1.65] mb-6 text-ink-2">
              Yaklaşımımız üç sütun üzerine kurulu:{" "}
              <em className="font-serif italic text-[22px]">klasik açılış repertuvarı</em>,
              hesaplama disiplini ve turnuva psikolojisi. Öğrencilerimiz Türkiye Satranç
              Federasyonu takviminde her yıl 30&apos;un üzerinde resmi turnuvada mücadele
              eder.
            </p>

            <p className="text-[20px] leading-[1.65] mb-10 text-ink-2">
              Kadromuzda FIDE Ustası (FM) düzeyinde iki eğitmen ve Türkiye Satranç
              Federasyonu 1. kademe antrenörleri bulunuyor. Her öğrenci için bireysel
              gelişim planı hazırlanır; ilerleyiş üç ayda bir raporlanır.
            </p>

            <div className="pt-10 border-t border-line-soft">
              <div className="font-mono text-[11px] tracking-[0.14em] text-ink-4 uppercase mb-2">
                Felsefe
              </div>
              <p className="font-serif italic text-2xl leading-[1.3]">
                &quot;Satranç yalnızca hafıza değil, ihtimalleri okumaktır.&quot;
              </p>
              <div className="font-mono text-[11px] text-ink-3 mt-3">
                — Berkan Hacıoğlu, Kurucu Antrenör
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

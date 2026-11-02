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
              Lüleburgaz Satranç Spor Kulübü, 2022 yılında Trakya&apos;da rekabetçi satranç
              eğitimine analitik ve vizyoner bir standart getirmek amacıyla, stratejik
              düşünceyi merkeze alan bir kadro tarafından kuruldu. Bugün 150&apos;nin
              üzerinde öğrencimize ders veriyor; 127 lisanslı sporcumuzla profesyonel
              arenada boy gösteriyoruz.
            </p>

            <p className="text-[20px] leading-[1.65] mb-4 text-ink-2">
              Eğitim yaklaşımımız, mühendislik disipliniyle harmanlanmış geniş ve kapsamlı
              bir metot yelpazesi üzerine kuruludur:
            </p>
            <ul className="text-[20px] leading-[1.65] mb-6 text-ink-2 list-disc pl-5 space-y-2">
              <li>
                Klasik Açılış Repertuvarı ve Varyant Analizi (Sistematik altyapı ve oyun kurma)
              </li>
              <li>
                Derinlemesine Hesaplama ve Pozisyonel Görüş Disiplini (Analitik karar alma süreçleri)
              </li>
              <li>
                Oyun Sonu (Endgame) Ustalık Teknikleri ve Taktiksel Kalıplar (Derinleşme ve optimizasyon)
              </li>
              <li>
                Turnuva Pratiği, Zaman Yönetimi ve Zihinsel Dayanıklılık (Stratejik odaklanma ve süreklilik)
              </li>
            </ul>

            <p className="text-[20px] leading-[1.65] mb-10 text-ink-2">
              Öğrencilerimiz, ulusal ve yerel platformlarda geniş bir yelpazede aktif olarak
              mücadele etmektedir. Uzman kadromuzla her öğrencimiz için kişiselleştirilmiş
              bireysel gelişim planı hazırlıyor; atılan her adımı ve ilerleyişi yakından
              takip ederek başarıyı şansa değil, sisteme bağlıyoruz.
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

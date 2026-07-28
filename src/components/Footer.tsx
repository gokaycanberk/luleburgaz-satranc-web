import { SCHOOL } from "@/lib/data";
import BrandMark from "./BrandMark";

const COLS = [
  {
    title: "Site Haritası",
    links: [
      { label: "Hakkımızda", href: "/#hakkimizda" },
      { label: "Programlar", href: "/#programlar" },
      { label: "Eğitmenler", href: "/#egitmenler" },
      { label: "Turnuvalar", href: "/#turnuvalar" },
      { label: "Blog", href: "/#blog" },
      { label: "İletişim", href: "/#iletisim" },
    ],
  },
  {
    title: "Programlar",
    links: [
      { label: "Bireysel Ders", href: "/#programlar" },
      { label: "Grup Dersleri", href: "/#programlar" },
      { label: "Online Ders", href: "/#programlar" },
      { label: "Yaz Okulu", href: "/#programlar" },
      { label: "Kış Kampı", href: "/#programlar" },
    ],
  },
  {
    title: "Bağlantılar",
    links: [
      { label: "TSF Resmi Site", href: "https://tsf.org.tr", external: true },
      { label: "FIDE.com", href: "https://www.fide.com", external: true },
      { label: "Lichess.org", href: "https://lichess.org", external: true },
      { label: "Chess.com", href: "https://www.chess.com", external: true },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-ink text-paper pt-20 pb-8 relative overflow-hidden">
      <div className="container-lg relative">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-12 md:gap-16 mb-20">
          <div>
            <BrandMark size={88} bordered={false} className="mb-6 ring-1 ring-paper/20" />
            <div className="font-serif text-[28px] md:text-[32px] leading-[1.1] max-w-[380px] mb-6">
              {SCHOOL.name}
            </div>
            <p className="text-sm leading-[1.65] text-ink-4 max-w-[380px]">
              2022&apos;den bu yana Lüleburgaz ve Kırklareli&apos;de çocuk ve gençlerin
              stratejik düşünce yolculuğunda.
            </p>
          </div>

          {COLS.map((col) => (
            <div key={col.title}>
              <div className="font-mono text-[10px] tracking-[0.16em] text-gold-soft mb-5 uppercase">
                {col.title}
              </div>
              <div className="flex flex-col gap-3">
                {col.links.map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    {...("external" in l && l.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="text-sm text-paper/75 hover:text-paper transition-opacity"
                  >
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-paper/15 flex flex-col md:flex-row md:justify-between md:items-center gap-4 font-mono text-[11px] text-ink-4 tracking-[0.08em]">
          <div>© 2026 LÜLEBURGAZ SATRANÇ SPOR KULÜBÜ · TÜM HAKLARI SAKLIDIR</div>
          <div className="flex gap-6">
            <span>KVKK</span>
            <span className="text-gold-soft">TSF LİSANSLI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

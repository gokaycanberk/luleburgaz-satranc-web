import { SCHOOL } from "@/lib/data";

const COLS = [
  {
    title: "Site Haritası",
    links: ["Hakkımızda", "Programlar", "Eğitmenler", "Turnuvalar", "Blog", "İletişim"],
  },
  {
    title: "Programlar",
    links: ["Bireysel Ders", "Grup Dersleri", "Online Ders", "Yaz Okulu", "Kış Kampı", "Kurumsal"],
  },
  {
    title: "Bağlantılar",
    links: ["TSF Resmi Site", "FIDE.com", "Lichess.org", "Chess.com", "PGN Arşivi", "KVKK"],
  },
];

export default function Footer() {
  return (
    <footer className="bg-ink text-paper pt-20 pb-8 relative overflow-hidden">
      <div
        aria-hidden
        className="absolute left-[-40px] bottom-[-200px] font-serif italic pointer-events-none select-none"
        style={{
          fontSize: 800,
          lineHeight: 0.85,
          color: "rgba(245,242,234,0.04)",
        }}
      >
        L
      </div>

      <div className="container-lg relative">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-12 md:gap-16 mb-20">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="font-serif italic text-[40px] leading-[0.9]">L</span>
              <span className="text-[32px] text-gold">♞</span>
            </div>
            <div className="font-serif text-[32px] leading-[1.1] max-w-[380px] mb-6">
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
                    key={l}
                    href="#"
                    className="text-sm text-paper/75 hover:text-paper transition-opacity"
                  >
                    {l}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-paper/15 flex flex-col md:flex-row md:justify-between md:items-center gap-4 font-mono text-[11px] text-ink-4 tracking-[0.08em]">
          <div>© 2026 LÜLEBURGAZ SATRANÇ SPOR OKULU · TÜM HAKLARI SAKLIDIR</div>
          <div className="flex gap-6">
            <span>KVKK</span>
            <span>ÇEREZ POLİTİKASI</span>
            <span className="text-gold-soft">TSF LİSANSLI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

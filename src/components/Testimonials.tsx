import { TESTIMONIALS } from "@/lib/data";
import SectionBackdrop from "./SectionBackdrop";

export default function Testimonials() {
  return (
    <section className="relative py-16 md:py-20 bg-ink text-paper overflow-hidden">
      <SectionBackdrop
        src="/chess-banner.jpeg"
        strength={0.35}
        position="center"
        tone="ink"
      />
      <div className="container-lg relative z-[1]">
        <div className="mb-10">
          <div className="eyebrow" style={{ color: "#D9BF8F" }}>
            <span
              className="eyebrow-dot"
              style={{ background: "#B8935A" }}
            />
            <span className="text-ink-4 mr-3">06</span>
            Veli ve öğrenci sesleri
          </div>
          <h2 className="font-serif text-[40px] md:text-[56px] lg:text-[72px] leading-[1.02] mt-5 tracking-tighterish max-w-[900px]">
            &quot;Sadece satranç <em className="italic font-serif text-gold-soft">değil,</em> bir düşünce disiplini.&quot;
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="border-t border-paper/15 pt-8">
              <div className="font-serif italic text-[60px] leading-[0.5] text-gold mb-5">
                &quot;
              </div>
              <p className="text-[17px] leading-[1.55] mb-8">{t.quote}</p>
              <div className="font-serif text-[20px] mb-1">{t.author}</div>
              <div className="font-mono text-[10px] tracking-[0.12em] text-ink-4 uppercase">
                {t.role}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

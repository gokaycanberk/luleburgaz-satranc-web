"use client";

import { useState } from "react";
import { SCHOOL } from "@/lib/data";
import { Eyebrow } from "./Primitives";

type Level = "baslangic" | "temel" | "orta" | "ileri";
type ProgramChoice = "bireysel" | "grup" | "online" | "yaz";

const LEVELS: [Level, string][] = [
  ["baslangic", "Hiç bilmiyor"],
  ["temel", "Kuralları biliyor"],
  ["orta", "Kulüpte oynuyor"],
  ["ileri", "Reytingli oyuncu"],
];

const PROGRAM_CHOICES: [ProgramChoice, string][] = [
  ["bireysel", "Bireysel"],
  ["grup", "Grup"],
  ["online", "Online"],
  ["yaz", "Yaz okulu"],
];

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    age: "",
    level: "baslangic" as Level,
    program: "bireysel" as ProgramChoice,
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("sent");
      setTimeout(() => setStatus("idle"), 5000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  const inputCls =
    "w-full py-4 bg-transparent border-0 border-b border-line-soft text-base text-ink outline-none transition-colors focus:border-ink";
  const labelCls =
    "font-mono text-[10px] tracking-[0.14em] text-ink-3 uppercase block mb-1";

  return (
    <section id="iletisim" className="py-32 md:py-36 bg-paper-2">
      <div className="container-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">
          <div>
            <Eyebrow num="09">İletişim</Eyebrow>
            <h2 className="font-serif text-[44px] md:text-[64px] lg:text-[84px] leading-none tracking-tightestish mt-5">
              İlk hamle <em className="italic font-serif text-bordo">senin.</em>
            </h2>
            <p className="text-lg leading-[1.55] text-ink-2 mt-6 max-w-[440px]">
              Ücretsiz deneme dersi için formu doldur. 24 saat içinde arayıp uygun bir zaman belirleyelim.
            </p>

            <div className="mt-14 flex flex-col gap-7">
              <div>
                <div className="font-mono text-[10px] tracking-[0.14em] text-ink-4 mb-2">MERKEZ</div>
                <div className="font-serif text-[22px] leading-[1.3]">{SCHOOL.address}</div>
              </div>
              <div>
                <div className="font-mono text-[10px] tracking-[0.14em] text-ink-4 mb-2">TELEFON</div>
                <a href={`tel:${SCHOOL.phone.replace(/\s/g, "")}`} className="font-serif text-[22px] hover:text-bordo transition-colors">
                  {SCHOOL.phone}
                </a>
              </div>
              <div>
                <div className="font-mono text-[10px] tracking-[0.14em] text-ink-4 mb-2">E-POSTA</div>
                <a href={`mailto:${SCHOOL.email}`} className="font-serif text-[22px] hover:text-bordo transition-colors">
                  {SCHOOL.email}
                </a>
              </div>
            </div>

            <a
              href={`https://wa.me/${SCHOOL.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 mt-10 px-5 py-3.5 bg-ink text-paper rounded-full text-sm font-medium hover:bg-bordo transition-colors"
            >
              <span className="text-lg">◍</span> WhatsApp ile yaz
            </a>
          </div>

          <form
            onSubmit={submit}
            className="bg-paper p-8 md:p-12 border border-line-soft"
          >
            <div className="font-mono text-[11px] tracking-[0.14em] text-ink-4 mb-8">
              ÜCRETSİZ DENEME DERSİ · KAYIT FORMU
            </div>

            <div className="flex flex-col gap-6">
              <div>
                <label className={labelCls}>Ad Soyad (öğrenci)</label>
                <input
                  required
                  className={inputCls}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ör. Berk Yılmaz"
                />
              </div>
              <div className="grid grid-cols-[1fr_100px] gap-6">
                <div>
                  <label className={labelCls}>Veli telefonu</label>
                  <input
                    required
                    type="tel"
                    className={inputCls}
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="0 5xx xxx xx xx"
                  />
                </div>
                <div>
                  <label className={labelCls}>Yaş</label>
                  <input
                    required
                    type="number"
                    min={6}
                    max={18}
                    className={inputCls}
                    value={form.age}
                    onChange={(e) => setForm({ ...form, age: e.target.value })}
                    placeholder="10"
                  />
                </div>
              </div>

              <div>
                <label className={labelCls}>Satranç seviyesi</label>
                <div className="flex flex-wrap gap-2 mt-3">
                  {LEVELS.map(([v, l]) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setForm({ ...form, level: v })}
                      className="px-3.5 py-2 text-[13px] rounded-full border transition-all"
                      style={{
                        borderColor: form.level === v ? "#141311" : "rgba(20,19,17,0.12)",
                        background: form.level === v ? "#141311" : "transparent",
                        color: form.level === v ? "#F5F2EA" : "#3A362E",
                      }}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={labelCls}>İlgilendiği program</label>
                <div className="flex flex-wrap gap-2 mt-3">
                  {PROGRAM_CHOICES.map(([v, l]) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setForm({ ...form, program: v })}
                      className="px-3.5 py-2 text-[13px] rounded-full border transition-all"
                      style={{
                        borderColor: form.program === v ? "#7A1E1E" : "rgba(20,19,17,0.12)",
                        background: form.program === v ? "#7A1E1E" : "transparent",
                        color: form.program === v ? "#F5F2EA" : "#3A362E",
                      }}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="btn btn-primary mt-5 justify-center py-4 text-sm w-full"
              >
                {status === "sending" && "Gönderiliyor…"}
                {status === "sent" && "✓ Talebiniz alındı — sizi arayacağız"}
                {status === "error" && "Bir hata oluştu, tekrar deneyin"}
                {status === "idle" && (
                  <>
                    Deneme dersi talep et <span className="arrow-hover">→</span>
                  </>
                )}
              </button>

              <p className="font-mono text-[10px] text-ink-4 leading-[1.6] mt-1">
                Formu göndererek verilerinizin ders koordinasyonu amacıyla kullanılmasını
                kabul edersiniz. KVKK metnimizi okuyun.
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

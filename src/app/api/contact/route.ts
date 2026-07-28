import { NextRequest, NextResponse } from "next/server";

// Contact form endpoint
// Şu an sadece console.log + başarılı yanıt döndürüyor.
// Üretimde Resend / SendGrid / kendi SMTP + Google Sheets / CRM entegre edin.

type ContactPayload = {
  name: string;
  phone: string;
  age: string;
  level: string;
  program: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ContactPayload;

    // Basit doğrulama
    if (!body.name || !body.phone || !body.age) {
      return NextResponse.json(
        { ok: false, error: "Zorunlu alanlar eksik" },
        { status: 400 }
      );
    }

    // 1) Sunucu tarafı log (Vercel Logs'ta görünür)
    console.log("[contact form]", {
      timestamp: new Date().toISOString(),
      ...body,
    });

    // 2) OPSİYONEL: Resend ile e-posta gönderimi
    // if (process.env.RESEND_API_KEY) {
    //   const { Resend } = await import("resend");
    //   const resend = new Resend(process.env.RESEND_API_KEY);
    //   await resend.emails.send({
    //     from: "Lüleburgaz Satranç <noreply@luleburgazsatranc.com>",
    //     to: [process.env.CONTACT_TO_EMAIL!],
    //     subject: `Yeni deneme dersi talebi — ${body.name}`,
    //     html: `
    //       <h2>Yeni deneme dersi talebi</h2>
    //       <p><strong>İsim:</strong> ${body.name}</p>
    //       <p><strong>Telefon:</strong> ${body.phone}</p>
    //       <p><strong>Yaş:</strong> ${body.age}</p>
    //       <p><strong>Seviye:</strong> ${body.level}</p>
    //       <p><strong>Program:</strong> ${body.program}</p>
    //     `,
    //   });
    // }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact form] error:", err);
    return NextResponse.json(
      { ok: false, error: "Sunucu hatası" },
      { status: 500 }
    );
  }
}

import type { Metadata } from "next";
import { DM_Sans, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const sansFont = DM_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-dm-sans",
  display: "swap",
});

const monoFont = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://luleburgazsatranc.com",
  ),
  title: "Lüleburgaz Satranç Spor Okulu — Zihinsel disiplin, stratejik düşünce",
  description:
    "Trakya'nın en eski satranç okulu. Kırklareli ve Lüleburgaz'da 6–18 yaş çocuk ve gençlere bireysel, grup ve online satranç dersleri. FIDE ratingli turnuva hazırlığı.",
  keywords: [
    "Lüleburgaz satranç",
    "Kırklareli satranç",
    "satranç okulu",
    "satranç kursu",
    "çocuk satranç dersi",
    "FIDE turnuva",
    "TSF lisanslı",
  ],
  authors: [{ name: "Lüleburgaz Satranç Spor Okulu" }],
  openGraph: {
    title: "Lüleburgaz Satranç Spor Okulu",
    description: "Zihinsel disiplin. Stratejik düşünce.",
    locale: "tr_TR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={`${instrumentSerif.variable} ${sansFont.variable} ${monoFont.variable}`}>
      <body>{children}</body>
    </html>
  );
}

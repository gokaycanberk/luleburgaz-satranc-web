import type { Metadata } from "next";
import { DM_Sans, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import JsonLd from "@/components/JsonLd";
import { SITE_NAME, SITE_NAME_ALT, SITE_URL } from "@/lib/site";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-instrument-serif",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

const sansFont = DM_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "700"],
  variable: "--font-dm-sans",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

const monoFont = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

const DESCRIPTION =
  "Lüleburgaz ve Kırklareli'de satranç eğitimi. 5–6 yaştan itibaren bireysel, grup ve online dersler. Ücretsiz deneme dersi. 150+ öğrenci, 127 lisanslı sporcu.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Zihinsel disiplin, stratejik düşünce`,
    template: `%s · ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "Lüleburgaz satranç",
    "Lüleburgaz satranç kursu",
    "Kırklareli satranç",
    "satranç okulu",
    "satranç kulübü",
    "çocuk satranç dersi",
    "ücretsiz deneme dersi",
    "online satranç dersi",
    "turnuva hazırlığı",
    SITE_NAME_ALT,
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME_ALT,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: SITE_NAME,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "tr_TR",
    type: "website",
    images: [
      {
        url: "/logo.jpeg",
        width: 512,
        height: 512,
        alt: `${SITE_NAME} logo`,
      },
    ],
  },
  twitter: {
    card: "summary",
    title: SITE_NAME,
    description: DESCRIPTION,
    images: ["/logo.jpeg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "sports",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="tr"
      className={`${instrumentSerif.variable} ${sansFont.variable} ${monoFont.variable}`}
    >
      <body className={`${sansFont.className} antialiased`}>
        <JsonLd />
        {children}
      </body>
    </html>
  );
}

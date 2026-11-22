import { COACHES, FAQ_ITEMS, PROGRAMS, SCHOOL, STATS } from "@/lib/data";
import { SITE_NAME, SITE_NAME_ALT, SITE_URL } from "@/lib/site";

export default function JsonLd() {
  const localBusiness = {
    "@context": "https://schema.org",
    "@type": ["SportsClub", "LocalBusiness", "EducationalOrganization"],
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    alternateName: SITE_NAME_ALT,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.jpeg`,
    image: `${SITE_URL}/logo.jpeg`,
    description:
      "Lüleburgaz ve Kırklareli'de çocuk ve gençlere bireysel, grup ve online satranç eğitimi veren spor kulübü. Ücretsiz deneme dersi.",
    foundingDate: String(SCHOOL.founded),
    address: {
      "@type": "PostalAddress",
      streetAddress: "Zafer Mahallesi, Emel Caddesi No:120",
      addressLocality: "Lüleburgaz",
      addressRegion: "Kırklareli",
      postalCode: "39750",
      addressCountry: "TR",
    },
    telephone: SCHOOL.phoneTel,
    email: SCHOOL.email,
    areaServed: SCHOOL.cities.map((city) => ({
      "@type": "City",
      name: city,
    })),
    sameAs: [],
    knowsAbout: [
      "satranç eğitimi",
      "çocuk satranç dersi",
      "turnuva hazırlığı",
      "online satranç dersi",
      "Lüleburgaz satranç",
      "Kırklareli satranç",
    ],
    numberOfEmployees: STATS.find((s) => s.label === "Antrenör")?.num,
    employee: COACHES.map((c) => ({
      "@type": "Person",
      name: c.name,
      jobTitle: c.role,
      description: c.bio,
    })),
    makesOffer: PROGRAMS.map((p) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: p.title,
        description: p.body,
      },
    })),
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: SCHOOL.phoneTel,
        contactType: "customer service",
        areaServed: "TR",
        availableLanguage: ["Turkish"],
      },
    ],
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    inLanguage: "tr-TR",
    publisher: { "@id": `${SITE_URL}/#organization` },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
    </>
  );
}

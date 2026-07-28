import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ContentArticle from "@/components/ContentArticle";
import {
  getRelatedContent,
  getTournamentContent,
  getTournamentContentBySlug,
} from "@/lib/content";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://luleburgazsatranc.com";

type PageProps = {
  params: { slug: string };
};

export function generateStaticParams() {
  return getTournamentContent().map((item) => ({ slug: item.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const item = getTournamentContentBySlug(params.slug);
  if (!item) {
    return { title: "Turnuva bulunamadı" };
  }

  const title = item.seo?.title || item.title;
  const description = item.seo?.description || item.summary;
  const canonicalPath = `/turnuvalar/${item.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title,
      description,
      type: "article",
      locale: "tr_TR",
      url: `${SITE_URL}${canonicalPath}`,
      publishedTime: item.publishedAt,
      ...(item.coverImage
        ? {
            images: [
              {
                url: item.coverImage.startsWith("http")
                  ? item.coverImage
                  : `${SITE_URL}${item.coverImage}`,
              },
            ],
          }
        : {}),
    },
  };
}

export default function TournamentDetailPage({ params }: PageProps) {
  const item = getTournamentContentBySlug(params.slug);
  if (!item) notFound();

  const related = getRelatedContent(item, 6)
    .filter((rel) => rel.contentType === "tournament")
    .slice(0, 3);

  return (
    <>
      <Nav />
      <main className="pt-32 pb-24">
        <ContentArticle
          item={item}
          related={related}
          hrefBase="/turnuvalar"
          backHref="/#turnuvalar"
          backLabel="Tüm turnuvalara dön"
        />
      </main>
      <Footer />
    </>
  );
}

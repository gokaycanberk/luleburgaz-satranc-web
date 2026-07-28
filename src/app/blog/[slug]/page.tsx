import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ContentArticle from "@/components/ContentArticle";
import {
  getBlogContent,
  getBlogContentBySlug,
  getRelatedContent,
} from "@/lib/content";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://luleburgazsatranc.com";

type PageProps = {
  params: { slug: string };
};

export function generateStaticParams() {
  return getBlogContent().map((item) => ({ slug: item.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const item = getBlogContentBySlug(params.slug);
  if (!item) {
    return { title: "Yazı bulunamadı" };
  }

  const title = item.seo?.title || item.title;
  const description = item.seo?.description || item.summary;
  const canonicalPath = `/blog/${item.slug}`;

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

export default function BlogDetailPage({ params }: PageProps) {
  const item = getBlogContentBySlug(params.slug);
  if (!item) notFound();

  const related = getRelatedContent(item, 6)
    .filter((rel) => rel.contentType !== "tournament" && rel.contentType !== "gallery")
    .slice(0, 3);

  return (
    <>
      <Nav />
      <main className="pt-32 pb-24">
        <ContentArticle
          item={item}
          related={related}
          hrefBase="/blog"
          backHref="/#blog"
          backLabel="Tüm yazılara dön"
        />
      </main>
      <Footer />
    </>
  );
}

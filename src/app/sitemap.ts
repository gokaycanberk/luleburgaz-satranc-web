import type { MetadataRoute } from "next";
import { getBlogContent, getTournamentContent } from "@/lib/content";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://luleburgazsatranc.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
  ];

  for (const post of getBlogContent()) {
    routes.push({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.publishedAt),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  for (const item of getTournamentContent()) {
    routes.push({
      url: `${BASE_URL}/turnuvalar/${item.slug}`,
      lastModified: new Date(item.publishedAt),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  return routes;
}

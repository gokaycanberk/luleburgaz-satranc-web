import type { MetadataRoute } from "next";
import { getBlogContent, getTournamentContent } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
  ];

  for (const post of getBlogContent()) {
    routes.push({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.publishedAt),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  for (const item of getTournamentContent()) {
    routes.push({
      url: `${SITE_URL}/turnuvalar/${item.slug}`,
      lastModified: new Date(item.publishedAt),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  return routes;
}

import contentData from "@/data/content.json";
import type { ContentCollection, ContentItem, ContentType } from "@/types/content";

const collection = contentData as ContentCollection;

export const BLOG_CONTENT_TYPES: ContentType[] = [
  "blog",
  "news",
  "announcement",
  "achievement",
];

function byPublishedDesc(a: ContentItem, b: ContentItem): number {
  return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
}

/** All content items, newest first (as stored in content.json). */
export function getAllContent(): ContentItem[] {
  return collection.items;
}

export function getContentBySlug(slug: string): ContentItem | undefined {
  return collection.items.find((item) => item.slug === slug);
}

export function getContentById(id: string): ContentItem | undefined {
  return collection.items.find((item) => item.id === id);
}

export function getContentByType(type: ContentType): ContentItem[] {
  return collection.items.filter((item) => item.contentType === type);
}

export function getFeaturedContent(limit = 6): ContentItem[] {
  return collection.items.filter((item) => item.featured).slice(0, limit);
}

export function getContentByCategory(category: string): ContentItem[] {
  const needle = category.toLocaleLowerCase("tr-TR");
  return collection.items.filter(
    (item) => item.category.toLocaleLowerCase("tr-TR") === needle,
  );
}

export function getContentMeta(): ContentCollection["meta"] {
  return collection.meta;
}

export function getBlogContent(): ContentItem[] {
  return getAllContent()
    .filter((item) => BLOG_CONTENT_TYPES.includes(item.contentType))
    .sort(byPublishedDesc);
}

export function getBlogContentBySlug(slug: string): ContentItem | undefined {
  const item = getContentBySlug(slug);
  if (!item || !BLOG_CONTENT_TYPES.includes(item.contentType)) return undefined;
  return item;
}

export function getTournamentContent(): ContentItem[] {
  return getContentByType("tournament").sort(byPublishedDesc);
}

export function getTournamentContentBySlug(slug: string): ContentItem | undefined {
  const item = getContentBySlug(slug);
  if (!item || item.contentType !== "tournament") return undefined;
  return item;
}

/** Same category or contentType, excluding current item — newest first. */
export function getRelatedContent(item: ContentItem, limit = 3): ContentItem[] {
  return getAllContent()
    .filter((other) => other.id !== item.id)
    .filter(
      (other) =>
        other.category === item.category || other.contentType === item.contentType,
    )
    .sort(byPublishedDesc)
    .slice(0, limit);
}

export type ContentType =
  | "news"
  | "blog"
  | "tournament"
  | "achievement"
  | "announcement"
  | "gallery";

export type ContentSeo = {
  title: string;
  description: string;
};

export type ContentItem = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  /** Instagram caption as scraped — untouched source text */
  originalCaption: string;
  contentType: ContentType;
  category: string;
  tags: string[];
  publishedAt: string;
  coverImage: string | null;
  images: string[];
  video: string | null;
  instagramUrl: string;
  featured: boolean;
  seo: ContentSeo;
};

export type ContentCollection = {
  meta: {
    source: string;
    generatedAt: string;
    count: number;
  };
  items: ContentItem[];
};

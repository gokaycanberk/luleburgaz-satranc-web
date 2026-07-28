import Image from "next/image";
import Link from "next/link";
import { getAllContent } from "@/lib/content";
import type { ContentItem, ContentType } from "@/types/content";
import { SectionHead } from "./Primitives";

const BLOG_TYPES: ContentType[] = ["blog", "news", "announcement", "achievement"];

function formatDateTr(iso: string): string {
  return new Date(iso).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getBlogItems(limit = 6): ContentItem[] {
  return getAllContent()
    .filter((item) => BLOG_TYPES.includes(item.contentType))
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    )
    .slice(0, limit);
}

/** Announcements & text-heavy posts → contain; photo stories → cover. */
function blogMediaMode(item: ContentItem): "contain" | "cover" {
  if (item.contentType === "announcement") return "contain";
  if (item.video) return "contain";
  return "cover";
}

export default function Blog() {
  const posts = getBlogItems(6);

  return (
    <section id="blog" className="py-32 md:py-36">
      <div className="container-lg">
        <SectionHead
          num="07"
          eyebrow="Açılış Teorisi Köşesi"
          title={
            <>
              Blog & <em className="italic font-serif">yazılar.</em>
            </>
          }
          subtitle="Antrenörlerimizin öğrencilerimiz ve satranç meraklıları için hazırladığı seçili yazılar."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {posts.map((p) => (
            <BlogCard key={p.id} post={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

function BlogCard({ post }: { post: ContentItem }) {
  const mode = blogMediaMode(post);

  return (
    <Link href={`/blog/${post.slug}`} className="group flex flex-col h-full min-w-0">
      <div
        className="mb-5 relative w-full overflow-hidden border border-line-soft bg-paper-2"
        style={{ aspectRatio: "4 / 3", minHeight: 220 }}
      >
        {post.coverImage ? (
          mode === "contain" ? (
            <div className="absolute inset-0 p-3">
              <div className="relative h-full w-full overflow-hidden">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-contain object-center transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>
            </div>
          ) : (
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.04]"
            />
          )
        ) : (
          <div
            className="absolute inset-0 opacity-40"
            style={{
              background:
                "repeating-linear-gradient(90deg, #DDD5C0 0 12.5%, #EBE6D8 12.5% 25%)",
            }}
            aria-hidden
          />
        )}
        <div className="absolute top-4 left-4 font-mono text-[10px] tracking-[0.14em] text-bordo bg-paper px-2.5 py-1 z-10">
          {post.category}
        </div>
      </div>

      <h3 className="font-serif text-[24px] md:text-[26px] leading-[1.15] mb-3 -tracking-[0.01em] text-ink transition-colors group-hover:text-bordo line-clamp-3">
        {post.title}
      </h3>
      <p className="text-sm leading-[1.55] text-ink-2 mb-5 line-clamp-3 flex-1">
        {post.summary}
      </p>
      <div className="mt-auto flex justify-between pt-4 border-t border-line-soft font-mono text-[11px] text-ink-3 tracking-[0.05em]">
        <span>{post.category}</span>
        <span>{formatDateTr(post.publishedAt)}</span>
      </div>
    </Link>
  );
}

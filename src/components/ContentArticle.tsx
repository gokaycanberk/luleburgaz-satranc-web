import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import Link from "next/link";
import type { ContentItem } from "@/types/content";

export function formatDateTr(iso: string): string {
  return new Date(iso).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Paragraphs by blank lines only — never split mid-sentence by index. */
function ContentParagraphs({ text }: { text: string }) {
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((block) => block.replace(/\n+/g, " ").replace(/\s+/g, " ").trim())
    .filter(Boolean);

  if (paragraphs.length === 0) return null;

  return (
    <div className="article-content space-y-5">
      {paragraphs.map((paragraph, i) => (
        <p key={i} className="text-base md:text-lg leading-[1.75] text-ink-2">
          {paragraph}
        </p>
      ))}
    </div>
  );
}

function CoverFallback() {
  return (
    <div
      className="absolute inset-0 bg-paper-2"
      style={{
        background:
          "repeating-linear-gradient(90deg, #DDD5C0 0 12.5%, #EBE6D8 12.5% 25%)",
      }}
      aria-hidden
    />
  );
}

function RelatedCard({
  item,
  hrefBase,
}: {
  item: ContentItem;
  hrefBase: "/blog" | "/turnuvalar";
}) {
  return (
    <Link href={`${hrefBase}/${item.slug}`} className="group block">
      <div
        className="mb-4 relative overflow-hidden border border-line-soft bg-paper-2"
        style={{ aspectRatio: "4/3" }}
      >
        {item.coverImage ? (
          <Image
            src={item.coverImage}
            alt={item.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <CoverFallback />
        )}
        <div className="absolute top-3 left-3 font-mono text-[10px] tracking-[0.14em] text-bordo bg-paper px-2 py-1 z-10">
          {item.category}
        </div>
      </div>
      <h3 className="font-serif text-[22px] leading-[1.2] mb-2 -tracking-[0.01em] text-ink transition-colors group-hover:text-bordo">
        {item.title}
      </h3>
      <p className="text-sm leading-[1.5] text-ink-2 line-clamp-2 mb-3">
        {item.summary}
      </p>
      <div className="font-mono text-[11px] text-ink-3 tracking-[0.05em]">
        {formatDateTr(item.publishedAt)}
      </div>
    </Link>
  );
}

function readImageSize(absPath: string): { width: number; height: number } | null {
  try {
    const buf = fs.readFileSync(absPath);
    if (buf.length < 24) return null;

    if (buf[0] === 0x89 && buf[1] === 0x50) {
      return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
    }

    if (buf[0] === 0xff && buf[1] === 0xd8) {
      let i = 2;
      while (i < buf.length - 8) {
        if (buf[i] !== 0xff) {
          i += 1;
          continue;
        }
        const marker = buf[i + 1];
        if (marker === 0xd9) break;
        if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
          i += 2;
          continue;
        }
        const len = buf.readUInt16BE(i + 2);
        if (marker >= 0xc0 && marker <= 0xc3) {
          return {
            height: buf.readUInt16BE(i + 5),
            width: buf.readUInt16BE(i + 7),
          };
        }
        i += 2 + len;
      }
    }

    if (buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") {
      const fourcc = buf.toString("ascii", 12, 16);
      if (fourcc === "VP8X") {
        return {
          width: 1 + buf[24] + (buf[25] << 8) + (buf[26] << 16),
          height: 1 + buf[27] + (buf[28] << 8) + (buf[29] << 16),
        };
      }
      if (fourcc === "VP8 ") {
        return {
          width: buf.readUInt16LE(26) & 0x3fff,
          height: buf.readUInt16LE(28) & 0x3fff,
        };
      }
      if (fourcc === "VP8L") {
        const bits = buf.readUInt32LE(21);
        return {
          width: (bits & 0x3fff) + 1,
          height: ((bits >> 14) & 0x3fff) + 1,
        };
      }
    }
  } catch {
    return null;
  }
  return null;
}

function isPortraitMedia(publicUrl: string | null | undefined): boolean {
  if (!publicUrl?.startsWith("/")) return true; // IG clips default portrait
  const abs = path.join(process.cwd(), "public", publicUrl.replace(/^\//, ""));
  if (!fs.existsSync(abs)) return true;
  const size = readImageSize(abs);
  if (!size || size.height <= 0) return true;
  return size.width / size.height < 0.85;
}

function uniqueGallery(images: string[], coverImage: string | null): string[] {
  if (!coverImage) return images;
  const coverKey = coverImage.split("?")[0];
  return images.filter((src) => src.split("?")[0] !== coverKey);
}

function MainMedia({
  item,
  portrait,
}: {
  item: ContentItem;
  portrait: boolean;
}) {
  if (item.video) {
    const wrapperClass = portrait
      ? "relative mx-auto w-full max-w-[min(100%,420px)] md:max-w-[480px] lg:max-w-[540px] overflow-hidden bg-ink border border-line-soft"
      : "relative mx-auto w-full max-w-5xl overflow-hidden bg-ink border border-line-soft";

    return (
      <div className="w-full px-6 md:px-12 mt-8 mb-10 md:mt-10 md:mb-12">
        <div className={wrapperClass}>
          <video
            className="block w-full h-auto"
            controls
            preload="metadata"
            poster={item.coverImage ?? undefined}
            playsInline
          >
            <source src={item.video} type="video/mp4" />
            Tarayıcınız video oynatmayı desteklemiyor.
          </video>
        </div>
      </div>
    );
  }

  if (item.coverImage) {
    return (
      <div className="w-full max-w-5xl mx-auto px-6 md:px-12 mt-8 mb-10 md:mt-10 md:mb-12">
        <div className="flex justify-center w-full border border-line-soft bg-paper-2 overflow-hidden">
          <Image
            src={item.coverImage}
            alt={item.title}
            width={1600}
            height={2000}
            priority
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="w-full h-auto object-contain"
          />
        </div>
      </div>
    );
  }

  return null;
}

type ContentArticleProps = {
  item: ContentItem;
  related: ContentItem[];
  hrefBase: "/blog" | "/turnuvalar";
  backHref: string;
  backLabel: string;
};

export default function ContentArticle({
  item,
  related,
  hrefBase,
  backHref,
  backLabel,
}: ContentArticleProps) {
  const portrait = isPortraitMedia(item.coverImage);
  const gallery = uniqueGallery(item.images, item.coverImage);
  const galleryCols =
    gallery.length >= 5
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      : "grid-cols-1 sm:grid-cols-2";

  return (
    <article>
      <header className="max-w-3xl mx-auto px-6 md:px-12 mb-6 md:mb-8">
        <div className="font-mono text-[11px] tracking-[0.14em] text-bordo uppercase mb-6">
          {item.category}
        </div>
        <h1 className="font-serif text-[40px] md:text-[64px] leading-[1.05] tracking-tightestish mb-6">
          {item.title}
        </h1>
        <div className="font-mono text-[12px] text-ink-3 tracking-[0.05em]">
          {formatDateTr(item.publishedAt)}
        </div>
      </header>

      {/* Summary — full block, always before media */}
      {item.summary ? (
        <div className="summary max-w-3xl mx-auto px-6 md:px-12 mb-2 md:mb-4">
          <p className="text-xl md:text-2xl leading-[1.5] text-ink font-serif border-t border-line-soft pt-8">
            {item.summary}
          </p>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto px-6 md:px-12 border-t border-line-soft" />
      )}

      <MainMedia item={item} portrait={portrait} />

      {/* Content — full block, always after media */}
      {item.content ? (
        <div className="max-w-3xl mx-auto px-6 md:px-12">
          <ContentParagraphs text={item.content} />
        </div>
      ) : null}

      {gallery.length > 0 ? (
        <section className="w-full max-w-6xl mx-auto px-6 md:px-12 mt-12 md:mt-16">
          <h2 className="font-mono text-[11px] tracking-[0.16em] uppercase text-ink-3 mb-6">
            Galeri
          </h2>
          {gallery.length === 1 ? (
            <div className="flex justify-center w-full max-w-5xl mx-auto border border-line-soft bg-paper-2 overflow-hidden">
              <Image
                src={gallery[0]}
                alt=""
                width={1600}
                height={2000}
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="w-full h-auto object-contain"
              />
            </div>
          ) : (
            <div className={`grid ${galleryCols} gap-4 md:gap-5`}>
              {gallery.map((src) => (
                <div
                  key={src}
                  className="relative overflow-hidden border border-line-soft bg-paper-2"
                >
                  <Image
                    src={src}
                    alt=""
                    width={1200}
                    height={1500}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="h-auto w-full object-contain"
                  />
                </div>
              ))}
            </div>
          )}
        </section>
      ) : null}

      <div className="max-w-3xl mx-auto px-6 md:px-12">
        {item.instagramUrl ? (
          <div className="mt-12 pt-8 border-t border-line-soft">
            <a
              href={item.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
            >
              Instagram gönderisi <span className="arrow-hover">→</span>
            </a>
          </div>
        ) : null}
      </div>

      {related.length > 0 ? (
        <section className="w-full max-w-6xl mx-auto px-6 md:px-12 mt-20 md:mt-24 pt-12 border-t border-line">
          <h2 className="font-serif text-[32px] md:text-[40px] leading-[1.1] tracking-tighterish mb-10">
            İlgili <em className="italic font-serif">içerikler</em>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {related.map((rel) => (
              <RelatedCard key={rel.id} item={rel} hrefBase={hrefBase} />
            ))}
          </div>
        </section>
      ) : null}

      <div className="max-w-3xl mx-auto px-6 md:px-12 mt-16 pt-8 border-t border-line-soft">
        <Link href={backHref} className="btn btn-ghost">
          ← {backLabel}
        </Link>
      </div>
    </article>
  );
}

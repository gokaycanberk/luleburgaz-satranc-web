import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import Link from "next/link";
import { getContentByType } from "@/lib/content";
import type { ContentItem } from "@/types/content";
import { SectionHead } from "./Primitives";

type Orientation = "portrait" | "square" | "landscape";

type TournamentCardData = ContentItem & {
  orientation: Orientation;
  isPoster: boolean;
};

function formatDateTr(iso: string): string {
  return new Date(iso).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getTournamentItems(limit = 6): ContentItem[] {
  return getContentByType("tournament")
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    )
    .slice(0, limit);
}

/** Lightweight JPEG / PNG / WebP header reader — no extra dependency. */
function readImageSize(absPath: string): { width: number; height: number } | null {
  try {
    const buf = fs.readFileSync(absPath);
    if (buf.length < 24) return null;

    // PNG
    if (buf[0] === 0x89 && buf[1] === 0x50) {
      return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
    }

    // JPEG
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

    // WebP
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

function classifyOrientation(ratio: number): Orientation {
  if (ratio < 0.85) return "portrait";
  if (ratio <= 1.25) return "square";
  return "landscape";
}

function resolvePublicPath(publicUrl: string): string | null {
  if (!publicUrl.startsWith("/")) return null;
  return path.join(process.cwd(), "public", publicUrl.replace(/^\//, ""));
}

function enrichTournament(item: ContentItem): TournamentCardData {
  let orientation: Orientation = "landscape";
  if (item.coverImage) {
    const abs = resolvePublicPath(item.coverImage);
    if (abs && fs.existsSync(abs)) {
      const size = readImageSize(abs);
      if (size && size.height > 0) {
        orientation = classifyOrientation(size.width / size.height);
      }
    }
  }

  // Video thumbs / single promo frames often include text overlays
  const isPoster = Boolean(item.video) && orientation !== "portrait";

  return { ...item, orientation, isPoster };
}

export default function Tournaments() {
  const tournaments = getTournamentItems(6).map(enrichTournament);

  return (
    <section id="turnuvalar" className="py-16 md:py-20">
      <div className="container-lg">
        <SectionHead
          num="05"
          eyebrow="Turnuvalar"
          title={
            <>
              Sahada <em className="italic font-serif">yaşananlar.</em>
            </>
          }
          subtitle="Yaklaşan organizasyonlar ve geçmiş turnuva sonuçları — öğrencilerimizin katıldığı TSF puanlı müsabakalar burada."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
          {tournaments.map((t) => (
            <TournamentCard key={t.id} item={t} />
          ))}
        </div>

        <div className="mt-10 text-right">
          <a href="#turnuvalar" className="btn btn-ghost">
            Tüm turnuvalar <span className="arrow-hover">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

function TournamentCard({ item }: { item: TournamentCardData }) {
  const isLandscape = item.orientation === "landscape";
  const isPortrait = item.orientation === "portrait";

  const mediaAspect = isPortrait ? "4 / 5" : isLandscape ? "16 / 9" : "1 / 1";

  const imageClass = item.isPoster
    ? "object-contain object-center"
    : isPortrait
      ? "object-cover object-top"
      : "object-cover object-center";

  return (
    <Link
      href={`/turnuvalar/${item.slug}`}
      className={`group border border-line-soft bg-paper overflow-hidden hover:bg-paper-2 transition-colors ${
        isLandscape
          ? "md:col-span-2 grid grid-cols-1 lg:grid-cols-2"
          : "col-span-1 flex flex-col h-full"
      }`}
    >
      <div
        className={`relative w-full overflow-hidden bg-paper-2 ${
          isLandscape ? "lg:min-h-full" : ""
        }`}
        style={{ aspectRatio: mediaAspect }}
      >
        {item.coverImage ? (
          item.isPoster ? (
            <div className="absolute inset-0 p-2">
              <div className="relative h-full w-full overflow-hidden">
                <Image
                  src={item.coverImage}
                  alt={item.title}
                  fill
                  sizes={
                    isLandscape
                      ? "(max-width: 1024px) 100vw, 50vw"
                      : "(max-width: 768px) 100vw, 50vw"
                  }
                  className={`${imageClass} transition-transform duration-500 group-hover:scale-[1.02]`}
                />
              </div>
            </div>
          ) : (
            <Image
              src={item.coverImage}
              alt={item.title}
              fill
              sizes={
                isLandscape
                  ? "(max-width: 1024px) 100vw, 50vw"
                  : "(max-width: 768px) 100vw, 50vw"
              }
              className={`${imageClass} transition-transform duration-500 group-hover:scale-[1.03]`}
            />
          )
        ) : (
          <div className="absolute inset-0 bg-paper-3" aria-hidden />
        )}
      </div>

      <div
        className={`flex flex-col justify-center px-4 py-4 md:px-5 md:py-5 ${
          isLandscape ? "lg:px-8 lg:py-8" : ""
        }`}
      >
        <div className="font-mono text-[10px] text-bordo tracking-[0.14em] uppercase mb-2">
          {item.category}
        </div>
        <h3
          className={`font-serif leading-[1.15] mb-2 transition-colors group-hover:text-bordo line-clamp-3 ${
            isLandscape ? "text-[26px] md:text-[32px]" : "text-[22px] md:text-[24px]"
          }`}
        >
          {item.title}
        </h3>
        <p className="text-sm leading-[1.5] text-ink-2 mb-3 line-clamp-3">
          {item.summary}
        </p>
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-line-soft font-mono text-[11px] text-ink-3">
          <span>{formatDateTr(item.publishedAt)}</span>
          <span className="text-bordo transition-transform duration-200 group-hover:translate-x-1">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}

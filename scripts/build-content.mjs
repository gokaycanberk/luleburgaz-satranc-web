#!/usr/bin/env node
/**
 * Rewrites content.json media fields to local /instagram/{shortCode}/ paths.
 *
 * Usage: npm run build:content
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const CONTENT_PATH = path.join(ROOT, "src/data/content.json");
const BACKUP_PATH = path.join(ROOT, "src/data/content.backup.json");
const RAW_PATH = path.join(ROOT, "src/data/instagram-raw.json");
const MEDIA_ROOT = path.join(ROOT, "public/instagram");

const COVER_CANDIDATES = ["cover.jpg", "cover.jpeg", "cover.png", "cover.webp"];
const IMAGE_RE = /^image-\d+\.(jpg|jpeg|png|webp)$/i;

const PRESERVE_KEYS = [
  "title",
  "slug",
  "summary",
  "content",
  "originalCaption",
  "contentType",
  "category",
  "tags",
  "publishedAt",
  "featured",
  "seo",
];

const stats = {
  updated: 0,
  withCover: 0,
  withGallery: 0,
  withVideo: 0,
  missingMedia: 0,
  unmatched: 0,
};

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function buildRawIndex(rawPosts) {
  const byId = new Map();
  const byShortCode = new Map();

  for (const post of rawPosts) {
    if (post?.id != null) byId.set(String(post.id), post);
    if (typeof post?.shortCode === "string" && post.shortCode.trim()) {
      byShortCode.set(post.shortCode.trim(), post);
    }
  }

  return { byId, byShortCode };
}

function resolveShortCode(item, rawIndex) {
  // Prefer explicit shortCode on the content item if ever present
  if (typeof item.shortCode === "string" && item.shortCode.trim()) {
    return item.shortCode.trim();
  }

  if (item.id != null) {
    const byId = rawIndex.byId.get(String(item.id));
    if (byId?.shortCode) return String(byId.shortCode).trim();
  }

  // Fallback: match via instagramUrl /p/{shortCode}/
  if (typeof item.instagramUrl === "string") {
    const match = item.instagramUrl.match(/instagram\.com\/(?:p|reel|tv)\/([^/?#]+)/i);
    if (match?.[1] && rawIndex.byShortCode.has(match[1])) {
      return match[1];
    }
    if (match?.[1]) return match[1];
  }

  return null;
}

function listLocalMedia(shortCode) {
  const dir = path.join(MEDIA_ROOT, shortCode);

  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
    return { coverImage: null, images: [], video: null };
  }

  const files = fs.readdirSync(dir);

  let coverImage = null;
  for (const name of COVER_CANDIDATES) {
    if (files.includes(name)) {
      coverImage = `/instagram/${shortCode}/${name}`;
      break;
    }
  }

  const images = files
    .filter((name) => IMAGE_RE.test(name))
    .sort((a, b) => a.localeCompare(b, "en", { numeric: true }))
    .map((name) => `/instagram/${shortCode}/${name}`);

  const video = files.includes("video.mp4")
    ? `/instagram/${shortCode}/video.mp4`
    : null;

  return { coverImage, images, video };
}

function main() {
  if (!fs.existsSync(CONTENT_PATH)) {
    console.error(`Missing: ${CONTENT_PATH}`);
    process.exit(1);
  }
  if (!fs.existsSync(RAW_PATH)) {
    console.error(`Missing: ${RAW_PATH}`);
    process.exit(1);
  }

  const content = readJson(CONTENT_PATH);
  const rawPosts = readJson(RAW_PATH);

  if (!Array.isArray(content?.items)) {
    console.error("content.json must contain an items array");
    process.exit(1);
  }
  if (!Array.isArray(rawPosts)) {
    console.error("instagram-raw.json must be an array");
    process.exit(1);
  }

  // Backup before mutating
  writeJson(BACKUP_PATH, content);
  console.log(`Backup → ${path.relative(ROOT, BACKUP_PATH)}`);

  const rawIndex = buildRawIndex(rawPosts);

  const items = content.items.map((item) => {
    const preserved = {};
    for (const key of PRESERVE_KEYS) {
      if (key in item) preserved[key] = item[key];
    }

    const shortCode = resolveShortCode(item, rawIndex);

    if (!shortCode) {
      stats.unmatched += 1;
      console.warn(`  ✗ unmatched — id=${item.id ?? "?"} slug=${item.slug ?? "?"}`);
      return {
        ...item,
        ...preserved,
        coverImage: null,
        images: [],
        video: null,
        instagramUrl: item.instagramUrl,
      };
    }

    const media = listLocalMedia(shortCode);
    stats.updated += 1;

    if (media.coverImage) stats.withCover += 1;
    if (media.images.length > 0) stats.withGallery += 1;
    if (media.video) stats.withVideo += 1;
    if (!media.coverImage && media.images.length === 0 && !media.video) {
      stats.missingMedia += 1;
      console.warn(`  · no local media — ${shortCode} (${item.slug ?? item.id})`);
    }

    return {
      id: item.id,
      slug: preserved.slug ?? item.slug,
      title: preserved.title ?? item.title,
      summary: preserved.summary ?? item.summary,
      content: preserved.content ?? item.content,
      originalCaption: preserved.originalCaption ?? item.originalCaption,
      contentType: preserved.contentType ?? item.contentType,
      category: preserved.category ?? item.category,
      tags: preserved.tags ?? item.tags,
      publishedAt: preserved.publishedAt ?? item.publishedAt,
      coverImage: media.coverImage,
      images: media.images,
      video: media.video,
      instagramUrl: item.instagramUrl,
      featured: preserved.featured ?? item.featured,
      seo: preserved.seo ?? item.seo,
    };
  });

  const output = {
    ...content,
    meta: {
      ...(content.meta || {}),
      mediaSource: "public/instagram",
      mediaBuiltAt: new Date().toISOString(),
      count: items.length,
    },
    items,
  };

  writeJson(CONTENT_PATH, output);

  console.log("\n========== ÖZET ==========");
  console.log(`Güncellenen içerik sayısı:     ${stats.updated}`);
  console.log(`Cover bulunan kayıt sayısı:    ${stats.withCover}`);
  console.log(`Galerisi bulunan kayıt sayısı: ${stats.withGallery}`);
  console.log(`Videosu bulunan kayıt sayısı:  ${stats.withVideo}`);
  console.log(`Medyası eksik kayıt sayısı:    ${stats.missingMedia}`);
  console.log(`Eşleşmeyen kayıt sayısı:       ${stats.unmatched}`);
  console.log("==========================\n");
}

main();

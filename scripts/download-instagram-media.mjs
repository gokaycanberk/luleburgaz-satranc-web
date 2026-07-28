#!/usr/bin/env node
/**
 * Downloads Instagram media from src/data/instagram-raw.json
 * into public/instagram/{shortCode}/
 *
 * Usage: npm run download:instagram
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const RAW_PATH = path.join(ROOT, "src/data/instagram-raw.json");
const OUT_ROOT = path.join(ROOT, "public/instagram");

const TIMEOUT_MS = 30_000;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 800;

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,video/*,*/*;q=0.8",
  "Accept-Language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
  Referer: "https://www.instagram.com/",
};

const IMAGE_EXTS = new Set(["jpg", "jpeg", "png", "webp"]);

const stats = {
  totalPosts: 0,
  successImages: 0,
  successVideos: 0,
  alreadyExists: 0,
  failed: 0,
  skippedPosts: 0,
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isValidUrl(value) {
  if (!value || typeof value !== "string") return false;
  const trimmed = value.trim();
  if (!trimmed) return false;
  try {
    const u = new URL(trimmed);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function urlKey(url) {
  // Deduplicate ignoring query noise where the path is identical
  try {
    const u = new URL(url);
    return `${u.origin}${u.pathname}`;
  } catch {
    return url.split("?")[0];
  }
}

function extFromContentType(contentType, { forceExt } = {}) {
  if (forceExt) return forceExt;
  if (!contentType) return null;

  const mime = contentType.split(";")[0].trim().toLowerCase();

  if (mime === "image/jpeg" || mime === "image/jpg") return "jpg";
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  if (mime === "video/mp4") return "mp4";

  return null;
}

function findExistingFile(dir, basename, forceExt) {
  if (forceExt) {
    const full = path.join(dir, `${basename}.${forceExt}`);
    return fs.existsSync(full) ? full : null;
  }

  for (const ext of IMAGE_EXTS) {
    const full = path.join(dir, `${basename}.${ext}`);
    if (fs.existsSync(full)) return full;
  }

  return null;
}

/**
 * Build download jobs for a single post.
 * Carousel: images[0] → cover, images[1+] → image-02, image-03, …
 * Single image / video poster: displayUrl → cover
 * Video: videoUrl → video.mp4
 */
function planJobs(post) {
  const jobs = [];
  const seen = new Set();

  const push = (url, basename, opts = {}) => {
    if (!isValidUrl(url)) return;
    const key = urlKey(url);
    if (seen.has(key)) return;
    seen.add(key);
    jobs.push({ url: url.trim(), basename, forceExt: opts.forceExt || null });
  };

  const images = Array.isArray(post.images)
    ? post.images.filter((u) => isValidUrl(u))
    : [];

  if (images.length > 0) {
    // First image is cover — never also written as image-01
    push(images[0], "cover");

    for (let i = 1; i < images.length; i++) {
      const n = String(i + 1).padStart(2, "0"); // image-02, image-03, …
      push(images[i], `image-${n}`);
    }

    // displayUrl == images[0] ise zaten indirildi; farklıysa carousel kaynağı images[] olduğu için atlanır
  } else if (isValidUrl(post.displayUrl)) {
    push(post.displayUrl, "cover");
  }

  if (isValidUrl(post.videoUrl)) {
    push(post.videoUrl, "video", { forceExt: "mp4" });
  }

  return jobs;
}

async function fetchWithRetry(url) {
  let lastError;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const res = await fetch(url, {
        method: "GET",
        headers: HEADERS,
        redirect: "follow",
        signal: controller.signal,
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status} ${res.statusText}`);
      }

      const contentType = res.headers.get("content-type") || "";
      const buffer = Buffer.from(await res.arrayBuffer());

      if (!buffer.length) {
        throw new Error("Empty response body");
      }

      return { buffer, contentType };
    } catch (err) {
      lastError = err;
      const message = err?.name === "AbortError" ? "Timeout" : err?.message || String(err);
      console.warn(`  ↻ retry ${attempt}/${MAX_RETRIES} — ${message}`);
      if (attempt < MAX_RETRIES) {
        await sleep(RETRY_DELAY_MS * attempt);
      }
    } finally {
      clearTimeout(timer);
    }
  }

  throw lastError;
}

async function downloadJob(dir, job, shortCode) {
  const existing = findExistingFile(dir, job.basename, job.forceExt);
  if (existing) {
    stats.alreadyExists += 1;
    console.log(`  · skip (exists) ${path.basename(existing)}`);
    return;
  }

  try {
    const { buffer, contentType } = await fetchWithRetry(job.url);
    const ext = extFromContentType(contentType, { forceExt: job.forceExt });

    if (!ext) {
      throw new Error(`Unsupported content-type: ${contentType || "(none)"}`);
    }

    if (job.basename !== "video" && !IMAGE_EXTS.has(ext)) {
      throw new Error(`Expected image, got .${ext} (${contentType})`);
    }

    const filename = `${job.basename}.${ext}`;
    const dest = path.join(dir, filename);
    fs.writeFileSync(dest, buffer);

    if (job.basename === "video") {
      stats.successVideos += 1;
    } else {
      stats.successImages += 1;
    }

    console.log(`  ✓ ${filename} (${buffer.length} bytes)`);
  } catch (err) {
    stats.failed += 1;
    console.error(
      `  ✗ ${job.basename} [${shortCode}] — ${err?.message || err}\n    url: ${job.url.slice(0, 120)}…`,
    );
  }
}

async function processPost(post, index, total) {
  const shortCode = typeof post.shortCode === "string" ? post.shortCode.trim() : "";

  if (!shortCode) {
    stats.skippedPosts += 1;
    console.warn(
      `[${index + 1}/${total}] SKIP — missing shortCode (id=${post.id ?? "?"})`,
    );
    return;
  }

  const dir = path.join(OUT_ROOT, shortCode);
  fs.mkdirSync(dir, { recursive: true });

  const jobs = planJobs(post);
  console.log(
    `[${index + 1}/${total}] ${shortCode} — ${jobs.length} file(s) (${post.type || "?"})`,
  );

  if (jobs.length === 0) {
    console.warn(`  · no downloadable media`);
    return;
  }

  for (const job of jobs) {
    await downloadJob(dir, job, shortCode);
  }
}

async function main() {
  if (!fs.existsSync(RAW_PATH)) {
    console.error(`Raw data not found: ${RAW_PATH}`);
    process.exit(1);
  }

  const raw = JSON.parse(fs.readFileSync(RAW_PATH, "utf8"));
  if (!Array.isArray(raw)) {
    console.error("instagram-raw.json must be an array of posts");
    process.exit(1);
  }

  stats.totalPosts = raw.length;
  fs.mkdirSync(OUT_ROOT, { recursive: true });

  console.log(`Downloading media for ${raw.length} posts → ${OUT_ROOT}\n`);

  for (let i = 0; i < raw.length; i++) {
    try {
      await processPost(raw[i], i, raw.length);
    } catch (err) {
      // Belt-and-suspenders: never abort the whole run
      stats.failed += 1;
      console.error(`[${i + 1}/${raw.length}] unexpected error — ${err?.message || err}`);
    }
  }

  console.log("\n========== ÖZET ==========");
  console.log(`Toplam post sayısı:            ${stats.totalPosts}`);
  console.log(`Başarılı görsel sayısı:        ${stats.successImages}`);
  console.log(`Başarılı video sayısı:         ${stats.successVideos}`);
  console.log(`Zaten mevcut olan dosya sayısı:${stats.alreadyExists}`);
  console.log(`Başarısız indirme sayısı:      ${stats.failed}`);
  console.log(`Atlanan kayıt sayısı:          ${stats.skippedPosts}`);
  console.log("==========================\n");
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});

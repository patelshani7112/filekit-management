// scripts/generate-sitemap.ts
//
// Run with: pnpm generate:sitemap
//
// This script reads SEO_ENTRIES from src/seo/seoConfig.ts
// and generates public/sitemap.xml automatically.

import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

// Adjust import path if your structure is different
import { SEO_ENTRIES, BASE_URL } from "../src/seo/seoConfig.js";

// ESM-style __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getChangefreq(type: string, entryPath: string): string {
  if (entryPath === "/") return "daily";
  if (type === "category") return "weekly";
  if (type === "tool") return "weekly";
  return "monthly"; // static pages
}

function getPriority(type: string, entryPath: string): string {
  if (entryPath === "/") return "1.0";
  if (type === "category") return "0.9";
  if (type === "tool") {
    // Some very popular tools can be bumped up
    if (
      entryPath === "/merge-pdf" ||
      entryPath === "/compress-pdf" ||
      entryPath === "/pdf-to-word" ||
      entryPath === "/jpg-to-pdf" ||
      entryPath === "/jpg-to-png" ||
      entryPath === "/mp4-to-mp3"
    ) {
      return "0.9";
    }
    return "0.8";
  }
  return "0.6"; // static / low-priority
}

function buildSitemapXml() {
  const urls = SEO_ENTRIES.map((entry) => {
    const loc =
      entry.path === "/"
        ? `${BASE_URL}/`
        : `${BASE_URL}${entry.path}`;
    const changefreq = getChangefreq(entry.type, entry.path);
    const priority = getPriority(entry.type, entry.path);

    return `  <url>
    <loc>${loc}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>
`;

  return xml;
}

function main() {
  const sitemap = buildSitemapXml();

  // public/sitemap.xml (relative to project root)
  const outputPath = path.resolve(__dirname, "..", "public", "sitemap.xml");

  // ensure public/ exists
  const publicDir = path.dirname(outputPath);
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, sitemap, "utf8");
  console.log(`✅ sitemap.xml generated at: ${outputPath}`);
}

main();

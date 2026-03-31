#!/usr/bin/env npx tsx
/**
 * Programmatic content generation pipeline.
 *
 * Reads keyword definitions from src/content/keywords.json and generates
 * SEO-optimized markdown articles using templates. Existing articles are
 * skipped unless --force is passed.
 *
 * Usage:
 *   npx tsx scripts/generate-content.ts              # generate all
 *   npx tsx scripts/generate-content.ts --force       # overwrite existing
 *   npx tsx scripts/generate-content.ts --dry-run     # preview without writing
 */

import fs from "fs";
import path from "path";

interface Keyword {
  keyword: string;
  slug: string;
  searchVolume: string;
  difficulty: string;
}

interface Category {
  slug: string;
  name: string;
  keywords: Keyword[];
}

interface KeywordsConfig {
  siteUrl: string;
  siteName: string;
  defaultAuthor: string;
  categories: Category[];
}

const ROOT = path.resolve(new URL("..", import.meta.url).pathname);
const CONTENT_DIR = path.join(ROOT, "src/content");
const KEYWORDS_PATH = path.join(CONTENT_DIR, "keywords.json");
const TEMPLATES_DIR = path.join(ROOT, "scripts/templates");

function loadKeywords(): KeywordsConfig {
  const raw = fs.readFileSync(KEYWORDS_PATH, "utf8");
  return JSON.parse(raw) as KeywordsConfig;
}

function loadTemplate(name: string): string {
  const tplPath = path.join(TEMPLATES_DIR, `${name}.md`);
  if (!fs.existsSync(tplPath)) {
    throw new Error(`Template not found: ${tplPath}`);
  }
  return fs.readFileSync(tplPath, "utf8");
}

function today(): string {
  return new Date().toISOString().split("T")[0];
}

function titleCase(str: string): string {
  return str
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function renderTemplate(
  template: string,
  vars: Record<string, string>,
): string {
  let result = template;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replaceAll(`{{${key}}}`, value);
  }
  return result;
}

function selectTemplate(category: Category): string {
  // Use category-specific template if it exists, else fall back to default
  try {
    return loadTemplate(category.slug);
  } catch {
    return loadTemplate("default");
  }
}

function generateArticle(
  kw: Keyword,
  category: Category,
  config: KeywordsConfig,
): string {
  const template = selectTemplate(category);
  const title = titleCase(kw.keyword);
  const vars: Record<string, string> = {
    title,
    keyword: kw.keyword,
    slug: kw.slug,
    description: `${title} — a comprehensive guide covering everything you need to know about ${kw.keyword}.`,
    date: today(),
    author: config.defaultAuthor,
    category: category.name,
    categorySlug: category.slug,
    siteName: config.siteName,
    siteUrl: config.siteUrl,
  };
  return renderTemplate(template, vars);
}

function main() {
  const args = process.argv.slice(2);
  const force = args.includes("--force");
  const dryRun = args.includes("--dry-run");

  const config = loadKeywords();
  let generated = 0;
  let skipped = 0;

  for (const category of config.categories) {
    for (const kw of category.keywords) {
      const filePath = path.join(CONTENT_DIR, `${kw.slug}.md`);

      if (fs.existsSync(filePath) && !force) {
        console.log(`SKIP  ${kw.slug} (exists)`);
        skipped++;
        continue;
      }

      const content = generateArticle(kw, category, config);

      if (dryRun) {
        console.log(`DRY   ${kw.slug}`);
        console.log(content.slice(0, 200) + "\n...\n");
      } else {
        fs.writeFileSync(filePath, content, "utf8");
        console.log(`WRITE ${kw.slug}`);
      }
      generated++;
    }
  }

  console.log(
    `\nDone. Generated: ${generated}, Skipped: ${skipped}, Total keywords: ${generated + skipped}`,
  );
}

main();

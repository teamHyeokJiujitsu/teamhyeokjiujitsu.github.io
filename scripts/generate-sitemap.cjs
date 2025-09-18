const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const baseUrl = 'https://teamhyeokjiujitsu.github.io';
const today = new Date().toISOString().split('T')[0];

function escapeXml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function normalizeDate(value) {
  if (!value) return null;
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return null;
    return value.toISOString().split('T')[0];
  }
  if (typeof value === 'number') {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    return date.toISOString().split('T')[0];
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return null;
    const parsed = new Date(trimmed);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString().split('T')[0];
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      return trimmed;
    }
  }
  return null;
}

function normalizePath(value) {
  let result = value.startsWith('/') ? value : `/${value}`;
  if (result !== '/' && !result.endsWith('/')) {
    result = `${result}/`;
  }
  return result;
}

function addEntry(map, urlPath, lastmod) {
  const pathKey = normalizePath(urlPath);
  const normalizedDate = normalizeDate(lastmod) || today;
  const current = map.get(pathKey);
  if (!current || current < normalizedDate) {
    map.set(pathKey, normalizedDate);
  }
}

function collectMarkdownEntries(section, basePath) {
  const dir = path.join(__dirname, '..', 'content', section);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter(file => file.endsWith('.md') || file.endsWith('.mdx'))
    .map(file => {
      const slug = file.replace(/\.mdx?$/, '');
      const filePath = path.join(dir, file);
      const raw = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(raw);
      const frontMatterDate = normalizeDate(data.lastmod || data.date);
      const fallbackDate = normalizeDate(fs.statSync(filePath).mtime);
      return {
        path: `${basePath}${slug}/`,
        lastmod: frontMatterDate || fallbackDate || today,
      };
    });
}

const entriesMap = new Map();

['/', '/events/', '/events/closing/', '/news/', '/rules/'].forEach(page => {
  addEntry(entriesMap, page, today);
});

collectMarkdownEntries('events', '/events/').forEach(entry => {
  addEntry(entriesMap, entry.path, entry.lastmod);
});

collectMarkdownEntries('news', '/news/').forEach(entry => {
  addEntry(entriesMap, entry.path, entry.lastmod);
});

const entries = Array.from(entriesMap.entries())
  .sort((a, b) => a[0].localeCompare(b[0]))
  .map(([pagePath, lastmod]) => {
    const loc = escapeXml(`${baseUrl}${pagePath}`);
    return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`;
  })
  .join('\n');

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  entries,
  '</urlset>',
  ''
].join('\n');

const publicDir = path.join(__dirname, '..', 'public');

fs.writeFileSync(
  path.join(publicDir, 'sitemap.xml'),
  sitemap.replace(/<script.*?>.*?<\/script>/gi, ''),
  'utf8'
);

const sitemapIndex = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  `  <sitemap>\n    <loc>${escapeXml(`${baseUrl}/sitemap.xml`)}</loc>\n  </sitemap>`,
  '</sitemapindex>',
  ''
].join('\n');

fs.writeFileSync(
  path.join(publicDir, 'sitemap-index.xml'),
  sitemapIndex,
  'utf8'
);

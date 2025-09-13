const fs = require('fs');
const path = require('path');

const baseUrl = 'https://teamhyeok.github.io';
const pages = ['/', '/events/', '/rules/'];

const today = new Date().toISOString().split('T')[0];

function escapeXml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

const entries = pages
  .map((page) => {
    const loc = escapeXml(`${baseUrl}${page}`);
    return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`;
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

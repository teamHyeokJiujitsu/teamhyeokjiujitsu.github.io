const fs = require('fs');
const path = require('path');

const baseUrl = 'https://teamhyeok.github.io/team-jiujitsu';
const pages = ['/', '/events/', '/rules/'];

const today = new Date().toISOString().split('T')[0];

const entries = pages.map((page) => {
  return `  <url>\n    <loc>${baseUrl}${page}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`;
}).join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;

const outPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
fs.writeFileSync(outPath, sitemap);

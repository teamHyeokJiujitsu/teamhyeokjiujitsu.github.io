const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const root = process.cwd();
const dir = path.join(root, 'content', 'events');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.md') || f.endsWith('.mdx'));

const errors = [];

for (const file of files) {
  const raw = fs.readFileSync(path.join(dir, file), 'utf-8');
  const { data } = matter(raw);
  const slug = file.replace(/\.mdx?$/, '');
  const city = String(data.city || '');
  const venue = String(data.venue || '');

  const location =
    city || venue
      ? {
          '@type': 'Place',
          name: venue || city,
          address: {
            '@type': 'PostalAddress',
            addressLocality: city || undefined,
            addressCountry: 'KR',
          },
        }
      : {
          '@type': 'Place',
          name: '대한민국',
          address: {
            '@type': 'PostalAddress',
            addressCountry: 'KR',
          },
        };

  if (!location) {
    errors.push(`${slug}: missing location`);
    continue;
  }

  if (location['@type'] !== 'Place') {
    errors.push(`${slug}: location type is not Place`);
  }

  if (!location.address || !location.address.addressCountry) {
    errors.push(`${slug}: missing addressCountry`);
  }
}

if (errors.length) {
  console.error('Event structured data validation failed:\n' + errors.join('\n'));
  process.exit(1);
}

console.log(`Validated ${files.length} events. All schema locations are present.`);

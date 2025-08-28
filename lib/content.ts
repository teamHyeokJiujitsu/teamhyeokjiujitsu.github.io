import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkRehype from 'remark-rehype';
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import DOMPurify from 'isomorphic-dompurify';

const ROOT = process.cwd();

type BaseMeta = {
  slug: string;
  title: string;
  date: string;
  tags?: string[];
  excerpt?: string;
  cover?: string;
};

export type NewsMeta = BaseMeta & {
  sourceName?: string;
  sourceUrl?: string;
};

export type EventMeta = BaseMeta & {
  city?: string;
  venue?: string;
  registrationUrl?: string;
  organizer?: string;
};

function readDir(dir: string) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(f => f.endsWith('.md') || f.endsWith('.mdx'));
}

export function getAllNewsMeta(): NewsMeta[] {
  const dir = path.join(ROOT, 'content', 'news');
  const files = readDir(dir);
  const items = files.map(file => {
    const raw = fs.readFileSync(path.join(dir, file), 'utf-8');
    const { data } = matter(raw);
    const slug = file.replace(/\.mdx?$/, '');
    return {
      slug,
      title: String(data.title || slug),
      date: String(data.date || ''),
      tags: (data.tags as string[]) || [],
      excerpt: String(data.excerpt || ''),
      cover: String(data.cover || ''),
      sourceName: String(data.sourceName || ''),
      sourceUrl: String(data.sourceUrl || ''),
    } as NewsMeta;
  });
  return items.sort((a, b) => (a.date > b.date ? -1 : 1));
}

export function getAllEventsMeta(): EventMeta[] {
  const dir = path.join(ROOT, 'content', 'events');
  const files = readDir(dir);
  const items = files.map(file => {
    const raw = fs.readFileSync(path.join(dir, file), 'utf-8');
    const { data } = matter(raw);
    const slug = file.replace(/\.mdx?$/, '');
    let tags = ((data.tags as string[]) || []).map(t => t.toLowerCase());
    if (tags.some(t => t.endsWith('jjf'))) tags.push('jjf');
    if (tags.includes('woman') && !tags.includes('women')) tags.push('women');
    tags = Array.from(new Set(tags));
    return {
      slug,
      title: String(data.title || slug),
      date: String(data.date || ''),
      tags,
      excerpt: String(data.excerpt || ''),
      cover: String(data.cover || ''),
      city: String(data.city || ''),
      venue: String(data.venue || ''),
      registrationUrl: String(data.registrationUrl || ''),
      organizer: String(data.organizer || ''),
    } as EventMeta;
  });
  return items.sort((a, b) => (a.date > b.date ? -1 : 1));
}

async function markdownToSafeHtml(content: string) {
  const processed = await remark()
    .use(remarkRehype)
    .use(rehypeSanitize)
    .use(rehypeStringify)
    .process(content);
  const html = processed.toString();
  return DOMPurify.sanitize(html);
}

export async function getNewsHtmlBySlug(slug: string) {
  const fileMd = path.join(ROOT, 'content', 'news', `${slug}.md`);
  const fileMdx = path.join(ROOT, 'content', 'news', `${slug}.mdx`);
  const file = fs.existsSync(fileMd) ? fileMd : fileMdx;
  const raw = fs.readFileSync(file, 'utf-8');
  const { content } = matter(raw);
  return markdownToSafeHtml(content);
}

export async function getEventHtmlBySlug(slug: string) {
  const fileMd = path.join(ROOT, 'content', 'events', `${slug}.md`);
  const fileMdx = path.join(ROOT, 'content', 'events', `${slug}.mdx`);
  const file = fs.existsSync(fileMd) ? fileMd : fileMdx;
  const raw = fs.readFileSync(file, 'utf-8');
  const { content } = matter(raw);
  return markdownToSafeHtml(content);
}

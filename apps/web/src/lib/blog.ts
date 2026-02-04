import fs from 'fs/promises';
import path from 'path';

import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'content/posts');

interface FrontMatter {
  title?: string;
  date?: string;
  excerpt?: string;
  tags?: string[];
}

export interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  tags?: string[];
}

export async function getAllPosts(): Promise<Post[]> {
  try {
    const fileNames = await fs.readdir(postsDirectory);
    const posts = await Promise.all(
      fileNames
        .filter((name) => name.endsWith('.md'))
        .map(async (fileName) => {
          const slug = fileName.replace(/\.md$/, '');
          const post = await getPostBySlug(slug);
          return post;
        })
    );

    return posts.filter((p): p is Post => p !== null).sort((a, b) => (a.date > b.date ? -1 : 1));
  } catch {
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    const fileContents = await fs.readFile(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    const frontMatter = data as FrontMatter;

    const processedContent = await remark().use(html).process(content);
    const contentHtml = processedContent.toString();

    return {
      slug,
      title: frontMatter.title ?? slug,
      date: frontMatter.date ?? new Date().toISOString().split('T')[0] ?? '',
      excerpt: frontMatter.excerpt ?? content.slice(0, 160) + '...',
      content: contentHtml,
      tags: frontMatter.tags,
    };
  } catch {
    return null;
  }
}

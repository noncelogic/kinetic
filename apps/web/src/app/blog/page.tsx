import Link from 'next/link';

import type { ReactElement } from 'react';

import { getAllPosts } from '@/lib/blog';

export const metadata = {
  title: 'Blog | YourSaaS',
  description: 'Thoughts on AI, software engineering, and building products.',
};

export default async function BlogIndex(): Promise<ReactElement> {
  const posts = await getAllPosts();

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Blog</h1>
        <p className="text-gray-600 mb-12">
          Thoughts on AI, software engineering, and building products that don't suck.
        </p>

        <div className="space-y-8">
          {posts.map((post) => (
            <article key={post.slug} className="border-b pb-8">
              <Link href={`/blog/${post.slug}`} className="group">
                <time className="text-sm text-gray-500">{post.date}</time>
                <h2 className="text-2xl font-semibold mt-1 group-hover:text-brand-600 transition">
                  {post.title}
                </h2>
                <p className="text-gray-600 mt-2">{post.excerpt}</p>
                <span className="inline-block mt-3 text-brand-600 font-medium">
                  Read more →
                </span>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

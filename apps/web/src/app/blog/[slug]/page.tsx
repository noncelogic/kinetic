import { notFound } from 'next/navigation';

import type { Metadata } from 'next';
import type { ReactElement } from 'react';

import { getAllPosts, getPostBySlug } from '@/lib/blog';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (post === null) {
    return {};
  }

  return {
    title: `${post.title} | Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
    },
  };
}

export default async function BlogPost({ params }: Props): Promise<ReactElement> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (post === null) {
    notFound();
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <article className="max-w-3xl mx-auto">
        <header className="mb-8">
          <time className="text-sm text-gray-500">{post.date}</time>
          <h1 className="text-4xl font-bold mt-2">{post.title}</h1>
        </header>

        <div 
          className="prose prose-lg max-w-none prose-headings:font-semibold prose-a:text-brand-600"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Newsletter CTA */}
        <div className="mt-16 p-8 bg-gray-50 rounded-2xl">
          <h3 className="text-xl font-semibold mb-2">Get more like this</h3>
          <p className="text-gray-600 mb-4">
            I write about AI, engineering, and building products. No spam, unsubscribe anytime.
          </p>
          <form className="flex gap-2">
            <input
              type="email"
              placeholder="you@example.com"
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </article>
    </div>
  );
}

import type { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Kinetic Showroom | Zero to Sign-off in 14 Days',
  description:
    'Skip months of discovery theater. Get a working prototype, validated spec, and implementation roadmap—all in two weeks. Book your Prototype Sprint today.',
  keywords: [
    'prototype sprint',
    'product development',
    'rapid prototyping',
    'MVP development',
    'product design sprint',
    'software development',
    'NonceLogic',
    'Kinetic',
  ],
  authors: [{ name: 'NonceLogic' }],
  openGraph: {
    title: 'Kinetic Showroom | Zero to Sign-off in 14 Days',
    description:
      'Skip months of discovery theater. Get a working prototype, validated spec, and implementation roadmap—all in two weeks.',
    type: 'website',
    siteName: 'Kinetic by NonceLogic',
    images: [
      {
        url: '/og-showroom.png',
        width: 1200,
        height: 630,
        alt: 'Kinetic Showroom - Zero to Sign-off in 14 Days',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kinetic Showroom | Zero to Sign-off in 14 Days',
    description:
      'Skip months of discovery theater. Get a working prototype, validated spec, and implementation roadmap—all in two weeks.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ShowroomLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${jetbrainsMono.variable}`}>
      {children}
    </div>
  );
}

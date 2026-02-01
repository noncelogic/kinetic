import { Inter } from 'next/font/google';

import type { Metadata } from 'next';
import type { ReactElement, ReactNode } from 'react';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Your SaaS Name',
  description: 'Your value proposition goes here',
  openGraph: {
    title: 'Your SaaS Name',
    description: 'Your value proposition goes here',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>): ReactElement {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
